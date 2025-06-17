import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import localData from "@/lib/services/local-api/vietnam-address.json";


export interface Location{
    province?: string;
    district?: string;
    ward?: string;
}

export interface Province {
    code: number;
    name: string;
    // Add other properties as needed based on the API response
}

export interface District {
    code: number;
    name: string;
    province_code: number;
    // Add other properties as needed
}

export interface Ward {
    code: number;
    name: string;
    district_code: number;
    // Add other properties as needed
}

export const addressApi = createApi({
    reducerPath: 'addressApi',
    baseQuery: () => ({ data: {} }), // Không cần baseQuery thực sự
    endpoints: (builder) => ({
        getProvinces: builder.query<Province[], void>({
            async queryFn() {
                try {
                    const response = localData.provinces || [];
                    const transformedData = response.map((province: any) => ({
                        code: province.code,
                        name: province.name,
                        // Không include districts để giảm kích thước dữ liệu ban đầu
                    }));
                    return { data: transformedData };
                } catch (error) {
                    return { error: { status: "FETCH_ERROR", error: String(error) } };
                }
            },
        }),

        getDistricts: builder.query<District[], number>({
            async queryFn(provinceCode) {
                try {
                    const province = localData.provinces.find((p: any) => p.code === provinceCode);
                    if (!province) {
                        return { data: [] };
                    }

                    const transformedData = province.districts.map((district: any) => ({
                        code: district.code,
                        name: district.name,
                        province_code: district.province_code,
                        // Không include wards để giảm kích thước dữ liệu
                    }));

                    return { data: transformedData };
                } catch (error) {
                    return { error: { status: "FETCH_ERROR", error: String(error) } };
                }
            },
        }),

        getWards: builder.query<Ward[], number>({
            async queryFn(districtCode) {
                try {
                    // Tìm district trong tất cả các provinces
                    let targetWards: Ward[] = [];

                    for (const province of localData.provinces) {
                        if (province.districts) {
                            const district = province.districts.find(d => d.code === districtCode);
                            if (district && district.wards) {
                                targetWards = district.wards.map((ward: any) => ({
                                    code: ward.code,
                                    name: ward.name,
                                    district_code: ward.district_code,
                                }));
                                break;
                            }
                        }
                    }

                    return { data: targetWards };
                } catch (error) {
                    return { error: { status: "FETCH_ERROR", error: String(error) } };
                }
            },
        }),

        // Phiên bản lấy tất cả dữ liệu cùng lúc (nếu cần)
        getFullAddressData: builder.query<Province[], void>({
            async queryFn() {
                try {
                    return { data: localData.provinces };
                } catch (error) {
                    return { error: { status: "FETCH_ERROR", error: String(error) } };
                }
            },
        }),
    }),
});

export const {
    useGetProvincesQuery,
    useGetDistrictsQuery,
    useGetWardsQuery,
    useGetFullAddressDataQuery,
} = addressApi;