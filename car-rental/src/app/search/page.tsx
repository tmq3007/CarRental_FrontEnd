"use client";

import { useState, useCallback } from "react";
import SearchResultComponent from "@/components/search/search-result-component";
import FilterPillComponent from "@/components/search/floating-filter-pill";
import { FilterCriteria, QueryCriteria, useSearchCarsQuery } from "@/lib/services/car-api";
import { useSearchParams } from "next/navigation";

export default function SearchPage() {
  const searchParams = useSearchParams();

  const location = {
    province: searchParams.get("province") || "",
    district: searchParams.get("district") || "",
    ward: searchParams.get("ward") || "",
  };

  const parseDateParam = (param: string | null): Date | null => {
    if (!param) return null;
    const date = new Date(param);
    return isNaN(date.getTime()) ? null : date;
  };

  const pickupTime = parseDateParam(searchParams.get("pickupTime"));
  const dropoffTime = parseDateParam(searchParams.get("dropoffTime"));

  const [currentFilters, setCurrentFilters] = useState<FilterCriteria>({
    priceRange: [0, 1000],
    dailyPriceMax: 200,
    carTypes: [],
    fuelTypes: [],
    transmissionTypes: [],
    brands: [],
    seats: [],
    searchQuery: "",
    location: Object.values(location).some((v) => v) ? location : undefined,
    pickupTime,
    dropoffTime,
    order: "asc",
    sortBy: "newest",
  });

  // Add state for current page and page size
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Default page size

  // Convert FilterCriteria to QueryCriteria for RTK Query, including page and pageSize
  const queryCriteria: QueryCriteria = {
    ...currentFilters,
    pickupTime: currentFilters.pickupTime instanceof Date && !isNaN(currentFilters.pickupTime.getTime())
      ? currentFilters.pickupTime.toISOString()
      : null,
    dropoffTime: currentFilters.dropoffTime instanceof Date && !isNaN(currentFilters.dropoffTime.getTime())
      ? currentFilters.dropoffTime.toISOString()
      : null,
    page: currentPage,
    pageSize: pageSize,
  };

  const { data, isLoading, error } = useSearchCarsQuery(queryCriteria);
  const cars = data?.data.data || [];
  const pagination = data?.data.pagination || {
    pageNumber: 1,
    pageSize: 10,
    totalRecords: 0,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  };

  const rentalDays =
    currentFilters.pickupTime && currentFilters.dropoffTime
      ? Math.max(
        1,
        Math.ceil(
          (currentFilters.dropoffTime.getTime() - currentFilters.pickupTime.getTime()) /
          (1000 * 60 * 60 * 24)
        )
      )
      : 7;

  const handleFilterChange = useCallback((filters: FilterCriteria) => {
    setCurrentFilters(filters);
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  const handleSortChange = useCallback((sortBy: string, order: "asc" | "desc") => {
    setCurrentFilters((prev) => ({
      ...prev,
      sortBy,
      order,
    }));
    setCurrentPage(1); // Reset to first page when sort changes
  }, []);

  const handleClearFilters = useCallback(() => {
    setCurrentFilters({
      priceRange: [0, 1000],
      dailyPriceMax: 200,
      carTypes: [],
      fuelTypes: [],
      transmissionTypes: [],
      brands: [],
      seats: [],
      searchQuery: "",
      location: undefined,
      pickupTime: null,
      dropoffTime: null,
      order: "asc",
      sortBy: "newest",
    });
  }, []);

  const getLocationString = () => {
    if (!currentFilters.location) return "";
    const { province, district, ward } = currentFilters.location;
    return `${province}${district ? `, ${district}` : ""}${ward ? `, ${ward}` : ""}`;
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-2">
        <FilterPillComponent
          onFilterChange={handleFilterChange}
          rentalDays={rentalDays}
          initialSortBy={currentFilters.sortBy}
          initialOrder={currentFilters.order}
        />

        <SearchResultComponent
          cars={cars}
          pagination={pagination}
          location={getLocationString()}
          isLoading={isLoading}
          onClearFilters={handleClearFilters}
          sortBy={currentFilters.sortBy}
          order={currentFilters.order}
          onSortChange={handleSortChange}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
}