"use client";
import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Home, CalendarDays, LayoutGrid } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="bg-white w-64 h-screen p-6 shadow-md">
      <div className="flex flex-col items-center mb-10">
        <div className="w-14 h-14 bg-blue-100 flex items-center justify-center rounded-lg">
          <span className="text-2xl font-bold text-blue-900">CR</span>
        </div>
        <Image
          src="/CRAMS_full_logo_blue.png"
          alt="CRAMS Logo"
          className="max-w-[50%] md:max-w-[55%] xl:max-w-[70%] h-auto mx-auto mb-2"
        />
        <h1 className="text-xl font-bold text-center mt-2">CRAMS</h1>
        <p className="text-sm text-gray-500 text-center">
          Classroom Reservation and Management System
        </p>
        <p className="font-semibold mt-6">
          Welcome <span className="text-blue-800">Admin!</span>
        </p>
      </div>
      <nav className="space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-blue-800 bg-blue-100"
        >
          <Home className="mr-2" size={16} />
          Dashboard
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <CalendarDays className="mr-2" size={16} />
          Booking Management
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <LayoutGrid className="mr-2" size={16} />
          Room Management
        </Button>
      </nav>
    </aside>
  );
};

export default Sidebar;
