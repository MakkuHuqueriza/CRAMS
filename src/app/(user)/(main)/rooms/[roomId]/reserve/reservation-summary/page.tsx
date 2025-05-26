"use client";

import { useParams, useRouter } from "next/navigation";
import { roomData } from "@/app/roomData";
import Link from "next/link";

export default function ReservationSummary() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId;
  const decodedRoomId =
    typeof roomId === "string" ? decodeURIComponent(roomId) : "";
  const room = roomData.find((room) => room.id === decodedRoomId);

  if (!room) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-bold text-red-500">Room not found</h1>
      </div>
    );
  }

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
          href={`/rooms/${encodeURIComponent(room.id)}`}
          className="text-[#274c77] hover:underline cursor-pointer"
        >
          {room.id}
        </Link>{" "}
        &gt;{" "}
        <Link
          href={`/rooms/${encodeURIComponent(room.id)}/reserve/reservation-form`}
          className="text-[#274c77] hover:underline cursor-pointer"
        >
          Reservation Form
        </Link>{" "}
        &gt; Reservation Summary
      </p>

      <div className="flex flex-col items-center gap-6 pb-20">
        <div className="border-[#B9B9B9] border-[1px] rounded-lg py-2 px-6 w-full">
          <h1 className="text-[23px] md:text-[32px] font-bold text-[#274c77]">
            Reservation Summary
          </h1>
        </div>

        {/* Summary Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-6">
          {/* Contact Details */}
          <div className="w-full px-5 py-4 space-y-4 border-[#B9B9B9] border-[1px] rounded-lg pb-8 shadow-md">
            <h2 className="text-[18px] md:text-[20px] font-semibold">
              Contact Details
            </h2>
            <div className="space-y-3 text-sm md:text-base">
              <p>Name: John Doe</p>
              <p>Email: johndoe@example.com</p>
              <p>Contact Number: +123456789</p>
              <p>Role: Student</p>
              <p>Course/Department: Computer Science</p>
            </div>
          </div>

          {/* Request for Job Order */}
          <div className="w-full px-5 py-4 space-y-4 border-[#B9B9B9] border-[1px] rounded-lg pb-8 shadow-md">
            <h2 className="text-[18px] md:text-[20px] font-semibold">
              Request for Job Order
            </h2>
            <div className="space-y-3 text-sm md:text-base">
              <p>Room: {room.id}</p>
              <p>Location: {room.floor}</p>
              <p>Date: 2025-04-13</p>
              <p>Time: 12:00 PM - 2:00 PM</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row justify-between w-full gap-4 mt-6">
          <button
            type="button"
            onClick={() =>
              router.push(
                `/rooms/${encodeURIComponent(room.id)}/reserve/reservation-form`,
              )
            }
            className="w-full md:w-auto bg-[#780D29] text-white font-medium px-6 py-[10px] rounded-[50px] transition-transform transform hover:scale-[1.02] order-2 md:order-1"
          >
            Edit Details
          </button>
          <button
            type="button"
            onClick={() =>
              router.push(
                `/rooms/${encodeURIComponent(room.id)}/reserve/reservation-confirmation`,
              )
            }
            className="w-full md:w-auto bg-[#274C77] text-white font-medium px-6 py-[10px] rounded-[50px] transition-transform transform hover:scale-[1.02] order-1 md:order-2"
          >
            Confirm Details
          </button>
        </div>
      </div>
    </div>
  );
}
