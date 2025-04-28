"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  MapPin,
  LogIn,
  LogOut,
  Users,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { roomData } from "@/app/roomData";
import { availableTime } from "@/app/searchElements";
import { roomCapacity } from "@/app/searchElements";
import "@/styles/globals.css";
import "react-day-picker/dist/style.css"; // for default styling

const Hero = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [isStartTimeOpen, setIsStartTimeOpen] = useState(false);
  const [isEndTimeOpen, setIsEndTimeOpen] = useState(false);
  const [isCapacityOpen, setIsCapacityOpen] = useState(false);
  const [roomCap, setRoomCap] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [showAllRooms, setShowAllRooms] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  // Extract and sort room names numerically
  const roomNames = roomData
    .map((room) => room.name)
    .sort(
      (a, b) => parseInt(a.replace(/\D/g, "")) - parseInt(b.replace(/\D/g, "")),
    );

  const displayedRooms = showAllRooms ? roomNames : roomNames.slice(0, 6);

  return (
    <section className="w-full bg-background">
      <div className="mx-auto px-4">
        {/* Hero Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 h-[420px] rounded-xl overflow-hidden">
          <div className="relative flex flex-col justify-center px-10">
            <div className="absolute inset-0 hero-bg-blue opacity-50"></div>
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-bold dark-blue-text mb-2">
                don’t stress, <br /> just CRAMS.
              </h1>
              <p className="text-primary-foreground text-lg">
                Classroom reservations made simple!
              </p>
            </div>
          </div>

          <div className="relative w-full h-full">
            <Image
              src="/hero-classroom.jpg"
              alt="Classroom Image"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center justify-between">
          <div className="bg-white shadow-lg rounded-lg p-4 flex flex-wrap items-center justify-between gap-2 w-[1450px] mx-auto">
            {/* DATE PICKER */}
            <Popover>
              <PopoverTrigger asChild>
                <div className="flex items-start gap-4 p-2 rounded-md hover:bg-secondary cursor-pointer">
                  {/* Icon */}
                  <div className="flex items-center justify-center w-10 h-10">
                    <CalendarIcon className="text-color-primary w-6 h-6" />
                  </div>

                  {/* Calendar */}
                  <div className="flex flex-col">
                    <label className="text-base font-medium text-black mb-1">
                      DATE
                    </label>
                    <div
                      className={`text-left min-w-[235px]
                        ${dateRange?.from && dateRange?.to ? "text-black" : "text-gray-400"}
                      `}
                    >
                      {dateRange?.from && dateRange?.to
                        ? `${format(dateRange.from, "MM/dd/yyyy")} - ${format(dateRange.to, "MM/dd/yyyy")}`
                        : "Select a Date"}
                    </div>
                  </div>
                </div>
              </PopoverTrigger>

              <PopoverContent
                className="w-auto p-0 border-0 shadow-none bg-transparent"
                align="start"
              >
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            {/* Divider */}
            <div className="h-12 w-px bg-secondary" />

            {/* LOCATION PICKER */}
            <div className="relative flex items-start gap-4 p-2 rounded-md hover:bg-secondary cursor-pointer w-[200px]">
              <div className="flex items-center justify-center w-10 h-10">
                <MapPin className="text-color-primary w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <label className="text-base font-medium text-black mb-1">
                  LOCATION
                </label>
                <div
                  onClick={() => setIsLocationOpen(!isLocationOpen)}
                  className={`text-base border-none bg-transparent focus:outline-none ${
                    selectedRoom ? "text-black" : "text-gray-400"
                  }`}
                >
                  {selectedRoom || "Select Room"}
                </div>

                {isLocationOpen && (
                  <div className="absolute z-50 top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto w-48">
                    {displayedRooms.map((room) => (
                      <div
                        key={room}
                        onClick={() => {
                          setSelectedRoom(room);
                          setIsLocationOpen(false);
                        }}
                        className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                          selectedRoom === room ? "bg-blue-500 text-white" : ""
                        }`}
                      >
                        {room}
                      </div>
                    ))}

                    {!showAllRooms && roomNames.length > 6 && (
                      <div
                        onClick={() => setShowAllRooms(true)}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-gray-500 border-t border-gray-200"
                      >
                        List More
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="h-12 w-px bg-secondary" />

            {/* START TIME PICKER */}
            <div className="relative flex items-start gap-4 p-2 rounded-md hover:bg-secondary cursor-pointer w-[200px]">
              <div className="flex items-center justify-center w-10 h-10">
                <LogIn className="text-color-primary w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <label className="text-base font-medium text-black mb-1">
                  START TIME
                </label>
                <div
                  onClick={() => setIsStartTimeOpen(!isStartTimeOpen)}
                  className={`text-base border-none bg-transparent focus:outline-none w-[180px] ${
                    startTime ? "text-black" : "text-gray-400"
                  }`}
                >
                  {startTime || "Select Start Time"}
                </div>

                {isStartTimeOpen && (
                  <div className="absolute z-50 top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {availableTime.map((time) => (
                      <div
                        key={time.availableTime}
                        onClick={() => {
                          setStartTime(time.availableTime);
                          setIsStartTimeOpen(false);
                        }}
                        className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                          startTime === time.availableTime
                            ? "bg-blue-500 text-white"
                            : ""
                        }`}
                      >
                        {time.availableTime}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="h-12 w-px bg-secondary" />

            {/* END TIME PICKER */}
            <div className="relative flex items-start gap-4 p-2 rounded-md hover:bg-secondary cursor-pointer w-[200px]">
              <div className="flex items-center justify-center w-10 h-10">
                <LogOut className="text-color-primary w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <label className="text-base font-medium text-black mb-1">
                  END TIME
                </label>
                <div
                  onClick={() => setIsEndTimeOpen(!isEndTimeOpen)}
                  className={`text-base border-none bg-transparent focus:outline-none w-[180px] ${
                    endTime ? "text-black" : "text-gray-400"
                  }`}
                >
                  {endTime || "Select End Time"}
                </div>

                {isEndTimeOpen && (
                  <div className="absolute z-50 top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {availableTime.map((time) => (
                      <div
                        key={time.availableTime}
                        onClick={() => {
                          setEndTime(time.availableTime);
                          setIsEndTimeOpen(false);
                        }}
                        className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                          endTime === time.availableTime
                            ? "bg-blue-500 text-white"
                            : ""
                        }`}
                      >
                        {time.availableTime}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="h-12 w-px bg-secondary" />

            {/* CAPACITY PICKER */}
            <div className="relative flex items-start gap-4 p-2 rounded-md hover:bg-secondary cursor-pointer w-[200px]">
              <div className="flex items-center justify-center w-10 h-10">
                <Users className="text-color-primary w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <label className="text-base font-medium text-black mb-1">
                  CAPACITY
                </label>
                <div
                  onClick={() => setIsCapacityOpen(!isCapacityOpen)}
                  className={`text-base border-none bg-transparent focus:outline-none ${
                    roomCap ? "text-black" : "text-gray-400"
                  }`}
                >
                  {roomCap || "Select Cap"}
                </div>

                {isCapacityOpen && (
                  <div className="absolute z-50 top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {roomCapacity.map((capacity) => (
                      <div
                        key={capacity.roomCapacity}
                        onClick={() => {
                          setRoomCap(capacity.roomCapacity);
                          setIsCapacityOpen(false);
                        }}
                        className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                          roomCap === capacity.roomCapacity
                            ? "bg-blue-500 text-white"
                            : ""
                        }`}
                      >
                        {capacity.roomCapacity}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
