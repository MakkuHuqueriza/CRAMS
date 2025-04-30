"use client";

import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import { useParams } from "next/navigation";
import { roomData } from "@/app/roomData";

const ReservationDetails = () => {
  const [reservationInputEnabled, setReservationInputEnabled] = useState(false);
  const [othersInputEnabled, setOthersInputEnabled] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [startTime, setStartTime] = useState("");
  const [startPeriod, setStartPeriod] = useState("AM");
  const [endTime, setEndTime] = useState("");
  const [endPeriod, setEndPeriod] = useState("AM");
  interface FormErrors {
    contactName?: string;
    email?: string;
    contactNumber?: string;
    role?: string;
    course?: string;
    time?: string;
  }

  const [formErrors, setFormErrors] = useState<FormErrors>({});

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

  const validateForm = () => {
    const errors: FormErrors = {};

    // Validate Contact Name
    const contactName = document.querySelector(
      'input[type="text"][placeholder="Enter your name"]',
    ) as HTMLInputElement;
    if (!contactName?.value.trim()) {
      errors.contactName = "Contact Name is required.";
    }

    // Validate Email Address
    const email = document.querySelector(
      'input[type="email"]',
    ) as HTMLInputElement;
    if (!email?.value.trim()) {
      errors.email = "Email Address is required.";
    } else if (!/\S+@\S+\.\S+/.test(email.value)) {
      errors.email = "Invalid email address.";
    }

    // Validate Contact Number
    const contactNumber = document.querySelector(
      'input[type="text"][placeholder="Enter your number"]',
    ) as HTMLInputElement;
    if (!contactNumber?.value.trim()) {
      errors.contactNumber = "Contact Number is required.";
    }

    // Validate Role
    if (!selectedOption) {
      errors.role = "Role is required.";
    }

    // Validate Course/Department/Organization
    const course = document.querySelector(
      'input[type="text"][placeholder="Enter your current affiliation"]',
    ) as HTMLInputElement;
    if (!course?.value.trim()) {
      errors.course = "Course/Department/Organization is required.";
    }

    // Validate Start and End Times
    const startHour = parseInt(startTime.split(":")[0], 10);
    const endHour = parseInt(endTime.split(":")[0], 10);
    const startMinutes = parseInt(startTime.split(":")[1], 10);
    const endMinutes = parseInt(endTime.split(":")[1], 10);

    if (!startTime || !endTime) {
      errors.time = "Start Time and End Time are required.";
    } else if (
      startHour < 7 ||
      (startHour === 7 && startMinutes < 0) ||
      endHour > 7 + 12 ||
      (endHour === 7 + 12 && endMinutes > 0)
    ) {
      errors.time = "Time must be between 7:00 AM and 7:00 PM.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Form submitted successfully!");
    }
  };

  const timeOptions = [
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "01:00",
    "01:30",
    "02:00",
    "02:30",
    "03:00",
    "03:30",
    "04:00",
    "04:30",
    "05:00",
    "05:30",
    "06:00",
    "06:30",
  ];
  const periodOptions = ["AM", "PM"];

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
          <form
            className="flex flex-col items-center gap-6 px-5"
            onSubmit={handleSubmit}
          >
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
                    placeholder="Enter your name"
                    className="border-[1px] border-[#B9B9B9] rounded-md px-2 p-[1px] w-full"
                  />
                  {formErrors.contactName && (
                    <p className="text-red-500 text-sm">
                      {formErrors.contactName}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="text-[16px] font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="border-[1px] border-[#B9B9B9] rounded-md px-2 p-[1px] w-full"
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-sm">{formErrors.email}</p>
                  )}
                </div>
              </div>

              {/* Contact Number, Role, and Course/Department/Organization */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 px-10">
                {/* Left Column: Contact Number and Role */}
                <div className="grid grid-cols-2 gap-x-[140px]">
                  {/* Contact Number */}
                  <div>
                    <label className="text-[16px] font-medium">
                      Contact Number
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value="+63"
                        readOnly
                        className="border-[1px] border-[#B9B9B9] rounded-md p-[1px] w-[65px] bg-gray-100 text-center"
                      />
                      <input
                        type="text"
                        placeholder="Enter your number"
                        className="border-[1px] border-[#B9B9B9] rounded-md p-[1px] px-2 w-[200px]"
                      />
                    </div>
                    {formErrors.contactNumber && (
                      <p className="text-red-500 text-sm">
                        {formErrors.contactNumber}
                      </p>
                    )}
                  </div>

                  {/* Role */}
                  <div>
                    <label className="text-[16px] font-medium">Role</label>
                    <select
                      className="border-[1px] border-[#B9B9B9] rounded-md p-[2px] px-2 w-full"
                      value={selectedOption}
                      onChange={(e) => setSelectedOption(e.target.value)}
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      <option value="Student">Student</option>
                      <option value="Faculty">Faculty</option>
                    </select>
                    {formErrors.role && (
                      <p className="text-red-500 text-sm">{formErrors.role}</p>
                    )}
                  </div>
                </div>

                {/* Right Column: Course/Department/Organization */}
                <div>
                  <label className="text-[16px] font-medium">
                    Course/Department/Organization
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your current affiliation"
                    className="border-[1px] border-[#B9B9B9] rounded-md p-[1px] px-2 w-full"
                  />
                  {formErrors.course && (
                    <p className="text-red-500 text-sm">{formErrors.course}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Request for Job Order */}
            <div className="w-full max-w-5xl border border-[#B9B9B9] rounded-lg shadow-md">
              <div className="bg-secondary rounded-t-lg py-5 px-10">
                <h2 className="text-[25px] font-semibold">
                  Request for Job Order
                </h2>
              </div>
              <p className="text-sm px-10 py-4">
                Ensure the information displayed is correct.
              </p>

              {/* PARTICULARS */}
              <fieldset className="border border-[#B9B9B9] rounded-lg px-6 py-4 pb-6 mx-10 mb-8 relative">
                <legend className="text-[18px] font-bold px-2 text-[#274C77]">
                  PARTICULARS
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-3">
                  <div>
                    <label className="text-sm font-medium block mb-1">
                      Room to Reserve
                    </label>
                    <input
                      type="text"
                      value={room?.id || ""}
                      readOnly
                      className="border-[1px] border-[#B9B9B9] text-gray-500 rounded-md p-[1px] w-full px-2 bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">
                      Location/Building
                    </label>
                    <input
                      type="text"
                      value={room?.floor || ""}
                      readOnly
                      className="border-[1px] border-[#B9B9B9] text-gray-500 rounded-md p-[1px] px-2 w-full bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">
                      Type
                    </label>
                    <input
                      type="text"
                      className="border-[1px] border-[#B9B9B9] rounded-md px-2 p-[1px] w-full"
                    />
                    <p className="text-[12px] text-gray-400 mt-[2px]">
                      Type of Reservation – Event, Seminar, etc
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">
                      Date of Reservation
                    </label>
                    <input
                      type="date"
                      className="border-[1px] border-[#B9B9B9] rounded-md px-2 p-[1px] w-[180px]"
                    />
                  </div>
                  {/* Time Section in a Box */}
                  <div className="md:col-span-2 grid md:grid-cols-2">
                    <div className="border border-gray-300 rounded p-2 px-3 justify-center flex flex-col md:flex-row gap-x-4">
                      {/* Start Time */}
                      <div className="flex flex-col w-full md:w-1/2">
                        <label className="text-sm font-medium block mb-1">
                          Start Time
                        </label>
                        <div className="flex gap-1">
                          <select
                            className="w-[70px] border rounded px-1 py-[2px] text-sm"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                          >
                            <option value="" disabled>
                              00:00
                            </option>
                            {timeOptions.map((time) => (
                              <option key={`start-${time}`} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                          <select
                            className="border rounded p-1 text-sm w-[60px]"
                            value={startPeriod}
                            onChange={(e) => setStartPeriod(e.target.value)}
                          >
                            {periodOptions.map((period) => (
                              <option key={`start-${period}`} value={period}>
                                {period}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* End Time */}
                      <div className="flex flex-col w-full md:w-1/2">
                        <label className="text-sm font-medium block mb-1">
                          End Time
                        </label>
                        <div className="flex gap-1">
                          <select
                            className="w-[70px] border rounded px-1 py-[2px] text-sm"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                          >
                            <option value="" disabled>
                              00:00
                            </option>
                            {timeOptions.map((time) => (
                              <option key={`end-${time}`} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                          <select
                            className="border rounded p-1 text-sm w-[60px]"
                            value={endPeriod}
                            onChange={(e) => setEndPeriod(e.target.value)}
                          >
                            {periodOptions.map((period) => (
                              <option key={`end-${period}`} value={period}>
                                {period}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* NATURE OF WORK */}
              <fieldset className="border border-[#B9B9B9] rounded-lg px-6 py-4 pb-6 mx-10 mb-10 relative">
                <legend className="text-[18px] font-bold px-2 text-[#274C77]">
                  NATURE OF WORK
                </legend>
                <div className="flex flex-col gap-1">
                  {/* Reservation/Set-up */}
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="reservationCheckbox"
                      className="h-4 w-4"
                      onChange={(e) =>
                        setReservationInputEnabled(e.target.checked)
                      }
                    />
                    <span>Reservation/Set-up of:</span>
                    <select
                      className="border border-[#B9B9B9] rounded p-[1px] w-full max-w-[250px] text-sm"
                      disabled={!reservationInputEnabled}
                      value={selectedOption}
                      onChange={(e) => setSelectedOption(e.target.value)}
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
                      className="h-4 w-4"
                    />
                    <span>Repairs</span>
                  </label>

                  {/* Activity/Program */}
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value="Activity/Program"
                      className="h-4 w-4"
                    />
                    <span>Activity/Program</span>
                  </label>

                  {/* Others */}
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="othersCheckbox"
                      className="h-4 w-4"
                      onChange={(e) => setOthersInputEnabled(e.target.checked)}
                    />
                    <span>Others/Purpose:</span>
                    <input
                      type="text"
                      className="border border-[#B9B9B9] rounded p-[1px] w-full max-w-[300px] text-sm"
                      disabled={!othersInputEnabled}
                    />
                  </label>
                </div>
              </fieldset>
            </div>

            {/* Buttons */}
            <div className="flex justify-between w-full max-w-5xl">
              <button
                type="button"
                className="bg-[#780D29] text-white font-medium px-4 py-[10px] rounded-[50px] transition-transform transform hover:scale-[1.03]"
                onClick={() => history.back()}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#274C77] text-white font-medium px-4 py-[10px] rounded-[50px] transition-transform transform hover:scale-[1.03]"
              >
                Submit for Approval
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default ReservationDetails;
