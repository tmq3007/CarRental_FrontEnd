import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { BookingDetailVO, BookingVO } from "@/lib/services/booking-api"
import { Car, Fuel, Users, Settings, Shield, Star } from "lucide-react"

interface CarInformationProps {
  bookingDetail: BookingDetailVO
}

export default function CarInformation({ bookingDetail }: CarInformationProps) {
  const carImages = [
    { src: bookingDetail.carImageFront, label: "Front View", icon: Car },
    { src: bookingDetail.carImageBack, label: "Back View", icon: Car },
    { src: bookingDetail.carImageLeft, label: "Left Side", icon: Car },
    { src: bookingDetail.carImageRight, label: "Right Side", icon: Car },
  ]

  const carFeatures = [
    { icon: Fuel, label: "Fuel Type", value: "Gasoline" },
    { icon: Users, label: "Capacity", value: "5 Passengers" },
    { icon: Settings, label: "Transmission", value: "Automatic" },
    { icon: Shield, label: "Insurance", value: "Full Coverage" },
  ]

  return (
    <div className="space-y-6">
      {/* Car Overview */}
      <Card className="border-green-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl text-green-700 flex items-center">
            <Car className="w-6 h-6 mr-2" />
            {bookingDetail.carName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-600">Vehicle ID</p>
              <p className="font-semibold text-gray-900">{bookingDetail.carId}</p>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <Star className="w-3 h-3 mr-1" />
              Premium Vehicle
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {carFeatures.map((feature, index) => (
              <div key={index} className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                <feature.icon className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600 mb-1">{feature.label}</p>
                <p className="text-sm font-semibold text-gray-900">{feature.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Car Images Gallery */}
      <Card className="border-green-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-green-700">Vehicle Gallery</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {carImages.map((image, index) => (
              <div key={index} className="group relative">
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 border-2 border-green-100 group-hover:border-green-300 transition-colors">
                  <img
                    src={image.src || "/placeholder.svg?height=200&width=300&text=Car+Image"}
                    alt={image.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                  <p className="text-sm font-medium text-gray-900 flex items-center">
                    <image.icon className="w-4 h-4 mr-1 text-green-600" />
                    {image.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Specifications */}
      <Card className="border-green-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-green-700 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Vehicle Specifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 mb-3">Engine & Performance</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Engine Type:</span>
                  <span className="font-medium">2.5L 4-Cylinder</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Horsepower:</span>
                  <span className="font-medium">190 HP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fuel Economy:</span>
                  <span className="font-medium">8.5L/100km</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 mb-3">Features & Comfort</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Air Conditioning:</span>
                  <span className="font-medium">Dual Zone</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Audio System:</span>
                  <span className="font-medium">Premium Sound</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Navigation:</span>
                  <span className="font-medium">GPS Included</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety & Insurance */}
      <Card className="border-green-100 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-green-800 mb-2">Safety & Insurance Coverage</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-green-700">
                <ul className="space-y-1">
                  <li>• Comprehensive insurance included</li>
                  <li>• 24/7 roadside assistance</li>
                  <li>• Anti-lock braking system (ABS)</li>
                </ul>
                <ul className="space-y-1">
                  <li>• Electronic stability control</li>
                  <li>• Multiple airbags</li>
                  <li>• Emergency contact support</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
