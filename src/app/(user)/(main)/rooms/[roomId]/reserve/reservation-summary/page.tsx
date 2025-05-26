"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getReservationSummary, submitReservation } from "@/actions/users";
import { ReservationFormValues } from "@/utils/database/types";
import { roomData } from "@/app/roomData";

export default function ReservationSummary() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId;
  const decodedRoomId =
    typeof roomId === "string" ? decodeURIComponent(roomId) : "";
  const room = roomData.find((room) => room.id === decodedRoomId);

  const [reservationData, setReservationData] =
    useState<ReservationFormValues | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservationData = async () => {
      try {
        // First try to get from server
        const data = await getReservationSummary();
        if (data && typeof data === "object" && "error" in data) {
          // If server fails, try localStorage
          const localData = localStorage.getItem("reservationData");
          if (localData) {
            const parsedData = JSON.parse(localData);
            // Convert the data to match ReservationFormValues format
            const convertedData = {
              name: parsedData.contactName,
              email: parsedData.email,
              contact_number: "+63" + parsedData.contactNumber,
              role: parsedData.role,
              course: parsedData.course,
              room_id: room?.id ?? "",
              room_location: room?.floor ?? "",
              type: parsedData.type,
              date: parsedData.dateOfReservation,
              start_time: `${parsedData.startTime} ${parsedData.startPeriod}`,
              end_time: `${parsedData.endTime} ${parsedData.endPeriod}`,
              nature_of_work: parsedData.natureOfWork,
              reservationOptions: parsedData.reservationOptions ?? [],
              others_purpose: parsedData.otherPurpose ?? "",
            };
            setReservationData(convertedData);
          } else {
            setError("No reservation data found");
          }
        } else {
          setReservationData(data as ReservationFormValues);
        }
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        // Try localStorage as fallback
        const localData = localStorage.getItem("reservationData");
        if (localData) {
          const parsedData = JSON.parse(localData);
          const convertedData = {
            name: parsedData.contactName,
            email: parsedData.email,
            contact_number: "+63" + parsedData.contactNumber,
            role: parsedData.role,
            course: parsedData.course,
            room_id: room?.id ?? "",
            room_location: room?.floor ?? "",
            type: parsedData.type,
            date: parsedData.dateOfReservation,
            start_time: `${parsedData.startTime} ${parsedData.startPeriod}`,
            end_time: `${parsedData.endTime} ${parsedData.endPeriod}`,
            nature_of_work: parsedData.natureOfWork,
            reservationOptions: parsedData.reservationOptions ?? [],
            others_purpose: parsedData.otherPurpose ?? "",
          };
          setReservationData(convertedData);
        } else {
          setError("Failed to load reservation data");
        }
        setIsLoading(false);
      }
    };

    fetchReservationData();
  }, [room?.id, room?.floor]);

  const handleConfirm = async () => {
    try {
      if (!reservationData) {
        setError("No reservation data available");
        return;
      }

      // Create FormData with all the reservation details
      const formData = new FormData();
      formData.append("name", reservationData.name);
      formData.append("email", reservationData.email);
      formData.append("contact_number", reservationData.contact_number);
      formData.append("role", reservationData.role);
      formData.append("course", reservationData.course);
      formData.append("room_id", reservationData.room_id);
      formData.append("room_location", reservationData.room_location);
      formData.append("date", reservationData.date.toString());
      formData.append("start_time", reservationData.start_time);
      formData.append("end_time", reservationData.end_time);
      formData.append("type", reservationData.type);
      formData.append("nature_of_work", reservationData.nature_of_work);

      if (reservationData.others_purpose) {
        formData.append("others_purpose", reservationData.others_purpose);
      }

      const result = await submitReservation();

      if (result.success && result.data?.id) {
        // Store the reservation data in localStorage
        localStorage.setItem(
          "reservationData",
          JSON.stringify({
            ...reservationData,
            id: result.data.id,
          }),
        );

        // Navigate to confirmation page with the ID in the URL
        router.push(
          `/rooms/${encodeURIComponent(decodedRoomId)}/reserve/reservation-confirmation?id=${result.data.id}`,
        );
      } else {
        console.error("Submission error:", result.error);
        setError(result.error || "Failed to submit reservation");
      }
    } catch (error: unknown) {
      console.error("Error submitting reservation:", error);
      setError("Failed to submit reservation. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-xl font-medium">Loading reservation details...</h1>
      </div>
    );
  }

  // Show error message if no data found
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">{error}</h1>
          <Link
            href={`/rooms/${encodeURIComponent(decodedRoomId)}/reserve/reservation-form/`}
          >
            <button className="bg-[#274C77] text-white font-medium px-4 py-[10px] rounded-[50px]">
              Go Back to Form
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Fallback to static data if backend data isn't available
  if (!reservationData && !room) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-bold text-red-500">Room not found</h1>
      </div>
    );
  }

  // Use backend data
  const displayData = reservationData;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Breadcrumb */}
      <p className="text-sm text-muted-foreground mb-6">
        <Link
          href="/"
          className="text-[#274c77] hover:underline cursor-pointer"
        >
          Available Rooms
        </Link>{" "}
        &gt;{" "}
        <Link
          href={`/rooms/${encodeURIComponent(room?.id ?? decodedRoomId)}`}
          className="text-[#274c77] hover:underline cursor-pointer"
        >
          {room?.id ?? decodedRoomId}
        </Link>{" "}
        &gt;{" "}
        <Link
          href={`/rooms/${encodeURIComponent(room?.id ?? decodedRoomId)}/reserve/reservation-form`}
          className="text-[#274c77] hover:underline cursor-pointer"
        >
          Reservation Form
        </Link>{" "}
        &gt; Reservation Summary
      </p>

      <div className="flex flex-col items-center gap-6 pb-20">
        <div className="border-[#B9B9B9] border-[1px] rounded-lg py-2 px-6 w-full">
          <h1 className="text-[23px] md:text-[32px] font-bold text-[#274c77]">
            Reservation Summary
          </h1>
        </div>

        {/* Summary Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-6">
          {/* Contact Details */}
          <div className="w-full px-5 py-4 space-y-4 border-[#B9B9B9] border-[1px] rounded-lg pb-8 shadow-md">
            <h2 className="text-[18px] md:text-[20px] font-semibold">
              Contact Details
            </h2>
            <div className="space-y-3 text-sm md:text-base">
              <p>Name: {displayData?.name || ""}</p>
              <p>Email: {displayData?.email || ""}</p>
              <p>Contact Number: +63{displayData?.contact_number || ""}</p>
              <p>Role: {displayData?.role || ""}</p>
              <p>Course/Department: {displayData?.course || ""}</p>
            </div>
          </div>

          {/* Request for Job Order */}
          <div className="w-full px-5 py-4 space-y-4 border-[#B9B9B9] border-[1px] rounded-lg pb-8 shadow-md">
            <h2 className="text-[18px] md:text-[20px] font-semibold">
              Request for Job Order
            </h2>
            <p>Room: {displayData?.room_id || ""}</p>
            <p>Location: {displayData?.room_location || ""}</p>
            <p>
              Date:{" "}
              {typeof displayData?.date === "object"
                ? (displayData.date as Date).toLocaleDateString()
                : displayData?.date || ""}
            </p>
            <p>
              Time: {displayData?.start_time || ""} -{" "}
              {displayData?.end_time || ""}
            </p>
            {displayData?.nature_of_work && (
              <p>Nature of Work: {displayData.nature_of_work}</p>
            )}
            {displayData?.others_purpose && (
              <p>Other Purpose: {displayData.others_purpose}</p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row justify-between w-full gap-4 mt-6">
          <button
            type="button"
            onClick={() =>
              router.push(
                `/rooms/${encodeURIComponent(room?.id ?? decodedRoomId)}/reserve/reservation-form`,
              )
            }
            className="w-full md:w-auto bg-[#780D29] text-white font-medium px-6 py-[10px] rounded-[50px] transition-transform transform hover:scale-[1.03] order-2 md:order-1"
          >
            Edit Details
          </button>
          <button
            type="button"
            onClick={() => {
              handleConfirm();
              router.push(
                `/rooms/${encodeURIComponent(room?.id ?? decodedRoomId)}/reserve/reservation-confirmation`,
              );
            }}
            className="w-full md:w-auto bg-[#274C77] text-white font-medium px-6 py-[10px] rounded-[50px] transition-transform transform hover:scale-[1.03] order-1 md:order-2"
          >
            Confirm Details
          </button>
        </div>
      </div>
    </div>
  );
}