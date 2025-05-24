"use client";

import { useState } from "react";
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

// FOR TRIAL DATA ONLY - CHANGE THIS INFO FROM BACKEND
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
      time: "12:00 AM - 12:00 PM",
      natureOfWork: "Reservation/Setup Room/Space",
    },
  },
  // Add more reservations as needed
];

export default function PendingReservationsPage() {
  const [reservations, setReservations] = useState(mockReservations);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState<
    string | null
  >(null);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getStatusBadge = (status: "pending" | "accepted" | "rejected") => {
    const statusConfig = {
      pending: "bg-[#FFA500] text-white",
      accepted: "bg-[#28A745] text-white",
      rejected: "bg-[#DC3545] text-white",
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

  const confirmCancelReservation = () => {
    if (selectedReservationId) {
      setReservations((prev) =>
        prev.filter((reservation) => reservation.id !== selectedReservationId),
      );
      setShowCancelDialog(false);
      setSelectedReservationId(null);
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

  return (
    <div className="min-h-screen bg-[#F5EEEA]">
      {/* Disclaimer Popup */}
      {showDisclaimer && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-blue-100 border border-blue-300 rounded-lg p-4 max-w-md mx-4 shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> When you can&apos;t find your recent
                reservation here, check your email for more status updates.
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

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#274c77] mb-4">
            Pending Reservations
          </h1>
          <p className="text-gray-600 mb-6">
            Check to verify the status of your reservation
          </p>

          {/* Horizontal Line */}
          <hr className="border-t-2 border-gray-300 mb-8" />
        </div>

        {/* Reservations List */}
        <div className="space-y-8">
          {reservations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No reservations found</p>
              <p className="text-gray-400 text-sm mt-2">
                Check your email for status updates
              </p>
            </div>
          ) : (
            reservations.map((reservation) => (
              <div key={reservation.id} className="space-y-4">
                {/* Reservation Summary Title */}
                <h2 className="text-xl font-semibold text-[#274c77]">
                  Reservation Summary
                </h2>

                {/* Blue Container */}
                <div className="bg-[#E8F4FD] rounded-lg border border-gray-200 overflow-hidden">
                  {/* Blue Header with ID and Status */}
                  <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="border border-gray-300 bg-white rounded px-3 py-1 text-sm font-medium">
                        Reservation ID {reservation.id}
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

                  {/* White Content Area */}
                  <div className="mx-6 mb-4 bg-white rounded-lg p-6 shadow-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Contact Details */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Contact Details
                        </h3>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="font-medium">Name:</span>{" "}
                            {reservation.contactDetails.name}
                          </p>
                          <p>
                            <span className="font-medium">Email:</span>{" "}
                            {reservation.contactDetails.email}
                          </p>
                          <p>
                            <span className="font-medium">Contact Number:</span>{" "}
                            {reservation.contactDetails.contactNumber}
                          </p>
                          <p>
                            <span className="font-medium">Role:</span>{" "}
                            {reservation.contactDetails.role}
                          </p>
                          <p>
                            <span className="font-medium">
                              Course/Dept/Org:
                            </span>{" "}
                            {reservation.contactDetails.courseDeptOrg}
                          </p>
                        </div>

                        {/* Horizontal line in Contact Details */}
                        <hr className="border-t-2 border-gray-400 my-4" />
                      </div>

                      {/* Request for Job Order */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Request for Job Order
                        </h3>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="font-medium">Room:</span>{" "}
                            {reservation.jobOrder.room}
                          </p>
                          <p>
                            <span className="font-medium">
                              Location/Building:
                            </span>{" "}
                            {reservation.jobOrder.locationBuilding}
                          </p>
                          <p>
                            <span className="font-medium">Type:</span>{" "}
                            {reservation.jobOrder.type}
                          </p>
                          <p>
                            <span className="font-medium">
                              Date of Reservation:
                            </span>{" "}
                            {reservation.jobOrder.dateOfReservation}
                          </p>
                          <p>
                            <span className="font-medium">Time:</span>{" "}
                            {reservation.jobOrder.time}
                          </p>
                          <p>
                            <span className="font-medium">Nature of Work:</span>{" "}
                            {reservation.jobOrder.natureOfWork}
                          </p>
                        </div>

                        {/* Horizontal line in Request for Job Order */}
                        <hr className="border-t-2 border-gray-400 my-4" />
                      </div>
                    </div>
                  </div>

                  {/* Cancel Button in Blue Area */}
                  <div className="px-6 pb-4 flex justify-end">
                    <button
                      onClick={() => handleCancelReservation(reservation.id)}
                      className="bg-[#780D29] text-white font-medium px-6 py-2 rounded-full hover:bg-[#5a0a1f] transition-colors"
                    >
                      Cancel Reservation
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
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
              Are you sure you want to cancel this reservation? You cannot make
              bawi na baya.
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
