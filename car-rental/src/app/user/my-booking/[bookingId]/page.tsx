import BookingDetails from "@/components/booking/booking-details";

export default function Booking({ params }: { params: { bookingId: string } }) {
    return (
        <main className="container mx-auto py-6">
            <BookingDetails bookingId={String(params.bookingId)}/>
        </main>
    )
}
