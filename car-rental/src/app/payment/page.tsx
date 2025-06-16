// components/VnpApi.tsx
'use client';
import React, { useState } from 'react';
import {useCreatePaymentMutation, VnpayPaymentRequest} from "@/lib/services/vnp-api";

const VnpApi: React.FC = () => {
    const [createPayment, { data, error, isLoading }] = useCreatePaymentMutation();
    const [qrUrl, setQrUrl] = useState<string | null>(null);

    const handleCreatePayment = async () => {
        try {
            const params: VnpayPaymentRequest = {
                vnp_Amount: 100000, // 100,000 VND (phải khớp với backend)
                vnp_OrderInfo: 'Thanh toan don hang test',
                vnp_TxnRef: `TX${Date.now()}`, // Mã giao dịch duy nhất
                vnp_IpAddr: '127.0.0.1',
                vnp_Locale: 'vn',
                vnp_ReturnUrl: 'http://localhost:3000/payment/callback',
                vnp_Version: '2.1.0',
                vnp_Command: 'pay',
                vnp_OrderType: 'other',
                vnp_CurrCode: 'VND',
            };

            const response = await createPayment(params).unwrap();
            if (response.code === '00' && response.url) {
                setQrUrl(response.url); // Lưu URL để hiển thị mã QR
            } else {
                console.error('Lỗi:', response.message);
            }
        } catch (err) {
            console.error('Lỗi khi gọi API:', err);
        }
    };

    return (
        <div>
            <h1>Thanh toán VNPay</h1>
            <button onClick={handleCreatePayment} disabled={isLoading}>
                {isLoading ? 'Đang xử lý...' : 'Tạo thanh toán'}
            </button>
            {error && <p>Lỗi: {(error as any).data?.message || 'Có lỗi xảy ra'}</p>}
            {qrUrl && (
                <div>
                    <h2>Mã QR Thanh toán</h2>
                    <img src={qrUrl} alt="QR Code" />
                    <p><a href={qrUrl} target="_blank" rel="noopener noreferrer">Xem QR Code</a></p>
                </div>
            )}
        </div>
    );
};

export default VnpApi;