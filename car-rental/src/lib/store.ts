import { configureStore } from "@reduxjs/toolkit"
 import {userApi} from "@/lib/services/user-api";
import {  deepSeekApi} from "@/lib/services/chatbot-api";
import {userApi2} from "@/lib/services/user-test";
import {addressApi} from "@/lib/services/local-api/address-api";

export type ApiResponse<T> = {
    code: number;
    message: string;
    data: T;
};
// Create the store
export const store = configureStore({
    reducer: {
         [userApi.reducerPath]: userApi.reducer,
        [deepSeekApi.reducerPath]: deepSeekApi.reducer,
        [userApi2.reducerPath]: userApi2.reducer,
        [addressApi.reducerPath]: addressApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(  userApi.middleware,deepSeekApi.middleware,userApi2.middleware,addressApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
