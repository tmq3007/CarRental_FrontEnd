// lib/services/gemini-api.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const geminiApi = createApi({
    reducerPath: "geminiApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro",
        prepareHeaders: (headers) => {
            headers.set("Content-Type", "application/json")
            return headers
        },
    }),
    endpoints: (builder) => ({
        getCompletion: builder.mutation({
            query: (prompt: string) => ({
                url: `/generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
                method: "POST",
                body: {
                    contents: [{ parts: [{ text: prompt }] }],
                },
            }),
        }),
    }),
})

export const { useGetCompletionMutation } = geminiApi
