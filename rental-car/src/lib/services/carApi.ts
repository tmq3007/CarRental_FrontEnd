import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const carApi = createApi({
    reducerPath: "carApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://private-anon-d476b393e6-carsapi1.apiary-mock.com/",
    }),
    endpoints: (builder) => ({
        getCars: builder.query({
            query: () => "cars",
        }),
        getCarById: builder.query({
            query: (id) => `cars/${id}`,
        }),
    }),
})

export const { useGetCarsQuery, useGetCarByIdQuery } = carApi
