import { configureStore } from "@reduxjs/toolkit"
import { carApi } from "./services/carApi"


// Create the store
export const store = configureStore({
    reducer: {
        [carApi.reducerPath]: carApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(carApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
