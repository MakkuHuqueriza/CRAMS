"use client";

import Link from "next/link";
import { CircleCheckBig, Check, Copy } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function Confirmation() {
  const params = useParams();
  const roomId = params.roomId;
  const reservationId = "#111-69"; // Replace with dynamic ID if needed

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(text);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Breadcrumb */}
      <p className="text-sm text-muted-foreground mb-6">
        <Link
          href="/"
          className="text-[#274c77] hover:underline cursor-pointer"
        >
          Available Rooms
        </Link>{" "}
        &gt;{" "}
        <Link
          href={`/rooms/${encodeURIComponent(roomId as string)}`}
          className="text-[#274c77] hover:underline cursor-pointer"
        >
          {decodeURIComponent(roomId as string)}
        </Link>{" "}
        &gt;{" "}
        <Link
          href={`/rooms/${encodeURIComponent(roomId as string)}/reserve/page1`}
          className="text-[#274c77] hover:underline cursor-pointer"
        >
          Reservation Form
        </Link>{" "}
        &gt;{" "}
        <Link
          href={`/rooms/${encodeURIComponent(roomId as string)}/reserve/page2`}
          className="text-[#274c77] hover:underline cursor-pointer"
        >
          Reservation Summary
        </Link>{" "}
        &gt; Confirmation
      </p>

      <div className="flex flex-col items-center border-[#B9B9B9] border-[1px] rounded-lg p-4 md:p-6 w-full mx-auto mb-20">
        <div className="text-[#274c77] my-8 md:my-10">
          <CircleCheckBig className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32" />
        </div>
        <h1 className="text-[22px] sm:text-[26px] md:text-[32px] font-bold text-[#274c77] w-full max-w-lg text-center leading-tight py-4 px-4">
          Your reservation request has been submitted!
        </h1>
        <div className="flex items-center gap-2 text-[12px] md:text-[16px] mb-4">
          <p>Reservation ID: {reservationId}</p>
          <button
            onClick={() => copyToClipboard(reservationId)}
            className="p-1 hover:bg-blue-200 rounded transition-colors"
            title="Copy to clipboard"
          >
            {copiedId === reservationId ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4 text-gray-600" />
            )}
          </button>
        </div>
        <p className="text-[18px] sm:text-[22px] md:text-[28px] lg:text-[32px] font-medium text-center px-4 md:px-10 leading-tight py-4">
          You will be notified{" "}
          <span className="text-[#780D29] font-semibold">through email</span>{" "}
          when an admin reviews your request.
        </p>

        <Link href="/">
          <div className="py-4 pb-6 mt-4">
            <button
              type="button"
              className="border-2 border-[#274c77] text-[#274c77] font-semibold px-6 py-3 rounded-[50px] transition-transform transform hover:scale-[1.02]"
            >
              Reserve Another Room
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
}
