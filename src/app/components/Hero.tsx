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
import { availableTime } from "@/app/searchElements";
import { roomCapacity } from "@/app/searchElements";
import "@/styles/globals.css";
import "react-day-picker/dist/style.css"; // for default styling

const Hero = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [roomCap, setRoomCap] = useState<string>("");

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
                      className={`text-left min-w-[240px]
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
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-10 h-10">
                <MapPin className="text-color-primary w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-black mb-1">
                  LOCATION
                </label>
                <input
                  type="text"
                  placeholder="Select Room"
                  className="text-gray-400 border-none bg-transparent focus:outline-none"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="h-12 w-px bg-secondary" />

            {/* START TIME PICKER */}
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-10 h-10">
                <LogIn className="text-color-primary w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-black mb-1">
                  START TIME
                </label>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="text-sm text-gray-400 border-none bg-transparent focus:outline-none"
                >
                  <option value="">Select Start Time</option>
                  {availableTime.map((time, index) => (
                    <option key={index} value={time.availableTime}>
                      {time.availableTime}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Divider */}
            <div className="h-12 w-px bg-secondary" />

            {/* END TIME PICKER */}
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-10 h-10">
                <LogOut className="text-color-primary w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-black mb-1">
                  END TIME
                </label>
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="text-sm text-gray-400 border-none bg-transparent focus:outline-none"
                >
                  <option value="">Select End Time</option>
                  {availableTime.map((time, index) => (
                    <option key={index} value={time.availableTime}>
                      {time.availableTime}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Divider */}
            <div className="h-12 w-px bg-secondary" />

            {/* CAPACITY PICKER */}
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-10 h-10">
                <Users className="text-color-primary w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-black mb-1">
                  CAPACITY
                </label>
                <select
                  value={roomCap}
                  onChange={(e) => setRoomCap(e.target.value)} 
                  className="text-sm text-gray-400 border-none bg-transparent focus:outline-none"
                >
                  <option value="">Select Cap</option>
                  {roomCapacity.map((capacity, index) => (
                    <option key={index} value={capacity.roomCapacity}>
                      {capacity.roomCapacity}
                    </option>
                  ))}
                </select>
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
