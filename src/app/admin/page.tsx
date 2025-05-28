"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import {
  getRoomCountsAction,
  getPendingReservationsCountAction,
} from "@/actions/admin";

const holidays2024 = [
  { date: "08/21", day: "Wednesday", name: "Ninoy Aquino Day" },
  { date: "08/26", day: "Monday", name: "National Heroes Day" },
  { date: "09/01", day: "Friday", name: "All Saints Day" },
  { date: "09/02", day: "Saturday", name: "Special Non-working Holiday" },
  { date: "09/30", day: "Saturday", name: "Bonifacio Day" },
  {
    date: "12/08",
    day: "Sunday",
    name: "Feast of the Immaculate Conception of Mary",
  },
  { date: "12/24", day: "Tuesday", name: "Special Non-working Holiday" },
  { date: "12/25", day: "Wednesday", name: "Christmas Day" },
  { date: "12/30", day: "Monday", name: "Rizal Day" },
];

const holidays2025 = [
  { date: "01/01", day: "Wednesday", name: "New Year's Day" },
  { date: "01/29", day: "Wednesday", name: "Lunar New Year" },
  { date: "02/25", day: "Tuesday", name: "EDSA Anniversary" },
  { date: "03/01", day: "Saturday", name: "Araw ng Dabaw" },
  { date: "04/09", day: "Wednesday", name: "Day of Valor" },
  { date: "04/17", day: "Thursday", name: "Maundy Thursday" },
  { date: "04/18", day: "Friday", name: "Good Friday" },
  { date: "05/01", day: "Thursday", name: "Labor Day" },
  { date: "06/12", day: "Thursday", name: "Independence Day" },
];

