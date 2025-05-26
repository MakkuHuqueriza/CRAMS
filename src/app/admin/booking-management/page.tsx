"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { ArrowDownWideNarrow, Search, X, Check, XIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../Sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Sample data for the bookings with full dates
const bookingsData = [
  {
    id: "0001",
    room: "227",
    submittedDate: "2024-01-15",
    submittedTime: "4:15 PM",
    status: "Pending",
  },
  {
    id: "0002",
    room: "224",
    submittedDate: "2024-01-14",
    submittedTime: "3:27 PM",
    status: "Accepted",
  },
  {
    id: "0003",
    room: "224",
    submittedDate: "2024-01-13",
    submittedTime: "1:17 PM",
    status: "Completed",
  },
  {
    id: "0004",
    room: "226",
    submittedDate: "2024-01-12",
    submittedTime: "8:04 AM",
    status: "Rejected",
    rejectionReason:
      "Room is under maintenance during the requested time period. Please select an alternative date or room.",
  },
  {
    id: "0005",
    room: "201",
    submittedDate: "2024-01-11",
    submittedTime: "5:49 PM",
    status: "Pending",
  },
  {
    id: "0006",
    room: "208",
    submittedDate: "2024-01-10",
    submittedTime: "4:12 PM",
    status: "Accepted",
  },
  {
    id: "0007",
    room: "229",
    submittedDate: "2024-01-09",
    submittedTime: "5:32 AM",
    status: "Pending",
  },
  {
    id: "0008",
    room: "206",
    submittedDate: "2024-01-08",
    submittedTime: "3:01 PM",
    status: "Pending",
  },
  {
    id: "0009",
    room: "210",
    submittedDate: "2024-01-07",
    submittedTime: "2:41 PM",
    status: "Rejected",
    rejectionReason:
      "Insufficient equipment available for the requested event type.",
  },
  {
    id: "0010",
    room: "222",
    submittedDate: "2024-01-06",
    submittedTime: "1:07 PM",
    status: "Rejected",
    rejectionReason:
      "Conflicting reservation already exists for this time slot.",
  },
];

// Sample data for the reservation details
const reservationDetails = {
  contact: {
    name: "Makku Kuma",
    email: "makkukuma@y8.com",
    contactNumber: "+639462666969",
    role: "Student",
    department: "BS Computer Science",
  },
  jobOrder: {
    room: "CSM 227",
    location: "CSM, 2nd Floor",
    type: "Event",
    date: "04/13/2025",
    time: "12:00 AM - 12:00 PM",
    natureOfWork: "Reservation/Setup",
    details: "Room/Space",
  },
};

// Simplified animation variants - only for essential popups
const sheetVariants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: {
      type: "tween",
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    x: "100%",
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

const popupVariants = {
  hidden: {
    scale: 0.95,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: "easeIn",
    },
  },
};

const confirmationPopupVariants = {
  hidden: {
    scale: 0.9,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  exit: {
    scale: 0.9,
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: "easeIn",
    },
  },
};

type BookingData = {
  id: string;
  room: string;
  submittedDate: string;
  submittedTime: string;
  status: string;
  rejectionReason?: string;
};

