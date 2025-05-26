"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CircleCheckBig, ClipboardCopy } from "lucide-react";
import { getReservationById } from "@/actions/users";
import { Reservation, Room } from "@/utils/database/types";
import { useSearchParams, useRouter } from "next/navigation";

export default function Confirmation() {
  const [reservation, setReservation] = useState<
    (Reservation & { rooms: Room }) | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const reservationId = searchParams.get("id");

  // Debug logs
  console.log("Full URL:", window.location.href);
  console.log("Search params:", searchParams.toString());
  console.log("All search param entries:", Array.from(searchParams.entries()));
  console.log("Reservation ID from searchParams.get('id'):", reservationId);

  useEffect(() => {
    async function loadReservation() {
      // First try to get ID from URL params
      const urlId = searchParams.get("id");

      // Then try localStorage if no URL ID
      const localData = localStorage.getItem("reservationData");
      let localId = null;

      if (localData) {
        try {
          const parsedData = JSON.parse(localData);
          localId = parsedData.id;
          // If we have local data but no URL ID, update the URL
          if (!urlId && localId) {
            const params = new URLSearchParams(searchParams.toString());
            params.set("id", localId);
            router.replace(`${window.location.pathname}?${params.toString()}`);
          }
        } catch (e) {
          console.error("Error parsing localStorage data:", e);
        }
      }

      // Use either URL ID or local ID
      const finalId = urlId || localId;

      if (!finalId) {
        setError("No reservation ID found");
        setLoading(false);
        return;
      }

      try {
        const data = await getReservationById(finalId);
        if (data && "errorMessage" in data) {
          setError(data.errorMessage as string);
          setReservation(null);
        } else {
          setReservation(data as Reservation & { rooms: Room });
          // Update localStorage with fresh data
          localStorage.setItem("reservationData", JSON.stringify(data));
          setError(null);
        }
      } catch (error) {
        console.error("Error fetching reservation:", error);
        setError("Failed to load reservation details");
        setReservation(null);
      }
      setLoading(false);
    }

    loadReservation();
  }, [searchParams, router]); // Add searchParams and router as dependencies

  const handleCopyToClipboard = () => {
    // Use reservationId from URL params as primary source
    const idToCopy = reservationId || reservation?.id;
    if (idToCopy) {
      navigator.clipboard.writeText(idToCopy).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p>Loading reservation details...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-red-500 text-center mb-4">{error}</p>
        <Link href="/">
          <button className="border-2 border-[#274c77] text-[#274c77] font-semibold px-4 py-2 rounded-[50px]">
            Go Home
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center border-[#B9B9B9] border-[1px] rounded-lg p-2 my-10 pl-6 w-full max-w-5xl mx-auto mt-10">
      <div className="text-[#274c77] mb-[60px] mt-[70px]">
        <CircleCheckBig className="w-32 h-32 scale-[2]" />
      </div>

      <h1 className="text-[36px] font-bold text-[#274c77] w-full max-w-lg text-center leading-tight py-4">
        Your reservation request has been submitted!
      </h1>

      <div className="flex items-center gap-2 text-[10px] lg:text-[16px] md:text-[12px] mb-4">
        <p>
          Reservation ID:{" "}
          <span className="font-mono font-bold">
            {reservationId
              ? reservationId
              : reservation?.id
                ? reservation.id
                : "N/A"}
          </span>
        </p>
        <div className="relative">
          <ClipboardCopy
            className="w-4 h-4 cursor-pointer hover:text-[#274c77] transition-colors"
            onClick={handleCopyToClipboard}
          />
          {copied && (
            <span className="absolute -top-8 -left-14 bg-gray-800 text-white px-2 py-1 text-xs rounded whitespace-nowrap">
              Copied!
            </span>
          )}
        </div>
      </div>

      <p className="text-[36px] font-medium text-center px-10 leading-tight py-4">
        You will be notified{" "}
        <span className="text-[#780D29] font-semibold">through email</span> when
        an admin reviews your request.
      </p>

      <Link href="/">
        <div className="py-4 pb-6">
          <button
            type="button"
            className="border-2 border-[#274c77] text-[#274c77] font-semibold px-4 py-2 rounded-[50px] transition-transform transform hover:scale-[1.03]"
          >
            Reserve Another Room
          </button>
        </div>
      </Link>
    </div>
  );
}