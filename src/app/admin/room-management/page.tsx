"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Clock,
  X,
  ImageIcon,
  AlertTriangle,
  Laptop,
  Microscope,
  Presentation,
  School,
  ChefHat,
  MoreHorizontal,
  Trash2,
  Plus,
  CalendarIcon,
} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { format } from "date-fns";
// import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { roomData, type Room } from "@/app/roomData";
import "@/styles/globals.css";

// Function to get the appropriate icon based on room type
const getRoomTypeIcon = (type: string) => {
  const typeUpperCase = type.toUpperCase();

  if (
    typeUpperCase.includes("LECTURE") ||
    typeUpperCase.includes("AUDITORIUM")
  ) {
    return <Presentation className="h-4 w-4 mr-2" />;
  } else if (typeUpperCase.includes("DMPCS")) {
    return <Laptop className="h-4 w-4 mr-2" />;
  } else if (typeUpperCase.includes("DBSES")) {
    return <Microscope className="h-4 w-4 mr-2" />;
  } else if (typeUpperCase.includes("DFSC")) {
    return <ChefHat className="h-4 w-4 mr-2" />;
  } else {
    return <School className="h-4 w-4 mr-2" />;
  }
};

// Available room types for selection
const roomTypes = [
  "LECTURE ROOM",
  "LECTURE ROOM/AUDITORIUM",
  "DBSES LABORATORY ROOM",
  "DMPCS LABORATORY ROOM",
  "DFSC LABORATORY ROOM",
];

// Available floors for selection
const floorOptions = ["1st Floor, CSM", "2nd Floor, CSM"];

// Time options for dropdowns
// const timeOptions = [
//   "7:00 AM",
//   "7:30 AM",
//   "8:00 AM",
//   "8:30 AM",
//   "9:00 AM",
//   "9:30 AM",
//   "10:00 AM",
//   "10:30 AM",
//   "11:00 AM",
//   "11:30 AM",
//   "12:00 PM",
//   "12:30 PM",
//   "1:00 PM",
//   "1:30 PM",
//   "2:00 PM",
//   "2:30 PM",
//   "3:00 PM",
//   "3:30 PM",
//   "4:00 PM",
//   "4:30 PM",
//   "5:00 PM",
//   "5:30 PM",
//   "6:00 PM",
//   "6:30 PM",
//   "7:00 PM",
//   "7:30 PM",
//   "8:00 PM",
//   "8:30 PM",
//   "9:00 PM",
// ];

