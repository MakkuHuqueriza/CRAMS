"use client";

import { useState, useEffect } from "react";
import { X, AlertTriangle, Copy, Check } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getUserReservations, cancelReservation } from "@/actions/users";

// Define types based on your database schema
interface Room {
  room_id: string;
  name: string;
  room_location: string;
  room_type: string;
}

interface Reservation {
  id: string;
  name: string;
  email_address: string;
  contact_number: string;
  role: string;
  course: string;
  date_requested: string;
  start_time: string;
  end_time: string;
  status: "Pending" | "Accepted" | "Rejected";
  nature_of_work: string;
  type: string;
  created_at: string;
  rooms: Room;
  others_purpose?: string; // Optional field for additional purpose
}

/* Mock data - replace with actual data from your backend
const mockReservations = [
  {
    id: "#111-69",
    status: "pending" as "pending" | "accepted" | "rejected",
    contactDetails: {
      name: "Makku Kuma",
      email: "makkukuma@g8.com",
      contactNumber: "+639462666969",
      role: "Student",
      courseDeptOrg: "BS Computer Science",
    },
    jobOrder: {
      room: "CSM 227",
      locationBuilding: "CSM, 2nd Floor",
      type: "Event",
      dateOfReservation: "04/13/2025",
      time: "12:00 AM - 2:00 PM",
      natureOfWork: "Reservation/Setup Room/Space",
    },
  },
  {
    id: "#111-70",
    status: "accepted" as "pending" | "accepted" | "rejected",
    contactDetails: {
      name: "Joditech Gabano",
      email: "joditech.com.ph.edu.org",
      contactNumber: "+639411234567",
      role: "Student",
      courseDeptOrg: "BS Computer Science",
    },
    jobOrder: {
      room: "CSM 228",
      locationBuilding: "CSM, 2nd Floor",
      type: "Event",
      dateOfReservation: "05/13/2025",
      time: "12:00 AM - 3:00 PM",
      natureOfWork: "Reservation/Setup Room/Space",
    },
  },
  // Add more reservations as needed
]; */

