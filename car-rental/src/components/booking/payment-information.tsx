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

    // Calculate total paid amount
    const totalPaid = bookingDetail.transactions?.reduce((sum, transaction) => {
        return sum + (transaction.status === 'completed' ? transaction.amount : 0)
    }, 0) || 0

    // Calculate remaining balance (basePrice + deposit - totalPaid)
    const remainingBalance = (bookingDetail.basePrice || 0) + (bookingDetail.deposit || 0) - totalPaid

    // Separate transactions into completed and pending
    const completedTransactions = bookingDetail.transactions?.filter(
        t => t.status === 'completed'
    ) || []

    const pendingTransactions = bookingDetail.transactions?.filter(
        t => t.status !== 'completed'
    ) || []

    // If there's a deposit and the booking is completed, add deposit return as pending
    if (bookingDetail.status === 'completed' && bookingDetail.deposit) {
        pendingTransactions.push({
            amount: - (bookingDetail.deposit || 0),
            message: 'Security deposit return',
            status: 'pending',
            type: 'deposit_return'
        })
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
                        <div className="text-gray-600 text-sm">Base Price</div>
                        <div className="text-xl font-bold">
                            {(bookingDetail.basePrice || 0).toLocaleString()} VND
                        </div>
                    </div>
                    <div className="border rounded-md p-4">
                        <div className="text-gray-600 text-sm">Deposit</div>
                        <div className="text-xl font-bold">
                            {(bookingDetail.deposit || 0).toLocaleString()} VND
                        </div>
                    </div>
                    <div className="border rounded-md p-4">
                        <div className="text-gray-600 text-sm">Total Paid</div>
                        <div className="text-xl font-bold">
                            {totalPaid.toLocaleString()} VND
                        </div>
                    </div>
                </div>

                {remainingBalance > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                        <div className="flex items-center justify-between">
                            <div className="text-yellow-800">Remaining Balance:</div>
                            <div className="text-xl font-bold text-yellow-800">
                                {remainingBalance.toLocaleString()} VND
                            </div>
                        </div>
                        <p className="text-yellow-700 text-sm mt-2">
                            Please complete your payment before the due date.
                        </p>
                    </div>
                )}

                {remainingBalance < 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4">
                        <div className="flex items-center justify-between">
                            <div className="text-green-800">Refund Amount:</div>
                            <div className="text-xl font-bold text-green-800">
                                {Math.abs(remainingBalance).toLocaleString()} VND
                            </div>
                        </div>
                        <p className="text-green-700 text-sm mt-2">
                            This amount will be refunded to your account.
                        </p>
                    </div>
                )}

                <div className="space-y-4">
                    <h4 className="font-medium">Payment History</h4>
                    {completedTransactions.length > 0 ? (
                        <div className="space-y-2">
                            {completedTransactions.map((payment, index) => (
                                <div key={index} className="flex justify-between border-b pb-2">
                                    <div>
                                        <div>{payment.message || `Payment ${index + 1}`}</div>
                                        {payment.createdAt && (
                                            <div className="text-sm text-gray-500">
                                                {formatDate(payment.createdAt)}
                                            </div>
                                        )}
                                    </div>
                                    <div className={`font-medium ${payment.amount > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                        {payment.amount > 0 ? '-' : '+'}{Math.abs(payment.amount).toLocaleString()} VND
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No payment history available</p>
                    )}
                </div>

                <div className="space-y-4">
                    <h4 className="font-medium">Upcoming Payments</h4>
                    {pendingTransactions.length > 0 ? (
                        <div className="space-y-2">
                            {pendingTransactions.map((payment, index) => (
                                <div key={index} className="flex justify-between border-b pb-2">
                                    <div>
                                        <div>{payment.message || `Upcoming Payment ${index + 1}`}</div>
                                        {payment.createdAt && (
                                            <div className="text-sm text-gray-500">
                                                Due: {formatDate(payment.createdAt)}
                                            </div>
                                        )}
                                    </div>
                                    <div className={`font-medium ${payment.amount > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                        {payment.amount > 0 ? '-' : '+'}{Math.abs(payment.amount).toLocaleString()} VND
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No upcoming payments</p>
                    )}
                </div>

                <p className="text-gray-600">
                    {bookingDetail.paymentType === 'full'
                        ? "Full payment was required at booking."
                        : "Please make sure to have sufficient balance when you return the car."}
                </p>

                <div>
                    <Button variant="outline" className="text-blue-600 hover:text-blue-700">
                        View Payment Details
                    </Button>
                </div>
            </div>
        </div>
    )
}