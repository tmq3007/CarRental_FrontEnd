'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import SearchResultComponent from '@/components/search/search-result-component';
import FilterPillComponent from '@/components/search/floating-filter-pill';
import { FilterCriteria, QueryCriteria, useSearchCarsQuery } from '@/lib/services/car-api';
import toQueryParams from '@/lib/hook/useToQueryParam';
import { setSearchData } from '@/lib/slice/searchSlice';
import { RootState } from '@/lib/store';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const reduxSearchData = useSelector((state: RootState) => state.search);

  // Helpers
  const parseDateParam = (param: string | null): Date | null => {
    if (!param) return null;
    const date = new Date(param);
    return isNaN(date.getTime()) ? null : date;
  };

  // Initialize location and dates, preferring Redux state if available
  const initialLocation = {
    province: searchParams.get('locationProvince') || '',
    district: searchParams.get('locationDistrict') || '',
    ward: searchParams.get('locationWard') || '',
  };

  const initialFilters: FilterCriteria = useMemo(() => ({
    priceRange: [
      parseInt(searchParams.get('priceMin') || '0', 10),
      parseInt(searchParams.get('priceMax') || '10000000', 10),
    ],
    carTypes: searchParams.getAll('carTypes').length
      ? searchParams.getAll('carTypes')
      : searchParams.get('carTypes')
        ? [searchParams.get('carTypes')!]
        : [],
    fuelTypes: searchParams.getAll('fuelTypes').length
      ? searchParams.getAll('fuelTypes')
      : searchParams.get('fuelTypes')
        ? [searchParams.get('fuelTypes')!]
        : [],
    transmissionTypes: searchParams.getAll('transmissionTypes').length
      ? searchParams.getAll('transmissionTypes')
      : searchParams.get('transmissionTypes')
        ? [searchParams.get('transmissionTypes')!]
        : [],
    brands: searchParams.getAll('brands').length
      ? searchParams.getAll('brands')
      : searchParams.get('brands')
        ? [searchParams.get('brands')!]
        : [],
    seats: searchParams.getAll('seats').length
      ? searchParams.getAll('seats')
      : searchParams.get('seats')
        ? [searchParams.get('seats')!]
        : [],
    searchQuery: searchParams.get('searchQuery') || '',
    location: Object.values(initialLocation).some((v) => v) ? initialLocation : undefined,
    pickupTime: reduxSearchData.pickupTime
      ? new Date(reduxSearchData.pickupTime)
      : parseDateParam(searchParams.get('pickupTime')),
    dropoffTime: reduxSearchData.dropoffTime
      ? new Date(reduxSearchData.dropoffTime)
      : parseDateParam(searchParams.get('dropoffTime')),
    order: (searchParams.get('order') as 'asc' | 'desc') || 'asc',
    sortBy: searchParams.get('sortBy') || 'newest',
  }), [searchParams, reduxSearchData]);

  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  const initialPageSize = parseInt(searchParams.get('pageSize') || '10', 10);

  const [currentFilters, setCurrentFilters] = useState<FilterCriteria>(initialFilters);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Build query params + update URL
  const updateUrl = useCallback(
    (filters: FilterCriteria, page = currentPage, size = pageSize) => {
      const queryString = toQueryParams({
        ...filters,
        pickupTime: filters.pickupTime ? filters.pickupTime.toISOString() : null,
        dropOffTime: filters.dropoffTime ? filters.dropoffTime.toISOString() : null,
        page,
        pageSize: size,
      });

      router.push(`/search?${queryString}`, { scroll: false });
    },
    [router, currentPage, pageSize]
  );

  const queryCriteria: QueryCriteria = useMemo(() => ({
    ...currentFilters,
    pickupTime: currentFilters.pickupTime ? currentFilters.pickupTime.toISOString() : null,
    dropoffTime: currentFilters.dropoffTime ? currentFilters.dropoffTime.toISOString() : null,
    page: currentPage,
    pageSize,
  }), [currentFilters, currentPage, pageSize]);

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

  // Handlers
  const handleFilterChange = useCallback(
    (filters: FilterCriteria) => {
      setCurrentFilters(filters);
      setCurrentPage(1);
      // Update Redux store
      dispatch(
        setSearchData({
          location: {
            province: filters.location?.province ?? '',
            district: filters.location?.district ?? '',
            ward: filters.location?.ward ?? '',
          },
          pickupTime: filters.pickupTime ? filters.pickupTime.toISOString() : null,
          dropoffTime: filters.dropoffTime ? filters.dropoffTime.toISOString() : null,
        })
      );
      updateUrl(filters, 1);
    },
    [dispatch, updateUrl]
  );

  const handleSortChange = useCallback(
    (sortBy: string, order: 'asc' | 'desc') => {
      console.log('Sort changed to:', sortBy, order);
      const updatedFilters = { ...currentFilters, sortBy, order };
      setCurrentFilters(updatedFilters);
      setCurrentPage(1);
      updateUrl(updatedFilters, 1);
    },
    [currentFilters, updateUrl]
  );

  const handleClearFilters = useCallback(() => {
    const resetFilters: FilterCriteria = {
      priceRange: [0, 10000000],
      carTypes: [],
      fuelTypes: [],
      transmissionTypes: [],
      brands: [],
      seats: [],
      searchQuery: '',
      location: undefined,
      pickupTime: null,
      dropoffTime: null,
      order: 'asc',
      sortBy: 'newest',
    };
    setCurrentFilters(resetFilters);
    setCurrentPage(1);
    // Update Redux store
    dispatch(
      setSearchData({
        location: { province: '', district: '', ward: '' },
        pickupTime: null,
        dropoffTime: null,
      })
    );
    updateUrl(resetFilters, 1);
  }, [dispatch, updateUrl]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    updateUrl(currentFilters, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });

  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    updateUrl(currentFilters, 1, newPageSize);
  };

  const getLocationString = () => {
    if (!currentFilters.location) return '';
    const { province, district, ward } = currentFilters.location;
    return `${province}${district ? `, ${district}` : ''}${ward ? `, ${ward}` : ''}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-2">
        <FilterPillComponent
          onFilterChange={handleFilterChange}
          rentalDays={rentalDays}
          initialSortBy={currentFilters.sortBy}
          initialOrder={currentFilters.order}
          initialFilters={currentFilters}
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