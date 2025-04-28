"use client";

import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import { useParams } from "next/navigation";
import { roomData } from "@/app/roomData";
import Link from "next/link";

const ReservationDetails = () => {
  const [reservationInputEnabled, setReservationInputEnabled] = useState(false);
  const [othersInputEnabled, setOthersInputEnabled] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const params = useParams();
  const roomId = params.roomId;
  const decodedRoomId =
    typeof roomId === "string" ? decodeURIComponent(roomId) : "";
  const room = roomData.find((room) => room.id === decodedRoomId);

  if (!room) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-bold text-red-500">Room not found</h1>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <section className="flex justify-center py-12 lg:px-4 md:px-[58px] px-8">
        <div className="w-full max-w-5xl space-y-6">
          {/* Breadcrumb */}
          <p className="text-sm text-muted-foreground w-full px-6 max-w-5xl">
            <span
              className="text-[#274c77] hover:underline cursor-pointer"
              onClick={() => history.back()}
            >
              Available Rooms
            </span>{" "}
            &gt;{" "}
            <span
              className="text-[#274c77] hover:underline cursor-pointer"
              onClick={() => history.back()}
            >
              {room.id}
            </span>{" "}
            &gt; Reservation Form
          </p>

          <form className="flex flex-col items-center gap-6 px-5">
            <div className="border-[#B9B9B9] border-[1px] rounded-lg p-2 pl-6 w-full max-w-5xl">
              <h1 className="text-[32px] font-bold text-[#274c77]">
                Reservation Details
              </h1>
            </div>

            {/* Contact Details */}
            <div className="w-full max-w-5xl space-y-4 border-[#B9B9B9] border-[1px] rounded-lg pb-8 shadow-md">
              <div className="bg-secondary rounded-t-lg py-5 px-10">
                <h2 className="text-[25px] font-semibold">Contact Details</h2>
              </div>
              <p className="text-sm px-10 py-2">
                We will use these details for your reservation information.
              </p>
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 px-10">
                {/* Contact Name */}
                <div>
                  <label className="text-[16px] font-medium">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    className="border-[1px] border-[#B9B9B9] rounded-md p-[1px] w-full"
                  />
                  <p className="text-[12px] text-gray-400 mt-[2px]">
                    Enter your name (First name, Last name)
                  </p>
                </div>

                {/* Email Address */}
                <div>
                  <label className="text-[16px] font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="border-[1px] border-[#B9B9B9] rounded-md p-[1px] w-full"
                  />
                  <p className="text-[12px] text-gray-400 mt-[2px]">
                    Enter your email address
                  </p>
                </div>
              </div>

              {/* Contact Number, Role, and Course/Department/Organization */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 px-10">
                {/* Left Column: Contact Number and Role */}
                <div className="grid grid-cols-2 gap-x-4">
                  {/* Contact Number */}
                  <div>
                    <label className="text-[16px] font-medium">
                      Contact Number
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value="+63"
                        readOnly
                        className="border-[1px] border-[#B9B9B9] rounded-md p-[1px] w-[70px] bg-gray-100 text-center"
                      />
                      <input
                        type="text"
                        className="border-[1px] border-[#B9B9B9] rounded-md p-[1px] w-full"
                      />
                    </div>
                    <p className="text-[12px] text-gray-400 mt-[2px]">
                      Enter your contact number
                    </p>
                  </div>

                  {/* Role */}
                  <div>
                    <label className="text-[16px] font-medium">Role</label>
                    <select
                      className="border-[1px] border-[#B9B9B9] rounded-md p-[1px] w-full"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select your role
                      </option>
                      <option value="Student">Student</option>
                      <option value="Faculty">Faculty</option>
                    </select>
                    <p className="text-[12px] text-gray-400 mt-[2px]">
                      Select your role
                    </p>
                  </div>
                </div>

                {/* Right Column: Course/Department/Organization */}
                <div>
                  <label className="text-[16px] font-medium">
                    Course/Department/Organization
                  </label>
                  <input
                    type="text"
                    className="border-[1px] border-[#B9B9B9] rounded-md p-[1px] w-full"
                  />
                  <p className="text-[12px] text-gray-400 mt-[2px]">
                    Enter your current affiliation (e.g., if Student, enter your
                    course)
                  </p>
                </div>
              </div>
            </div>

            {/* Request for Job Order */}
            <div className="w-full max-w-5xl space-y-4 border-[#B9B9B9] border-[1px] rounded-lg pb-8 shadow-md">
              <div className="bg-secondary rounded-t-lg py-5 px-10">
                <h2 className="text-[25px] font-semibold">
                  Request for Job Order
                </h2>
              </div>
              <p className="text-sm px-10 py-2">
                Ensure the information displayed is correct.
              </p>
              <div className="border-[#B9B9B9] border-[1px] px-12 py-8 rounded-lg max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-[4px]">
                  <input
                    type="text"
                    value={room?.id || ""}
                    readOnly
                    className="border rounded p-2 w-full bg-gray-100"
                  />
                  <input
                    type="text"
                    value={room?.floor || ""}
                    readOnly
                    className="border rounded p-2 w-full bg-gray-100"
                  />
                  <input
                    type="text"
                    placeholder="Type"
                    className="border rounded p-2 w-full"
                  />
                  <input
                    type="date"
                    placeholder="Date of Reservation"
                    className="border rounded p-2 w-full"
                  />
                  <input
                    type="time"
                    placeholder="Start Time"
                    className="border rounded p-2 w-full"
                  />
                  <input
                    type="time"
                    placeholder="End Time"
                    className="border rounded p-2 w-full"
                  />
                </div>
              </div>

              <div className="border-[#B9B9B9] border-[1px] px-12 py-8 rounded-lg max-w-4xl mx-auto">
                {/* Nature of Work */}
                <div className="flex flex-col gap-2 px-[4px]">
                  {/* Reservation/Set-up of Room/Space */}
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="reservationCheckbox"
                      className="border rounded p-2"
                      onChange={(e) =>
                        setReservationInputEnabled(e.target.checked)
                      }
                    />
                    <span>Reservation/Set-up of:</span>
                    <select
                      className="border-[1px] border-[#B9B9B9] rounded-sm p-[1px] w-full max-w-[300px] text-sm"
                      disabled={!reservationInputEnabled}
                      value={selectedOption} // Controlled value
                      onChange={(e) => setSelectedOption(e.target.value)} // Update state on change
                    >
                      <option value="" disabled>
                        Select an option
                      </option>
                      <option value="Event">Event</option>
                      <option value="Meeting">Meeting</option>
                      <option value="Recognition">Recognition</option>
                    </select>
                  </label>

                  {/* Repairs */}
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value="Repairs"
                      className="border rounded p-2"
                    />
                    <span>Repairs</span>
                  </label>

                  {/* Activity/Program */}
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value="Activity/Program"
                      className="border rounded p-2"
                    />
                    <span>Activity/Program</span>
                  </label>

                  {/* Others */}
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="othersCheckbox"
                      className="p-[1px]"
                      onChange={(e) => setOthersInputEnabled(e.target.checked)}
                    />
                    <span>Others/Purpose:</span>
                    <input
                      type="text"
                      placeholder=""
                      className="border-[1px] border-[#B9B9B9] rounded-sm py-[1px] w-full max-w-[300px] text-sm"
                      disabled={!othersInputEnabled}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between w-full max-w-5xl">
              <Link href={`/components/AvailableRooms`}>
                <button
                  type="button"
                  className="bg-red-500 text-white font-medium px-4 py-[10px] rounded-[50px]"
                >
                  Cancel
                </button>
              </Link>
              <Link href={`/rooms/${roomId}/reserve/page2`}>
                <button
                  type="button"
                  className="bg-blue-500 text-white font-medium px-4 py-[10px] rounded-[50px]"
                >
                  Submit for Approval
                </button>
              </Link>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default ReservationDetails;
