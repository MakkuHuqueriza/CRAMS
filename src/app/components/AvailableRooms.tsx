"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  // Helper function to get the appropriate icon
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
    <Card className="flex flex-col md:flex-row items-start gap-4 p-4 bg-[#e9eff6] border-none">
      <Image
        src={room.image}
        alt={room.name}
        width={300}
        height={300}
        className="rounded-md object-cover shadow-md"
      />
      <CardContent className="p-0 flex-1 space-y-2">
        <h2 className="text-[40px] font-bold">{room.name}</h2>
        <div className="flex items-center gap-2">
          {getRoomIcon(room.type)} {/* Dynamically render the icon */}
          <span className="text-[24px]">{room.type}</span>
        </div>
        <div className="flex items-center gap-2 text-[20px] text-muted-foreground">
          <Building className="w-4 h-4" /> {room.floor}
          <span className="mx-2 mr-[-5px]">|</span>
          <Users className="w-4 h-4 ml-4" /> {room.capacity}
        </div>
        <div>
          <p className="text-[20px] font-medium mt-1">Available Time</p>
          {room.times.map((time, i) => (
            <p key={i} className="text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {time}
            </p>
          ))}
          <MoreHorizontal className="w-4 h-4 mt-1" />
        </div>
        <div className="flex gap-2 mt-2 text-[24px]">
          <Button variant="outline" className="px-4">
            View Details
          </Button>
          <Button className="bg-[#1f4e94] text-white hover:bg-[#274c77]">
            Reserve Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const AvailableRooms = () => {
  return (
    <section className="flex justify-center py-12">
      <div className="w-full rounded-xl shadow-lg bg-primary">
        {/* Header section with title + floor buttons */}
        <div className="bg-primary w-[85%] max-w-6xl mx-auto py-10 border-b border-muted">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
                className="rounded-md text-[#1f4e94] border-[#1f4e94]"
              >
                Floor 1 - CSM Lobby
              </Button>
              <Button className="bg-[#1f4e94] text-white hover:bg-[#274c77] rounded-md">
                Floor 2 - Rooms
              </Button>
            </div>
          </div>
        </div>

        {/* Beige background wrapper */}
        <div className="rooms-secondary px-4 md:px-8 py-10 rounded-t-[30px]">
          <div className="bg-primary w-[90%] max-w-6xl mx-auto p-6 space-y-4 rounded-3xl shadow-xl text-[24px]">
            <div className="flex justify-end">
              <Select>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="capacity">Capacity</SelectItem>
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
              className="rounded-full px-6 text-[#1f4e94] border-[#1f4e94] hover:bg-[#e1ecfa]"
            >
              Load More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AvailableRooms;
