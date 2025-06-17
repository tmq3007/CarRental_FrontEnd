import {FetchBaseQueryError} from "@reduxjs/toolkit/query";
import {SerializedError} from "@reduxjs/toolkit";
import {useRouter} from "next/navigation";
import {useEffect, useRef} from "react";
import {useDispatch} from "react-redux";
import {jwtDecode} from "jwt-decode";
import {CustomFetchBaseQueryError} from "@/lib/services/config/baseQuery";
import {updateUser} from "@/lib/slice/userSlice";
import {toast} from "sonner";

interface JwtPayload {
    email: string;
    id: string;
    role: string;
    exp: number;
    iat: number;
    fullname?: string;
}

const useAuthRedirect = (
    data: any,
    error: FetchBaseQueryError | SerializedError | undefined,
    messageApi: any,
    onSuccess?: () => void  // Callback to close modal when login successfully
) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const processed = useRef(false);
    useEffect(() => {
        if (data?.data && !processed.current) {
            processed.current = true;

            const accessToken = data.data.token;
            console.log("=============================================================================");
            console.log("Access Token:", accessToken);

            try {
                const decoded = jwtDecode<JwtPayload>(accessToken);
                console.log("Decoded Token:", decoded);
                const userRole = decoded.role;
                dispatch(updateUser({
                    email: decoded.email,
                    id: decoded.id,
                    role: decoded.role,
                    full_name: decoded.fullname || ''
                }));

                toast.success('Login successful.')

                // messageApi.success('Login successful.', 1).then(() => {
                    if(userRole === 'admin') {
                        router.push('/admin/dashboard');
                    } else if(userRole === 'customer' || userRole === 'car_owner') {
                        router.push('/car-rent/home');
                    }
                // });

            } catch (e) {
                // messageApi.error("Failed to decode token.", 1);
                console.log("Failed to decode token:", e);
            }

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
    }, [data, error, messageApi, router, onSuccess, dispatch]);
};

export default useAuthRedirect;
