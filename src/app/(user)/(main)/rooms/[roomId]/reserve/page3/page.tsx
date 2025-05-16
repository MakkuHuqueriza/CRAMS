"use client";

import Link from "next/link";
import { CircleCheckBig, ClipboardCopy } from "lucide-react";

export default function Confirmation() {
  const reservationId = "#111-69"; // Replace with dynamic ID if needed

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(reservationId).then(() => {
      alert("Reservation ID copied to clipboard!");
    });
  };

  return (
    <>
      <div className="flex flex-col items-center border-[#B9B9B9] border-[1px] rounded-lg p-2 my-10 pl-6 w-full max-w-5xl mx-auto mt-10">
        <div className="text-[#274c77] mb-[60px] mt-[70px]">
          <CircleCheckBig className="w-32 h-32 scale-[2]" />
        </div>
        <h1 className="text-[36px] font-bold text-[#274c77] w-full max-w-lg text-center leading-tight py-4">
          Your reservation request has been submitted!
        </h1>
        <div className="flex items-center gap-2 text-[10px] lg:text-[16px] md:text-[12px]">
          <p>Reservation ID: {reservationId}</p>
          <ClipboardCopy
            className="w-4 h-4 cursor-pointer hover:text-[#274c77]"
            onClick={handleCopyToClipboard}
          />
        </div>
        <p className="text-[36px] font-medium text-center px-10 leading-tight py-4">
          You will be notified{" "}
          <span className="text-[#780D29] font-semibold">through email</span>{" "}
          when an admin reviews your request.
        </p>

        <Link href="/">
          <div className="py-4 pb-6">
            <button
              type="button"
              className="border-2 border-[#274c77] text-[#274c77] font-semibold px-4 py-2 rounded-[50px] transition-transform transform hover:scale-[1.03]"
            >
              Reserve Another Room
            </button>
          </div>
        </Link>
      </div>
    </>
  );
}
