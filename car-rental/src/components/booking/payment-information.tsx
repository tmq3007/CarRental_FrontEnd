import { Button } from "@/components/ui/button"
import {BookingDetailVO} from "@/lib/services/booking-api";

interface PaymentInformationProps {
    bookingDetail: BookingDetailVO
}

export default function PaymentInformation({ bookingDetail }: PaymentInformationProps) {
    // Format date for display
    const formatDate = (dateString?: string): string => {
        if (!dateString) return "N/A"
        const date = new Date(dateString)
        return date.toLocaleDateString()
    }

    // If paymentType is not defined or empty, don't show anything
    if (!bookingDetail.paymentType) {
        return null;
    }

    return (
        <div className="border rounded-md p-6 mt-4">
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-500"
                    >
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M16 8h-6.5a2.5 2.5 0 0 0 0 5h1a2.5 2.5 0 0 1 0 5H4"></path>
                        <path d="M12 18v2"></path>
                        <path d="M12 4v2"></path>
                    </svg>
                    <h3 className="text-lg font-medium">Payment Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-md p-4">
                        <div className="text-gray-600 text-sm">Payment Type</div>
                        <div className="text-xl font-bold capitalize">
                            {bookingDetail.paymentType}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}