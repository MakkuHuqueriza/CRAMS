"use client";

import Link from "next/link";
import { ReservationWithRoom } from "@/utils/database/types"

export default function ReservationSuccess({ reservation }: { reservation: ReservationWithRoom }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
                {/* Success Header */}
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Your reservation requested have been submitted
                </h1>

                {/* Reservation ID */}
                <p className="text-gray-600 mb-8">
                    Reservation ID #{reservation.id}
                </p>

                {/* Success Message */}
                <p className="text-gray-600 mb-8">
                    You will be notified <span className="text-red-600">through email</span> when an admin has looked over your request.
                </p>

                {/* Reserve Another Button */}
                <div className="mb-8">
                    <button className="w-full">
                        <Link href="/reservations/new" className="text-black">
                            Reserve Another Room
                        </Link>
                    </button>
                </div>

                {/* Go Back to Reservations Page */}
                <div className="mb-8">
                    <button className="w-full">
                        <Link href="/reservations" className="text-black">
                            Back to My Reservations
                        </Link>
                    </button>
                </div>
            </div>
        </div>
    )
}