"use client";

import { useState } from "react";
import { adminLoginAction } from "@/actions/admin"; // Adjust the import path if necessary

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
    <div className="flex flex-col items-center gap-4 p-8">
      <h1 className="text-2xl font-bold">Admin Login</h1>
      <form
        onSubmit={handleAdminLogin}
        className="flex flex-col items-center gap-4"
      >
        <input
          type="email"
          name="email"
          placeholder="Admin Email"
          className="border rounded p-2 w-64"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border rounded p-2 w-64"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded ${
            isSubmitting ? "bg-gray-400" : "bg-blue-500 text-white"
          }`}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
      {message && <p className="text-sm text-red-500">{message}</p>}
    </div>
  );
}
