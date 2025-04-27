"use client";

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
    <div className="flex flex-col items-center gap-6 p-8">
      <h1 className="text-2xl font-bold">Reservation Summary</h1>

      {/* Summary Details */}
      <div className="w-full max-w-4xl space-y-4">
        <h2 className="text-lg font-semibold">Contact Details</h2>
        <p>Name: John Doe</p>
        <p>Email: johndoe@example.com</p>
        <p>Contact Number: +123456789</p>
        <p>Role: Student</p>
        <p>Course/Department: Computer Science</p>

        <h2 className="text-lg font-semibold">Reservation Details</h2>
        <p>Room: {room.id}</p>
        <p>Location: {room.floor}</p>
        <p>Date: 2025-04-13</p>
        <p>Time: 12:00 PM - 2:00 PM</p>
      </div>

      {/* Buttons */}
      <div className="flex justify-between w-full max-w-4xl">
        <Link href={`/rooms/${roomId}/reserve/page1`}>
          <button
            type="button"
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Edit Details
          </button>
        </Link>
        <Link href={`/rooms/${roomId}/reserve/page3`}>
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Confirm Details
          </button>
        </Link>
      </div>
    </div>
  );
}
