"use client"

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useTopupMoneyMutation } from "@/lib/services/wallet-api";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export default function VnpayCallbackPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [topupMoney, { isLoading: isToppingUp }] = useTopupMoneyMutation();
    const ACCOUNT_ID = useSelector((state: RootState) => state.user?.id);

    useEffect(() => {
        const handlePayment = async () => {
            const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
            const vnp_Amount = searchParams.get('vnp_Amount');
            const amount = vnp_Amount ? Number(vnp_Amount) / 100 : 0;

            if (!vnp_ResponseCode) {
                toast.error('Wrong transaction information');
                router.push('/wallet');
                return;
            }

            if (vnp_ResponseCode === '00') {
                try {
                    const result = await topupMoney({
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

            // Redirect to wallet page after 3 seconds
            setTimeout(() => {
                router.push('/user/wallet');
            }, 3000);
        };

        handlePayment();
    }, [searchParams, router, topupMoney, ACCOUNT_ID]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="p-6 bg-white rounded-lg shadow-md text-center">
                <h2 className="text-xl font-semibold mb-4">
                    {searchParams.get('vnp_ResponseCode') === '00'
                        ? 'Payment Successful!'
                        : 'Payment Failed'}
                </h2>
                <p>You will be redirected to your wallet shortly...</p>
            </div>
        </div>
    );
}