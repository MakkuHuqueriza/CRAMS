"use client";

import Link from "next/link";

export default function Confirmation() {
  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <h1 className="text-2xl font-bold text-green-500">
        Your reservation request has been submitted!
      </h1>
      <p>Reservation ID: #111-69</p>
      <p>
        You will be notified through email when an admin reviews your request.
      </p>

      <Link href="/rooms">
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Reserve Another Room
        </button>
      </Link>
    </div>
  );
}
