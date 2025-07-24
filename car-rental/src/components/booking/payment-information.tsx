import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { BookingDetailVO, BookingVO } from "@/lib/services/booking-api"
import { CreditCard, Receipt, Shield, CheckCircle, AlertCircle } from "lucide-react"
import { formatCurrency } from "@/lib/hook/useFormatCurrency"

interface PaymentInformationProps {
  bookingDetail: BookingDetailVO
}

export default function PaymentInformation({ bookingDetail }: PaymentInformationProps) {
  function calculateNumberOfDays(startDate?: string, endDate?: string): number {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  const numberOfDays = calculateNumberOfDays(bookingDetail.pickUpTime, bookingDetail.dropOffTime)
  const totalAmount = bookingDetail.basePrice ?? 0 * numberOfDays

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: "Paid", className: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
      pending_payment: {
        label: "Pending",
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: AlertCircle,
      },
      confirmed: { label: "Confirmed", className: "bg-blue-100 text-blue-800 border-blue-200", icon: CheckCircle },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.confirmed
    const IconComponent = config.icon

    return (
      <Badge variant="outline" className={`${config.className} font-medium`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Payment Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-green-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-green-700 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{bookingDetail.paymentType}</p>
                <p className="text-sm text-gray-600">Primary payment method</p>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-gray-600">Payment Status:</span>
              {getPaymentStatusBadge(bookingDetail.status)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-green-700 flex items-center">
              <Receipt className="w-5 h-5 mr-2" />
              Transaction Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-medium text-gray-900">TXN-{bookingDetail.bookingNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Date:</span>
                <span className="font-medium text-gray-900">
                  {new Date(bookingDetail.pickUpTime || "").toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Processing Fee:</span>
                <span className="font-medium text-gray-900">Included</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Breakdown */}
      <Card className="border-green-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-green-700 flex items-center">
            <Receipt className="w-5 h-5 mr-2" />
            Cost Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Base Price per Day:</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(bookingDetail.basePrice ?? -1)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Number of Days:</span>
                  <span className="font-semibold text-gray-900">{numberOfDays} days</span>
                </div>
                <div className="border-t border-green-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Subtotal:</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-700">Security Deposit:</span>
                <span className="font-semibold text-gray-900">{formatCurrency(bookingDetail.deposit ?? -1)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-700">Insurance Coverage:</span>
                <span className="font-semibold text-green-600">Included</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-700">Service Fee:</span>
                <span className="font-semibold text-green-600">Waived</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">Total Amount:</span>
                <span className="text-2xl font-bold text-green-600">{totalAmount.toLocaleString()} VND</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Terms & Conditions */}
      <Card className="border-green-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-green-700 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Payment Terms & Conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Payment Policy</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Deposit is required to secure the booking
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Full payment is due upon vehicle pickup
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Secure payment processing guaranteed
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Refund Policy</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Refunds processed within 3-5 business days
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Cancellation fees may apply
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Damage charges deducted from deposit
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Confirmation */}
      {bookingDetail.status === "completed" && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-green-800">Payment Completed Successfully</h4>
                <p className="text-sm text-green-700 mt-1">
                  Thank you for your payment. Your rental has been completed and all charges have been processed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending Payment Notice */}
      {bookingDetail.status === "pending_payment" && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-yellow-800">Payment Pending</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Your payment is currently being processed. You will receive a confirmation once the payment is
                  complete.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
