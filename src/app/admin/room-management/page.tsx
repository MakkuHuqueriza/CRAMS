"use client";

import React, { useState, useEffect, useRef } from "react";
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
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Room } from "@/utils/database/types";
import {
  getAllRoomsWithTimeslots,
  createRoomAction,
  updateRoomDetailsAction,
  deleteRoomAction,
  searchRoomsAction,
} from "@/actions/admin";
import { formatTimeTo12Hour } from "@/lib/utils";

// Helper for room type icons
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

const floorOptions = ["1st Floor, CSM", "2nd Floor, CSM"];
const roomTypes = ["LECTURE ROOM", "LECTURE ROOM/AUDITORIUM", "DBSES LABORATORY ROOM", "DMPCS LABORATORY ROOM", "DFSC LABORATORY ROOM"] as const;

type RoomWithTimeslots = Room & { availableTimeslots?: any[] };

export default function RoomManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<RoomWithTimeslots | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(700);
  const [isResizing, setIsResizing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedChangesAlert, setShowUnsavedChangesAlert] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");
  const [roomImage, setRoomImage] = useState<string | null>("/classroom.jpg");
  const [rooms, setRooms] = useState<RoomWithTimeslots[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllTimesSidebar, setShowAllTimesSidebar] = useState(false);
  const [showCreateRoomDialog, setShowCreateRoomDialog] = useState(false);

  // Create room state
  const [newRoom, setNewRoom] = useState<Partial<Room>>({
    name: "",
    room_type: "LECTURE ROOM",
    room_location: "",
    capacity: 50,
    room_description: "",
  });

  const minWidth = 700;
  const maxWidth = 1150;
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Fetch rooms from Supabase
  useEffect(() => {
    async function fetchRooms() {
      setLoading(true);
      const { rooms: fetchedRooms } = await getAllRoomsWithTimeslots();
      if (fetchedRooms) setRooms(fetchedRooms);
      setLoading(false);
    }
    fetchRooms();
  }, []);

  // Filter rooms based on search query and selected floor
  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFloor =
      selectedFloor === null || room.room_location === selectedFloor;
    return matchesSearch && matchesFloor;
  });

  // Handle mouse events for resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
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
      setEditedDescription(selectedRoom.room_description || "");
    }
  }, [selectedRoom, isEditing]);

  const startResizing = () => setIsResizing(true);

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

  const handleSaveChanges = async () => {
    if (selectedRoom) {
      const formData = new FormData();
      formData.append("roomId", selectedRoom.room_id);
      formData.append("roomName", selectedRoom.name);
      formData.append("description", editedDescription);
      formData.append("capacity", String(selectedRoom.capacity));
      formData.append("floor", selectedRoom.room_location);
      formData.append("roomType", selectedRoom.room_type);

      const { room, error } = await updateRoomDetailsAction(formData);
      if (!error && room) {
        setRooms((prev) =>
          prev.map((r) =>
            r.room_id === selectedRoom.room_id
              ? { ...r, ...room, room_description: editedDescription }
              : r
          )
        );
        setSelectedRoom({ ...selectedRoom, ...room, room_description: editedDescription });
        setIsEditing(false);
        setHasUnsavedChanges(false);
      } else {
        alert(error?.message || "Failed to save changes.");
      }
    }
  };

  const handleDiscardChanges = () => {
    setIsEditing(false);
    setHasUnsavedChanges(false);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setEditedDescription(e.target.value);
    setHasUnsavedChanges(true);
  };

  const handleDeleteRoom = () => setShowDeleteConfirmation(true);

  const confirmDeleteRoom = async () => {
    if (selectedRoom) {
      const { error } = await deleteRoomAction(selectedRoom.room_id);
      if (!error) {
        setRooms((prev) =>
          prev.filter((room) => room.room_id !== selectedRoom.room_id)
        );
        setShowDeleteConfirmation(false);
        setSelectedRoom(null);
      } else {
        console.error("Delete error:", error);
        alert(error.message || "Failed to delete room.");
      }
    }
  };

  const handleCreateRoom = () => setShowCreateRoomDialog(true);

  const handleSaveNewRoom = async () => {
    if (
      newRoom.name &&
      newRoom.room_type &&
      newRoom.room_location &&
      newRoom.room_description
    ) {
      const formData = new FormData();
      formData.append("roomName", newRoom.name);
      formData.append("description", newRoom.room_description);
      formData.append("capacity", String(newRoom.capacity));
      formData.append("floor", newRoom.room_location);
      formData.append("roomType", newRoom.room_type);

      const { room, error } = await createRoomAction(formData);
      if (!error && room) {
        // Refetch all rooms with timeslots to ensure consistency
        const { rooms: fetchedRooms } = await getAllRoomsWithTimeslots();
        setRooms(fetchedRooms || []);
        setShowCreateRoomDialog(false);
        setNewRoom({
          name: "",
          room_type: "LECTURE ROOM",
          room_location: "",
          capacity: 50,
          room_description: "",
        });
      }
    }
  };

  // Function to clear search
  const clearSearch = () => setSearchQuery("");

  // Optional: handle search with backend
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      const { rooms: fetchedRooms } = await getAllRoomsWithTimeslots();
      setRooms(fetchedRooms || []);
    } else {
      const { rooms: searchedRooms } = await searchRoomsAction(query);
      setRooms(searchedRooms || []);
    }
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
            placeholder="Search Room Name"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
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
        {floorOptions.map((floor) => (
          <Button
            key={floor}
            variant={selectedFloor === floor ? "default" : "outline"}
            onClick={() =>
              setSelectedFloor(selectedFloor === floor ? null : floor)
            }
            className={`${
              selectedFloor === floor
                ? "bg-[#274c77] hover:bg-[#274c77] text-white"
                : "bg-white text-color-primary primary-border"
            }`}
          >
            {floor}
          </Button>
        ))}
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
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500 text-lg">Loading rooms...</p>
            </div>
          ) : filteredRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRooms.map((room) => (
                <RoomCard
                  key={room.room_id}
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
                <Image
                  src={roomImage || "/classroom.jpg"}
                  alt="Room"
                  width={600}
                  height={200}
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
              <h3 className="text-lg font-bold mb-2">{selectedRoom.name}</h3>
              <div className="flex items-center">
                {getRoomTypeIcon(selectedRoom.room_type)}
                <span className="uppercase">{selectedRoom.room_type}</span>
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
                  {selectedRoom.room_description}
                </p>
              )}
            </div>

            {/* Capacity */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-2">Capacity</h3>
              <p className="text-sm text-gray-700">
                {selectedRoom.capacity}
              </p>
            </div>

            {/* Available Timeslots */}
            <div className="mb-6 pt-4 pb-1">
              <h3 className="text-lg font-bold mb-2">Available Time</h3>
              <div className={showAllTimesSidebar ? "grid grid-cols-3 gap-1" : "space-y-1"}>
                {(showAllTimesSidebar
                  ? selectedRoom?.availableTimeslots
                  : selectedRoom?.availableTimeslots?.slice(0, 2) || []
                ).map((time: any, i: number) => (
                  <p
                    key={i}
                    className="text-[#274c77] text-[13px] lg:text-sm md:text-[11px] tracking-wider flex items-center gap-2"
                  >
                    <Clock className="w-4 h-4 text-[#274c77]" />
                    {`${formatTimeTo12Hour(time.start_time)} - ${formatTimeTo12Hour(time.end_time)}`}
                  </p>
                ))}
              </div>
              {selectedRoom?.availableTimeslots && selectedRoom.availableTimeslots.length > 2 && (
                <button
                  onClick={() => setShowAllTimesSidebar(!showAllTimesSidebar)}
                  className="bg-primary text-black rounded-full p-1 w-6 h-3 mt-[2px] flex items-center justify-center"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              )}
              {(!selectedRoom?.availableTimeslots || selectedRoom.availableTimeslots.length === 0) && (
                <p className="text-sm text-gray-500">No available timeslots today.</p>
              )}
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
              <Image
                src={"/classroom.jpg"}
                alt="Room"
                width={600}
                height={200}
                className="w-full h-[200px] object-cover rounded-lg"
              />

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
                          });
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
            </div>

            {/* Room Name */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="roomName" className="text-right">
                Room Name
              </Label>
              <Input
                id="roomName"
                placeholder="e.g., ROOM 101"
                className="col-span-3"
                value={newRoom.name}
                onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
              />
            </div>

            {/* Room Type */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="roomType" className="text-right">
                Room Type
              </Label>
              <Select
                value={newRoom.room_type}
                onValueChange={(value: typeof roomTypes[number]) =>
                  setNewRoom({ ...newRoom, room_type: value })
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
                value={newRoom.room_location}
                onValueChange={(value) =>
                  setNewRoom({ ...newRoom, room_location: value })
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
                value={newRoom.room_description}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, room_description: e.target.value })
                }
              />
            </div>
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
                !newRoom.name ||
                !newRoom.room_type ||
                !newRoom.room_location ||
                !newRoom.room_description
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
  room: RoomWithTimeslots;
  onViewDetails: () => void;
}) {
  const [showAllTimes, setShowAllTimes] = useState(false);

  return (
    <div className="bg-[#e9f0f5] rounded-lg p-5 pb-3 relative">
      <div className="mb-3">
        <h2 className="text-xl font-bold">{room.name}</h2>
        <div className="flex items-center text-gray-600">
          {getRoomTypeIcon(room.room_type)}
          <span>{room.room_type}</span>
        </div>
      </div>
      {/* Available Timeslots Preview */}
      <div className="mb-2 pt-4 pb-1">
        <p className="text-[15px] lg:text-[16px] md:text-[12px] text-primary-foreground font-semibold">
          Available Time
        </p>
        <div className={showAllTimes ? "grid grid-cols-3 gap-1" : "space-y-1"}>
          {(showAllTimes
            ? room.availableTimeslots
            : room.availableTimeslots?.slice(0, 2) || []
          ).map((time: any, i: number) => (
            <p
              key={i}
              className="text-primary-foreground text-[13px] lg:text-sm md:text-[11px] tracking-wider flex items-center gap-2"
            >
              <Clock className="w-4 h-4 text-[#274c77]" />
              {`${formatTimeTo12Hour(time.start_time)} - ${formatTimeTo12Hour(time.end_time)}`}
            </p>
          ))}
        </div>
        {room.availableTimeslots && room.availableTimeslots.length > 2 && (
          <button
            onClick={() => setShowAllTimes(!showAllTimes)}
            className="bg-primary text-black rounded-full p-1 w-6 h-3 mt-[2px] flex items-center justify-center"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="text-right mt-2">
        <Button
          variant="outline"
          className="bg-blue-400 hover:bg-blue-500 text-white border-none"
          onClick={onViewDetails}
        >
          View Room Details
        </Button>
      </div>
    </div>
  );
}
