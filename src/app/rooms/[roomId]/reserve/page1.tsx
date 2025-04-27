"use client";

import { useParams } from "next/navigation";
import { roomData } from "@/app/roomData";
import Link from "next/link";

const ReservationDetails = () => {
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
    <form className="flex flex-col items-center gap-6 p-8">
      <h1 className="text-2xl font-bold">Reservation Details</h1>

      {/* Contact Details */}
      <div className="w-full max-w-4xl space-y-4">
        <h2 className="text-lg font-semibold">Contact Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Contact Name"
            className="border rounded p-2 w-full"
          />
          <input
            type="email"
            placeholder="Email Address"
            className="border rounded p-2 w-full"
          />
          <input
            type="text"
            placeholder="Contact Number"
            className="border rounded p-2 w-full"
          />
          <input
            type="text"
            placeholder="Role"
            className="border rounded p-2 w-full"
          />
          <input
            type="text"
            placeholder="Course/Department/Organization"
            className="border rounded p-2 w-full"
          />
        </div>
      </div>

      {/* Request for Job Order */}
      <div className="w-full max-w-4xl space-y-4">
        <h2 className="text-lg font-semibold">Request for Job Order</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={room.id}
            readOnly
            className="border rounded p-2 w-full bg-gray-100"
          />
          <input
            type="text"
            value={room.floor}
            readOnly
            className="border rounded p-2 w-full bg-gray-100"
          />
          <input
            type="text"
            placeholder="Type"
            className="border rounded p-2 w-full"
          />
          <input
            type="date"
            placeholder="Date of Reservation"
            className="border rounded p-2 w-full"
          />
          <input
            type="time"
            placeholder="Start Time"
            className="border rounded p-2 w-full"
          />
          <input
            type="time"
            placeholder="End Time"
            className="border rounded p-2 w-full"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between w-full max-w-4xl">
        <Link href={`/rooms/${roomId}`}>
          <button
            type="button"
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </Link>
        <Link href={`/rooms/${roomId}/reserve/page2`}>
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Submit for Approval
          </button>
        </Link>
      </div>
    </form>
  );
};

export default ReservationDetails;
