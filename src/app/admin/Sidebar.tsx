"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, CalendarDays, LayoutGrid, LogOut } from "lucide-react";
import { adminLogoutAction } from "@/actions/admin";
import { usePathname } from "next/navigation"; // Import usePathname

const Sidebar = () => {
  const pathname = usePathname(); // Get the current route

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
      <nav className="space-y-1">
        {/* Dashboard Button */}
        <Link href="/admin">
          <Button
            variant="ghost"
            className={`w-full justify-start ${
              pathname === "/admin"
                ? "bg-blue-100 text-blue-800"
                : "hover:bg-blue-100 hover:text-blue-800"
            } transition duration-200 ease-in-out`}
          >
            <Home className="mr-2" size={16} />
            Dashboard
          </Button>
        </Link>

        {/* Booking Management Button */}
        <Link href="/admin/booking-management">
          <Button
            variant="ghost"
            className={`w-full justify-start ${
              pathname === "/admin/booking-management"
                ? "bg-blue-100 text-blue-800"
                : "hover:bg-blue-100 hover:text-blue-800"
            } transition duration-200 ease-in-out`}
          >
            <CalendarDays className="mr-2" size={16} />
            Booking Management
          </Button>
        </Link>

        {/* Room Management Button */}
        <Link href="/admin/room-management">
          <Button
            variant="ghost"
            className={`w-full justify-start ${
              pathname === "/admin/room-management"
                ? "bg-blue-100 text-blue-800"
                : "hover:bg-blue-100 hover:text-blue-800"
            } transition duration-200 ease-in-out`}
          >
            <LayoutGrid className="mr-2" size={16} />
            Room Management
          </Button>
        </Link>

        {/* Logout Button */}
        <button
          onClick={adminLogoutAction}
          className="flex items-center gap-2 px-4 py-2 w-full text-[14px] hover:bg-gray-100 active:bg-[#274c77] active:text-white rounded-md transition duration-200 ease-in-out"
        >
          <LogOut className="w-4 h-4" />
          <span>Log out</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
