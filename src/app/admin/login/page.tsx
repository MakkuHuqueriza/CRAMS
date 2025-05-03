"use client";

import { useState } from "react";
import Image from "next/image";
import { adminLoginAction } from "@/actions/admin";

export default function AdminLoginPage() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdminLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission
    setIsSubmitting(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);

    try {
      const result = await adminLoginAction(formData);
      if (result?.message) {
        setMessage(result.message); // Display error message if login fails
      }
    } catch (error) {
      console.error("Error during admin login:", error);
      setMessage("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Section */}
      <div className="bg-white text-[#274c77] border-l-2 border-[#274c77] flex flex-col justify-center items-center p-8 md:w-1/2 w-full h-full md:h-auto">
        {/* Mobile Logo */}
        <Image
          src="/CRAMS_logo.svg"
          alt="CRAMS Logo"
          className="block md:hidden max-w-[50%] h-auto absolute top-4 left-1/2 transform -translate-x-1/2"
        />
        {/* Desktop Logo */}
        <div className="hidden md:block text-center">
          <Image
            src="/CRAMS_full_logo_blue.png"
            alt="CRAMS Logo"
            className="max-w-[50%] md:max-w-[55%] xl:max-w-[70%] h-auto mx-auto mb-2"
          />
          <h1 className="text-[40px] md:text-[80px] lg:text-[110px] xl:text-[140px] font-semibold leading-none tracking-wide">
            CRAMS
          </h1>
          <p className="text-[9px] md:text-[11px] lg:text-[15px] xl:text-[20px] font-medium">
            Classroom Reservation and Management System
          </p>
          <p className="text-[8px] md:text-[9px] lg:text-[12px] xl:text-sm mt-1">
            Organized Reservations, Even for the Biggest Crammers!
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="bg-white flex flex-col justify-center items-center p-4 sm:p-6 md:p-2 lg:p-8 md:w-1/2 w-full rounded-t-[30px] md:rounded-none md:h-auto absolute bottom-0 md:relative">
        <h1 className="text-[32px] sm:text-[36px] md:text-[44px] lg:text-[50px] xl:text-[56px] font-semibold mb-6 text-left w-[80%] sm:w-[70%] md:w-[60%]">
          Admin Login
        </h1>
        <form
          onSubmit={handleAdminLogin}
          className="flex flex-col items-center gap-4 w-[80%] sm:w-[70%] md:w-[60%]"
        >
          <label
            htmlFor="email"
            className="text-left text-[12px] sm:text-[14px] lg:text-[16px] font-medium w-full"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email"
            className="bg-[#f5f9fc] border-[1px] border-[#B9B9B9] rounded-md p-1 md:p-2 w-full mb-4 text-sm"
          />
          <label
            htmlFor="password"
            className="text-left text-[12px] sm:text-[14px] lg:text-[16px] font-medium w-full"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter your password"
            className="bg-[#f5f9fc] border-[1px] border-[#B9B9B9] rounded-md p-1 md:p-2 w-full mb-2 text-sm"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-[#9BB2FC] text-black font-medium text-[12px] sm:text-[13px] lg:text-[16px] px-6 sm:px-8 py-[6px] rounded-[50px] mb-2 transition hover:scale-[103%] ${
              isSubmitting ? "bg-gray-400" : ""
            }`}
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </form>
        {message && (
          <p className="text-sm text-[#cf2626] mt-4 text-center">{message}</p>
        )}
      </div>
    </div>
  );
}
