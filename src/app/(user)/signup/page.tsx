"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { signUpAction } from "@/actions/users";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter(); // Initialize router

  const handleSignup = async () => {
    const result = await signUpAction(email, password);
    if (result?.errorMessage) {
      setMessage(result.errorMessage);
    } else {
      setMessage("Signed up successfully!");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h1 className="text-2xl font-bold">Signup</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border rounded p-2 w-64"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border rounded p-2 w-64"
      />
      <button
        onClick={handleSignup}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Signup
      </button>
      <button
        onClick={() => router.push("/login")} // Navigate to login page
        className="text-blue-500 underline"
      >
        Already have an account? Login
      </button>
      {message && <p className="text-sm text-red-500">{message}</p>}
    </div>
  );
}
