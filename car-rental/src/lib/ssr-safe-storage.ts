'use client'
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

interface NoopStorageReturnType {
    getItem: (_key: any) => Promise<null>,
    setItem: (_key: any, value: any) => Promise<any>,
    removeItem: (_key: any) => Promise<void>
}

const createNoopStorage = (): NoopStorageReturnType => {
    return {
        getItem(_key: any) {
            return Promise.resolve(null);
        },
        setItem(_key: any, value: any) {
            return Promise.resolve(value);
        },
        removeItem(_key: any) {
            return Promise.resolve();
        }
    };
};

const storage =
    typeof window !== 'undefined'
        ? createWebStorage('local')
        : createNoopStorage();

export default storage