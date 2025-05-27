import { configureStore } from "@reduxjs/toolkit"
 import {userApi} from "@/lib/services/user-api";
import {  deepSeekApi} from "@/lib/services/chatbot-api";
import {userApi2} from "@/lib/services/user-test";


// Create the store
export const store = configureStore({
    reducer: {
         [userApi.reducerPath]: userApi.reducer,
        [deepSeekApi.reducerPath]: deepSeekApi.reducer,
        [userApi2.reducerPath]: userApi2.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(  userApi.middleware,deepSeekApi.middleware,userApi2.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
