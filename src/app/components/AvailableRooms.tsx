"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    name: "ROOM 102",
    type: "DBSES LABORATORY ROOM",
    floor: "1st Floor, CSM",
    capacity: 50,
    image: "/room_sample.png",
    times: ["10:00 AM – 11:00 PM", "11:30 AM – 12:30 PM"],
  },
  {
    name: "ROOM 105",
    type: "LECTURE ROOM",
    floor: "1st Floor, CSM",
    capacity: 50,
    image: "/room_sample.png",
    times: ["10:00 AM – 11:00 PM", "11:30 AM – 12:30 PM"],
  },
  {
    name: "ROOM 108",
    type: "DBSES LABORATORY ROOM",
    floor: "1st Floor, CSM",
    capacity: 50,
    image: "/room_sample.png",
    times: ["10:00 AM – 11:00 PM", "11:30 AM – 12:30 PM"],
  },
  {
    name: "ROOM 112",
    type: "LECTURE ROOM",
    floor: "1st Floor, CSM",
    capacity: 50,
    image: "/room_sample.png",
    times: ["10:00 AM – 11:00 PM", "11:30 AM – 12:30 PM"],
  },
  {
    name: "ROOM 132",
    type: "DFSC LABORATORY ROOM",
    floor: "1st Floor, CSM",
    capacity: 50,
    image: "/room_sample.png",
    times: ["10:00 AM – 11:00 PM", "11:30 AM – 12:30 PM"],
  },
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

const AvailableRooms = () => {
  const [selectedFloor, setSelectedFloor] = useState("1st Floor, CSM");

  // Filter rooms based on the selected floor
  const filteredRooms = roomData.filter((room) => room.floor === selectedFloor);

  const RoomCard = ({ room }: { room: Room }) => {
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

    return (
      <Card className="w-[98%] flex md:flex-row bg-[#e7edf1] border-none p-4 md:p-4 scale-[0.90] md:scale-[0.97] gap-6 md:gap-5">
        <div className="flex-shrink-0">
          <Image
            src={room.image}
            alt={room.name}
            width={315}
            height={315}
            className="rounded-lg object-cover w-full max-w-[280px] h-auto aspect-square md:w-[250px] md:h-[250px] lg:w-[315px] lg:h-[315px]"
          />
        </div>

        <div className="flex flex-col justify-between flex-1">
          <div className="space-y-1">
            <h2 className="text-primary-foreground text-[30px] lg:text-[36px] md:text-[28px] font-bold mb-5 lg:mb-10 md:mb-5">
              {room.name}
            </h2>

            <div className="flex items-center gap-2">
              {getRoomIcon(room.type)}
              <span className="text-primary-foreground text-[10px] lg:text-[16px] md:text-[12px] font-semibold">
                {room.type}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[10px] lg:text-[16px] md:text-[12px] text-primary-foreground">
              <Building className="w-4 h-4" /> {room.floor}
              <span className="mx-2 mr-[-5px]">|</span>
              <Users className="w-4 h-4 ml-4" /> {room.capacity}
            </div>

            <div className="pt-4 pb-1">
              <p className="text-[15px] lg:text-[16px] md:text-[12px] text-primary-foreground font-semibold">
                Available Time
              </p>
              {room.times.map((time, i) => (
                <p
                  key={i}
                  className="text-primary-foreground text-[13px] lg:text-sm md:text-[11px] tracking-wider flex items-center gap-2"
                >
                  <Clock className="w-4 h-4 text-[#274c77]" />
                  {time}
                </p>
              ))}
            </div>
          </div>

          {/* Dots Button */}
          <button className="bg-primary text-black rounded-full p-1 w-6 h-3 flex items-center justify-center">
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {/* Buttons */}
          <div className="flex justify-center md:justify-end gap-2 mt-6 md:mt-4">
            <Button
              size="extraSmall"
              className="border-[#182657] text-[#182657] hover:shadow-lg border-2 
              xl:text-[15px] xl:px-4 xl:py-3 
              lg:text-[14px] lg:px-4 lg:py-2 
              md:text-[11px] md:px-2 md:py-1 
              text-[11px] px-3 py-2"
            >
              View Details
            </Button>
            <Button
              size="extraSmall"
              className="bg-[#274c77] text-white hover:bg-[#182657] 
              xl:text-[15px] xl:px-5 xl:py-3 
              lg:text-[14px] lg:px-4 lg:py-2 
              md:text-[12px] md:px-3 md:py-2 
              text-[11px] px-3 py-2"
            >
              Reserve Now
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <section className="flex justify-center py-12">
      <div className="w-full rounded-xl shadow-lg bg-primary">
        <div className="bg-primary w-[75%] max-w-6xl mx-auto py-10 border-b border-muted">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-[28px] xl:text-[42px] md:text-[30px] font-bold text-primary whitespace-nowrap">
                Available Rooms
              </h1>
              <p className="text-[14px] xl:text-[20px] md:text-[14px] text-muted-foreground whitespace-nowrap">
                Browse to see room&apos;s availability
              </p>
            </div>
            <div className="flex gap-2 xl:gap-3 lg:gap-2">
              <Button
                size="extraSmall"
                onClick={() => setSelectedFloor("1st Floor, CSM")}
                className={`rounded-md font-semibold border-2 ${
                  selectedFloor === "1st Floor, CSM"
                    ? "text-[#274c77] border-[#274c77] hover:shadow-lg"
                    : "bg-[#274c77] text-white border-[#274c77] hover:bg-[#182657]"
                } xl:text-[16px] xl:px-4 xl:py-4 lg:text-[14px] lg:px-3 lg:py-3 md:text-[12px] md:px-2 md:py-1 text-[11px] px-2 py-1`}
              >
                Floor 1 - CSM Lobby
              </Button>
              <Button
                size="extraSmall"
                onClick={() => setSelectedFloor("2nd Floor, CSM")}
                className={`rounded-md font-semibold border-2 ${
                  selectedFloor === "2nd Floor, CSM"
                    ? "text-[#274c77] border-[#274c77] hover:shadow-lg"
                    : "bg-[#274c77] text-white border-[#274c77] hover:bg-[#182657]"
                } xl:text-[16px] xl:px-4 xl:py-4 lg:text-[14px] lg:px-3 lg:py-3 md:text-[12px] md:px-2 md:py-1 text-[11px] px-2 py-1`}
              >
                Floor 2 - Rooms
              </Button>
            </div>
          </div>
        </div>

        <div className="rooms-secondary h-full px-4 md:px-8 pt-10 rounded-t-[30px]">
          <div className="bg-primary xl:w-[75%] lg:w-[90%] md:w-[89%] w-[85%] max-w-6xl mx-auto p-6 px-2 md:space-y-5 rounded-3xl shadow-xl text-[24px]">
            <div className="flex justify-center md:justify-end lg:mr-2">
              <Select>
                <SelectTrigger className="w-[190px] text-[#8a8a8a] py-2 mr-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-100 mb-0 md:mb-0">
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

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedFloor}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center space-y-[-30px] md:space-y-4"
              >
                {filteredRooms.map((room, index) => (
                  <RoomCard key={index} room={room} />
                ))}
              </motion.div>
            </AnimatePresence>
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
