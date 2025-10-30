import { QueryCriteria } from "../services/car-api"

const toQueryParams = (filters: QueryCriteria): string => {
  const params = new URLSearchParams()

  params.append("priceRangeMin", filters.priceRange[0].toString())
  params.append("priceRangeMax", filters.priceRange[1].toString())

  const appendArray = (key: string, values?: string[]) => {
    values?.forEach(value => {
      if (value) params.append(key, value)
    })
  }

  appendArray("carTypes", filters.carTypes)
  appendArray("fuelTypes", filters.fuelTypes)
  appendArray("transmissionTypes", filters.transmissionTypes)
  appendArray("brands", filters.brands)
  appendArray("seats", filters.seats)

  if (filters.searchQuery?.trim()) {
    params.append("searchQuery", filters.searchQuery.trim())
  }

  if (filters.location) {
    const { province, district, ward } = filters.location
    if (province) params.append("locationProvince", province)
    if (district) params.append("locationDistrict", district)
    if (ward) params.append("locationWard", ward)
  }

  if (filters.pickupTime) params.append("pickupTime", filters.pickupTime)
  if (filters.dropOffTime) params.append("dropOffTime", filters.dropOffTime)

  params.append("page", filters.page.toString())
  params.append("pageSize", filters.pageSize.toString())
  params.append("sortBy", filters.sortBy)
  params.append("order", filters.order)

  return params.toString()
}

export default toQueryParams
