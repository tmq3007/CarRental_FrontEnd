import type { Metadata } from "next";
import BookingDetails from "@/components/booking/booking-details";

interface BookingPageProps {
    params: {
        bookingId: string;
    };
}

export default function Booking({ params }: BookingPageProps) {
    return (
        <main className="container mx-auto py-6">
            <BookingDetails bookingId={params.bookingId} />
        </main>
    );
}

