"use client";

import React, { useState } from "react";
import { loginAction, signUpAction } from "@/actions/user";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true); // Toggle between login and signup
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (isLoginMode) {
      // Login logic
      const result = await loginAction(email, password);
      if (result?.errorMessage) {
        setMessage(result.errorMessage);
      } else {
        setMessage("Logged in successfully!");
      }
    } else {
      // Signup logic
      const result = await signUpAction(email, password);
      if (result?.errorMessage) {
        setMessage(result.errorMessage);
      } else {
        setMessage("Signed up successfully!");
        setIsLoginMode(true); // Switch to login mode after successful signup
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h1 className="text-2xl font-bold">{isLoginMode ? "Login" : "Signup"}</h1>
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
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {isLoginMode ? "Login" : "Signup"}
      </button>
      <button
        onClick={() => setIsLoginMode(!isLoginMode)}
        className="text-blue-500 underline"
      >
        {isLoginMode
          ? "Don't have an account? Signup"
          : "Already have an account? Login"}
      </button>
      {message && <p className="text-sm text-red-500">{message}</p>}
    </div>
  );
}
