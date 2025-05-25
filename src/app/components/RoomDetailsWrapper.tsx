"use client";
import { useEffect, useState } from "react";
import { getAllRoomsWithTimeslotsInEachRoom } from "@/actions/users";
import RoomDetails from "@/app/components/RoomDetails";
import { Room } from "@/lib/types";
import { format } from "date-fns";
import { LoadingOverlay } from "@/components/ui/loading-spinner";

export default function RoomDetailsWrapper() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [roomDetails, setRoomDetails] = useState<Room[]>([]);
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false);

  useEffect(() => {
    if (!date) return; // Don't fetch if date is undefined
    const fetchRooms = async () => {
      setIsLoadingTimeSlots(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
      const data = await getAllRoomsWithTimeslotsInEachRoom(formattedDate);
      setRoomDetails(data || []);
      setIsLoadingTimeSlots(false);
    };
    fetchRooms();
  }, [date]);

  return (
    <LoadingOverlay
      isLoading={isLoadingTimeSlots}
      message="Loading available time slots for selected date..."
      spinnerType="pulse"
    >
      <RoomDetails roomDetails={roomDetails} date={date} setDate={setDate} />
    </LoadingOverlay>
  );
}
