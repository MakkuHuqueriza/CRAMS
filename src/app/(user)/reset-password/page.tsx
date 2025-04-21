"use client";

import React, { useState } from "react";
import { resetPasswordAction } from "@/actions/users";

export default function ResetPasswordPage() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission behavior
    setIsSubmitting(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);

    try { 
      const result = await resetPasswordAction(formData);
      if (result?.errorMessage) {
        setMessage(result.errorMessage || "An error occurred while resetting the password.");
      } else {
        setMessage("Password reset email sent successfully!");
      }
    } catch (error) {
      setMessage("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h1 className="text-2xl font-bold">Reset Password</h1>
      <p className="text-gray-600">Enter your email to reset your password.</p>
      <form onSubmit={handleResetPassword} className="flex flex-col items-center gap-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border rounded p-2 w-64"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded ${
            isSubmitting ? "bg-gray-400" : "bg-blue-500 text-white"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Reset Password"}
        </button>
      </form>
      {message && <p className="text-sm text-red-500">{message}</p>}
    </div>
  );
}