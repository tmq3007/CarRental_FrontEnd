import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const deepSeekApi = createApi({
    reducerPath: 'deepSeekApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://openrouter.ai/api/v1/',
        prepareHeaders: (headers) => {
            headers.set('Authorization', `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`);
            headers.set('Content-Type', 'application/json');
            // @ts-ignore
            headers.set('HTTP-Referer', process.env.NEXT_PUBLIC_SITE_URL.toString());
            // @ts-ignore
            headers.set('X-Title', process.env.NEXT_PUBLIC_SITE_NAME);
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getChatCompletion: builder.mutation({
            query: (message) => ({
                url: 'chat/completions',
                method: 'POST',
                body: {
                    model: 'deepseek/deepseek-r1:free',
                    messages: [
                        {
                            role: 'user',
                            content: message,
                        },
                    ],
                },
            }),
        }),
    }),
});

export const { useGetChatCompletionMutation } = deepSeekApi;
