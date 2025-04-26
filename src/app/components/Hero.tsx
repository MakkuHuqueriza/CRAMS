"use client";
import React, { useState } from "react";
import Image from "next/image";
import { MapPin, LogIn, LogOut, Users, Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import "@/styles/globals.css";
import "react-day-picker/dist/style.css"; // for default styling

const Hero = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const formattedRange = dateRange?.from
    ? dateRange.to
      ? `${format(dateRange.from, "PPP")} → ${format(dateRange.to, "PPP")}`
      : format(dateRange.from, "PPP")
    : "Pick a date range";

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
          <div className="bg-white shadow-lg rounded-lg p-4 flex flex-wrap items-center justify-between gap-2 w-[1350px] mx-auto">
            
            {/* DATE PICKER */}
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10">
                <CalendarIcon className="text-color-primary w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-black mb-0.5">
                  DATE
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="text-gray-400 text-left text-lg hover:bg-secondary min-w-[240px]">
                      {formattedRange}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                      showOutsideDays
                      className=" bg-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Divider */}
            <div className="h-14 w-px bg-black" />

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
                  className="text-gray-400 placeholder-gray-400 border-none bg-transparent focus:outline-none"
                />
              </div>
            </div>

            {/* Start Time */}
            <div className="flex items-start gap-4">
              <LogIn className="text-blue-600 w-6 h-6 mt-1" />
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-black mb-1">
                  START TIME
                </label>
                <input
                  type="time"
                  className="text-gray-400 border-none bg-transparent focus:outline-none"
                />
              </div>
            </div>

            {/* End Time */}
            <div className="flex items-start gap-4">
              <LogOut className="text-blue-600 w-6 h-6 mt-1" />
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-black mb-1">
                  END TIME
                </label>
                <input
                  type="time"
                  className="text-gray-400 border-none bg-transparent focus:outline-none"
                />
              </div>
            </div>

            {/* Capacity */}
            <div className="flex items-start gap-4">
              <Users className="text-blue-600 w-6 h-6 mt-1" />
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-black mb-1">
                  CAPACITY
                </label>
                <input
                  type="number"
                  placeholder="Select Cap"
                  className="text-gray-400 border-none bg-transparent focus:outline-none"
                />
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
