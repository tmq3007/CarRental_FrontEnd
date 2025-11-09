export interface BookingActionTarget {
  bookingNumber: string
  bookingId?: string
  carName?: string
  status?: string
  deposit?: number
  basePrice?: number
  totalAmount?: number
  pickupDate?: string
  returnDate?: string
  paymentType?: string
}
