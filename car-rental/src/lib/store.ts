import { configureStore } from "@reduxjs/toolkit"
import { carApi } from "./services/car-api"
import {userApi} from "@/lib/services/user-api";


// Create the store
export const store = configureStore({
    reducer: {
        [carApi.reducerPath]: carApi.reducer,
        [userApi.reducerPath]: userApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(carApi.middleware, userApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
