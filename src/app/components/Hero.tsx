"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  MapPin,
  LogIn,
  LogOut,
  Users,
  Search,
  CalendarIcon,
  X,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { availableTime, roomCapacity, roomFloors } from "@/app/searchElements";
import { SearchLoadingState } from "@/components/ui/search-loading";
import "@/styles/globals.css";
import "react-day-picker/dist/style.css";
import { HeroProps } from "@/lib/types";

const Hero = ({ onSearch }: HeroProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [roomCap, setRoomCap] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setIsSearching(true);
    // Simulate a delay for the search loading state
    const timer = setTimeout(() => {
      setIsSearching(false);
    }, 3000); // Adjust the delay as needed
    return () => clearTimeout(timer);
  }, []);

  // Function to filter end times based on the selected start time
  const getFilteredEndTimes = () => {
    const startIndex = availableTime.findIndex(
      (time) => time.availableTime === startTime,
    );
    if (startIndex === -1) return [];
    return availableTime.slice(startIndex + 1);
  };
  // Clear functions for each input
  const clearDate = () => setSelectedDate(undefined);
  const clearRoom = () => setSelectedRoom(null);
  const clearStartTime = () => {
    setStartTime("");
    setEndTime(""); // Clear end time when start time is cleared
  };
  const clearEndTime = () => setEndTime("");
  const clearCapacity = () => setRoomCap("");

  // Check if search button should be enabled
  const isSearchEnabled =
    selectedDate && selectedRoom && startTime && endTime && roomCap;

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSearching(true);
    const formData = new FormData(e.currentTarget);
    // add error handling for empty fields
    if (!selectedDate || !selectedRoom || !startTime || !endTime || !roomCap) {
      alert("Please fill in all fields before searching.");
      return;
    }
    if (onSearch) {
      await onSearch(formData);
    }
    // Simulate a search delay
    // This is where you would typically call your search function
    // For demonstration, we can simulate a delay
    // Uncomment the line below to simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsSearching(false);
  };

  return (
    <>
      <SearchLoadingState isLoading={isSearching} />
      <section className="w-full bg-background relative">
        <div className="mx-auto px-4 h-full">
          <div className="grid grid-cols-1 md:grid-cols-2 h-[500px] rounded-xl overflow-hidden">
            {/* Left Section */}
            <div className="relative flex flex-col justify-center px-10">
              <div className="absolute inset-0 hero-bg-blue opacity-50" />
              <div className="relative z-10">
                <h1 className="text-4xl md:text-5xl font-bold dark-blue-text mb-2">
                  don&apos;t stress, <br /> just CRAMS.
                </h1>
                <p className="text-primary-foreground text-lg">
                  Classroom reservations made simple!
                </p>
              </div>
            </div>

            {/* Right Section */}
            <div className="relative w-full h-full">
              <Image
                src="/hero-classroom.jpg"
                alt="Classroom Image"
                fill
                className="object-cover"
              />
            </div>
            {/* Search Bar */}
            <div className="absolute bottom-10 left-0 right-0 px-8">
              <div className="bg-white shadow-lg rounded-lg p-4 mx-auto max-w-[1450px]">
                <form
                  className="flex flex-wrap items-center justify-between gap-2"
                  onSubmit={handleSearch}
                >
                  <input
                    type="hidden"
                    name="date"
                    value={
                      selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""
                    }
                  />
                  <input
                    type="hidden"
                    name="location"
                    value={selectedRoom || ""}
                  />
                  <input
                    type="hidden"
                    name="startTime"
                    value={startTime || ""}
                  />
                  <input type="hidden" name="endTime" value={endTime || ""} />
                  <input type="hidden" name="capacity" value={roomCap || ""} />
                  {/* DATE PICKER */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="flex items-start gap-4 p-2 rounded-md hover:bg-secondary cursor-pointer w-[210px] relative">
                        <div className="flex items-center justify-center w-10 h-10">
                          <CalendarIcon className="text-color-primary w-6 h-6" />
                        </div>
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-medium text-black mb-1">
                            DATE
                          </label>
                          <div className="flex flex-col">
                            <div
                              className={`text-md ${selectedDate ? "text-black" : "text-gray-400"}`}
                            >
                              {selectedDate
                                ? format(selectedDate, "MM/dd/yyyy")
                                : "Select Date"}
                            </div>
                          </div>
                          {selectedDate && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                clearDate();
                              }}
                              className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                            >
                              <X className="w-4 h-4 text-gray-500" />
                            </button>
                          )}
                        </div>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 shadow-none border-none bg-transparent outline-none"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => setSelectedDate(date)}
                        initialFocus
                        className="bg-white rounded-xl shadow-md"
                      />
                    </PopoverContent>
                  </Popover>

                  <div className="h-12 w-px bg-secondary" />
                  {/* LOCATION PICKER */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="flex items-start gap-4 p-2 rounded-md hover:bg-secondary cursor-pointer w-[200px] relative">
                        <div className="flex items-center justify-center w-10 h-10">
                          <MapPin className="text-color-primary w-6 h-6" />
                        </div>
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-medium text-black mb-1">
                            LOCATION
                          </label>
                          <div
                            className={`text-md ${selectedRoom ? "text-black" : "text-gray-400"}`}
                          >
                            {selectedRoom || "Select Room"}
                          </div>
                        </div>
                        {selectedRoom && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              clearRoom();
                            }}
                            className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                          >
                            <X className="w-4 h-4 text-gray-500" />
                          </button>
                        )}
                      </div>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className="w-auto p-0 bg-white rounded-lg shadow-lg outline-none"
                    >
                      <div className="w-48 max-h-60 overflow-y-auto rounded-lg">
                        {roomFloors.map((room) => (
                          <div
                            key={room.roomFloors}
                            onClick={() => setSelectedRoom(room.roomFloors)}
                            className={`px-4 py-2 cursor-pointer hover:hover-color ${
                              selectedRoom === room.roomFloors
                                ? "color-primary text-white font-semibold"
                                : ""
                            }`}
                          >
                            {room.roomFloors}
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>

                  <div className="h-12 w-px bg-secondary" />

                  {/* START TIME PICKER */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="flex items-start gap-4 p-2 rounded-md hover:bg-secondary cursor-pointer w-[200px] relative">
                        <div className="flex items-center justify-center w-10 h-10">
                          <LogIn className="text-color-primary w-6 h-6" />
                        </div>
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-medium text-black mb-1">
                            START TIME
                          </label>
                          <div
                            className={`text-md ${startTime ? "text-black" : "text-gray-400"}`}
                          >
                            {startTime || "Select Time"}
                          </div>
                        </div>
                        {startTime && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              clearStartTime();
                            }}
                            className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                          >
                            <X className="w-4 h-4 text-gray-500" />
                          </button>
                        )}
                      </div>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className="w-auto p-0 bg-white rounded-lg shadow-lg outline-none"
                    >
                      <div className="w-48 max-h-60 overflow-y-auto rounded-lg">
                        {availableTime
                          .filter((time) => time.availableTime !== "7:00 PM")
                          .map((time) => (
                            <div
                              key={time.availableTime}
                              onClick={() => setStartTime(time.availableTime)}
                              className={`px-4 py-2 cursor-pointer hover:hover-color ${
                                startTime === time.availableTime
                                  ? "color-primary text-white font-semibold"
                                  : ""
                              }`}
                            >
                              {time.availableTime}
                            </div>
                          ))}
                      </div>
                    </PopoverContent>
                  </Popover>

                  <div className="h-12 w-px bg-secondary" />

                  {/* END TIME PICKER */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="flex items-start gap-4 p-2 rounded-md hover:bg-secondary cursor-pointer w-[200px] relative">
                        <div className="flex items-center justify-center w-10 h-10">
                          <LogOut className="text-color-primary w-6 h-6" />
                        </div>
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-medium text-black mb-1">
                            END TIME
                          </label>
                          <div
                            className={`text-md ${endTime ? "text-black" : "text-gray-400"}`}
                          >
                            {endTime || "Select Time"}
                          </div>
                        </div>
                        {endTime && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              clearEndTime();
                            }}
                            className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                          >
                            <X className="w-4 h-4 text-gray-500" />
                          </button>
                        )}
                      </div>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className="w-auto p-0 bg-white rounded-lg shadow-lg outline-none"
                    >
                      <div className="w-48 max-h-60 overflow-y-auto rounded-lg">
                        {getFilteredEndTimes().map((time) => (
                          <div
                            key={time.availableTime}
                            onClick={() => setEndTime(time.availableTime)}
                            className={`px-4 py-2 cursor-pointer hover:hover-color ${
                              endTime === time.availableTime
                                ? "color-primary text-white font-semibold"
                                : ""
                            }`}
                          >
                            {time.availableTime}
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>

                  <div className="h-12 w-px bg-secondary" />

                  {/* CAPACITY PICKER */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="flex items-start gap-4 p-2 rounded-md hover:bg-secondary cursor-pointer w-[200px] relative">
                        <div className="flex items-center justify-center w-10 h-10">
                          <Users className="text-color-primary w-6 h-6" />
                        </div>
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-medium text-black mb-1">
                            CAPACITY
                          </label>
                          <div
                            className={`text-md ${roomCap ? "text-black" : "text-gray-400"}`}
                          >
                            {roomCap || "Select Capacity"}
                          </div>
                        </div>
                        {roomCap && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              clearCapacity();
                            }}
                            className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                          >
                            <X className="w-4 h-4 text-gray-500" />
                          </button>
                        )}
                      </div>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className="w-auto p-0 bg-white rounded-lg shadow-lg outline-none"
                    >
                      <div className="w-48 max-h-60 overflow-y-auto rounded-lg">
                        {roomCapacity.map((cap) => (
                          <div
                            key={cap.roomCapacity}
                            onClick={() => setRoomCap(cap.roomCapacity)}
                            className={`px-4 py-2 cursor-pointer hover:hover-color ${
                              roomCap === cap.roomCapacity
                                ? "color-primary text-white font-semibold"
                                : ""
                            }`}
                          >
                            {cap.roomCapacity}
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  {/* Search Button */}
                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={!isSearchEnabled || isSearching}
                      className={`font-semibold px-6 py-2 rounded-lg h-[55px] flex items-center gap-2 transition-all duration-200 ${
                        isSearchEnabled && !isSearching
                          ? "dark-blue-bg text-white hover:bg-[#182657] cursor-pointer"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <Search size={20} />
                      {isSearching ? "Searching..." : "Search"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
