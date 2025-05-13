import { api } from './services/api';

export const middleware = (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
        api.middleware,
        // other custom middleware
    );
