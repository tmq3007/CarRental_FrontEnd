import BookingDetails from "@/components/booking/booking-details"

interface PageProps {
  params: Promise<{ bookingId?: string | string[] }>
}

export default async function BookingDetailsPage({ params }: PageProps) {
  const resolvedParams = await params
  const bookingId = Array.isArray(resolvedParams?.bookingId)
    ? resolvedParams?.bookingId[0] ?? ""
    : resolvedParams?.bookingId ?? ""

  return <BookingDetails bookingId={bookingId} />
}