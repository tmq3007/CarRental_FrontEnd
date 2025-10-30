"use client"

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useTopupMoneyMutation } from "@/lib/services/wallet-api";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export default function VnpayCallbackPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [topupMoney] = useTopupMoneyMutation();
    const ACCOUNT_ID = useSelector((state: RootState) => state.user?.id);
    const calledRef = useRef(false); // ✅ Đảm bảo chỉ gọi 1 lần

    useEffect(() => {
        if (!ACCOUNT_ID || calledRef.current) return;

        calledRef.current = true;

        const handlePayment = async () => {
            const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
            const vnp_Amount = searchParams.get('vnp_Amount');
            const amount = vnp_Amount ? Number(vnp_Amount) / 100 : 0;

            if (!vnp_ResponseCode) {
                toast.error('Wrong transaction information');
                setTimeout(() => router.push('/wallet'), 3000);
                return;
            }

            if (vnp_ResponseCode === '00') {
                try {
                    await topupMoney({
                        accountId: ACCOUNT_ID,
                        dto: { amount, message: "Top-up to wallet" },
                    }).unwrap();

                    toast.success(`Payment of ${amount.toLocaleString()} VND was successful!`);
                } catch (error) {
                    toast.error('Payment succeeded but failed to update wallet');
                }
            } else {
                toast.error('Payment was cancelled or failed');
            }

            setTimeout(() => {
                router.push('/user/wallet');
            }, 3000);
        };

        handlePayment();
    }, [ACCOUNT_ID, router, topupMoney, searchParams]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="p-6 bg-white rounded-lg shadow-md text-center">
                <h2 className="text-xl font-semibold mb-4">
                    {searchParams.get('vnp_ResponseCode') === '00'
                        ? 'Payment Successful!'
                        : 'Payment Failed'}
                </h2>
                <p>You will be redirected to your wallet in a few seconds...</p>
            </div>
        </div>
    );
}
