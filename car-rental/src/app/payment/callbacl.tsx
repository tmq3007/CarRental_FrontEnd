// pages/payment/callback.tsx
'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const PaymentCallback: React.FC = () => {
    const searchParams = useSearchParams();

    useEffect(() => {
        const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
        const vnp_TransactionNo = searchParams.get('vnp_TransactionNo');

        if (vnp_ResponseCode === '00') {
            alert('Thanh toán thành công! Mã giao dịch: ' + vnp_TransactionNo);
        } else {
            alert('Thanh toán thất bại: ' + searchParams.get('vnp_ResponseCode'));
        }
    }, [searchParams]);

    return (
        <div>
            <h1>Kết quả thanh toán</h1>
            <p>Đang xử lý...</p>
        </div>
    );
};

export default PaymentCallback;