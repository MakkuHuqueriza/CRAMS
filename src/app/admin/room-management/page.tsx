"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Search, Clock, X, ImageIcon, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { roomData, Room } from "@/app/roomData";
import Sidebar from "@/app/admin/Sidebar";

export default function RoomSchedulePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(700);
  const [isResizing, setIsResizing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedChangesAlert, setShowUnsavedChangesAlert] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");
  const minWidth = 700;
  const maxWidth = 1150;
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Extract unique floor values for filtering
  const floors = Array.from(new Set(roomData.map((room) => room.floor)));

  // Filter rooms based on search query and selected floor
  const filteredRooms = roomData.filter((room) => {
    const matchesSearch = room.id
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFloor = selectedFloor === null || room.floor === selectedFloor;
    return matchesSearch && matchesFloor;
  });

  // Handle mouse events for resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      // Calculate new width based on mouse position
      const newWidth = window.innerWidth - e.clientX;

      // Apply constraints
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  // Initialize edit form when a room is selected or editing mode changes
  useEffect(() => {
    if (selectedRoom && isEditing) {
      setEditedDescription(selectedRoom.description);
    }
  }, [selectedRoom, isEditing]);

  const startResizing = () => {
    setIsResizing(true);
  };

  const handleEditRoom = () => {
    setIsEditing(true);
    setHasUnsavedChanges(false);
  };

  const handleCloseDetails = () => {
    if (isEditing && hasUnsavedChanges) {
      setShowUnsavedChangesAlert(true);
    } else {
      setSelectedRoom(null);
      setIsEditing(false);
      setHasUnsavedChanges(false);
    }
  };

  const handleSaveChanges = () => {
    // saving room changes @ local :)
    if (selectedRoom) {
      const updatedRooms = roomData.map((room) => {
        if (room.id === selectedRoom.id) {
          return {
            ...room,
            description: editedDescription,
          };
        }
        return room;
      });

      // demo
      console.log("Updated rooms:", updatedRooms);

      // Update the selected room with the new description
      setSelectedRoom({
        ...selectedRoom,
        description: editedDescription,
      });
    }

    setIsEditing(false);
    setHasUnsavedChanges(false);
  };

  const handleDiscardChanges = () => {
    setIsEditing(false);
    setHasUnsavedChanges(false);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setEditedDescription(e.target.value);
    setHasUnsavedChanges(true);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main content area */}
      <main className="flex-1 bg-[#f2ede4] py-6 px-10 overflow-y-auto relative">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Room Schedule</h1>
        </div>

        {/* Search bar */}
        <div className="mb-4">
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
        </div>

        {/* Floor filter buttons - now below search bar */}
        <div className="flex gap-4 mb-6">
          <Button
            variant={selectedFloor === "1st Floor, CSM" ? "default" : "outline"}
            onClick={() =>
              setSelectedFloor(
                selectedFloor === "1st Floor, CSM" ? null : "1st Floor, CSM",
              )
            }
            className={`${selectedFloor === "1st Floor, CSM" ? "bg-blue-800 hover:bg-blue-700" : "bg-white"}`}
          >
            Floor 1 - CSM Lobby
          </Button>

          <Button
            variant={selectedFloor === "2nd Floor, CSM" ? "default" : "outline"}
            onClick={() =>
              setSelectedFloor(
                selectedFloor === "2nd Floor, CSM" ? null : "2nd Floor, CSM",
              )
            }
            className={`${selectedFloor === "2nd Floor, CSM" ? "bg-blue-800 hover:bg-blue-700" : "bg-white"}`}
          >
            Floor 2 - Rooms
          </Button>

          <div className="ml-auto">
            <Button className="bg-blue-400 hover:bg-blue-500 text-white">
              Edit Room
            </Button>
          </div>
        </div>

        {/* White container with custom scrollbar */}
        <div className="bg-white rounded-lg shadow-md p-6 h-[calc(100vh-280px)] overflow-hidden">
          {/* Scrollable content area with custom scrollbar */}
          <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
            {/* Room cards grid */}
            {filteredRooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    onViewDetails={() => setSelectedRoom(room)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500 text-lg">No room exists</p>
              </div>
            )}
          </div>
        </div>

        {/* Resizable Room Details Sidebar */}
        {selectedRoom && (
          <div
            ref={sidebarRef}
            className="fixed inset-y-0 right-0 bg-white shadow-lg z-10 overflow-y-auto custom-scrollbar"
            style={{ width: `${sidebarWidth}px` }}
          >
            {/* Resize handle */}
            <div
              className="absolute inset-y-0 left-0 w-1 cursor-ew-resize hover:bg-blue-400 transition-colors"
              onMouseDown={startResizing}
            ></div>

            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Room Details</h2>
                <div className="flex items-center gap-2">
                  {isEditing && (
                    <span className="text-sm text-gray-500">Editing Mode</span>
                  )}
                  <button
                    onClick={handleCloseDetails}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Room Image */}
              <div className="bg-gray-200 h-[200px] rounded-lg mb-6 relative">
                {isEditing && (
                  <Button
                    className="absolute bottom-2 right-2 bg-blue-400 hover:bg-blue-500 text-white"
                    size="sm"
                    onClick={() => setHasUnsavedChanges(true)}
                  >
                    <ImageIcon className="h-4 w-4 mr-1" />
                    Edit Room Photo
                  </Button>
                )}
              </div>

              {/* Room Name */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-2">Room Name</h3>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-black mr-2"></div>
                  <span className="uppercase">{selectedRoom.type}</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-2">Description</h3>
                {isEditing ? (
                  <Textarea
                    value={editedDescription}
                    onChange={handleDescriptionChange}
                    className="min-h-[100px] text-sm"
                  />
                ) : (
                  <p className="text-sm text-gray-700">
                    {selectedRoom.description}
                  </p>
                )}
              </div>

              {/* Equipments */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-2">Equipments</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                    <div key={item} className="flex items-center">
                      <div className="w-3 h-3 bg-black mr-2"></div>
                      <div className="h-[1px] bg-gray-300 flex-grow"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Available Time */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-2">Available Time</h3>
                <div className="grid grid-cols-3 gap-2">
                  {selectedRoom.times.map((time, index) => (
                    <div key={index} className="mb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 rounded-full bg-black"></div>
                        <span className="text-xs">{time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-8">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      className="bg-gray-400 hover:bg-gray-500 text-white border-none"
                      onClick={handleDiscardChanges}
                    >
                      Discard Changes
                    </Button>
                    <Button
                      className="bg-blue-400 hover:bg-blue-500 text-white"
                      onClick={handleSaveChanges}
                    >
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="bg-gray-400 hover:bg-gray-500 text-white border-none"
                    >
                      Delete Room
                    </Button>
                    <Button
                      className="bg-blue-400 hover:bg-blue-500 text-white"
                      onClick={handleEditRoom}
                    >
                      Edit Room
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Unsaved Changes Alert */}
        <AlertDialog
          open={showUnsavedChangesAlert}
          onOpenChange={setShowUnsavedChangesAlert}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Unsaved Changes
              </AlertDialogTitle>
              <AlertDialogDescription>
                You have unsaved changes. Would you like to save your changes
                before exiting?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setSelectedRoom(null);
                  setIsEditing(false);
                  setHasUnsavedChanges(false);
                  setShowUnsavedChangesAlert(false);
                }}
              >
                Discard
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  handleSaveChanges();
                  setSelectedRoom(null);
                  setShowUnsavedChangesAlert(false);
                }}
              >
                Save
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}

// Room card component
function RoomCard({
  room,
  onViewDetails,
}: {
  room: Room;
  onViewDetails: () => void;
}) {
  const [showAllTimes, setShowAllTimes] = useState(false);

  // Show only 2 times initially, or all times if showAllTimes is true
  const displayTimes = showAllTimes ? room.times : room.times.slice(0, 2);

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

        {room.times.length > 2 && (
          <div className="flex justify-between items-center mt-1">
            {!showAllTimes ? (
              <button
                onClick={() => setShowAllTimes(true)}
                className="text-left text-gray-500"
              >
                ...
              </button>
            ) : (
              <button
                onClick={() => setShowAllTimes(false)}
                className="text-left text-sm text-blue-500 hover:text-blue-700"
              >
                Show less
              </button>
            )}

            <Button
              variant="outline"
              className="bg-blue-400 hover:bg-blue-500 text-white border-none"
              onClick={onViewDetails}
            >
              View Room Details
            </Button>
          </div>
        )}

        {room.times.length <= 2 && (
          <div className="text-right mt-4">
            <Button
              variant="outline"
              className="bg-blue-400 hover:bg-blue-500 text-white border-none"
              onClick={onViewDetails}
            >
              View Room Details
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
