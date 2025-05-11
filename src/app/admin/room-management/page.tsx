"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Clock } from "lucide-react"
import { roomData, Room } from "@/app/roomData"
import Sidebar from "@/app/admin/Sidebar"

export default function RoomSchedulePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null)

  // Extract unique floor values for filtering
  const floors = Array.from(new Set(roomData.map((room) => room.floor)))

  // Filter rooms based on search query and selected floor
  const filteredRooms = roomData.filter((room) => {
    const matchesSearch = room.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFloor = selectedFloor === null || room.floor === selectedFloor
    return matchesSearch && matchesFloor
  })

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main content area */}
      <main className="flex-1 bg-[#f2ede4] py-6 px-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Room Schedule</h1>
        </div>

        {/* Search and filters */}
        <div className="mb-6">
          <div className="flex gap-4 items-center flex-wrap">
            <div className="relative w-full max-w-xs">
              <Input
                type="text"
                placeholder="Search Room Number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            {floors.map((floor) => (
              <Button
                key={floor}
                variant={selectedFloor === floor ? "default" : "outline"}
                onClick={() => setSelectedFloor(selectedFloor === floor ? null : floor)}
                className={`${selectedFloor === floor ? "bg-blue-800 hover:bg-blue-700" : "bg-white"}`}
              >
                {floor}
              </Button>
            ))}

            <div className="ml-auto">
              <Button className="bg-blue-400 hover:bg-blue-500 text-white">Edit Room</Button>
            </div>
          </div>
        </div>

        {/* White container with custom scrollbar */}
        <div className="bg-white rounded-lg shadow-md p-6 h-[calc(100vh-220px)] overflow-hidden">
          {/* Scrollable content area with custom scrollbar */}
          <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
            {/* Room cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Room card component
function RoomCard({ room }: { room: Room }) {
  const [showAllTimes, setShowAllTimes] = useState(false)

  // Show only 2 times initially, or all times if showAllTimes is true
  const displayTimes = showAllTimes ? room.times : room.times.slice(0, 2)

  return (
    <div className="bg-[#e9f0f5] rounded-lg p-6 relative">
      <div className="mb-4">
        <h2 className="text-xl font-bold">{room.id}</h2>
        <p className="text-gray-600">{room.type}</p>
      </div>

      <div className="mb-4">
        <h3 className="font-medium mb-2">Available Time</h3>
        {displayTimes.map((time, index) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-gray-700" />
            <span>{time}</span>
          </div>
        ))}

        {room.times.length > 2 && !showAllTimes && (
          <button
            onClick={() => setShowAllTimes(true)}
            className="w-full text-center mt-1 text-blue-500 hover:text-blue-700 transition-colors"
          >
            ...
          </button>
        )}

        {showAllTimes && room.times.length > 2 && (
          <button
            onClick={() => setShowAllTimes(false)}
            className="w-full text-center mt-2 text-sm text-blue-500 hover:text-blue-700 transition-colors"
          >
            Show less
          </button>
        )}
      </div>

      <div className="text-right">
        <Button variant="outline" className="bg-blue-400 hover:bg-blue-500 text-white border-none">
          View Room Details
        </Button>
      </div>
    </div>
  )
}