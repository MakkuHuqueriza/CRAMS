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
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="w-1/2 color-primary text-white flex flex-col justify-center items-center p-8">
        <div className="text-center">
          <img
            src="/CRAMS_full_logo.png"
            alt="CRAMS Logo"
            className="max-w-[70%] h-auto mx-auto mb-2"
          />
          <h1 className="text-[140px] font-semibold leading-none tracking-wide">CRAMS</h1>
          <p className="text-[20px] font-medium">
            Classroom Reservation and Management System
          </p>
          <p className="text-sm mt-1">
            Organized Reservations, Even for the Biggest Crammers!
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-1/2 flex flex-col justify-center items-center p-8">
        <h1 className="text-[64px] font-semibold mb-6">Log In</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded p-2 w-[60%] mb-4"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded p-2 w-[60%] mb-4"
        />
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-black font-medium text-[16px] px-8 py-[6px] rounded-[50px] mb-2"
        >
          Log In
        </button>
        <button
          onClick={handleGoogleSignIn}
          className="bg-red-500 text-white px-4 py-2 rounded w-64 mb-4"
        >
          Log in using Google
        </button>
        <button
          onClick={() => router.push("/signup")} // Navigate to signup page
          className="text-blue-500 underline mb-4"
        >
          Don&apos;t have an account? Signup
        </button>
        {message && <p className="text-sm text-red-500">{message}</p>}
      </div>
    </div>
  );
}
