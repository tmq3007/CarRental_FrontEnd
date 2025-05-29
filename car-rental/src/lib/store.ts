import {combineReducers, configureStore} from "@reduxjs/toolkit"
import {persistReducer} from 'redux-persist';
 import {userApi} from "@/lib/services/user-api";
import {deepSeekApi} from "@/lib/services/chatbot-api";
import {userApi2} from "@/lib/services/user-test";
import {authApi} from "@/lib/services/auth-api";
import userReducer from "@/lib/slice/userSlice";
import storage from "@/lib/ssr-safe-storage";
import {addressApi} from "@/lib/services/local-api/address-api";

export type ApiResponse<T> = {
    code: number;
    message: string;
    data: T;
};

const baseReducer =  combineReducers({
    [userApi.reducerPath]: userApi.reducer,
    [deepSeekApi.reducerPath]: deepSeekApi.reducer,
    [userApi2.reducerPath]: userApi2.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [addressApi.reducerPath]: addressApi.reducer
    user: userReducer,
})

export const persistConfig = {
    key: 'car-rental',
    storage,
    // Những reducer được đăng ký trong whitelist sẽ được lưu trữ trong local storage
    whitelist: ['user']
}

const persistedReducer = persistReducer(persistConfig, baseReducer);

// Create the store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(  userApi.middleware,deepSeekApi.middleware,userApi2.middleware,addressApi.middleware,authApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
