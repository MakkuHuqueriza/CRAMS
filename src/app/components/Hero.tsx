"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  MapPin,
  LogIn,
  LogOut,
  Users,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { availableTime } from "@/app/searchElements";
import { roomCapacity } from "@/app/searchElements";
import { roomFloors } from "@/app/searchElements";
import "@/styles/globals.css";
import "react-day-picker/dist/style.css";

const Hero = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [roomCap, setRoomCap] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isStartTimeOpen, setIsStartTimeOpen] = useState(false);
  const [isEndTimeOpen, setIsEndTimeOpen] = useState(false);
  const [isCapacityOpen, setIsCapacityOpen] = useState(false);

  return (
    <section className="w-full bg-background relative">
      {/* Original Banner with Search Bar Integrated */}
      <div className="mx-auto px-4 h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 h-[500px] rounded-xl overflow-hidden">
          {/* Left Side - Blue Background */}
          <div className="relative flex flex-col justify-center px-10">
            <div className="absolute inset-0 hero-bg-blue opacity-50"></div>
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-bold dark-blue-text mb-2">
                don&apos;t stress, <br /> just CRAMS.
              </h1>
              <p className="text-primary-foreground text-lg">
                Classroom reservations made simple!
              </p>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="relative w-full h-full">
            <Image
              src="/hero-classroom.jpg"
              alt="Classroom Image"
              fill
              className="object-cover"
            />
          </div>

          {/* Search Bar Positioned at Bottom */}
          <div className="absolute bottom-10 left-0 right-0 px-8">
            <div className="bg-white shadow-lg rounded-lg p-4 mx-auto max-w-[1450px]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                {/* DATE PICKER */}
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="flex items-start gap-4 p-2 rounded-md hover:bg-secondary cursor-pointer w-[210px]">
                      <div className="flex items-center justify-center w-10 h-10">
                        <CalendarIcon className="text-color-primary w-6 h-6" />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-black mb-1">
                          DATE
                        </label>
                        <div className="flex flex-col">
                          <div
                            className={`text-left ${selectedDate ? "text-black" : "text-gray-400"}`}
                          >
                            {selectedDate
                              ? format(selectedDate, "MM/dd/yyyy")
                              : "Select Date"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 shadow-none border-none bg-transparent"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => setSelectedDate(date)}
                      initialFocus
                      className="bg-white rounded-xl shadow-md"
                    />
                  </PopoverContent>
                </Popover>

                <div className="h-12 w-px bg-secondary" />

                {/* LOCATION PICKER */}
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="relative flex items-start gap-4 p-2 rounded-md hover:bg-secondary cursor-pointer w-[200px]">
                      <div className="flex items-center justify-center w-10 h-10">
                        <MapPin className="text-color-primary w-6 h-6" />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-black mb-1">
                          LOCATION
                        </label>
                        <div
                          onClick={() => setIsLocationOpen(!isLocationOpen)}
                          className={`text-sm ${selectedRoom ? "text-black" : "text-gray-400"}`}
                        >
                          {selectedRoom || "Select Floor"}
                        </div>
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 shadow-none border-none bg-transparent"
                    align="start"
                  >
                    {isLocationOpen && (
                      <div className="z-50 w-48 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {roomFloors.map((room) => (
                          <div
                            key={room.roomFloors}
                            onClick={() => {
                              setSelectedRoom(room.roomFloors);
                              setIsLocationOpen(false);
                            }}
                            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                              selectedRoom === room.roomFloors
                                ? "bg-blue-500 text-white"
                                : ""
                            }`}
                          >
                            {room.roomFloors}
                          </div>
                        ))}
                      </div>
                    )}
                  </PopoverContent>
                </Popover>

                <div className="h-12 w-px bg-secondary" />

                {/* START TIME PICKER */}
                <div className="relative flex items-start gap-4 p-2 rounded-md hover:bg-secondary cursor-pointer w-[200px]">
                  <div className="flex items-center justify-center w-10 h-10">
                    <LogIn className="text-color-primary w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-black mb-1">
                      START TIME
                    </label>
                    <div
                      onClick={() => setIsStartTimeOpen(!isStartTimeOpen)}
                      className={`text-sm ${startTime ? "text-black" : "text-gray-400"}`}
                    >
                      {startTime || "Select Time"}
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

                <div className="h-12 w-px bg-secondary" />

                {/* END TIME PICKER */}
                <div className="relative flex items-start gap-4 p-2 rounded-md hover:bg-secondary cursor-pointer w-[200px]">
                  <div className="flex items-center justify-center w-10 h-10">
                    <LogOut className="text-color-primary w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-black mb-1">
                      END TIME
                    </label>
                    <div
                      onClick={() => setIsEndTimeOpen(!isEndTimeOpen)}
                      className={`text-sm ${endTime ? "text-black" : "text-gray-400"}`}
                    >
                      {endTime || "Select Time"}
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

                <div className="h-12 w-px bg-secondary" />

                {/* CAPACITY PICKER */}
                <div className="relative flex items-start gap-4 p-2 rounded-md hover:bg-secondary cursor-pointer w-[160px]">
                  <div className="flex items-center justify-center w-10 h-10">
                    <Users className="text-color-primary w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-black mb-1">
                      CAPACITY
                    </label>
                    <div
                      onClick={() => setIsCapacityOpen(!isCapacityOpen)}
                      className={`text-sm ${roomCap ? "text-black" : "text-gray-400"}`}
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
        </div>
      </div>
    </section>
  );
};

export default Hero;
