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
  const [selectedCheckbox, setSelectedCheckbox] = useState<string | null>(null);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  interface FormErrors {
    contactName?: boolean;
    email?: boolean;
    contactNumber?: boolean;
    role?: boolean;
    course?: boolean;
    time?: boolean;
    type?: boolean;
    dateOfReservation?: boolean;
    natureOfWork?: boolean;
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
    let hasErrors = false;

    // Reset errors
    setFormErrors({});
    setErrorMessages([]);

    // Validate Contact Name
    const contactName = document.querySelector(
      'input[type="text"][placeholder="Enter your name"]',
    ) as HTMLInputElement;
    if (!contactName?.value.trim()) {
      errors.contactName = true;
      hasErrors = true;
    }

    // Validate Email Address
    const email = document.querySelector(
      'input[type="email"]',
    ) as HTMLInputElement;
    if (!email?.value.trim()) {
      errors.email = true;
      hasErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(email.value)) {
      errors.email = true;
      hasErrors = true;
    }

    // Validate Contact Number
    const contactNumber = document.querySelector(
      'input[type="text"][placeholder="Enter your number"]',
    ) as HTMLInputElement;
    if (!contactNumber?.value.trim()) {
      errors.contactNumber = true;
      hasErrors = true;
    }

    // Validate Role
    if (!selectedOption) {
      errors.role = true;
      hasErrors = true;
    }

    // Validate Course/Department/Organization
    const course = document.querySelector(
      'input[type="text"][placeholder="Enter your current affiliation"]',
    ) as HTMLInputElement;
    if (!course?.value.trim()) {
      errors.course = true;
      hasErrors = true;
    }

    // Validate Start and End Times
    if (!startTime || !endTime) {
      errors.time = true;
      hasErrors = true;
    }

    // Validate Job Order Section
    const type = document.querySelector(
      'input[type="text"][placeholder="Type of Reservation – Event, Seminar, etc"]',
    ) as HTMLInputElement;
    if (!type?.value.trim()) {
      errors.type = true;
      hasErrors = true;
    }

    const dateOfReservation = document.querySelector(
      'input[type="date"]',
    ) as HTMLInputElement;
    if (!dateOfReservation?.value.trim()) {
      errors.dateOfReservation = true;
      hasErrors = true;
    }

    // Validate Nature of Work Checkboxes
    if (!selectedCheckbox) {
      errors.natureOfWork = true;
      hasErrors = true;
    }

    // Set errors and error messages
    setFormErrors(errors);
    setErrorMessages(
      hasErrors
        ? ["Insufficient information, please fill up the form properly."]
        : [],
    );

    return !hasErrors;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission behavior

    if (validateForm()) {
      // If the form is valid, navigate to the next page
      window.location.href = `/rooms/${encodeURIComponent(room?.id)}/reserve/page2`;
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
            {/* Error Messages Box */}
            {errorMessages.length > 0 && (
              <div className="bg-red-100 border border-red-500 text-red-700 text-sm w-full px-4 py-2 rounded mb-2">
                <p>{errorMessages[0]}</p>
              </div>
            )}

            <div className="border-[#B9B9B9] border-[1px] my-[-10px] rounded-lg p-2 pl-6 w-full max-w-5xl">
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
                    {formErrors.contactName && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  <input
                    type="text"
                    className="border-[1px] border-[#B9B9B9] rounded-md px-2 p-[1px] w-full"
                  />
                  <p className="text-[13px] text-gray-500 pt-[2px]">
                    Enter your name (First Name, Last Name)
                  </p>
                </div>

                {/* Email Address */}
                <div>
                  <label className="text-[16px] font-medium">
                    Email Address
                    {formErrors.email && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  <input
                    type="email"
                    className="border-[1px] border-[#B9B9B9] rounded-md px-2 p-[1px] w-full"
                  />
                  <p className="text-[13px] text-gray-500 pt-[2px]">
                    Enter your email address
                  </p>
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
                      {formErrors.contactNumber && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
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
                        className="border-[1px] border-[#B9B9B9] rounded-md p-[1px] px-2 w-[200px]"
                      />
                    </div>
                    <p className="text-[13px] text-gray-500 pt-[2px] w-[200px]">
                      Enter your contact number
                    </p>
                  </div>

                  {/* Role */}
                  <div>
                    <label className="text-[16px] font-medium">
                      Role
                      {formErrors.role && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <select
                      className="border-[1px] border-[#B9B9B9] rounded-md p-[2px] px-2 w-full"
                      value={selectedOption}
                      onChange={(e) => setSelectedOption(e.target.value)}
                    >
                      <option value="" disabled hidden></option>{" "}
                      {/* Empty default option */}
                      <option value="Student">Student</option>
                      <option value="Faculty">Professor</option>
                      <option value="Faculty">Outsider</option>
                    </select>
                    <p className="text-[13px] text-gray-500 pt-[2px]">
                      Select a role
                    </p>
                  </div>
                </div>

                {/* Right Column: Course/Department/Organization */}
                <div>
                  <label className="text-[16px] font-medium">
                    Course/Department/Organization
                    {formErrors.course && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  <input
                    type="text"
                    className="border-[1px] border-[#B9B9B9] rounded-md p-[1px] px-2 w-full"
                  />
                  <p className="text-[13px] text-gray-500 pt-[2px]">
                    Enter your affiliation
                  </p>
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
                      {formErrors.type && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <input
                      type="text"
                      className="border-[1px] border-[#B9B9B9] rounded-md px-2 p-[1px] w-full"
                    />
                    <p className="text-[13px] text-gray-500 pt-[2px]">
                      Type of reservation
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">
                      Date of Reservation
                      {formErrors.dateOfReservation && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <input
                      type="date"
                      className="border-[1px] border-[#B9B9B9] rounded-md px-2 p-[1px] w-[180px]"
                    />
                  </div>
                  {/* Time Section in a Box */}
                  <div className="md:col-span-2">
                    <div className="border border-gray-300 rounded p-2 px-3 justify-center flex flex-col md:flex-row gap-x-4">
                      {/* Start Time */}
                      <div className="flex flex-col w-full md:w-1/2">
                        <label className="text-sm font-medium block mb-1">
                          Start Time
                          {formErrors.time && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
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
                          {formErrors.time && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
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
                  {formErrors.natureOfWork && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </legend>
                <div className="flex flex-col gap-1">
                  {/* Reservation/Set-up */}
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value="Reservation/Set-up"
                      checked={selectedCheckbox === "Reservation/Set-up"}
                      onChange={(e) =>
                        setSelectedCheckbox(
                          e.target.checked ? "Reservation/Set-up" : null,
                        )
                      }
                      className="h-4 w-4"
                    />
                    <span>Reservation/Set-up of:</span>
                    <select
                      className="border border-[#B9B9B9] rounded p-[1px] w-full max-w-[250px] text-sm"
                      disabled={selectedCheckbox !== "Reservation/Set-up"}
                      value={selectedOption}
                      onChange={(e) => setSelectedOption(e.target.value)}
                    >
                      <option value="" disabled>
                        Select an option
                      </option>
                      <option value="Room/Space">A. Room/Space</option>
                      <option value="Equipment">
                        B. Equipment (LCD, Sound System, etc.)
                      </option>
                      <option value="Transportation">
                        C. Vehicle Rental/Means of Transportation
                      </option>
                    </select>
                  </label>

                  {/* Repairs */}
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value="Repairs"
                      checked={selectedCheckbox === "Repairs"}
                      onChange={(e) =>
                        setSelectedCheckbox(e.target.checked ? "Repairs" : null)
                      }
                      className="h-4 w-4"
                    />
                    <span>Repairs</span>
                  </label>

                  {/* Activity/Program */}
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value="Activity/Program"
                      checked={selectedCheckbox === "Activity/Program"}
                      onChange={(e) =>
                        setSelectedCheckbox(
                          e.target.checked ? "Activity/Program" : null,
                        )
                      }
                      className="h-4 w-4"
                    />
                    <span>Activity/Program</span>
                  </label>

                  {/* Others */}
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value="Others"
                      checked={selectedCheckbox === "Others"}
                      onChange={(e) =>
                        setSelectedCheckbox(e.target.checked ? "Others" : null)
                      }
                      className="h-4 w-4"
                    />
                    <span>Others/Purpose:</span>
                    <input
                      type="text"
                      className="border border-[#B9B9B9] rounded p-[1px] w-full max-w-[300px] text-sm"
                      disabled={selectedCheckbox !== "Others"}
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
