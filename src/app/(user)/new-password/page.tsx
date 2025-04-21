"use client";

import React, { useState } from "react";
import { updatePasswordAction } from "@/actions/users";

function NewPasswordPage() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdatePassword = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault(); // Prevent the default form submission behavior
    setIsSubmitting(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);

    try {
      const result = await updatePasswordAction(formData);
      if (result?.errorMessage) {
        setMessage(
          result.errorMessage ||
            "An error occurred while updating the password.",
        );
      } else {
        setMessage("Password updated successfully!");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setMessage("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h1 className="text-2xl font-bold">Update Password</h1>
      <p className="text-gray-600">Enter your new password below.</p>
      <form
        onSubmit={handleUpdatePassword}
        className="flex flex-col items-center gap-4"
      >
        <input
          type="password"
          name="new_password"
          placeholder="New Password"
          className="border rounded p-2 w-64"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded ${
            isSubmitting ? "bg-gray-400" : "bg-blue-500 text-white"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Update Password"}
        </button>
      </form>
      {message && <p className="text-sm text-red-500">{message}</p>}
    </div>
  );
}

export default NewPasswordPage;