export default function DashboardPage() {
  // State for fetched data
  const [roomCounts, setRoomCounts] = useState({
    lectureRooms: 0,
    dbsesLabs: 0,
    dmpcsLabs: 0,
    dfscLabs: 0,
    totalRooms: 0,
  });
  const [pendingCount, setPendingCount] = useState(0);

  // Fetch data on mount
  useEffect(() => {
    async function fetchData() {
      const roomCountsResult = await getRoomCountsAction();
      const pendingReservationsResult =
        await getPendingReservationsCountAction();

      setRoomCounts(
        roomCountsResult?.counts || {
          lectureRooms: 0,
          dbsesLabs: 0,
          dmpcsLabs: 0,
          dfscLabs: 0,
          totalRooms: 0,
        },
      );
      setPendingCount(pendingReservationsResult?.count || 0);
    }
    fetchData();
  }, []);

  // Calculate percentages for the color bar
  const total = roomCounts.totalRooms;
  const lecturePercent =
    total > 0 ? (roomCounts.lectureRooms / total) * 100 : 0;
  const dbsesPercent = total > 0 ? (roomCounts.dbsesLabs / total) * 100 : 0;
  const dmpcsPercent = total > 0 ? (roomCounts.dmpcsLabs / total) * 100 : 0;
  const dfscPercent = total > 0 ? (roomCounts.dfscLabs / total) * 100 : 0;

  const [selectedYear, setSelectedYear] = useState<2024 | 2025>(2024);
  const currentHolidays = selectedYear === 2024 ? holidays2024 : holidays2025;

  return (
    <div className="flex h-screen">
      <main className="flex-1 bg-[#f2ede4] px-6 py-1">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Section */}
          <div className="w-full lg:w-2/5 flex flex-col gap-6">
            {/* New Reservations */}
            <Card className="bg-white p-4 rounded-xl shadow-md">
              <div className="flex items-center justify-between mb-[-25px]">
                <h2 className="text-sm text-gray-500">New Reservations</h2>
                <Link href="/admin/booking-management">
                  <CalendarDays className="w-5 h-5 text-[#1c2b3b] cursor-pointer hover:text-[#274c77] transition" />
                </Link>
              </div>
              <p className="text-[50px] font-bold mb-[-15px]">
                {pendingCount.toString().padStart(2, "0")}
              </p>
              <p className="text-sm text-gray-600">
                Check the management tab to see pending reservations that may
                require your attention.
              </p>
            </Card>

            {/* Room Types */}
            <Card className="bg-white p-4 rounded-xl shadow-md">
              <h2 className="text-sm text-gray-500">Room Types</h2>

              {/* Stacked color bar */}
              <div className="w-full h-[72px] overflow-hidden outline-none flex mb-4">
                <div
                  className="bg-blue-300 w-[60%] border-2 border-white rounded-l-xl"
                  style={{ width: `${lecturePercent}%` }}
                />
                <div
                  className="bg-blue-500 w-[20%] border-2 border-white"
                  style={{ width: `${dbsesPercent}%` }}
                />
                <div
                  className="bg-blue-700 w-[10%] border-2 border-white"
                  style={{ width: `${dmpcsPercent}%` }}
                />
                <div
                  className="bg-blue-900 w-[10%] border-2 border-white rounded-r-xl"
                  style={{ width: `${dfscPercent}%` }}
                />
              </div>

              {/* Room types grid */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                <div className="flex items-center">
                  <div className="w-[5px] h-[60px] bg-blue-300 rounded-sm mr-2" />
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Lecture Rooms</p>
                    <p className="text-[32px] font-bold leading-none">
                      {roomCounts.lectureRooms}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-[5px] h-[60px] bg-blue-500 rounded-sm mr-2" />
                  <div>
                    <p className="text-sm text-gray-600 mb-2">DBSES Labs</p>
                    <p className="text-[32px] font-bold leading-none">
                      {roomCounts.dbsesLabs}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-[5px] h-[60px] bg-blue-700 rounded-sm mr-2" />
                  <div>
                    <p className="text-sm text-gray-600 mb-2">DMPCS Labs</p>
                    <p className="text-[32px] font-bold leading-none">
                      {roomCounts.dmpcsLabs}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-[5px] h-[60px] bg-blue-900 rounded-sm mr-2" />
                  <div>
                    <p className="text-sm text-gray-600 mb-2">DFSC Labs</p>
                    <p className="text-[32px] font-bold leading-none">
                      {roomCounts.dfscLabs}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Section */}
          <div className="w-full lg:w-3/5 flex flex-col">
            <Card className="bg-white p-4 rounded-xl shadow-md flex-1 flex flex-col">
              <div className="mb-2">
                <h2 className="text-gray-500 text-sm font-semibold">
                  Holidays (based on the approved academic calendar)
                </h2>
                <p className="text-xs text-gray-500 mb-6">
                  <i>Rooms cannot be booked during these days</i>
                </p>

                {/* Year Toggle */}
                <div className="flex bg-gray-100 rounded-t-lg p-1 w-fit">
                  <Button
                    variant={selectedYear === 2024 ? "default" : "ghost"}
                    size="default"
                    onClick={() => setSelectedYear(2024)}
                    className={`p-6 text-base transition-all text-[25px] rounded-t-md rounded-b-none ${
                      selectedYear === 2024
                        ? "bg-[#1a365d] text-white shadow-sm font-bold"
                        : "text-gray-600 hover:text-gray-900 hover:bg-white font-medium"
                    }`}
                  >
                    2024
                  </Button>
                  <Button
                    variant={selectedYear === 2025 ? "default" : "ghost"}
                    size="default"
                    onClick={() => setSelectedYear(2025)}
                    className={`p-6 text-base transition-all text-[25px] rounded-t-md rounded-b-none ${
                      selectedYear === 2025
                        ? "bg-[#1a365d] text-white shadow-sm font-bold"
                        : "text-gray-600 hover:text-gray-900 hover:bg-white font-medium"
                    }`}
                  >
                    2025
                  </Button>
                </div>

                {/* Holiday Content Box */}
                <div className="bg-gray-100 rounded-lg rounded-tl-none p-1 flex-1 min-h-[330px]">
                  <div className="bg-[#1a365d] rounded-md h-full p-6">
                    <div className="grid grid-cols-[auto,1fr] gap-x-8 gap-y-3 text-sm">
                      {currentHolidays.map((holiday, index) => (
                        <React.Fragment key={index}>
                          <div className="font-semibold text-white">{`${holiday.date}, ${holiday.day}`}</div>
                          <div className="text-blue-50">{holiday.name}</div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
