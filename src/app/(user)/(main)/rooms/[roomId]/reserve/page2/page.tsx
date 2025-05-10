"use client";

import Navbar from "@/app/components/Navbar";
import { useParams } from "next/navigation";
import { roomData } from "@/app/roomData";
import Link from "next/link";

export default function ReservationSummary() {
  const params = useParams();
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
    <>
      <Navbar />

      <section className="flex justify-center py-12 lg:px-4 md:px-[58px] px-8">
        <div className="w-full max-w-5xl space-y-1">
          {/* Breadcrumb */}
          <p className="text-sm text-muted-foreground w-full px-6 max-w-5xl">
            <span
              className="text-[#274c77] hover:underline cursor-pointer"
              onClick={() => history.back()}
            >
              Available Rooms
            </span>{" "}
            &gt;{" "}
            <span
              className="text-[#274c77] hover:underline cursor-pointer"
              onClick={() => history.back()}
            >
              {room.id}
            </span>{" "}
            &gt;{" "}
            <span
              className="text-[#274c77] hover:underline cursor-pointer"
              onClick={() => history.back()}
            >
              Reservation Form
            </span>{" "}
            &gt; Reservation Summary
          </p>

          <div className="flex flex-col items-center gap-6 p-6">
            <div className="border-[#B9B9B9] border-[1px] rounded-lg p-2 pl-6 w-full max-w-5xl">
              <h1 className="text-[32px] font-bold text-[#274c77]">
                Reservation Summary
              </h1>
            </div>

            {/* Summary Details */}
            <div className="grid grid-cols-1 w-full max-w-5xl md:grid-cols-2 gap-6">
              {/* Contact Details */}
              <div className="w-full px-5 py-3 max-w-5xl space-y-4 border-[#B9B9B9] border-[1px] rounded-lg pb-8 shadow-md">
                <h2 className="text-[20px] font-semibold">Contact Details</h2>
                <p>Name: John Doe</p>
                <p>Email: johndoe@example.com</p>
                <p>Contact Number: +123456789</p>
                <p>Role: Student</p>
                <p>Course/Department: Computer Science</p>
              </div>

              {/* Request for Job Order */}
              <div className="w-full px-5 py-3 max-w-5xl space-y-4 border-[#B9B9B9] border-[1px] rounded-lg pb-8 shadow-md">
                <h2 className="text-[20px] font-semibold">
                  Request for Job Order
                </h2>
                <p>Room: {room.id}</p>
                <p>Location: {room.floor}</p>
                <p>Date: 2025-04-13</p>
                <p>Time: 12:00 PM - 2:00 PM</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between w-full max-w-5xl">
              <Link href={`/rooms/${roomId}/reserve/page1`}>
                <button
                  type="button"
                  className="bg-[#780D29] text-white font-medium px-4 py-[10px] rounded-[50px] transition-transform transform hover:scale-[1.03]"
                >
                  Edit Details
                </button>
              </Link>
              <Link href={`/rooms/${roomId}/reserve/page3`}>
                <button
                  type="button"
                  className="bg-[#274C77] text-white font-medium px-4 py-[10px] rounded-[50px] transition-transform transform hover:scale-[1.03]"
                >
                  Confirm Details
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
