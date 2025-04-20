"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  Building,
  MoreHorizontal,
  Users,
  BookOpen,
  Laptop,
  Beaker,
  ChefHat,
  ArrowDown,
} from "lucide-react";

type Room = {
  name: string;
  type: string;
  floor: string;
  capacity: number;
  image: string;
  times: string[];
};

const roomData: Room[] = [
  {
    name: "ROOM 227",
    type: "LECTURE ROOM/AUDITORIUM",
    floor: "2nd Floor, CSM",
    capacity: 50,
    image: "/room_sample.png",
    times: ["10:00 AM – 11:00 PM", "11:30 AM – 12:30 PM"],
  },
  {
    name: "ROOM 225A",
    type: "DMPCS LABORATORY ROOM",
    floor: "2nd Floor, CSM",
    capacity: 50,
    image: "/room_sample.png",
    times: ["10:00 AM – 11:00 PM", "11:30 AM – 12:30 PM"],
  },
  {
    name: "ROOM 221",
    type: "DBSES LABORATORY ROOM",
    floor: "2nd Floor, CSM",
    capacity: 50,
    image: "/room_sample.png",
    times: ["10:00 AM – 11:00 PM", "11:30 AM – 12:30 PM"],
  },
  {
    name: "ROOM 223",
    type: "DFSC LABORATORY ROOM",
    floor: "2nd Floor, CSM",
    capacity: 50,
    image: "/room_sample.png",
    times: ["10:00 AM – 11:00 PM", "11:30 AM – 12:30 PM"],
  },
  {
    name: "ROOM 222",
    type: "LECTURE ROOM",
    floor: "2nd Floor, CSM",
    capacity: 50,
    image: "/room_sample.png",
    times: ["10:00 AM – 11:00 PM", "11:30 AM – 12:30 PM"],
  },
];

const RoomCard = ({ room }: { room: Room }) => {
  // Helper function to get the room icon
  const getRoomIcon = (type: string) => {
    switch (type) {
      case "LECTURE ROOM/AUDITORIUM":
      case "LECTURE ROOM":
        return <BookOpen className="w-5 h-5 text-[24px]" />;
      case "DMPCS LABORATORY ROOM":
        return <Laptop className="w-5 h-5 text-[24px]" />;
      case "DBSES LABORATORY ROOM":
        return <Beaker className="w-5 h-5 text-[24px]" />;
      case "DFSC LABORATORY ROOM":
        return <ChefHat className="w-5 h-5 text-[24px]" />;
      default:
        return null; // No icon for unknown types
    }
  };

  return (
    <Card className="flex md:flex-row bg-[#e9eff6] border-none p-4 md:p-5 scale-[0.97] gap-6">
      <div className="flex-shrink-0">
        <Image
          src={room.image}
          alt={room.name}
          width={310}
          height={310}
          className="rounded-md object-cover"
        />
      </div>

      <div className="flex flex-col justify-between flex-1">
        {/* Top Section: Title & Info */}
        <div className="space-y-1">
          <h2 className="text-[36px] font-bold mb-10">{room.name}</h2>

          <div className="flex items-center gap-2">
            {getRoomIcon(room.type)}
            <span className="text-[16px] font-semibold">{room.type}</span>
          </div>

          <div className="flex items-center gap-2 text-[16px] text-muted-foreground">
            <Building className="w-4 h-4" /> {room.floor}
            <span className="mx-2 mr-[-5px]">|</span>
            <Users className="w-4 h-4 ml-4" /> {room.capacity}
          </div>

          <div className="pt-8 pb-1">
            <p className="text-[16px] text-primary-foreground font-semibold">
              Available Time
            </p>
            {room.times.map((time, i) => (
              <p
                key={i}
                className="text-sm tracking-wider flex items-center gap-2"
              >
                <Clock className="w-4 h-4 text-[#274c77]" />
                {time}
              </p>
            ))}
          </div>

          {/* Dots Button */}
          <button className="bg-primary text-black rounded-full p-1 w-6 h-3 flex items-center justify-center">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Buttons aligned right */}
        <div className="flex justify-end gap-2 mt-4 text-[24px]">
          <Button
            variant="outline"
            className="px-4 border-[#182657] text-[#182657] hover:shadow-lg border-2"
          >
            View Details
          </Button>
          <Button className="bg-[#274c77] text-white hover:bg-[#182657]">
            Reserve Now
          </Button>
        </div>
      </div>
    </Card>
  );
};

const AvailableRooms = () => {
  return (
    <section className="flex justify-center py-12">
      <div className="w-full rounded-xl shadow-lg bg-primary">
        {/* Header section with title + floor buttons */}
        <div className="bg-primary w-[75%] max-w-6xl mx-auto py-10 border-b border-muted">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-[48px] font-bold text-primary">
                Available Rooms
              </h1>
              <p className="text-[20px] text-muted-foreground">
                Browse to see room&apos;s availability
              </p>
            </div>
            <div className="flex gap-2 text-[25px]">
              <Button
                variant="outline"
                className="rounded-md text-[#274c77] border-[#274c77] hover:shadow-lg transition border-2 font-semibold px-6 py-3"
              >
                Floor 1 - CSM Lobby
              </Button>
              <Button className="bg-[#274c77] text-white hover:bg-[#182657] rounded-md font-semibold px-5 py-4">
                Floor 2 - Rooms
              </Button>
            </div>
          </div>
        </div>

        {/* Beige background */}
        <div className="rooms-secondary h-full px-4 md:px-8 pt-10 rounded-t-[30px]">
          <div className="bg-primary w-[75%] max-w-6xl mx-auto p-6 px-2 space-y-5 rounded-3xl shadow-xl text-[24px]">
            <div className="flex justify-end">
              <Select>
                <SelectTrigger className="w-[190px] text-[#8a8a8a] py-2 mr-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-100">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="w-full bg-white text-black border border-gray-300 shadow-md rounded-lg mt-2">
                  <SelectItem
                    value="lecture"
                    className="hover:bg-gray-200 active:bg-[#274c77] active:text-white px-4 py-[2px] rounded-md cursor-pointer"
                  >
                    Lecture Room
                  </SelectItem>
                  <SelectItem
                    value="lab"
                    className="hover:bg-gray-200 active:bg-[#274c77] active:text-white px-4 py-[2px] rounded-md cursor-pointer"
                  >
                    Laboratory Room
                  </SelectItem>
                  <SelectItem
                    value="all"
                    className="hover:bg-gray-200 active:bg-[#274c77] active:text-white px-4 py-[2px] rounded-md cursor-pointer"
                  >
                    All Rooms
                  </SelectItem>
                  <div>
                    <button className="text-[#274c77] border border-[#274c77] text-sm font-medium rounded-md w-full px-4 py-[2px] active:bg-[#274c77] active:text-white transition">
                      Reset Filter
                    </button>
                  </div>
                </SelectContent>
              </Select>
            </div>

            {roomData.map((room, index) => (
              <RoomCard key={index} room={room} />
            ))}
          </div>
          <div className="flex justify-center pt-12">
            <Button
              variant="outline"
              className="rounded-full bg-primary px-5 py-[18px] font-semibold text-[#274c77] border-[#274c77] border-2 transition-transform transform hover:scale-105"
            >
              Load More
              <ArrowDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AvailableRooms;
