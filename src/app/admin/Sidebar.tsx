"use client";
import React from "react";
import Image from "next/image";
// import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";
import { Home, CalendarDays, LayoutGrid } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="bg-white w-[270px] h-screen p-6 shadow-xl">
      <div className="flex flex-col items-center mb-10">
        <Image
          src="/CRAMS_full_logo_blue.svg"
          alt="CRAMS Logo"
          width={80}
          height={80}
          className="max-w-[50%] md:max-w-[55%] xl:max-w-[70%] h-auto mx-auto mb-2"
        />
        <h1 className="text-[40px] text-[#274c77] font-bold text-center tracking-wide">
          CRAMS
        </h1>

        <hr className="border-[1px] w-full border-[#B9B9B9] rounded-md"></hr>

        <p className="font-semibold mt-6">
          Welcome <span className="text-[#274c77]">Admin!</span>
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
        <Button
          variant="ghost"
          className="w-full justify-start hover:text-blue-800 hover:bg-blue-100"
        >
          <CalendarDays className="mr-2" size={16} />
          Booking Management
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start hover:text-blue-800 hover:bg-blue-100"
        >
          <LayoutGrid className="mr-2" size={16} />
          Room Management
        </Button>
      </nav>
    </aside>
  );
};

export default Sidebar;
