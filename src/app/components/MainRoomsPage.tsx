"use client";
import { useEffect, useState } from "react";
import Hero from "@/app/components/Hero";
import AvailableRooms from "@/app/components/AvailableRooms";
import {
  getAllRoomsWithTimeslots,
  searchAvailableRooms,
} from "@/actions/users";
import { Room } from "@/lib/types";

export default function MainRoomsPage() {
  const [roomDetails, setRoomDetails] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchedFloor, setSearchedFloor] = useState<string>("1st Floor, CSM");

  // Initial load
  useEffect(() => {
    getAllRoomsWithTimeslots().then((data) => {
      setRoomDetails(data || []);
      setLoading(false);
    });
  }, []);

  // Handler for search
  const handleSearch = async (formData: FormData) => {
    setLoading(true);
    const searchPromise = searchAvailableRooms(formData).then((data) => {
    const location = formData.get("location");
    let mappedFloor = "1st Floor, CSM";
    if (location === "Floor 2") mappedFloor = "2nd Floor, CSM";
    if (location === "Floor 1") mappedFloor = "1st Floor, CSM";
    setSearchedFloor(mappedFloor);
    setRoomDetails(data || []);
    setLoading(false);
  });
  return searchPromise;
  };

  return (
    <section>
      <Hero onSearch={handleSearch} />
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <AvailableRooms
          roomDetails={roomDetails}
          searchedFloor={searchedFloor}
        />
      )}
    </section>
  );
}
