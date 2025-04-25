"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { loginAction, signInWithGoogle } from "@/actions/users";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter(); // Initialize router

  const handleLogin = async () => {
    const result = await loginAction(email, password);
    if (result?.errorMessage) {
      setMessage(result.errorMessage);
    } else {
      setMessage("Logged in successfully!");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      if (result?.errorMessage) {
        setMessage(result.errorMessage);
      } else {
        setMessage("Redirecting to Google...");
      }
    } catch (error) {
      setMessage(`An error occurred during Google sign-in: ${error}`);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Section */}
      <div className="color-primary text-white flex flex-col justify-center items-center p-8 md:w-1/2 w-full h-full md:h-auto">
        {/* Mobile Logo */}
        <img
          src="/CRAMS_white_logo.svg"
          alt="CRAMS Logo"
          className="block md:hidden max-w-[50%] h-auto absolute top-4 left-1/2 transform -translate-x-1/2"
        />
        {/* Desktop Logo */}
        <div className="hidden md:block text-center">
          <img
            src="/CRAMS_full_logo.png"
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
          Log In
        </h1>
        <label
          htmlFor="email"
          className="w-[80%] sm:w-[70%] md:w-[60%] text-left text-[12px] sm:text-[14px] lg:text-[16px] font-medium"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-[#f5f9fc] border-[1px] border-[#B9B9B9] rounded-md p-1 md:p-2 w-[80%] sm:w-[70%] md:w-[60%] mb-4 text-sm"
        />
        <label
          htmlFor="password"
          className="w-[80%] sm:w-[70%] md:w-[60%] text-left text-[12px] sm:text-[14px] lg:text-[16px] font-medium"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-[#f5f9fc] border-[1px] border-[#B9B9B9] rounded-md p-1 md:p-2 w-[80%] sm:w-[70%] md:w-[60%] mb-2 text-sm"
        />
        <a
          href="/forgot-password"
          className="text-[#a3a3a3] underline mb-10 w-[80%] sm:w-[70%] md:w-[60%] text-left text-[10px] sm:text-[11px] lg:text-[13px]"
        >
          Forgot Your Password?
        </a>
        <button
          onClick={handleLogin}
          className="bg-[#9BB2FC] text-black font-medium text-[12px] sm:text-[13px] lg:text-[16px] px-6 sm:px-8 py-[6px] rounded-[50px] mb-2 transition hover:scale-[103%]"
        >
          Log In
        </button>

        <div className="my-2 lg:my-4 text-[#a3a3a3]">
          <p>or</p>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="bg-primary text-black border-[3px] text-[12px] sm:text-[13px] lg:text-[16px] border-[#9BB2FC] px-6 sm:px-8 py-[4px] rounded-[50px] w-[80%] sm:w-[70%] md:w-[65%] max-w-[300px] mb-4 transition hover:scale-[103%]"
        >
          Log in using Google
        </button>
        <button
          onClick={() => router.push("/signup")} // Navigate to signup page
          className="text-[#6b89eb] text-[12px] sm:text-sm lg:text-[16px] underline mb-4 mt-6"
        >
          Don&apos;t have an account? Signup
        </button>
        {message && <p className="text-sm text-[#cf2626]">{message}</p>}
      </div>
    </div>
  );
}
