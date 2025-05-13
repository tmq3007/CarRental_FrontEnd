import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery(
        {
            baseUrl: 'https://jsonplaceholder.typicode.com'
        }),
    endpoints: (builder) => ({
        getAllPosts: builder.query({
            query: () => '/posts',
        }),

        getPost: builder.query({
            query: (id) => `/posts/${1}`,
        }),

    }),
});

export const { useGetAllPostsQuery, useGetPostQuery } = api;
