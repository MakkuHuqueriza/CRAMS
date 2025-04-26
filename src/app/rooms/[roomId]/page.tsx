"use client";

import Navbar from "@/app/components/Navbar";
import { useParams } from "next/navigation";
import { roomData } from "@/app/roomData";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Building,
  Users,
  BookOpen,
  Laptop,
  Beaker,
  ChefHat,
} from "lucide-react";

const RoomDetails = () => {
  const params = useParams();
  const roomId = params.roomId;
  const decodedRoomId =
    typeof roomId === "string" ? decodeURIComponent(roomId) : "";
  const room = roomData.find((room) => room.name === decodedRoomId);

  const getRoomIcon = (type: string) => {
    switch (type) {
      case "LECTURE ROOM/AUDITORIUM":
      case "LECTURE ROOM":
        return (
          <BookOpen className="lg:w-5 lg:h-5 md:w-4 md:h-4 w-4 h-4 text-primary-foreground" />
        );
      case "DMPCS LABORATORY ROOM":
        return (
          <Laptop className="lg:w-5 lg:h-5 md:w-4 md:h-4 w-4 h-4 text-primary-foreground" />
        );
      case "DBSES LABORATORY ROOM":
        return (
          <Beaker className="lg:w-5 lg:h-5 md:w-4 md:h-4 w-4 h-4 text-primary-foreground" />
        );
      case "DFSC LABORATORY ROOM":
        return (
          <ChefHat className="lg:w-5 lg:h-5 md:w-4 md:h-4 w-4 h-4 text-primary-foreground" />
        );
      default:
        return null;
    }
  };

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

      <section className="flex justify-center py-12 px-4">
        <div className="w-full max-w-4xl space-y-6">
          {/* Breadcrumb */}
          <p className="text-sm text-muted-foreground">
            <span
              className="text-[#274c77] hover:underline cursor-pointer"
              onClick={() => history.back()}
            >
              Available Rooms
            </span>{" "}
            &gt; {room.name}
          </p>

          {/* Room Image */}
          <Image
            src={room.image}
            alt={room.name}
            width={900}
            height={500}
            className="rounded-xl object-cover w-full h-[300px] md:h-[400px]"
          />

          {/* Room Info Card */}
          <div className="bg-white rounded-xl border-[1px] border-gray-200 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1b1b1b]">
                {room.name}
              </h1>
            </div>

            <div className="flex items-center gap-4 text-muted-foreground text-sm">
              <div className="flex items-center gap-1">
                <Building className="w-4 h-4" />
                {room.floor}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {room.capacity}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {getRoomIcon(room.type)}
              <p className="text-[#274c77] font-semibold uppercase tracking-wide text-sm">
                {room.type}
              </p>
            </div>
            
            <div className="border-[]"><hr></hr></div>

            <p className="text-sm text-gray-700 leading-relaxed">
              {room.description}
            </p>
          </div>

          {/* Available Times Card */}
          <div className="bg-white rounded-xl border-[1px] border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-[#1b1b1b]">
              Available Time
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {room.times.map((time, index) => (
                <div
                  key={index}
                  className="flex items-center text-sm text-muted-foreground"
                >
                  <Clock className="w-4 h-4 mr-2 text-[#274c77]" />
                  {time}
                </div>
              ))}
            </div>
          </div>

          {/* Reserve Button */}
          <div className="flex justify-start">
            <Button className="bg-[#274c77] text-white hover:bg-[#182657] px-6 py-2 rounded-2xl">
              Reserve Room
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default RoomDetails;
