import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Phone, Mail, Hash, CreditCard, DollarSign, MapPin } from "lucide-react"
import type { BookingDetailVO, BookingStatus } from "@/lib/services/booking-api"
import { BOOKING_STATUS_LABEL } from "@/lib/constants/booking-status"

interface BookingInformationProps {
  bookingDetail: BookingDetailVO
}

export default function BookingInformation({ bookingDetail }: BookingInformationProps) {
  function formatDate(dateString?: string): string {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString() + " - " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  function formatCurrency(amount?: number): string {
    if (!amount) return "N/A"
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  function calculateNumberOfDays(startDate?: string, endDate?: string): number {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  function formatLocation(address?: string, city?: string): string {
    if (address && city) return `${address}, ${city}`
    if (address) return address
    if (city) return city
    return "N/A"
  }

  const statusPalette: Record<BookingStatus, string> = {
    waiting_confirmed: "border-amber-200 bg-amber-100 text-amber-800",
    pending_deposit: "border-yellow-200 bg-yellow-100 text-yellow-800",
    pending_payment: "border-yellow-200 bg-yellow-100 text-yellow-800",
    confirmed: "border-blue-200 bg-blue-100 text-blue-800",
    in_progress: "border-indigo-200 bg-indigo-100 text-indigo-800",
    waiting_confirm_return: "border-purple-200 bg-purple-100 text-purple-800",
    rejected_return: "border-red-200 bg-red-100 text-red-700",
    completed: "border-slate-200 bg-slate-100 text-slate-700",
    cancelled: "border-rose-200 bg-rose-100 text-rose-700",
  }

  const getStatusBadge = (status: string) => {
    if (!status) {
      return (
        <Badge variant="outline" className="border-slate-200 bg-slate-100 text-slate-600 font-medium">
          Unknown
        </Badge>
      )
    }
    const normalized = status.toLowerCase() as BookingStatus
    const label = BOOKING_STATUS_LABEL[normalized] ?? status.replace(/_/g, " ")
    const className = statusPalette[normalized] ?? "border-slate-200 bg-slate-100 text-slate-600"
    return (
      <Badge variant="outline" className={`${className} font-medium`}>
        {label}
      </Badge>
    )
  }

  return (
    <div className="space-y-4">
      {/* Booking Details */}
      <Card className="border-green-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-green-700 flex items-center">
            <Hash className="w-5 h-5 mr-2" />
            Booking Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Booking Number</p>
                <p className="font-semibold text-gray-900">{bookingDetail.bookingNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                {getStatusBadge(bookingDetail.status)}
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Duration</p>
                <p className="font-semibold text-gray-900">
                  {calculateNumberOfDays(bookingDetail.pickUpTime, bookingDetail.dropOffTime)} days
                </p>
              </div>
            </div>
            <div className="space-y-3 md:col-span-2 lg:col-span-1">
              <div>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">Locations</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">Pick-up Location</p>
                    <p className="font-medium text-gray-900 text-sm">
                      {formatLocation(bookingDetail.carAddress, bookingDetail.renterCityProvince)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Drop-off Location</p>
                    <p className="font-medium text-gray-900 text-sm">
                      {formatLocation(bookingDetail.carAddress, bookingDetail.renterCityProvince)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule */}
      <Card className="border-blue-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-blue-700 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pick-up Date & Time</p>
                <p className="font-semibold text-gray-900">{formatDate(bookingDetail.pickUpTime)}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Drop-off Date & Time</p>
                <p className="font-semibold text-gray-900">{formatDate(bookingDetail.dropOffTime)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Renter Information */}
        <Card className="border-green-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-green-700 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Renter Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-semibold text-gray-900">{bookingDetail.renterFullName || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Phone className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <p className="font-semibold text-gray-900">{bookingDetail.renterPhoneNumber || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Mail className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Email Address</p>
                  <p className="font-semibold text-gray-900 break-all">{bookingDetail.renterEmail || "N/A"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Driver Information */}
        <Card className="border-purple-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-purple-700 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Driver Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-semibold text-gray-900">
                    {bookingDetail.isRenterSameAsDriver
                      ? bookingDetail.renterFullName || "N/A"
                      : bookingDetail.driverFullName || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Phone className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <p className="font-semibold text-gray-900">
                    {bookingDetail.isRenterSameAsDriver
                      ? bookingDetail.renterPhoneNumber || "N/A"
                      : bookingDetail.driverPhoneNumber || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Mail className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Email Address</p>
                  <p className="font-semibold text-gray-900 break-all">
                    {bookingDetail.isRenterSameAsDriver
                      ? bookingDetail.renterEmail || "N/A"
                      : bookingDetail.driverEmail || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Information */}
      <Card className="border-indigo-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-indigo-700 flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Base Price</p>
                <p className="font-semibold text-gray-900 text-lg">{formatCurrency(bookingDetail.basePrice)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Deposit</p>
                <p className="font-semibold text-gray-900 text-lg">{formatCurrency(bookingDetail.deposit)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Type</p>
                <p className="font-semibold text-gray-900">{bookingDetail.paymentType || "N/A"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card className="border-green-100 bg-green-50">
        <CardContent className="pt-4">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-green-800 mb-2">Important Information</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Please bring a valid driver's license and ID for pickup</li>
                <li>• Arrive 15 minutes early for vehicle inspection</li>
                <li>• Contact us immediately if you need to modify your booking</li>
                <li>• Late returns may incur additional charges</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
