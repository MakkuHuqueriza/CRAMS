"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { updatePasswordAction } from "@/actions/users";
import Image from "next/image";

function NewPasswordPage() {
  const router = useRouter(); // Initialize router
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
      <div className="flex justify-start items-left text-left mb-2">
        <Image
          src="/CRAMS_logo.svg"
          alt="CRAMS Logo"
          className="max-w-[50%] md:max-w-[55%] xl:max-w-[20%] h-auto"
        />
      </div>
      <h1 className="text-[64px] font-bold">Update Password</h1>
      <p className="text-gray-600 text-[15px] mt-4">
        Enter your new password below.
      </p>
      <form
        onSubmit={handleUpdatePassword}
        className="flex flex-col items-center gap-4"
      >
        <input
          type="password"
          name="new_password"
          placeholder="Enter your new password"
          className="bg-[#f5f9fc] border-[1px] border-[#B9B9B9] rounded-md p-1 md:p-3 w-full sm:w-[70%] md:w-[21rem] text-sm"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded ${
            isSubmitting
              ? "bg-[#618ccc] text-black font-medium text-[12px] sm:text-[13px] lg:text-[16px] px-6 sm:px-8 py-[6px] md:w-[21rem] rounded-md mb-2 transition hover:scale-[103%]"
              : "bg-[#9BB2FC] text-black font-medium text-[12px] sm:text-[13px] lg:text-[16px] px-6 sm:px-8 py-[6px] md:w-[21rem] rounded-md mb-2 transition hover:scale-[103%]"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Update Password"}
        </button>
      </form>
      {message && <p className="text-sm text-red-500">{message}</p>}

      <button
        onClick={() => router.push("/login")}
        className="text-black border-2 border-[#8d8d8d] font-medium text-[12px] sm:text-[13px] lg:text-[14px] px-4 sm:px-5 py-[6px] rounded-[50px] mb-2 mt-8 transition hover:scale-[103%]"
      >
        Back to Login
      </button>
    </div>
  );
}

export default NewPasswordPage;
