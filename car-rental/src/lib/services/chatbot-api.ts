// services/chatbotApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {baseQuery} from "@/lib/services/config/baseQuery";

export const chatbotApi = createApi({
    reducerPath: 'chatbotApi',
    baseQuery:  baseQuery,
    endpoints: (builder) => ({
        askChatbot: builder.mutation<{ answer: string, from: string }, { question: string }>({
            query: ({ question }) => ({
                url: 'chatbot/ask',
                method: 'POST',
                body: { question },
            }),
        }),
    }),
});

export const { useAskChatbotMutation } = chatbotApi;
