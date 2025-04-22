"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, LogIn, LogOut, Users } from "lucide-react";
import "@/styles/globals.css";

const Hero = () => {
  return (
    <section className="w-full bg-background">
      <div className="mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 h-[420px] rounded-xl overflow-hidden">
          {/* Left Side: Text */}
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

          {/* Right Side: Image */}
          <div className="relative w-full h-full">
            <Image
              src="/hero-classroom.jpg" // temporary picture only
              alt="Classroom Image"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Search Bar Section */}
        <div className="bg-white shadow-lg rounded-lg p-4 mt-6 flex flex-wrap items-center justify-between gap-4">
          {/* Date Input */}
          <div className="flex items-start gap-4">
            {/* Calendar Icon */}
            <Calendar className="text-blue-600 w-6 h-6 mt-1" />

            {/* Label and input */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-black mb-1">
                DATE
              </label>
              <input
                type="date"
                placeholder="Select Date"
                className="text-gray-400 placeholder-gray-400 border-none bg-transparent focus:outline-none"
              />
            </div>
          </div>

          {/* Location Input */}
          <div className="flex items-start gap-4">
            {/* Location Icon */}
            <MapPin className="text-blue-600 w-6 h-6 mt-1" />

            {/* Label and input */}
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

          {/* Start Time Input */}
          <div className="flex items-start gap-4">
            {/* Start Time Icon */}
            <LogIn className="text-blue-600 w-6 h-6 mt-1" />

            {/* Label and input */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-black mb-1">
                START TIME
              </label>
              <input
                type="time"
                placeholder="Select Time"
                className="text-gray-400 placeholder-gray-400 border-none bg-transparent focus:outline-none"
              />
            </div>
          </div>

          {/* End Time Input */}
          <div className="flex items-start gap-4">
            {/* End Time Icon */}
            <LogOut className="text-blue-600 w-6 h-6 mt-1" />

            {/* Label and input */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-black mb-1">
                END TIME
              </label>
              <input
                type="time"
                placeholder="Select Time"
                className="text-gray-400 placeholder-gray-400 border-none bg-transparent focus:outline-none"
              />
            </div>
          </div>

          {/* Capacity Input */}
          <div className="flex items-start gap-4">
            {/* Capacity Icon */}
            <Users className="text-blue-600 w-6 h-6 mt-1" />

            {/* Label and input */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-black mb-1">
                CAPACITY
              </label>
              <input
                type="number"
                placeholder="Select Cap"
                className="text-gray-400 placeholder-gray-400 border-none bg-transparent focus:outline-none"
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
    </section>
  );
};

export default Hero;
