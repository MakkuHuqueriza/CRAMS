"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Building,
  Users,
  BookOpen,
  Laptop,
  Beaker,
  ChefHat,
  CalendarIcon,
} from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatTimeTo12Hour } from "@/lib/utils";
import { Room } from "@/lib/types";

type RoomDetailsProps = {
  roomDetails: Room[];
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
};

const RoomDetails = ({ roomDetails, date, setDate }: RoomDetailsProps) => {
  const params = useParams();
  const roomId = params.roomId;
  const decodedRoomId =
    typeof roomId === "string" ? decodeURIComponent(roomId) : "";
  const room = roomDetails.find((room: Room) => room.name === decodedRoomId);

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
          <div className="relative w-full aspect-video">
            <Image
              src="/wide_room_sample.png"
              alt={room.name}
              fill
              className="rounded-xl object-cover"
            />
          </div>

          {/* Room Info Card */}
          <div className="bg-white rounded-xl border-[1px] border-[#B9B9B9] p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1b1b1b]">
                {room.name}
              </h1>
            </div>

            <div className="flex items-center gap-4 text-muted-foreground text-[12px] md:text-sm">
              <div className="flex items-center gap-1">
                <Building className="w-4 h-4" />
                {room.room_location}
              </div>
              <span className="mx-[4px] mr-[6px]">|</span>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {room.capacity}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-6 mb-6">
              {getRoomIcon(room.room_type)}
              <p className="text-[#274c77] font-semibold uppercase tracking-wide text-[10px] md:text-[16px]">
                {room.room_type}
              </p>
            </div>

            <hr className="border-[1px] border-[#B9B9B9] rounded-md"></hr>
            <p className="text-sm text-gray-700 leading-relaxed mt-4 font-medium">
              {room.room_description}
            </p>
          </div>

          {/* Available Times Card */}
          <div className="bg-white rounded-xl border-[1px] border-[#B9B9B9] p-6 space-y-4">
            {/* Date Selector */}
            <div className="border-b border-gray-200 pb-4">
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex items-center cursor-pointer">
                    <h2 className="text-[24px] font-semibold text-[#274c77]">
                      {date ? format(date, "MMMM d, yyyy") : "Select a date"}
                    </h2>
                    <CalendarIcon className="ml-2 h-5 w-5 text-[#274c77]" />
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 shadow-none border-none bg-transparent rounded-lg"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="border-none"
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-gray-500 italic mt-1">
                (Click calendar to see more dates)
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#274c77]">
                Available Time
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {room.availableTimeslots.map((time, index) => (
                  <div
                    key={index}
                    className="flex items-center text-sm text-muted-foreground"
                  >
                    <Clock className="w-4 h-4 mr-2 text-[#274c77]" />
                    {`${formatTimeTo12Hour(time.start_time)} - ${formatTimeTo12Hour(time.end_time)}`}
                  </div>
                ))}
              </div>
            </div>

            {/* Reserve Button */}
            <div className="flex justify-start">
              <Button className="bg-[#274c77] text-white text-[14px] hover:bg-[#182657] px-5 py-6 rounded-[30px]">
                <Link href={`/rooms/${encodeURIComponent(room.name)}/reserve/page1`}>
                  Reserve Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RoomDetails;
