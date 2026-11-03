'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { getTokenFromClient } from "@/app/lib/getTokenFromClient";
import { useSession } from "@/app/lib/auth-client";

const BookingButton = ({ product }) => {
    const { data: session, isPending } = useSession();
    const [loading, setLoading] = useState(false);

    const handleBooking = async () => {
        if (!session) {
            alert("Please log in first to book a workspace.");
            return;
        }

        try {
            setLoading(true);
            console.log('Initiating booking...');
            
            const token = await getTokenFromClient();
            console.log('Token retrieved:', token);

            const data = {
                productId: product._id,
                productName: product.title,
                productImage: product.imageUrl,
                userId: session?.user?.id,
                status: 'Pending',
                BookingDate: new Date().toISOString(),
            };
            console.log('Booking data prepared:', data);

            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URI}/studio-bookings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            console.log("Booking response:", result);

            if (res.ok) {
                alert("Booking submitted successfully!");
            } else {
                alert(result.message || "Failed to submit booking.");
            }
        } catch (err) {
            console.error('Booking failed:', err);
            alert("An error occurred while booking.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleBooking}
            disabled={loading || isPending}
            className="h-11 w-full rounded-xl bg-amber-400 font-semibold text-neutral-900 hover:bg-amber-300 disabled:opacity-50"
        >
            {loading ? "Processing..." : "Book Workspace Now"}
        </Button>
    );
}

export default BookingButton;