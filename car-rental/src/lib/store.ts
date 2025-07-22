import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import { userApi } from "@/lib/services/user-api";
import { authApi } from "@/lib/services/auth-api";
import userReducer from "@/lib/slice/userSlice";
import storage from "@/lib/ssr-safe-storage";
import { addressApi } from "@/lib/services/local-api/address-api";
import { carApi } from "@/lib/services/car-api";
import { bookingApi } from "./services/booking-api";
import {vnpayApi} from "@/lib/services/vnp-api";
import {dashboardApi} from "@/lib/services/dashboard-api";
import {walletApi} from "@/lib/services/wallet-api";
import {chatbotApi   } from "@/lib/services/chatbot-api";
import carReducer from "@/lib/slice/carSlice";

export type ApiResponse<T> = {
    code: number;
    message: string;
    data: T;
};

// Pagination data type (same as before, but reusable)
export type PaginationMetadata = {
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}
export type PaginationResponse<T> = {
    data: T
    PaginationMetadata: PaginationMetadata
}
const baseReducer = combineReducers({
    [userApi.reducerPath]: userApi.reducer,
    [chatbotApi.reducerPath]: chatbotApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [addressApi.reducerPath]: addressApi.reducer,
    [carApi.reducerPath]: carApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
    [vnpayApi.reducerPath]: vnpayApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [walletApi.reducerPath]: walletApi.reducer,
    user: userReducer,
    car: carReducer,
})

export const persistConfig = {
    key: 'car-rental',
    storage,
    // Những reducer được đăng ký trong whitelist sẽ được lưu trữ trong local storage
    whitelist: ['user']
}

const persistedReducer = persistReducer(persistConfig, baseReducer);

// Create the store
export const store = () => {
    return configureStore({
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, 'some/non-serializable-action'],
                    ignoredPaths: ['some.non.serializable.path'],
                },
            }).concat(
                userApi.middleware,
                chatbotApi.middleware,
                authApi.middleware,
                addressApi.middleware,
                carApi.middleware,
                bookingApi.middleware,
                vnpayApi.middleware,
                dashboardApi.middleware,
                walletApi.middleware,
            ),
    })
}

export type AppStore = ReturnType<typeof store>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
