"use client";

import { useParams } from "next/navigation"; // Import useParams
import { roomData } from "@/app/roomData";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Clock, Building, Users } from "lucide-react";

const RoomDetails = () => {
  const params = useParams(); // Use the useParams hook to get the params object
  const roomId = params.roomId; // Access the roomId from params

  // Decode the roomId to match the room name in roomData
  const decodedRoomId =
    typeof roomId === "string" ? decodeURIComponent(roomId) : "";

  // Find the room based on the decoded roomId
  const room = roomData.find((room) => room.name === decodedRoomId);

  if (!room) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-bold text-red-500">Room not found</h1>
      </div>
    );
  }

  return (
    <section className="flex justify-center py-12">
      <div className="w-full max-w-4xl rounded-xl shadow-lg bg-primary p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Room Image */}
          <div className="flex-shrink-0">
            <Image
              src={room.image}
              alt={room.name}
              width={400}
              height={400}
              className="rounded-lg object-cover w-full h-auto"
            />
          </div>

          {/* Room Details */}
          <div className="flex flex-col justify-between flex-1">
            <div className="space-y-4">
              <h1 className="text-[36px] font-bold text-primary-foreground">
                {room.name}
              </h1>
              <div className="flex items-center gap-2 text-[16px] text-muted-foreground">
                <Building className="w-5 h-5" /> {room.floor}
                <span className="mx-2">|</span>
                <Users className="w-5 h-5" /> {room.capacity} Capacity
              </div>
              <div className="pt-4">
                <p className="text-[16px] font-semibold text-primary-foreground">
                  Available Times:
                </p>
                {room.times.map((time, index) => (
                  <p
                    key={index}
                    className="text-[14px] text-muted-foreground flex items-center gap-2"
                  >
                    <Clock className="w-4 h-4 text-[#274c77]" />
                    {time}
                  </p>
                ))}
              </div>
            </div>

            {/* Back Button */}
            <div className="mt-6">
              <Button
                onClick={() => history.back()}
                className="bg-[#274c77] text-white hover:bg-[#182657] px-4 py-2"
              >
                Back to Rooms
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomDetails;
