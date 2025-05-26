import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:5227/api/",
    }),
    endpoints: (builder) => ({
        getUserById: builder.query({
            query: (id) => `User/profile/${id}`,
        }),
        //3E90353C-1C5D-469E-A572-0579A1C0468D
    }),
})

export const { useGetUserByIdQuery } = userApi