export default function RoomSchedulePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(700);
  const [isResizing, setIsResizing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedChangesAlert, setShowUnsavedChangesAlert] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");
  const [roomImage, setRoomImage] = useState<string | null>("/classroom.jpg");
  const [localRoomData, setLocalRoomData] = useState<Room[]>(roomData);

  // Create room state
  const [showCreateRoomDialog, setShowCreateRoomDialog] = useState(false);
  const [newRoom, setNewRoom] = useState<Partial<Room>>({
    id: "",
    type: "",
    floor: "",
    capacity: 50,
    image: "/classroom.jpg",
    times: [],
    description: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [timeSlots, setTimeSlots] = useState<
    { startTime: string; endTime: string }[]
  >([]);
  const [currentStartTime, setCurrentStartTime] = useState<string>("");
  const [currentEndTime, setCurrentEndTime] = useState<string>("");

  const minWidth = 700;
  const maxWidth = 1150;
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Extract unique floor values for filtering
  const floors = Array.from(new Set(localRoomData.map((room) => room.floor)));

  // Filter rooms based on search query and selected floor
  const filteredRooms = localRoomData.filter((room) => {
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
      const updatedRooms = localRoomData.map((room) => {
        if (room.id === selectedRoom.id) {
          return {
            ...room,
            description: editedDescription,
          };
        }
        return room;
      });

      // Update local room data
      setLocalRoomData(updatedRooms);

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

  const handleDeleteRoom = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteRoom = () => {
    if (selectedRoom) {
      // Filter out the selected room
      const updatedRooms = localRoomData.filter(
        (room) => room.id !== selectedRoom.id,
      );

      // Update local room data
      setLocalRoomData(updatedRooms);

      // Close the delete confirmation dialog
      setShowDeleteConfirmation(false);

      // Close the room details sidebar
      setSelectedRoom(null);
    }
  };

  const handleCreateRoom = () => {
    setShowCreateRoomDialog(true);
  };

  const handleAddTimeSlot = () => {
    if (currentStartTime && currentEndTime) {
      const timeSlot = `${currentStartTime} - ${currentEndTime}`;
      setTimeSlots([
        ...timeSlots,
        { startTime: currentStartTime, endTime: currentEndTime },
      ]);
      setCurrentStartTime("");
      setCurrentEndTime("");
    }
  };

  const handleSaveNewRoom = () => {
    if (newRoom.id && newRoom.type && newRoom.floor && newRoom.description) {
      // Format time slots
      const formattedTimes = timeSlots.map(
        (slot) => `${slot.startTime} - ${slot.endTime}`,
      );

      // Create new room object
      const roomToAdd: Room = {
        id: newRoom.id,
        type: newRoom.type,
        floor: newRoom.floor,
        capacity: newRoom.capacity || 50,
        image: newRoom.image || "/classroom.jpg",
        times: formattedTimes,
        description: newRoom.description,
      };

      // Add to local room data
      setLocalRoomData([...localRoomData, roomToAdd]);

      // Reset form
      setNewRoom({
        id: "",
        type: "",
        floor: "",
        capacity: 50,
        image: "/classroom.jpg",
        times: [],
        description: "",
      });
      setTimeSlots([]);
      setCurrentStartTime("");
      setCurrentEndTime("");
      setSelectedDate(new Date());

      // Close dialog
      setShowCreateRoomDialog(false);
    }
  };

  // Function to clear search
  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Room Schedule</h1>
      </div>

      {/* Search bar with clear button */}
      <div className="mb-4">
        <div className="relative w-full max-w-[21rem]">
          <Input
            type="text"
            placeholder="Search Room Number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 bg-white"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Floor filter buttons */}
      <div className="flex gap-5 mb-6">
        <Button
          variant={selectedFloor === "1st Floor, CSM" ? "default" : "outline"}
          onClick={() =>
            setSelectedFloor(
              selectedFloor === "1st Floor, CSM" ? null : "1st Floor, CSM",
            )
          }
          className={`${selectedFloor === "1st Floor, CSM" ? "bg-[#274c77] hover:bg-[#274c77] text-white" : "bg-white text-color-primary primary-border"}`}
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
          className={`${selectedFloor === "2nd Floor, CSM" ? "bg-[#274c77] hover:bg-[#274c77] text-white" : "bg-white text-color-primary primary-border"}`}
        >
          Floor 2 - Rooms
        </Button>

        <div className="ml-auto">
          <Button
            className="bg-[#034078] hover:bg-[#274c77] text-white font-semibold transition-colors duration-200"
            onClick={handleCreateRoom}
          >
            Create Room
          </Button>
        </div>
      </div>

      {/* White container with custom scrollbar */}
      <div className="bg-white rounded-lg shadow-md p-6 h-[calc(100vh-220px)] overflow-hidden">
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
            <div className="flex justify-between items-center mb-0.5">
              <div className="border border-gray-300 rounded-lg px-8 py-2 mb-4 w-fit">
                <h2 className="text-xl font-bold text-color-primary">
                  Room Details
                </h2>
              </div>
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
            <div className="relative mb-6">
              {roomImage ? (
                <img
                  src={roomImage || "/placeholder.svg"}
                  alt="Room"
                  className="w-full h-[200px] object-cover rounded-lg"
                />
              ) : (
                <div className="bg-gray-200 h-[200px] rounded-lg flex items-center justify-center text-gray-500">
                  No Room Image
                </div>
              )}

              {isEditing && (
                <div className="absolute bottom-2 right-2">
                  <label htmlFor="roomImageUpload">
                    <Button
                      className="bg-blue-400 hover:bg-blue-500 text-white"
                      size="sm"
                      asChild
                    >
                      <span>
                        <ImageIcon className="h-4 w-4 mr-1" />
                        Edit Room Photo
                      </span>
                    </Button>
                  </label>
                  <input
                    id="roomImageUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          if (typeof reader.result === "string") {
                            setRoomImage(reader.result);
                            setHasUnsavedChanges(true);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              )}
            </div>

            {/* Room Name */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-2">{selectedRoom.id}</h3>
              <div className="flex items-center">
                {getRoomTypeIcon(selectedRoom.type)}
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

            {/* Available Time */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-2">Available Time</h3>
              <div className="grid grid-cols-3 gap-2">
                {selectedRoom.times.map((time, index) => (
                  <div key={index} className="mb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-gray-700" />
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
                    className="bg-gray-400 hover:bg-red-500 text-white border-none transition-colors duration-200"
                    onClick={handleDiscardChanges}
                  >
                    Discard Changes
                  </Button>
                  <Button
                    className="bg-blue-400 hover:bg-[#274c77] text-white transition-colors duration-200"
                    onClick={handleSaveChanges}
                  >
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="bg-black hover:bg-red-500 text-white border-none transition-colors duration-200"
                    onClick={handleDeleteRoom}
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
              className="hover:bg-slate-100 hover:text-gray-700"
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
              className="hover:color-primary hover:text-white hover:font-semibold"
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

      {/* Delete Room Confirmation */}
      <AlertDialog
        open={showDeleteConfirmation}
        onOpenChange={setShowDeleteConfirmation}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Delete Room
            </AlertDialogTitle>
            <AlertDialogDescription>
              Do you really want to delete this room? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-slate-100 hover:text-gray-700">
              No
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteRoom}
              className="bg-red-500 hover:bg-red-700 hover:text-white"
            >
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Room Dialog */}
      <Dialog
        modal={false}
        open={showCreateRoomDialog}
        onOpenChange={setShowCreateRoomDialog}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto shadow-lg rounded-lg">
          <DialogHeader>
            <DialogTitle>Create New Room</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new room.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Room Image */}
            <div className="relative mb-4">
              {newRoom.image ? (
                <img
                  src={newRoom.image || "/placeholder.svg"}
                  alt="Room"
                  className="w-full h-[200px] object-cover rounded-lg"
                />
              ) : (
                <div className="bg-gray-200 h-[200px] rounded-lg flex items-center justify-center text-gray-500">
                  No Room Image
                </div>
              )}

              <div className="absolute bottom-2 right-2">
                <label htmlFor="newRoomImageUpload">
                  <Button
                    className="bg-blue-400 hover:bg-blue-500 text-white"
                    size="sm"
                    asChild
                  >
                    <span>
                      <ImageIcon className="h-4 w-4 mr-1" />
                      Add Room Photo
                    </span>
                  </Button>
                </label>
                <input
                  id="newRoomImageUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        if (typeof reader.result === "string") {
                          setNewRoom({
                            ...newRoom,
                            image: reader.result,
                          });
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
            </div>

            {/* Room ID */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="roomId" className="text-right">
                Room ID
              </Label>
              <Input
                id="roomId"
                placeholder="e.g., ROOM 101"
                className="col-span-3"
                value={newRoom.id}
                onChange={(e) => setNewRoom({ ...newRoom, id: e.target.value })}
              />
            </div>

            {/* Room Type */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="roomType" className="text-right">
                Room Type
              </Label>
              <Select
                value={newRoom.type}
                onValueChange={(value) =>
                  setNewRoom({ ...newRoom, type: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Floor */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="floor" className="text-right">
                Floor
              </Label>
              <Select
                value={newRoom.floor}
                onValueChange={(value) =>
                  setNewRoom({ ...newRoom, floor: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select floor" />
                </SelectTrigger>
                <SelectContent>
                  {floorOptions.map((floor) => (
                    <SelectItem key={floor} value={floor}>
                      {floor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Capacity */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">
                Capacity
              </Label>
              <Input
                id="capacity"
                type="number"
                placeholder="e.g., 30"
                className="col-span-3"
                value={newRoom.capacity}
                onChange={(e) =>
                  setNewRoom({
                    ...newRoom,
                    capacity: Number.parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>

            {/* Description */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter room description"
                className="col-span-3 min-h-[100px]"
                value={newRoom.description}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, description: e.target.value })
                }
              />
            </div>

            {/* Date Picker
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Date</Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "MM/dd/yyyy")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      className="bg-white rounded-xl shadow-md"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div> */}

            {/* Available Time */}
            {/* <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Available Time</Label>
              <div className="col-span-3 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="space-y-2 flex-1">
                    <Label>Start Time</Label>
                    <Select
                      value={currentStartTime}
                      onValueChange={setCurrentStartTime}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select start time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 flex-1">
                    <Label>End Time</Label>
                    <Select
                      value={currentEndTime}
                      onValueChange={setCurrentEndTime}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select end time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="button"
                    size="default"
                    className="mt-8 hover:color-primary hover:text-white rounded-lg"
                    onClick={handleAddTimeSlot}
                    disabled={!currentStartTime || !currentEndTime}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Time Slot
                  </Button>
                </div>

                Display added time slots
                {timeSlots.length > 0 && (
                  <div className="border rounded-md p-3 bg-gray-50">
                    <h4 className="font-medium mb-2">Added Time Slots:</h4>
                    <ul className="space-y-1">
                      {timeSlots.map((slot, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-700" />
                          <span>{`${slot.startTime} - ${slot.endTime}`}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 ml-auto"
                            onClick={() => {
                              const newSlots = [...timeSlots];
                              newSlots.splice(index, 1);
                              setTimeSlots(newSlots);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div> */}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateRoomDialog(false)}
              className="hover:bg-red-500 hover:text-white border-none transition-colors duration-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveNewRoom}
              className="bg-blue-400 hover:bg-[#274c77] text-white transition-colors duration-200"
              disabled={
                !newRoom.id ||
                !newRoom.type ||
                !newRoom.floor ||
                !newRoom.description ||
                timeSlots.length === 0
              }
            >
              Create Room
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
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
    <div className="bg-[#e9f0f5] rounded-lg p-5 pb-3 relative">
      <div className="mb-3">
        <h2 className="text-xl font-bold">{room.id}</h2>
        <div className="flex items-center text-gray-600">
          {getRoomTypeIcon(room.type)}
          <span>{room.type}</span>
        </div>
      </div>

      <div className="mb-2">
        <h3 className="font-medium mb-1">Available Time</h3>
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
                className="bg-white text-black rounded-full p-1 w-6 h-6 flex items-center justify-center"
              >
                <MoreHorizontal className="w-4 h-4" />
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
          <div className="text-right mt-2">
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
