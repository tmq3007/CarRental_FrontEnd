import {BaseQueryApi, FetchArgs, fetchBaseQuery, FetchBaseQueryMeta} from "@reduxjs/toolkit/query/react";
import {FetchBaseQueryError} from "@reduxjs/toolkit/query";
import {toast} from "sonner";
import {resetUser} from "@/lib/slice/userSlice";
import {router} from "next/client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const BASE_URL = 'http://localhost:5227/api';

export const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    // Đảm bảo cookie được gửi kèm request
    credentials: 'include',
});

let appRouter: AppRouterInstance | null = null;

export const setBaseQueryRouter = (router: AppRouterInstance) => {
    appRouter = router;
};

export const baseQueryWithAuthCheck = async (
    args: FetchArgs,
    api: BaseQueryApi,
    extraOptions: FetchBaseQueryMeta | any
) => {

    let result = await baseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {

        const msg = (result.error.data as any)?.message;

        if (
            msg &&
            typeof msg === 'string' &&
            msg.toLowerCase().includes('token') &&
            msg.toLowerCase().includes('expired')
        ) {
            await fetch("/api/logout", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            toast.error("Your session has expired. Please log in again.");
            api.dispatch(resetUser());

            if (appRouter) {
                appRouter.push("/signin"); // ✅ client redirect
            }
        }
    }

    return result;
};

export type CustomFetchBaseQueryError = FetchBaseQueryError & {
    data?: {
        code: number;
        message: string;
    };
};