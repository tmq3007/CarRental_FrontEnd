import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const carApi = createApi({
    reducerPath: "carApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:5098/api/",
    }),
    endpoints: (builder) => ({
        getCars: builder.query({
            query: () => "employees",
        }),
        getCarById: builder.query({
            query: (id) => `cars/${id}`,
        }),
    }),
})

export const { useGetCarsQuery, useGetCarByIdQuery } = carApi