export default function PendingReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState<
    string | null
  >(null);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch reservations on component mount
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const result = await getUserReservations();

        // Check if result is an error
        if (result && typeof result === "object" && "errorMessage" in result) {
          setError(result.errorMessage);
        } else {
          setReservations(result || []);
        }
      } catch (err) {
        setError("Failed to fetch reservations");
        console.error("Error fetching reservations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const getStatusBadge = (status: "Pending" | "Accepted" | "Rejected") => {
    const statusConfig = {
      Pending: "bg-[#FFA500] text-white",
      Accepted: "bg-[#006225] text-white",
      Rejected: "bg-[#780D29] text-white",
    };

    return (
      <span
        className={`px-4 py-1 rounded-full text-sm font-medium ${statusConfig[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleCancelReservation = (reservationId: string) => {
    setSelectedReservationId(reservationId);
    setShowCancelDialog(true);
  };

  const confirmCancelReservation = async () => {
    if (selectedReservationId) {
      try {
        const result = await cancelReservation(selectedReservationId);

        if (result.error) {
          setError(result.errorMessage || "Failed to cancel reservation");
        } else {
          // Remove the cancelled reservation from local state
          setReservations((prev) =>
            prev.filter(
              (reservation) => reservation.id !== selectedReservationId,
            ),
          );
        }
      } catch (err) {
        setError("Failed to cancel reservation");
        console.error("Error cancelling reservation:", err);
      } finally {
        setShowCancelDialog(false);
        setSelectedReservationId(null);
      }
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(text);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  // Date Formatting
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  // Time Formatting
  const formatTime = (startTime: string, endTime: string) => {
    const formatTimeString = (time: string) => {
      const [hours, minutes] = time.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${displayHour}:${minutes} ${ampm}`;
    };

    return `${formatTimeString(startTime)} - ${formatTimeString(endTime)}`;
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5EEEA] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reservations...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#F5EEEA] flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg font-medium mb-2">
            Error Loading Reservations
          </p>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* White Header Section */}
      <div className="bg-white">
        <section className="flex justify-center py-6 pt-9 md:px-[58px]">
          <div className="w-full max-w-4xl space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-[28px] xl:text-[42px] md:text-[30px] font-bold text-primary whitespace-nowrap">
                Pending Reservations
              </h1>
              <p className="text-[14px] xl:text-[20px] md:text-[14px] text-muted-foreground whitespace-nowrap">
                Check to verify the status of your reservation
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Full Width Horizontal Line */}
      <hr className="border-t-2 border-gray-300" />

      {/* Beige Background Section */}
      <div className="bg-[#F5EEEA] min-h-screen">
        <section className="flex justify-center py-12 lg:px-4 md:px-[58px] px-8">
          <div className="w-full max-w-4xl space-y-8">
            {/* Disclaimer Message - Now in document flow */}
            {showDisclaimer && (
              <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> If you can&apos;t find your recent
                      reservation here, check your email for more status
                      updates.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDisclaimer(false)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Reservations List */}
            {reservations.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No reservations found</p>
                <p className="text-gray-400 text-sm mt-2">
                  Check your email for status updates
                </p>
              </div>
            ) : (
              reservations.map((reservation) => (
                <div key={reservation.id}>
                  {/* OUTER WHITE CONTAINER */}
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden p-6">
                    {/* MIDDLE BLUE CONTAINER */}
                    <div className="bg-[#E7EDF1] rounded-lg overflow-hidden">
                      {/* Blue Header with Reservation Summary, ID and Status */}
                      <div className="px-6 py-4 space-y-2">
                        {/* Reservation Summary Title */}
                        <h2 className="text-xl font-bold text-[#274c77]">
                          Reservation Summary
                        </h2>

                        {/* ID and Status Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <div className="border border-[#0A1128] bg-white rounded px-3 py-1 text-sm font-medium">
                              Reservation ID #{reservation.id}
                            </div>
                            <button
                              onClick={() => copyToClipboard(reservation.id)}
                              className="p-1 hover:bg-blue-200 rounded transition-colors"
                              title="Copy to clipboard"
                            >
                              {copiedId === reservation.id ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4 text-gray-600" />
                              )}
                            </button>
                          </div>
                          {getStatusBadge(reservation.status)}
                        </div>
                      </div>

                      {/* INNER WHITE CONTENT BOXES */}
                      <div className="px-6 pb-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                          {/* Contact Details - White Box */}
                          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">
                              Contact Details
                            </h3>
                            <div className="space-y-2 text-sm">
                              <p>
                                <span className="font-medium">Name:</span>{" "}
                                {reservation.name}
                              </p>
                              <p>
                                <span className="font-medium">Email:</span>{" "}
                                {reservation.email_address}
                              </p>
                              <p>
                                <span className="font-medium">
                                  Contact Number:
                                </span>{" "}
                                {reservation.contact_number}
                              </p>
                              <p>
                                <span className="font-medium">Role:</span>{" "}
                                {reservation.role}
                              </p>
                              <p>
                                <span className="font-medium">
                                  Course/Dept/Org:
                                </span>{" "}
                                {reservation.course}
                              </p>
                            </div>
                          </div>

                          {/* Request for Job Order - White Box */}
                          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">
                              Request for Job Order
                            </h3>
                            <div className="space-y-2 text-sm">
                              <p>
                                <span className="font-medium">Room:</span>{" "}
                                {reservation.rooms?.name}
                              </p>
                              <p>
                                <span className="font-medium">
                                  Location/Building:
                                </span>{" "}
                                {reservation.rooms?.room_location}
                              </p>
                              <p>
                                <span className="font-medium">Type:</span>{" "}
                                {reservation.type}
                              </p>
                              <p>
                                <span className="font-medium">
                                  Date of Reservation:
                                </span>{" "}
                                {formatDate(reservation.date_requested)}
                              </p>
                              <p>
                                <span className="font-medium">Time:</span>{" "}
                                {formatTime(
                                  reservation.start_time,
                                  reservation.end_time,
                                )}
                              </p>
                              <p>
                                <span className="font-medium">
                                  Nature of Work:
                                </span>{" "}
                                {reservation.nature_of_work}
                              </p>
                              {reservation.others_purpose && (  <p>
                                <span className="font-medium">
                                  Specific Purpose:
                                </span>{" "}
                                {reservation.others_purpose}
                              </p>)}
                            </div>
                          </div>
                        </div>

                        {/* Cancel Button in Pending Area Only */}
                        <div className="flex justify-end">
                          {reservation.status === "Pending" && (
                            <button
                              onClick={() =>
                                handleCancelReservation(reservation.id)
                              }
                              className="bg-[#780D29] text-white font-medium px-6 py-2 rounded-full hover:bg-[#5a0a1f] transition-colors"
                            >
                              Cancel Reservation
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Cancel Reservation
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this reservation? This action
              cannot be undone. Proceed with caution.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-slate-100 hover:text-gray-700">
              Back
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancelReservation}
              className="bg-red-500 hover:bg-red-700 hover:text-white"
            >
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
