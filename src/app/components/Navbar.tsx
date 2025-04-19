"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { List, LogOut } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/actions/users"; // Import your logout action

const Navbar = () => {
  return (
    <nav className="bg-primary">
      <div className="w-full px-4 sm:px-0 lg:pr-0">
        <div className="h-14 flex items-center justify-between">
          {/* Left Section: Logo */}
          <div className="md:pl-8 flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="text-secondary-foreground">
                <Image
                  src="/CRAMS_logo.svg"
                  alt="CRAMS Logo"
                  width={120}
                  height={120}
                />
              </Link>
            </div>
          </div>

          {/* Right Section: Profile with Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-auto border border-gray-200 px-1 md:pr-10 py-[3px] flex items-center justify-center gap-2 
                  rounded-full sm:rounded-l-[50px] sm:rounded-r-none"
              >
                <Image
                  src="/profile_placeholder.svg"
                  alt="User Profile"
                  width={42}
                  height={42}
                  className="rounded-full"
                />
                <span className="hidden sm:inline text-secondary-foreground">
                  Makku Kuma
                </span>
              </Button>
            </PopoverTrigger>

            <PopoverContent
              align="end"
              className="w-52 p-0 rounded-none bg-white shadow-md z-50"
            >
              <ul className="space-y-1 text-sm text-secondary-foreground">
                <li>
                  <Link
                    href="/"
                    className="flex items-center gap-2 px-4 py-2 text-[14px] hover:bg-gray-100 active:bg-[#274c77] active:text-white"
                  >
                    <List className="w-4 h-4" />
                    <span>Pending Reservations</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="flex items-center gap-2 px-4 py-2 text-[14px] hover:bg-gray-100 active:bg-[#274c77] active:text-white"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log out</span>
                  </Link>
                </li>
              </ul>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
