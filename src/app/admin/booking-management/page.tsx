"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { ArrowDownWideNarrow, Search, X, Check, XIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
import {
  getAdminReservationsAction,
  getReservationDetailAction,
  updateReservationStatusAction,
} from "@/actions/admin";
import type {
  Reservation,
  Room,
  ReservationStatus,
} from "@/utils/database/types";

// Types
type BookingData = {
  id: string;
  room: string;
  submittedDate: string;
  submittedTime: string;
  status: ReservationStatus;
  rejectionReason?: string;
};

interface AdminReservation {
  id: string;
  admin_id: string;
  reservation_id: string;
  status: ReservationStatus;
  reason_for_rejection: string | null;
  reservation: Reservation & {
    room: Room | null;
  };
}

// Animation variants
const popupVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

const confirmationPopupVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.15 } },
};

export default function BookingManagementPage() {
  // UI State
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [bookingsData, setBookingsData] = useState<BookingData[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingData[]>([]);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReservationDetail, setSelectedReservationDetail] =
    useState<AdminReservation | null>(null);
  const [showAcceptConfirmation, setShowAcceptConfirmation] = useState(false);
  const [showRejectConfirmation, setShowRejectConfirmation] = useState(false);

  // Scrollbar state
  const [isDragging, setIsDragging] = useState(false);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [scrollbarStartY, setScrollbarStartY] = useState(0);

  const tableRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollbarRef = useRef<HTMLDivElement>(null);

  // For badge styling
  const badgeClass = "px-3 py-1 rounded-full text-xs font-semibold";

  // Fetch reservations on component mount
  useEffect(() => {
    fetchReservations();
  }, []);

  // Check if scrollbar should be shown
  useEffect(() => {
    if (scrollContainerRef.current) {
      const { scrollHeight, clientHeight } = scrollContainerRef.current;
      setShowScrollbar(scrollHeight > clientHeight);
    }
  }, [filteredBookings]);

  // Handle scrollbar dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !scrollContainerRef.current || !scrollbarRef.current)
        return;

      e.preventDefault();

      const deltaY = e.clientY - dragStartY;
      const newScrollbarY = scrollbarStartY + deltaY;

      const scrollbarContainer = scrollbarRef.current.parentElement;
      if (!scrollbarContainer) return;

      const containerHeight = scrollbarContainer.offsetHeight - 16; // Account for padding
      const scrollbarHeight = scrollbarRef.current.offsetHeight;
      const maxScrollbarY = containerHeight - scrollbarHeight;

      const clampedY = Math.max(0, Math.min(newScrollbarY, maxScrollbarY));
      const scrollPercentage = clampedY / maxScrollbarY;

      const scrollContainer = scrollContainerRef.current;
      const maxScroll =
        scrollContainer.scrollHeight - scrollContainer.clientHeight;
      scrollContainer.scrollTop = scrollPercentage * maxScroll;

      // Update scrollbar position immediately
      scrollbarRef.current.style.transform = `translateY(${clampedY}px)`;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "none";
      document.body.style.cursor = "grabbing";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [isDragging, dragStartY, scrollbarStartY]);

  // Fetch reservations from backend
  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getAdminReservationsAction();

      if ("error" in result && result.error) {
        const errorMessage =
          typeof result.error === "object" &&
          result.error !== null &&
          "message" in result.error
            ? (result.error as { message?: string }).message ||
              "Failed to fetch reservation details"
            : "Failed to fetch reservation details";
        setError(errorMessage);
        return;
      }

      if (result.reservations) {
        // Transform the data to match the expected BookingData structure
        const transformedBookings: BookingData[] = result.reservations.map(
          (item: AdminReservation) => {
            const reservation = item.reservation;
            const createdAt = new Date(reservation.created_at);

            return {
              id: reservation.id,
              room:
                reservation.room?.name || reservation.room_id || "Unknown Room",
              submittedTime: createdAt.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }),
              submittedDate: createdAt.toLocaleDateString("en-CA"), // YYYY-MM-DD format
              status: reservation.status,
              rejectionReason: item.reason_for_rejection || undefined,
            };
          },
        );

        setBookingsData(transformedBookings);
        setFilteredBookings(transformedBookings);
      }
    } catch (err: unknown) {
      setError("An unexpected error occurred while fetching reservations");
      console.error("Error fetching reservations:", err);
    } finally {
      setLoading(false);
    }
  };

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

    // Always move completed reservations to the bottom
    result = result.sort((a, b) => {
      if (a.status === "Completed" && b.status !== "Completed") {
        return 1;
      }
      if (b.status === "Completed" && a.status !== "Completed") {
        return -1;
      }
      return 0;
    });

    setFilteredBookings(result);
  }, [searchTerm, sortOption, bookingsData]);

  // Function to handle row click
  const handleRowClick = async (
    bookingId: string,
    status: ReservationStatus,
  ) => {
    if (status === "Pending") {
      try {
        setSelectedBooking(bookingId === selectedBooking ? null : bookingId);

        // Fetch detailed reservation information
        const result = await getReservationDetailAction(bookingId);

        if ("error" in result && result.error) {
          const errorMessage =
            typeof result.error === "object" &&
            result.error !== null &&
            "message" in result.error
              ? (result.error as { message?: string }).message ||
                "Failed to fetch reservation details"
              : "Failed to fetch reservation details";
          setError(errorMessage);
          return;
        }

        if (result.reservation) {
          setSelectedReservationDetail(result.reservation as AdminReservation);
          setIsSheetOpen(true);
          setShowRejectForm(false); // Reset reject form when opening sheet
        }
      } catch (err: unknown) {
        setError(
          "An unexpected error occurred while fetching reservation details",
        );
        console.error("Error fetching reservation details:", err);
      }
    } else {
      setSelectedBooking(bookingId === selectedBooking ? null : bookingId);
    }
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
  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      setRejectError(true);
      return;
    }

    if (!selectedReservationDetail) {
      setError("No reservation selected");
      return;
    }

    try {
      const formData = new FormData();
      formData.append(
        "reservationId",
        selectedReservationDetail.reservation_id,
      );
      formData.append("status", "Rejected");
      formData.append("reasonForRejection", rejectReason);

      const result = await updateReservationStatusAction(formData);

      if (!result) {
        setError("Failed to fetch reservation details");
        return;
      }

      if (result.error) {
        setError(result.error.message || "Failed to reject reservation");
        return;
      }

      // Refresh the reservations list
      await fetchReservations();

      // Close the form and sheet
      setShowRejectForm(false);
      setIsSheetOpen(false);
      setRejectReason("");
      setRejectError(false);
      setSelectedReservationDetail(null);
      setShowRejectConfirmation(true);
    } catch (err: unknown) {
      setError("An unexpected error occurred while rejecting the reservation");
      console.error("Error rejecting reservation:", err);
    }
  };

  // Function to handle accept
  const handleAccept = async () => {
    if (!selectedReservationDetail) {
      setError("No reservation selected");
      return;
    }

    try {
      const formData = new FormData();
      formData.append(
        "reservationId",
        selectedReservationDetail.reservation_id,
      );
      formData.append("status", "Accepted");

      const result = await updateReservationStatusAction(formData);

      if (!result) {
        setError("Failed to fetch reservation details");
        return;
      }

      if (result.error) {
        setError(result.error.message || "Failed to accept reservation");
        return;
      }

      // Refresh the reservations list
      await fetchReservations();

      // Close the sheet
      setIsSheetOpen(false);
      setSelectedReservationDetail(null);
      setShowAcceptConfirmation(true);
    } catch (err: unknown) {
      setError("An unexpected error occurred while accepting the reservation");
      console.error("Error accepting reservation:", err);
    }
  };

  // Function to get badge color based on status
  const getStatusBadge = (status: ReservationStatus) => {
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

  // Helper for formatting date (if needed)
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-CA");
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 bg-[#f2ede4] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading reservations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 bg-[#f2ede4] overflow-y-auto">
        <div className="container mx-auto px-2 py-4">
          <h1 className="text-3xl font-bold mb-6">Booking Management</h1>

          {/* Error display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
              <button
                onClick={() => setError(null)}
                className="float-right font-bold text-red-700 hover:text-red-900"
              >
                ×
              </button>
            </div>
          )}

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
            <div className="w-full md:w-[200px] bg-white rounded-lg shadow-sm">
              <Select value={sortOption} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full h-9 border-0 px-3">
                  <div className="flex items-center gap-2 w-full">
                    <ArrowDownWideNarrow className="h-4 w-4 flex-shrink-0" />
                    <SelectValue
                      placeholder="Sort by"
                      className="flex-1 text-left"
                    />
                  </div>
                </SelectTrigger>
                <SelectContent className="w-[200px] bg-white">
                  <SelectItem
                    value="latest"
                    className="focus:bg-[#274c77] active:bg-[#274c77] pl-[30px] rounded-t-md"
                  >
                    <span>Latest</span>
                  </SelectItem>
                  <SelectItem
                    value="oldest"
                    className="focus:bg-[#274c77] active:bg-[#274c77] pl-[30px]"
                  >
                    <span>Oldest</span>
                  </SelectItem>
                  <SelectItem
                    value="pending"
                    className="focus:bg-[#274c77] active:bg-[#274c77] pl-[30px] rounded-b-md"
                  >
                    <span>Pending</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Main content container with overlay scrollbar */}
          <div
            className="bg-white rounded-lg shadow-md w-full max-w-screen-xl mx-auto overflow-hidden"
            ref={tableRef}
          >
            <div className="relative">
              {/* Fixed Header */}
              <div className="border-b border-gray-200">
                <Table>
                  <TableHeader className="rounded-t-lg overflow-hidden">
                    <TableRow className="hover:bg-white rounded-t-lg">
                      <TableHead className="text-center font-semibold text-[18px] py-6 w-[30%] bg-white rounded-tl-lg">
                        Booking ID
                      </TableHead>
                      <TableHead className="text-center font-semibold text-[18px] py-6 w-[22%] bg-white">
                        Room Number
                      </TableHead>
                      <TableHead className="text-center font-semibold text-[18px] py-6 w-[23%] bg-white">
                        Submitted On
                      </TableHead>
                      <TableHead className="text-center font-semibold text-[18px] py-6 w-[25%] bg-white rounded-tr-lg">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                </Table>
              </div>

              {/* Scrollable Body with Overlay Scrollbar */}
              <div className="relative">
                <div
                  ref={scrollContainerRef}
                  className="max-h-[350px] overflow-y-auto overflow-x-hidden"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                  onScroll={(e) => {
                    if (isDragging) return; // Don't update position while dragging

                    const scrollTop = e.currentTarget.scrollTop;
                    const scrollHeight = e.currentTarget.scrollHeight;
                    const clientHeight = e.currentTarget.clientHeight;
                    const scrollPercentage =
                      scrollTop / (scrollHeight - clientHeight);

                    // Update scrollbar position
                    if (scrollbarRef.current) {
                      const scrollbarContainer =
                        scrollbarRef.current.parentElement;
                      if (scrollbarContainer) {
                        const containerHeight =
                          scrollbarContainer.offsetHeight - 16; // Account for padding
                        const scrollbarHeight =
                          scrollbarRef.current.offsetHeight;
                        const maxScroll = containerHeight - scrollbarHeight;
                        scrollbarRef.current.style.transform = `translateY(${scrollPercentage * maxScroll}px)`;
                      }
                    }
                  }}
                >
                  <style jsx>{`
                    div::-webkit-scrollbar {
                      width: 0px;
                      background: transparent;
                    }
                  `}</style>
                  <Table>
                    <TableBody>
                      {filteredBookings.length > 0 ? (
                        filteredBookings.map((booking) => (
                          <TableRow
                            key={booking.id}
                            className={`hover:bg-blue-50 cursor-pointer transition-colors duration-200 ${
                              selectedBooking === booking.id
                                ? "bg-blue-200"
                                : ""
                            }`}
                            onClick={() =>
                              handleRowClick(booking.id, booking.status)
                            }
                          >
                            <TableCell className="font-medium text-center text-[12px] py-4 w-[30%]">
                              {booking.id}
                            </TableCell>
                            <TableCell className="text-center py-4 w-[22%]">
                              {booking.room}
                            </TableCell>
                            <TableCell className="text-center py-4 w-[23%]">
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
                            {searchTerm
                              ? "No reservations found matching your search."
                              : "No reservations found."}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Custom Overlay Scrollbar */}
                {showScrollbar && (
                  <div className="scrollbar-container absolute top-0 right-[5px] w-[7px] h-full flex items-start pt-2">
                    <div
                      ref={scrollbarRef}
                      className={`custom-scrollbar w-full bg-[#274c77] rounded-full cursor-default ${
                        isDragging ? "cursor-grabbing" : ""
                      } ${isDragging ? "" : "transition-transform duration-75 ease-out"}`}
                      style={{
                        height: `${Math.min(80, (350 / Math.max(filteredBookings.length * 80, 350)) * 100)}%`,
                        minHeight: "20px",
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                        setDragStartY(e.clientY);

                        // Get current scrollbar position
                        const rect = e.currentTarget.getBoundingClientRect();
                        const containerRect =
                          e.currentTarget.parentElement!.getBoundingClientRect();
                        setScrollbarStartY(rect.top - containerRect.top - 8); // Account for padding
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reservation details sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          className="w-full sm:max-w-md p-4 overflow-y-auto transition-transform duration-300 ease-in-out"
          side="right"
        >
          <div className="relative">
            {/* Reservation Details */}
            <div
              className={`transition-all duration-300 ease-in-out ${
                showRejectForm ? "blur-[2px] pointer-events-none" : ""
              }`}
            >
              <SheetHeader>
                <SheetTitle className="text-2xl text-bold text-center text-blue-800">
                  Reservation Summary
                </SheetTitle>
                <SheetDescription className="text-center text-[12px]">
                  Review the reservation details before accepting or rejecting.
                </SheetDescription>
              </SheetHeader>

              {selectedReservationDetail ? (
                <>
                  {/* Contact Details Section */}
                  <div className="mt-6 p-4">
                    <h3 className="text-lg font-semibold mb-2">
                      Contact Details
                    </h3>
                    <div className="border-2 border-gray-300 p-4 rounded-lg space-y-2">
                      <p>
                        <span className="font-medium">Name:</span>{" "}
                        {selectedReservationDetail.reservation.name || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        {selectedReservationDetail.reservation.email_address ||
                          "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Contact Number:</span>{" "}
                        {selectedReservationDetail.reservation.contact_number ||
                          "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Role:</span>{" "}
                        {selectedReservationDetail.reservation.role || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Course/Dept/Org:</span>{" "}
                        {selectedReservationDetail.reservation.course || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Request for Job Order Section */}
                  <div className="mt-6 p-4">
                    <h3 className="text-lg font-semibold mb-2">
                      Request for Job Order
                    </h3>
                    <div className="border-2 border-gray-300 p-4 rounded-lg space-y-2">
                      <p>
                        <span className="font-medium">Room:</span>{" "}
                        {selectedReservationDetail.reservation.room?.name ||
                          selectedReservationDetail.reservation.room_id ||
                          "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Location/Building:</span>{" "}
                        {selectedReservationDetail.reservation.room
                          ?.room_location || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Room Type:</span>{" "}
                        {selectedReservationDetail.reservation.room
                          ?.room_type || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">
                          Date of Reservation:
                        </span>{" "}
                        {selectedReservationDetail.reservation.date_requested ||
                          "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Start Time:</span>{" "}
                        {selectedReservationDetail.reservation.start_time ||
                          "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">End Time:</span>{" "}
                        {selectedReservationDetail.reservation.end_time ||
                          "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Nature of Work:</span>{" "}
                        {selectedReservationDetail.reservation.nature_of_work ||
                          "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Status:</span>{" "}
                        {selectedReservationDetail.reservation.status}
                      </p>
                      <p>
                        <span className="font-medium">Submitted On:</span>{" "}
                        {new Date(
                          selectedReservationDetail.reservation.created_at,
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="mt-6 p-4 text-center text-gray-500">
                  <p>Loading reservation details...</p>
                </div>
              )}

              {/* Action Buttons */}
              {selectedReservationDetail && (
                <div className="flex gap-4 mt-8 mb-4 justify-end">
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
          </div>
        </SheetContent>
      </Sheet>

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
