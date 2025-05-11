"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { ArrowDownWideNarrow, Search, X } from "lucide-react";
import Sidebar from "@/app/admin/Sidebar";
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

// Sample data for the bookings
const bookingsData = [
  {
    id: "0001",
    room: "227",
    time: "4:15 PM",
    date: "2023-05-12",
    status: "Pending",
  },
  {
    id: "0002",
    room: "224",
    time: "3:27 AM",
    date: "2023-05-11",
    status: "Accepted",
  },
  {
    id: "0003",
    room: "224",
    time: "1:17 PM",
    date: "2023-05-10",
    status: "Completed",
  },
  {
    id: "0004",
    room: "226",
    time: "8:04 AM",
    date: "2023-05-09",
    status: "Rejected",
  },
  {
    id: "0005",
    room: "201",
    time: "5:49 PM",
    date: "2023-05-09",
    status: "Pending",
  },
  {
    id: "0006",
    room: "208",
    time: "4:12 PM",
    date: "2023-05-09",
    status: "Accepted",
  },
  {
    id: "0007",
    room: "229",
    time: "5:32 AM",
    date: "2023-05-09",
    status: "Pending",
  },
  {
    id: "0008",
    room: "206",
    time: "3:01 PM",
    date: "2023-05-09",
    status: "Pending",
  },
  {
    id: "0009",
    room: "210",
    time: "2:41 PM",
    date: "2023-05-09",
    status: "Rejected",
  },
  {
    id: "0010",
    room: "222",
    time: "1:07 AM",
    date: "2023-05-09",
    status: "Rejected",
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
    type: "Kita",
    date: "04/13/2025",
    time: "12:00 AM - 12:00 PM",
    natureOfWork: "Reservation/Setup",
    details: "Room/Space",
  },
};

export default function BookingManagementPage() {
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  // const [bookings, setBookings] = useState(bookingsData)
  const [filteredBookings, setFilteredBookings] = useState(bookingsData);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState(false);

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
          // Sort by date and time (newest first)
          const dateA = new Date(`${a.date} ${a.time}`).getTime();
          const dateB = new Date(`${b.date} ${b.time}`).getTime();
          return dateB - dateA;
        });
        break;
      case "oldest":
        result = result.sort((a, b) => {
          // Sort by date and time (oldest first)
          const dateA = new Date(`${a.date} ${a.time}`).getTime();
          const dateB = new Date(`${b.date} ${b.time}`).getTime();
          return dateA - dateB;
        });
        break;
      case "pending":
        result = result.filter((booking) => booking.status === "Pending");
        break;
      default:
        // No sorting if no option is selected
        break;
    }

    setFilteredBookings(result);
  }, [searchTerm, sortOption]);

  // Function to handle row click
  const handleRowClick = (bookingId: string, status: string) => {
    if (status === "Pending") {
      setSelectedBooking(bookingId === selectedBooking ? null : bookingId);
      setIsSheetOpen(true);
      setShowRejectForm(false); // Reset reject form when opening sheet
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
    setSortOption(value);
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

    // Here you would typically send the rejection to your API
    console.log("Reservation rejected with reason:", rejectReason);

    // Close the form and sheet
    setShowRejectForm(false);
    setIsSheetOpen(false);
    setRejectReason("");
    setRejectError(false);
  };

  // Function to get badge color based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 rounded-lg px-2 text-[13px]">
            Pending
          </Badge>
        );
      case "Accepted":
        return (
          <Badge className="bg-green-600 hover:bg-green-700 rounded-lg px-2 text-[13px]">
            Accepted
          </Badge>
        );
      case "Completed":
        return (
          <Badge className="bg-blue-600 hover:bg-blue-700 rounded-lg px-2 text-[13px]">
            Completed
          </Badge>
        );
      case "Rejected":
        return (
          <Badge className="bg-red-600 hover:bg-red-700 rounded-lg px-2 text-[13px]">
            Rejected
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 bg-[#f2ede4] overflow-y-auto">
        <div className="container mx-auto px-8 py-6">
          <h1 className="text-3xl font-bold mb-6">Booking Management</h1>

          {/* Main content container with white background */}
          <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-screen-xl mx-auto">
            {/* Search and filter controls */}
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  ref={searchInputRef}
                  placeholder="Search Room Number"
                  className="pl-10 pr-10 w-full h-9"
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
              <Select value={sortOption} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full md:w-[180px] h-9">
                  <div className="flex items-center gap-2">
                    <ArrowDownWideNarrow className="h-4 w-4" />
                    <SelectValue placeholder="Sort by" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table of bookings - with fixed height to show 5 rows */}
            <div className="overflow-x-auto" ref={tableRef}>
              <div className="max-h-[380px] overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-white z-10">
                    <TableRow>
                      <TableHead className="text-center">Booking ID</TableHead>
                      <TableHead className="text-center">Room Number</TableHead>
                      <TableHead className="text-center">
                        Submitted On
                      </TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.length > 0 ? (
                      filteredBookings.map((booking) => (
                        <TableRow
                          key={booking.id}
                          className={`hover:bg-blue-50 rounded-md ${
                            selectedBooking === booking.id
                              ? "bg-blue-200 rounded-md"
                              : ""
                          }`}
                          onClick={() =>
                            handleRowClick(booking.id, booking.status)
                          }
                        >
                          <TableCell className="font-medium text-center text-lg py-4">
                            {booking.id}
                          </TableCell>
                          <TableCell className="text-center text-lg py-4">
                            {booking.room}
                          </TableCell>
                          <TableCell className="text-center text-lg py-4">
                            {booking.time}
                          </TableCell>
                          <TableCell className="text-center text-lg py-4">
                            {getStatusBadge(booking.status)}
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
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-md p-4 overflow-y-auto">
          <div className="relative">
            {/* Reservation Details */}
            <div
              className={showRejectForm ? "blur-[2px] pointer-events-none" : ""}
            >
              <SheetHeader>
                <SheetTitle className="text-2xl text-bold text-center text-blue-800">
                  Reservation Summary
                </SheetTitle>
                <SheetDescription className="text-center text-[12px]">
                  Review the reservation details before accepting or rejecting.
                </SheetDescription>
              </SheetHeader>

              {/* Contact Details Section */}
              <div className="mt-6 p-4">
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
                    <span className="font-medium">Course/Dept/Org:</span>{" "}
                    {reservationDetails.contact.department}
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
                  <p className="pl-4">
                    • {reservationDetails.jobOrder.details}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8 mb-4 justify-end">
                <Button
                  variant="destructive"
                  className="bg-red-800 text-white hover:bg-red-900"
                  onClick={handleReject}
                >
                  Reject
                </Button>
                <Button className="bg-blue-700 text-white hover:bg-blue-800">
                  Accept
                </Button>
              </div>
            </div>

            {/* Reject Confirmation Popup */}
            {showRejectForm && (
              <div className="absolute inset-0 flex items-center justify-center">
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
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
