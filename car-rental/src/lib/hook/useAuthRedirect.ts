import {FetchBaseQueryError} from "@reduxjs/toolkit/query";
import {SerializedError} from "@reduxjs/toolkit";
import {useRouter} from "next/navigation";
import {useEffect, useRef} from "react";
import {useDispatch} from "react-redux";
import {jwtDecode} from "jwt-decode";
import {CustomFetchBaseQueryError} from "@/lib/services/config/baseQuery";
import {updateUser} from "@/lib/slice/userSlice";

interface JwtPayload {
    sub: string;
    id: string;
    role: string;
    exp: number;
    iat: number;
}

const useAuthRedirect = (
    data: any,
    error: FetchBaseQueryError | SerializedError | undefined,
    messageApi: any,
    redirectUrl: string,
    isCustomerLogin: boolean,  // param to check type of login form
    onSuccess?: () => void  // Callback to close modal when login successfully
) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const processed = useRef(false);
    useEffect(() => {
        if (data?.data && !processed.current) {
            processed.current = true;

            const accessToken = data.data.accessToken;

            try {
                const decoded = jwtDecode<JwtPayload>(accessToken);
                dispatch(updateUser({
                    username: decoded.sub,
                    id: decoded.id,
                    role: decoded.role,
                }));

            } catch (e) {
                messageApi.error("Failed to decode token.", 1);
            }

            messageApi.success('Login successful.', 1).then(() => {
                if (isCustomerLogin && onSuccess) {
                    onSuccess();
                } else if (!isCustomerLogin) {
                    router.push(redirectUrl); // Redirect admin
                }
            });
        }

        if (error && 'data' in error) {
            const code = (error as CustomFetchBaseQueryError).data?.code;
            if (code == 1000) {
                messageApi.error('Email or password is wrong.', 1);
            } else if (code == 1200) {
                messageApi.error('Access Denied.', 1);
            } else if (code == 1003) {
                messageApi.error('User not found.', 1);
            } else {
                messageApi.error('Something went wrong. Try again later!', 1);
            }
        }
    }, [data, error, redirectUrl, isCustomerLogin, messageApi, router, onSuccess, dispatch]);
};

export default useAuthRedirect;
