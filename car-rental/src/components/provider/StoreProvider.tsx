'use client'

import React, {useRef} from "react";
import {Provider} from "react-redux";
import {persistStore} from "redux-persist";
import {Persistor} from 'redux-persist/es/types';
import {PersistGate} from "redux-persist/integration/react";
import {setupListeners} from "@reduxjs/toolkit/query";
import {AppStore, store} from "@/lib/store";

export interface Props {
    children: React.ReactNode;
    params?: Promise<{ [key: string]: any }>;
}

export default function StoreProvider({children}: Props) {
    const storeRef = useRef<AppStore>(undefined);
    const persistorRef = useRef<Persistor>({} as Persistor)
    if (!storeRef.current) {
        // Initialize the store on the first render.
        storeRef.current = store();
        // setupListeners to automatically handle the query state (loading, success, error).
        setupListeners(storeRef.current.dispatch);
        // Start-up Redux
        persistorRef.current = persistStore(storeRef.current);
    }
    // Return the entire app wrapped in a Provider with the store.
    return <Provider store={storeRef.current}>
        <PersistGate persistor={persistorRef.current} loading={null}>
            {children}
        </PersistGate>
    </Provider>;
}