export default function BookingManagementPage() {
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [filteredBookings, setFilteredBookings] = useState(bookingsData);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState(false);
  const [selectedBookingData, setSelectedBookingData] =
    useState<BookingData | null>(null);
  const [showAcceptConfirmation, setShowAcceptConfirmation] = useState(false);
  const [showRejectConfirmation, setShowRejectConfirmation] = useState(false);

  const tableRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle click outside table to deselect row
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        tableRef.current &&
        !tableRef.current.contains(event.target as Node)
      ) {
        setSelectedBooking(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter and sort bookings when search term or sort option changes
  useEffect(() => {
    let result = [...bookingsData];

    // Filter by search term
    if (searchTerm) {
      result = result.filter((booking) =>
        booking.room.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Sort by selected option
    switch (sortOption) {
      case "latest":
        result = result.sort((a, b) => {
          const dateA = new Date(
            `${a.submittedDate} ${a.submittedTime}`,
          ).getTime();
          const dateB = new Date(
            `${b.submittedDate} ${b.submittedTime}`,
          ).getTime();
          return dateB - dateA;
        });
        break;
      case "oldest":
        result = result.sort((a, b) => {
          const dateA = new Date(
            `${a.submittedDate} ${a.submittedTime}`,
          ).getTime();
          const dateB = new Date(
            `${b.submittedDate} ${b.submittedTime}`,
          ).getTime();
          return dateA - dateB;
        });
        break;
      case "pending":
        result = result.filter((booking) => booking.status === "Pending");
        break;
      default:
        break;
    }

    setFilteredBookings(result);
  }, [searchTerm, sortOption]);

  // Function to handle row click
  const handleRowClick = (bookingId: string) => {
    const bookingData = bookingsData.find(
      (booking) => booking.id === bookingId,
    );
    setSelectedBookingData(bookingData ?? null);
    setSelectedBooking(bookingId === selectedBooking ? null : bookingId);
    setIsSheetOpen(true);
    setShowRejectForm(false);
  };

  // Function to handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Function to clear search
  const clearSearch = () => {
    setSearchTerm("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Function to handle sort change
  const handleSortChange = (value: string) => {
    if (sortOption === value) {
      setSortOption("");
    } else {
      setSortOption(value);
    }
  };

  // Function to handle accept button click
  const handleAccept = () => {
    setShowAcceptConfirmation(true);
    setIsSheetOpen(false);
  };

  // Function to handle reject button click
  const handleReject = () => {
    setShowRejectForm(true);
  };

  // Function to handle reject cancel
  const handleRejectCancel = () => {
    setRejectReason("");
    setRejectError(false);
    setShowRejectForm(false);
  };

  // Function to handle reject submit
  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) {
      setRejectError(true);
      return;
    }

    console.log("Reservation rejected with reason:", rejectReason);

    setShowRejectForm(false);
    setIsSheetOpen(false);
    setRejectReason("");
    setRejectError(false);
    setShowRejectConfirmation(true);
  };

  // Function to format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  // Function to get badge color based on status
  const getStatusBadge = (status: string) => {
    const badgeClass =
      "rounded-lg px-3 py-1 text-[13px] font-medium min-w-[80px] text-center";

    switch (status) {
      case "Pending":
        return (
          <Badge
            className={`${badgeClass} bg-[#FFC442] hover:bg-[#ffbe33] text-[#fdf7ec] cursor-pointer`}
          >
            Pending
          </Badge>
        );
      case "Accepted":
        return (
          <Badge
            className={`${badgeClass} bg-[#006225] text-[#c4f7d7] cursor-pointer`}
          >
            Accepted
          </Badge>
        );
      case "Completed":
        return (
          <Badge
            className={`${badgeClass} bg-[#034078] text-[#cde2fa] cursor-pointer`}
          >
            Completed
          </Badge>
        );
      case "Rejected":
        return (
          <Badge
            className={`${badgeClass} bg-[#780D29] text-[#ffd3df] cursor-pointer`}
          >
            Rejected
          </Badge>
        );
      default:
        return <Badge className={badgeClass}>{status}</Badge>;
    }
  };

  // Function to render sheet content based on status
  const renderSheetContent = () => {
    if (!selectedBookingData) return null;

    const isViewOnly =
      selectedBookingData.status === "Accepted" ||
      selectedBookingData.status === "Completed";
    const isRejected = selectedBookingData.status === "Rejected";
    const isPending = selectedBookingData.status === "Pending";

    return (
      <div className={showRejectForm ? "blur-[2px] pointer-events-none" : ""}>
        <SheetHeader>
          <SheetTitle className="text-2xl text-bold text-center text-blue-800">
            {isViewOnly ? "Reservation Details" : "Reservation Summary"}
          </SheetTitle>
          <SheetDescription className="text-center text-[12px]">
            {isViewOnly
              ? "View reservation details"
              : isPending
                ? "Review the reservation details before accepting or rejecting."
                : "Reservation details and rejection reason"}
          </SheetDescription>
        </SheetHeader>

        {/* Contact Details Section */}
        <div className="mt-4 p-4">
          <h3 className="text-lg font-semibold mb-2">Contact Details</h3>
          <div className="border-2 border-gray-300 p-4 rounded-lg space-y-2">
            <p>
              <span className="font-medium">Name:</span>{" "}
              {reservationDetails.contact.name}
            </p>
            <p>
              <span className="font-medium">Email:</span>{" "}
              {reservationDetails.contact.email}
            </p>
            <p>
              <span className="font-medium">Contact Number:</span>{" "}
              {reservationDetails.contact.contactNumber}
            </p>
            <p>
              <span className="font-medium">Role:</span>{" "}
              {reservationDetails.contact.role}
            </p>
            <p>
              <span className="font-medium">Affiliation:</span>{" "}
              {reservationDetails.contact.department}
            </p>
          </div>
        </div>

        {/* Request for Job Order Section */}
        <div className="mt-4 p-4">
          <h3 className="text-lg font-semibold mb-2">Request for Job Order</h3>
          <div className="border-2 border-gray-300 p-4 rounded-lg space-y-2">
            <p>
              <span className="font-medium">Room:</span>{" "}
              {reservationDetails.jobOrder.room}
            </p>
            <p>
              <span className="font-medium">Location/Building:</span>{" "}
              {reservationDetails.jobOrder.location}
            </p>
            <p>
              <span className="font-medium">Type:</span>{" "}
              {reservationDetails.jobOrder.type}
            </p>
            <p>
              <span className="font-medium">Date of Reservation:</span>{" "}
              {reservationDetails.jobOrder.date}
            </p>
            <p>
              <span className="font-medium">Time:</span>{" "}
              {reservationDetails.jobOrder.time}
            </p>
            <p>
              <span className="font-medium">Nature of Work:</span>{" "}
              {reservationDetails.jobOrder.natureOfWork}
            </p>
            <p className="pl-4">• {reservationDetails.jobOrder.details}</p>
          </div>
        </div>

        {/* Rejection Reason Section */}
        {isRejected && selectedBookingData.rejectionReason && (
          <div className="mt-4 p-4">
            <h3 className="text-lg font-semibold mb-2 text-red-700">
              Reason for Rejection
            </h3>
            <div className="border-2 border-red-300 bg-red-50 p-4 rounded-lg">
              <p className="text-red-800">
                {selectedBookingData.rejectionReason}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {isPending && (
          <div className="flex gap-4 mt-6 mb-4 justify-end">
            <Button
              variant="destructive"
              className="bg-red-800 text-white hover:bg-red-900"
              onClick={handleReject}
            >
              Reject
            </Button>
            <Button
              className="bg-blue-700 text-white hover:bg-blue-800"
              onClick={handleAccept}
            >
              Accept
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 bg-[#f2ede4] overflow-y-auto">
        <div className="container mx-auto px-8 py-6">
          <h1 className="text-3xl font-bold mb-6">Booking Management</h1>

          {/* Search and filter controls */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative w-full md:w-64">
              <div className="bg-white rounded-md shadow-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  ref={searchInputRef}
                  placeholder="Search Room Number"
                  className="pl-10 pr-10 w-full h-9 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Clear search</span>
                  </button>
                )}
              </div>
            </div>
            <div className="w-full md:w-[180px] bg-white rounded-lg shadow-sm">
              <Select value={sortOption} onValueChange={handleSortChange}>
                <SelectTrigger className={`w-full h-9 border-0`}>
                  <div className="flex items-center gap-2">
                    <ArrowDownWideNarrow className="h-4 w-4" />
                    <SelectValue placeholder="Sort by" />
                  </div>
                </SelectTrigger>
                <SelectContent className="w-full bg-white">
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Main content container */}
          <div
            className="bg-white rounded-lg shadow-md w-full max-w-screen-xl mx-auto overflow-hidden"
            ref={tableRef}
          >
            <div className="relative">
              <Table>
                <TableHeader className="rounded-t-lg overflow-hidden">
                  <TableRow className="hover:bg-white rounded-t-lg">
                    <TableHead className="text-center py-4 w-[25%] bg-white rounded-tl-lg">
                      Booking ID
                    </TableHead>
                    <TableHead className="text-center py-4 w-[25%] bg-white">
                      Room Number
                    </TableHead>
                    <TableHead className="text-center py-4 w-[25%] bg-white">
                      Submitted On
                    </TableHead>
                    <TableHead className="text-center py-4 w-[25%] bg-white rounded-tr-lg">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
              </Table>

              <div
                className="max-h-[330px] overflow-y-auto scrollbar-custom"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#274c77 #f0f0f0",
                }}
              >
                <Table>
                  <TableBody>
                    {filteredBookings.length > 0 ? (
                      filteredBookings.map((booking) => (
                        <TableRow
                          key={booking.id}
                          className={`hover:bg-blue-50 cursor-pointer transition-colors duration-200 ${
                            selectedBooking === booking.id ? "bg-blue-200" : ""
                          }`}
                          onClick={() => handleRowClick(booking.id)}
                        >
                          <TableCell className="font-medium text-center py-4 w-[25%]">
                            {booking.id}
                          </TableCell>
                          <TableCell className="text-center py-4 w-[25%]">
                            {booking.room}
                          </TableCell>
                          <TableCell className="text-center py-4 w-[26%]">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">
                                {formatDate(booking.submittedDate)}
                              </span>
                              <span className="text-xs text-gray-500">
                                {booking.submittedTime}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center py-4 w-[25%]">
                            <div className="flex justify-center">
                              {getStatusBadge(booking.status)}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center py-8 text-gray-500"
                        >
                          Room has no reservations.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reservation details sheet */}
      <AnimatePresence>
        {isSheetOpen && (
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetContent
              className="w-full sm:max-w-md p-4 overflow-y-auto"
              side="right"
            >
              <motion.div
                variants={sheetVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative"
              >
                {renderSheetContent()}

                {/* Reject Confirmation Popup */}
                <AnimatePresence>
                  {showRejectForm && (
                    <motion.div
                      variants={popupVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="bg-white border rounded-lg shadow-lg p-6 w-[90%] max-w-md">
                        <h3 className="text-lg font-semibold text-center mb-4">
                          Are you sure you want to reject this reservation?
                        </h3>

                        <Textarea
                          placeholder="Enter reason for rejection..."
                          value={rejectReason}
                          onChange={(e) => {
                            setRejectReason(e.target.value);
                            if (e.target.value.trim()) {
                              setRejectError(false);
                            }
                          }}
                          className={`min-h-[100px] ${rejectError ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                        />
                        {rejectError && (
                          <p className="text-sm text-red-500 mt-1">
                            Please provide a reason for rejection
                          </p>
                        )}

                        <div className="flex justify-between mt-6">
                          <Button
                            type="button"
                            className="bg-red-800 hover:bg-red-900 text-white"
                            onClick={handleRejectCancel}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            className="bg-blue-700 hover:bg-blue-800 text-white"
                            onClick={handleRejectSubmit}
                          >
                            Submit
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </SheetContent>
          </Sheet>
        )}
      </AnimatePresence>

      {/* Accept Confirmation Popup */}
      <AnimatePresence>
        {showAcceptConfirmation && (
          <motion.div
            variants={confirmationPopupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <div className="bg-green-50 border rounded-lg shadow-lg p-6 flex items-center gap-4 relative max-w-md mx-4">
              <button
                onClick={() => setShowAcceptConfirmation(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="bg-green-500 rounded-full p-2 flex-shrink-0">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-800">
                  Reservation Accepted
                </h3>
                <p className="text-sm text-green-600">
                  The reservation has been successfully accepted.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reject Confirmation Popup */}
      <AnimatePresence>
        {showRejectConfirmation && (
          <motion.div
            variants={confirmationPopupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <div className="bg-red-50 border rounded-lg shadow-lg p-6 flex items-center gap-4 relative max-w-md mx-4">
              <button
                onClick={() => setShowRejectConfirmation(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="bg-red-500 rounded-full p-2 flex-shrink-0">
                <XIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-800">
                  Reservation Rejected
                </h3>
                <p className="text-sm text-red-600">
                  The reservation has been rejected.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
