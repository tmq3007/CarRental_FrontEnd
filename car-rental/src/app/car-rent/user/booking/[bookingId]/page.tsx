import type { Metadata } from "next";
import BookingDetails from "@/components/booking/booking-details";

type PageProps = 
  Promise<{ bookingId: string }>

export default async function Booking({ params }: { params: PageProps }) {
  return (
    <BookingDetails bookingId={(await params).bookingId} />
  );
}
