"use client";

import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import { CircleCheckBig, ClipboardCopy } from "lucide-react";

export default function Confirmation() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center border-[#B9B9B9] border-[1px] rounded-lg p-2 pl-6 w-full max-w-5xl mx-auto mt-10">
        <CircleCheckBig className="text-[] w-15 h-15" />
        <h1 className="text-[36px] font-bold text-[#274c77] w-full max-w-lg text-center leading-tight py-4">
          Your reservation request has been submitted!
        </h1>
        <div className="flex items-center gap-2 text-[10px] lg:text-[16px] md:text-[12px]">
          <p>Reservation ID: #111-69</p>
          <ClipboardCopy className="w-4 h-4" />
        </div>
        <p className="text-[36px] font-medium text-center px-10 leading-tight py-4">
          You will be notified{" "}
          <span className="text-red-900 font-semibold">through email</span> when
          an admin reviews your request.
        </p>

        <Link href="/components/AvailableRooms">
          <div className="py-4 pb-6">
            <button
              type="button"
              className="border-2 border-[#274c77] text-[#274c77] font-semibold px-4 py-2 rounded-[50px]"
            >
              Reserve Another Room
            </button>
          </div>
        </Link>
      </div>
    </>
  );
}
