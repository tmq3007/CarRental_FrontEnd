import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

interface UserTest {
    id: string;
    name: string;
    email: string;
    age: number;
    address: string;
    role: string;
}

export const userApi2 = createApi({
    reducerPath: 'userApi2',
    baseQuery: fetchBaseQuery({ baseUrl: '/' }),
    endpoints: (builder) => ({
        getUserById: builder.query<UserTest, string>({
            async queryFn(id) {
                try {
                    const response = await fetch("/user.json");
                    const users: UserTest[] = await response.json();
                    const user = users.find((u) => u.id === id);
                    if (!user) {
                        return {
                            error: {
                                status: 404,
                                data: 'UserTest not found',
                            } as FetchBaseQueryError,
                        };
                    }
                    return { data: user };
                } catch (error: any) {
                    return {
                        error: {
                            status: 'FETCH_ERROR',
                            data: error.message,
                        } as FetchBaseQueryError,
                    };
                }
            },
        }),
    }),
});

export const { useGetUserByIdQuery } = userApi2;
