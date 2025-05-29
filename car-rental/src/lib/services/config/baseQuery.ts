import {fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {FetchBaseQueryError} from "@reduxjs/toolkit/query";

export const BASE_URL = 'http://localhost:5227/api';

export const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    // Đảm bảo cookie được gửi kèm request
    credentials: 'include',
});

export type CustomFetchBaseQueryError = FetchBaseQueryError & {
    data?: {
        code: number;
        message: string;
    };
};