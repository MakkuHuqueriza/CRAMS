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
          <BookOpen className="lg:w-5 lg:h-5 md:w-4 md:h-4 w-3 h-3 text-[#274c77]" />
        );
      case "DMPCS LABORATORY ROOM":
        return (
          <Laptop className="lg:w-5 lg:h-5 md:w-4 md:h-4 w-3 h-3 text-[#274c77]" />
        );
      case "DBSES LABORATORY ROOM":
        return (
          <Beaker className="lg:w-5 lg:h-5 md:w-4 md:h-4 w-3 h-3 text-[#274c77]" />
        );
      case "DFSC LABORATORY ROOM":
        return (
          <ChefHat className="lg:w-5 lg:h-5 md:w-4 md:h-4 w-3 h-3 text-[#274c77]" />
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

      <section className="flex justify-center py-12 lg:px-4 md:px-[58px] px-8">
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
          <div className="bg-white rounded-xl border-[1px] border-[#B9B9B9] p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1b1b1b]">
                {room.name}
              </h1>
            </div>

<<<<<<< HEAD
            <div className="flex items-center gap-4 text-muted-foreground text-[12px] md:text-sm">
=======
            <div className="flex items-center gap-4 text-muted-foreground text-sm">
>>>>>>> 5b44428f8cb8f95a088f3f74fd6eaa696610bfea
              <div className="flex items-center gap-1">
                <Building className="w-4 h-4" />
                {room.floor}
              </div>
              <span className="mx-[4px] mr-[6px]">|</span>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {room.capacity}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-6 mb-6">
              {getRoomIcon(room.type)}
              <p className="text-[#274c77] font-semibold uppercase tracking-wide text-[10px] md:text-[16px]">
                {room.type}
              </p>
            </div>

            <hr className="border-[1px] border-[#B9B9B9] rounded-md"></hr>
            <p className="text-sm text-gray-700 leading-relaxed mt-4 font-medium">
              {room.description}
            </p>
          </div>

          {/* Available Times Card */}
          <div className="bg-white rounded-xl border-[1px] border-[#B9B9B9] p-6 space-y-4">
            <h2 className="text-lg font-semibold text-[#274c77]">
              Available Time
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
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
            <Button className="bg-[#274c77] text-white text-[14px] hover:bg-[#182657] px-5 py-6 rounded-[30px]">
              Reserve Room
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default RoomDetails;
