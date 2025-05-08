"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  MapPin,
  LogIn,
  LogOut,
  Users,
  Search,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { availableTime, roomCapacity, roomFloors } from "@/app/searchElements";
import "@/styles/globals.css";
import "react-day-picker/dist/style.css";

const Hero = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [roomCap, setRoomCap] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  return (
    <section className="w-full bg-background relative">
      <div className="mx-auto px-4 h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 h-[500px] rounded-xl overflow-hidden">
          {/* Left Section */}
          <div className="relative flex flex-col justify-center px-10">
            <div className="absolute inset-0 hero-bg-blue opacity-50" />
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-bold dark-blue-text mb-2">
                don&apos;t stress, <br /> just CRAMS.
              </h1>
              <p className="text-primary-foreground text-lg">
                Classroom reservations made simple!
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="relative w-full h-full">
            <Image
              src="/hero-classroom.jpg"
              alt="Classroom Image"
              fill
              className="object-cover"
            />
          </div>

          {/* Search Bar */}
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
                            className={`text-md ${selectedDate ? "text-black" : "text-gray-400"}`}
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
                    <div className="flex items-start gap-4 p-2 rounded-md hover:bg-secondary cursor-pointer w-[200px]">
                      <div className="flex items-center justify-center w-10 h-10">
                        <MapPin className="text-color-primary w-6 h-6" />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-black mb-1">
                          LOCATION
                        </label>
                        <div
                          className={`text-md ${selectedRoom ? "text-black" : "text-gray-400"}`}
                        >
                          {selectedRoom || "Select Room"}
                        </div>
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="w-auto p-0 bg-white rounded-lg shadow-lg"
                  >
                    <div className="w-48 max-h-60 overflow-y-auto rounded-lg">
                      {roomFloors.map((room) => (
                        <div
                          key={room.roomFloors}
                          onClick={() => setSelectedRoom(room.roomFloors)}
                          className={`px-4 py-2 cursor-pointer hover:hover-color ${
                            selectedRoom === room.roomFloors
                              ? "color-primary text-white font-semibold"
                              : ""
                          }`}
                        >
                          {room.roomFloors}
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                <div className="h-12 w-px bg-secondary" />

                {/* START TIME PICKER */}
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="flex items-start gap-4 p-2 rounded-md hover:bg-secondary cursor-pointer w-[200px]">
                      <div className="flex items-center justify-center w-10 h-10">
                        <LogIn className="text-color-primary w-6 h-6" />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-black mb-1">
                          START TIME
                        </label>
                        <div
                          className={`text-md ${startTime ? "text-black" : "text-gray-400"}`}
                        >
                          {startTime || "Select Time"}
                        </div>
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="w-auto p-0 bg-white rounded-lg shadow-lg"
                  >
                    <div className="w-48 max-h-60 overflow-y-auto rounded-lg">
                      {availableTime.map((time) => (
                        <div
                          key={time.availableTime}
                          onClick={() => setStartTime(time.availableTime)}
                          className={`px-4 py-2 cursor-pointer hover:hover-color ${
                            startTime === time.availableTime
                              ? "color-primary text-white font-semibold"
                              : ""
                          }`}
                        >
                          {time.availableTime}
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                <div className="h-12 w-px bg-secondary" />

                {/* END TIME PICKER */}
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="flex items-start gap-4 p-2 rounded-md hover:bg-secondary cursor-pointer w-[200px]">
                      <div className="flex items-center justify-center w-10 h-10">
                        <LogOut className="text-color-primary w-6 h-6" />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-black mb-1">
                          END TIME
                        </label>
                        <div
                          className={`text-md ${endTime ? "text-black" : "text-gray-400"}`}
                        >
                          {endTime || "Select Time"}
                        </div>
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="w-auto p-0 bg-white rounded-lg shadow-lg"
                  >
                    <div className="w-48 max-h-60 overflow-y-auto rounded-lg">
                      {availableTime.map((time) => (
                        <div
                          key={time.availableTime}
                          onClick={() => setEndTime(time.availableTime)}
                          className={`px-4 py-2 cursor-pointer hover:hover-color ${
                            endTime === time.availableTime
                              ? "color-primary text-white font-semibold"
                              : ""
                          }`}
                        >
                          {time.availableTime}
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                <div className="h-12 w-px bg-secondary" />

                {/* CAPACITY PICKER */}
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="flex items-start gap-4 p-2 rounded-md hover:bg-secondary cursor-pointer w-[200px]">
                      <div className="flex items-center justify-center w-10 h-10">
                        <Users className="text-color-primary w-6 h-6" />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-black mb-1">
                          CAPACITY
                        </label>
                        <div
                          className={`text-md ${roomCap ? "text-black" : "text-gray-400"}`}
                        >
                          {roomCap || "Select Capacity"}
                        </div>
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="w-auto p-0 bg-white rounded-lg shadow-lg"
                  >
                    <div className="w-48 max-h-60 overflow-y-auto rounded-lg">
                      {roomCapacity.map((cap) => (
                        <div
                          key={cap.roomCapacity}
                          onClick={() => setRoomCap(cap.roomCapacity)}
                          className={`px-4 py-2 cursor-pointer hover:hover-color ${
                            roomCap === cap.roomCapacity
                              ? "color-primary text-white font-semibold"
                              : ""
                          }`}
                        >
                          {cap.roomCapacity}
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Search Button */}
                <div className="flex items-end">
                  <button className="dark-blue-bg text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#182657] h-[55px] flex items-center gap-2">
                    <Search size={20} />
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
