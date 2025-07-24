import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { BookingDetailVO, BookingVO } from "@/lib/services/booking-api"
import { Calendar, MapPin, User, Phone, Mail, Hash } from "lucide-react"

interface BookingInformationProps {
  bookingDetail: BookingDetailVO
}

export default function BookingInformation({ bookingDetail }: BookingInformationProps) {
  function formatDate(dateString?: string): string {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString() + " - " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  function calculateNumberOfDays(startDate?: string, endDate?: string): number {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { label: "Confirmed", className: "bg-green-100 text-green-800 border-green-200" },
      in_progress: { label: "In Progress", className: "bg-blue-100 text-blue-800 border-blue-200" },
      pending_payment: { label: "Pending Payment", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      pending_deposit: { label: "Pending Deposit", className: "bg-orange-100 text-orange-800 border-orange-200" },
      completed: { label: "Completed", className: "bg-gray-100 text-gray-800 border-gray-200" },
      cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800 border-red-200" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.confirmed
    return (
      <Badge variant="outline" className={`${config.className} font-medium`}>
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Booking Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-green-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-green-700 flex items-center">
              <Hash className="w-5 h-5 mr-2" />
              Booking Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Booking Number:</span>
              <span className="font-semibold text-gray-900">{bookingDetail.bookingNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status:</span>
              {getStatusBadge(bookingDetail.status)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Duration:</span>
              <span className="font-semibold text-gray-900">
                {calculateNumberOfDays(bookingDetail.pickUpTime, bookingDetail.dropOffTime)} days
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-green-700 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center text-gray-600 mb-1">
                <Calendar className="w-4 h-4 mr-2 text-green-500" />
                <span className="text-sm font-medium">Pick-up Date</span>
              </div>
              <p className="text-gray-900 font-semibold ml-6">{formatDate(bookingDetail.pickUpTime)}</p>
            </div>
            <div>
              <div className="flex items-center text-gray-600 mb-1">
                <Calendar className="w-4 h-4 mr-2 text-green-500" />
                <span className="text-sm font-medium">Drop-off Date</span>
              </div>
              <p className="text-gray-900 font-semibold ml-6">{formatDate(bookingDetail.dropOffTime)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Location Information */}
      <Card className="border-green-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-green-700 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Location Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <p className="font-semibold text-gray-900">{bookingDetail.renterCityProvince || "Ho Chi Minh City"}</p>
                <p className="text-sm text-gray-600">Pickup & Return Location</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card className="border-green-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-green-700 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-semibold text-gray-900">{bookingDetail.renterFullName || ""}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <p className="font-semibold text-gray-900">{bookingDetail.renterPhoneNumber || ""}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email Address</p>
                  <p className="font-semibold text-gray-900">{bookingDetail.renterEmail || ""}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card className="border-green-100 bg-green-50">
        <CardContent className="pt-6">
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
