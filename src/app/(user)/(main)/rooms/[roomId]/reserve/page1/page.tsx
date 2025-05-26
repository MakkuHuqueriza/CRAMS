"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation"; // Add useRouter import
import { roomData } from "@/app/roomData";
import { Field, Form, Formik, useFormikContext } from "formik";
import * as Yup from "yup";
import { createReservation } from "@/actions/users"; // Import the server action

type TimePeriodSelectorProps = {
  timeFieldName: string;
  periodFieldName: string;
};

type ReservationFormValues = {
  contactName: string;
  email: string;
  contactNumber: string;
  role: string;
  course: string;
  type: string;
  dateOfReservation: string;
  startTime: string;
  startPeriod: string;
  endTime: string;
  endPeriod: string;
  natureOfWork: string;
  reservationOptions?: string[];
  otherPurpose?: string;
};

// Helper function to convert time to minutes for comparison
const timeToMinutes = (time: string, period: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  let totalHours = hours;

  if (period === "PM" && hours !== 12) {
    totalHours += 12;
  } else if (period === "AM" && hours === 12) {
    totalHours = 0;
  }

  return totalHours * 60 + minutes;
};

// Time Period Component to handle the AM/PM logic
const TimePeriodSelector = ({
  timeFieldName,
  periodFieldName,
}: TimePeriodSelectorProps) => {
  const { values, setFieldValue } = useFormikContext<ReservationFormValues>();
  const selectedTime = values[
    timeFieldName as keyof ReservationFormValues
  ] as string;

  useEffect(() => {
    if (selectedTime) {
      // For times 1,2,3,4,5,6,12 - only PM allowed
      if (
        [
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
          "12:00",
          "12:30",
        ].includes(selectedTime)
      ) {
        setFieldValue(periodFieldName, "PM");
      }
      // For times 8,9,10,11 - only AM allowed
      else if (
        [
          "08:00",
          "08:30",
          "09:00",
          "09:30",
          "10:00",
          "10:30",
          "11:00",
          "11:30",
        ].includes(selectedTime)
      ) {
        setFieldValue(periodFieldName, "AM");
      }
      // For 7:00 and 7:30 - user can choose AM or PM (don't force)
    }
  }, [selectedTime, setFieldValue, periodFieldName]);

  // Determine available options based on selected time
  const getAvailableOptions = () => {
    if (!selectedTime) return ["AM", "PM"];

    // Times that can only be PM
    if (
      [
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
        "12:00",
        "12:30",
      ].includes(selectedTime)
    ) {
      return ["PM"];
    }
    // Times that can only be AM
    else if (
      [
        "08:00",
        "08:30",
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
      ].includes(selectedTime)
    ) {
      return ["AM"];
    }
    // Times that can be either (7:00, 7:30)
    else {
      return ["AM", "PM"];
    }
  };

  const availableOptions = getAvailableOptions();

  return (
    <Field
      name={periodFieldName}
      as="select"
      className="border rounded p-1 text-sm w-[60px]"
    >
      {availableOptions.map((period) => (
        <option key={period} value={period}>
          {period}
        </option>
      ))}
    </Field>
  );
};

const ReservationDetails = () => {
  const params = useParams();
  const router = useRouter();
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

  const validationSchema = Yup.object({
    contactName: Yup.string().required("Contact Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    contactNumber: Yup.string()
      .matches(/^9\d{9}$/, "Contact Number must start with 9")
      .required("Contact Number is required"),
    role: Yup.string().required("Role is required"),
    course: Yup.string().required("Course/Department/Organization is required"),
    type: Yup.string().required("Type is required"),
    dateOfReservation: Yup.string()
      .required("Date of Reservation is required")
      .test("valid-date", "Select a valid date", (value) => {
        if (!value) return false;
        const date = new Date(value);
        if (isNaN(date.getTime())) return false;
        const year = date.getFullYear();
        // Only allow years between 2024 and 2100
        return year >= 2024 && year <= 2100;
      })
      .test(
        "not-in-past",
        "Date of Reservation cannot be in the past",
        (value) => {
          if (!value) return false;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const date = new Date(value);
          return date >= today;
        },
      ),
    startTime: Yup.string().required("Start Time is required"),
    startPeriod: Yup.string().required("Start Period is required"),
    endTime: Yup.string().required("End Time is required"),
    endPeriod: Yup.string().required("End Period is required"),
    natureOfWork: Yup.string().required("Nature of Work is required"),
    reservationOptions: Yup.array().when("natureOfWork", {
      is: "Reservation/Set-up",
      then: (schema) => schema.min(1, "Select at least one option"),
      otherwise: (schema) => schema.notRequired(),
    }),
    otherPurpose: Yup.string().when("natureOfWork", {
      is: "Others",
      then: (schema) => schema.required("Please specify your purpose"),
      otherwise: (schema) => schema.notRequired(),
    }),
  }).test("time-interval", "Invalid time interval", function (values) {
    const { startTime, startPeriod, endTime, endPeriod } = values;

    if (!startTime || !startPeriod || !endTime || !endPeriod) {
      return true; // Let individual field validation handle missing values
    }

    const startMinutes = timeToMinutes(startTime, startPeriod);
    const endMinutes = timeToMinutes(endTime, endPeriod);

    // Check if start time is before end time
    if (startMinutes >= endMinutes) {
      return this.createError({
        path: "endTime",
        message: "End time must be after start time",
      });
    }

    // Check if times are within allowed range (7 AM to 7 PM)
    const earliestTime = timeToMinutes("07:00", "AM"); // 7 AM
    const latestTime = timeToMinutes("07:00", "PM"); // 7 PM

    if (startMinutes < earliestTime || startMinutes > latestTime) {
      return this.createError({
        path: "startTime",
        message: "Start time must be between 7:00 AM and 7:00 PM",
      });
    }

    if (endMinutes < earliestTime || endMinutes > latestTime) {
      return this.createError({
        path: "endTime",
        message: "End time must be between 7:00 AM and 7:00 PM",
      });
    }

    return true;
  });

  // Modified handleSubmit with client-side navigation
  const handleSubmit = async (values: ReservationFormValues) => {
    try {
      // Format start and end times with periods (AM/PM)
      const startTimeFormatted = `${values.startTime} ${values.startPeriod}`;
      const endTimeFormatted = `${values.endTime} ${values.endPeriod}`;

      // Create FormData object to send to the server action
      const formData = new FormData();
      formData.append("name", values.contactName);
      formData.append("email_address", values.email);
      formData.append("contact_number", values.contactNumber);
      formData.append("role", values.role);
      formData.append("course", values.course);
      formData.append("date_requested", values.dateOfReservation);
      formData.append("start_time", startTimeFormatted);
      formData.append("end_time", endTimeFormatted);
      formData.append("room_id", room.id);
      formData.append("room_location", room.floor || "");
      formData.append("type", values.type);
      formData.append("nature_of_work", values.natureOfWork);

      // Add optional fields if they exist
      if (
        values.natureOfWork === "Reservation/Set-up" &&
        values.reservationOptions
      ) {
        formData.append(
          "reservation_option",
          values.reservationOptions.join(",")
        );
      }

      if (values.natureOfWork === "Others" && values.otherPurpose) {
        formData.append("other_purpose", values.otherPurpose);
      }

      // Call the server action with the form data
      await createReservation(formData);

      // Handle navigation on client side
      router.push(`/rooms/${encodeURIComponent(room.id)}/reserve/page2/`);
    } catch (error) {
      console.error("Error submitting reservation:", error);
      alert(
        "An error occurred while submitting the reservation. Please try again.",
      );
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

  const initialValues = {
    contactName: "",
    email: "",
    contactNumber: "",
    role: "",
    course: "",
    type: "",
    dateOfReservation: "",
    startTime: "",
    startPeriod: "AM",
    endTime: "",
    endPeriod: "AM",
    natureOfWork: "",  // Changed from nature_of_work to match type
    reservationOptions: [],
    otherPurpose: "",
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Breadcrumb */}
      <p className="text-sm text-muted-foreground mb-6">
        <Link
          href="/"
          className="text-[#274c77] hover:underline cursor-pointer"
        >
          Available Rooms
        </Link>{" "}
        &gt;{" "}
        <Link
          href={`/rooms/${encodeURIComponent(room.id)}`}
          className="text-[#274c77] hover:underline cursor-pointer"
        >
          {room.id}
        </Link>{" "}
        &gt; Reservation Form
      </p>

      <Formik
        initialValues={{
          contactName: "",
          email: "",
          contactNumber: "",
          role: "",
          course: "",
          type: "",
          dateOfReservation: "",
          startTime: "",
          startPeriod: "AM",
          endTime: "",
          endPeriod: "AM",
          natureOfWork: "",  // Changed from nature_of_work to match type
          reservationOptions: [],
          otherPurpose: "",
        }}
        validationSchema={Yup.object().shape({
          contactName: Yup.string().required("Name is required"),
          email: Yup.string()
            .email("Invalid email")
            .required("Email is required"),
          contactNumber: Yup.string()
            .matches(/^[0-9]+$/, "Must be only digits")
            .min(10, "Must be exactly 10 digits")
            .max(10, "Must be exactly 10 digits")
            .required("Contact number is required"),
          role: Yup.string().required("Role is required"),
          course: Yup.string().required("Course/Department is required"),
          type: Yup.string().required("Type is required"),
          dateOfReservation: Yup.string().required("Date is required"),
          startTime: Yup.string().required("Start time is required"),
          endTime: Yup.string().required("End time is required"),
          natureOfWork: Yup.string().required("Nature of work is required"),  // Changed from nature_of_work
          reservationOptions: Yup.array().when("natureOfWork", {  // Changed from nature_of_work
            is: "Reservation/Set-up",
            then: (schema) => schema.min(1, "Select at least one option"),
            otherwise: (schema) => schema.notRequired(),
          }),
          otherPurpose: Yup.string().when("natureOfWork", {  // Changed from nature_of_work
            is: "Others",
            then: (schema) => schema.required("Please specify your purpose"),
            otherwise: (schema) => schema.notRequired(),
          }),
        })}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form className="flex flex-col items-center gap-6 pb-10">
            {/* Error Messages Box */}
            {Object.keys(errors).length > 0 && (
              <div className="bg-red-100 border border-red-500 text-red-700 text-sm w-full px-4 py-3 rounded mb-2">
                <p>
                  Complete the missing information indicated by the asterisk (*)
                </p>
                {errors.endTime &&
                  typeof errors.endTime === "string" &&
                  errors.endTime.includes(
                    "End time must be after start time",
                  ) && <p className="mt-1">• {errors.endTime}</p>}
                {errors.startTime &&
                  typeof errors.startTime === "string" &&
                  errors.startTime.includes("between 7:00 AM and 7:00 PM") && (
                    <p className="mt-1">• {errors.startTime}</p>
                  )}
                {errors.endTime &&
                  typeof errors.endTime === "string" &&
                  errors.endTime.includes("between 7:00 AM and 7:00 PM") && (
                    <p className="mt-1">• {errors.endTime}</p>
                  )}
              </div>
            )}

            <div className="border-[#B9B9B9] border-[1px] rounded-lg py-2 px-6 w-full">
              <h1 className="text-[23px] md:text-[32px] font-bold text-[#274c77]">
                Reservation Details
              </h1>
            </div>

            {/* Contact Details */}
            <div className="w-full space-y-4 border-[#B9B9B9] border-[1px] rounded-lg pb-8 shadow-md">
              <div className="bg-[#e7edf1] rounded-t-lg py-4 px-6">
                <h2 className="text-[20px] md:text-[24px] font-semibold">
                  Contact Details
                </h2>
              </div>
              <p className="text-sm px-6 py-2">
                We will use these details for your reservation information.
              </p>

              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 px-6">
                {/* Contact Name */}
                <div>
                  <label className="text-[14px] md:text-[16px] font-medium">
                    Contact Name
                    {errors.contactName && touched.contactName && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  <Field
                    name="contactName"
                    type="text"
                    className="border-[1px] border-[#B9B9B9] rounded-md px-3 py-2 w-full mt-1 focus:ring-2 focus:ring-[#274c77]/20 focus:outline-none transition-shadow h-9"
                  />
                  <p className="text-[11px] md:text-[13px] text-gray-500 mt-1">
                    Enter your name (First Name, Last Name)
                  </p>
                </div>

                {/* Email Address */}
                <div>
                  <label className="text-[14px] md:text-[16px] font-medium">
                    Email Address
                    {errors.email && touched.email && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  <Field
                    name="email"
                    type="email"
                    className="border-[1px] border-[#B9B9B9] rounded-md px-3 py-2 w-full mt-1 focus:ring-2 focus:ring-[#274c77]/20 focus:outline-none transition-shadow h-9"
                  />
                  <p className="text-[11px] md:text-[13px] text-gray-500 mt-1">
                    Enter your email address
                  </p>
                </div>
              </div>

              {/* Contact Number and Role */}
              <div className="w-full px-6">
                {/* Desktop Layout */}
                <div className="hidden lg:flex gap-6">
                  {/* Left Column */}
                  <div className="flex gap-4 flex-1">
                    {/* Contact Number */}
                    <div className="flex-[0.6]">
                      <label className="text-[14px] md:text-[16px] font-medium">
                        Contact Number
                        {errors.contactNumber && touched.contactNumber && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="border-[1px] border-[#B9B9B9] rounded-md py-[7px] w-[65px] bg-gray-100 text-center text-sm h-9">
                          <p className="text-[15px] text-gray-800">+63</p>
                        </div>
                        <Field
                          name="contactNumber"
                          type="text"
                          className="border-[1px] border-[#B9B9B9] rounded-md py-2 px-3 flex-1 focus:ring-2 focus:ring-[#274c77]/20 focus:outline-none transition-shadow h-9"
                          maxLength={10}
                          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                            e.target.value = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 10);
                          }}
                        />
                      </div>
                      {touched.contactNumber && errors.contactNumber && (
                        <div className="text-red-500 text-xs mt-1">
                          {errors.contactNumber}
                        </div>
                      )}
                      <p className="text-[11px] md:text-[13px] text-gray-500 mt-1">
                        Enter your contact number
                      </p>
                    </div>

                    {/* Role */}
                    <div className="flex-[0.4]">
                      <label className="text-[14px] md:text-[16px] font-medium">
                        Role
                        {errors.role && touched.role && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      <Field
                        name="role"
                        className="border-[1px] border-[#B9B9B9] rounded-md py-2 px-3 w-full mt-1 focus:ring-2 focus:ring-[#274c77]/20 focus:outline-none transition-shadow h-9"
                        as="select"
                      >
                        <option value="" disabled hidden>
                          Select
                        </option>
                        <option value="Student">Student</option>
                        <option value="Faculty">Faculty</option>
                        <option value="Outsider">Outsider</option>
                      </Field>
                      <p className="text-[11px] md:text-[13px] text-gray-500 mt-1">
                        Select a role
                      </p>
                    </div>
                  </div>

                  {/* Course/Department/Organization */}
                  <div className="flex-1">
                    <label className="text-[14px] md:text-[16px] font-medium">
                      Course/Department/Organization
                      {errors.course && touched.course && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <Field
                      name="course"
                      type="text"
                      className="border-[1px] border-[#B9B9B9] rounded-md py-2 px-3 w-full mt-1 focus:ring-2 focus:ring-[#274c77]/20 focus:outline-none transition-shadow h-9"
                    />
                    <p className="text-[11px] md:text-[13px] text-gray-500 mt-1">
                      Enter your affiliation
                    </p>
                  </div>
                </div>

                {/* Mobile/Tablet Layout */}
                <div className="lg:hidden space-y-4">
                  {/* Contact Number */}
                  <div>
                    <label className="text-[14px] md:text-[16px] font-medium">
                      Contact Number
                      {errors.contactNumber && touched.contactNumber && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="border-[1px] border-[#B9B9B9] rounded-md py-[7px] w-[50px] md:w-[65px] bg-gray-100 text-center text-sm h-9">
                        <p className="text-[13px] md:text-[15px] text-gray-800">
                          +63
                        </p>
                      </div>
                      <Field
                        name="contactNumber"
                        type="text"
                        className="border-[1px] border-[#B9B9B9] rounded-md py-2 px-3 flex-1 focus:ring-2 focus:ring-[#274c77]/20 focus:outline-none transition-shadow h-9"
                        maxLength={10}
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                          e.target.value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10);
                        }}
                      />
                    </div>
                    {touched.contactNumber && errors.contactNumber && (
                      <div className="text-red-500 text-xs mt-1">
                        {errors.contactNumber}
                      </div>
                    )}
                    <p className="text-[11px] md:text-[13px] text-gray-500 mt-1">
                      Enter your contact number
                    </p>
                  </div>

                  {/* Role and Course in same row for tablet, separate for mobile */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Role */}
                    <div>
                      <label className="text-[14px] md:text-[16px] font-medium">
                        Role
                        {errors.role && touched.role && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      <Field
                        name="role"
                        className="border-[1px] border-[#B9B9B9] rounded-md py-2 px-3 w-full mt-1 focus:ring-2 focus:ring-[#274c77]/20 focus:outline-none transition-shadow h-9"
                        as="select"
                      >
                        <option value="" disabled hidden>
                          Select
                        </option>
                        <option value="Student">Student</option>
                        <option value="Faculty">Faculty</option>
                        <option value="Outsider">Outsider</option>
                      </Field>
                      <p className="text-[11px] md:text-[13px] text-gray-500 mt-1">
                        Select a role
                      </p>
                    </div>

                    {/* Course/Department/Organization */}
                    <div>
                      <label className="text-[14px] md:text-[16px] font-medium">
                        Course/Department/Organization
                        {errors.course && touched.course && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      <Field
                        name="course"
                        type="text"
                        className="border-[1px] border-[#B9B9B9] rounded-md py-2 px-3 w-full mt-1 focus:ring-2 focus:ring-[#274c77]/20 focus:outline-none transition-shadow h-9"
                      />
                      <p className="text-[11px] md:text-[13px] text-gray-500 mt-1">
                        Enter your affiliation
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Request for Job Order */}
            <div className="w-full border border-[#B9B9B9] rounded-lg shadow-md">
              <div className="bg-[#e7edf1] rounded-t-lg py-4 px-6">
                <h2 className="text-[20px] md:text-[24px] font-semibold">
                  Request for Job Order
                </h2>
              </div>
              <p className="text-sm px-6 py-4">
                Ensure the information displayed is correct.
              </p>

              {/* PARTICULARS */}
              <fieldset className="border border-[#B9B9B9] rounded-lg px-4 md:px-6 py-4 pb-6 mx-6 mb-8 relative">
                <legend className="text-[16px] md:text-[18px] font-bold px-2 text-[#274C77]">
                  PARTICULARS
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-6 gap-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">
                      Room to Reserve
                    </label>
                    <input
                      type="text"
                      value={room?.id || ""}
                      readOnly
                      className="border-[1px] border-[#B9B9B9] text-gray-500 rounded-md px-3 w-full bg-gray-100 h-9"
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
                      className="border-[1px] border-[#B9B9B9] text-gray-500 rounded-md px-3 w-full bg-gray-100 h-9"
                    />
                  </div>
                  <div className="md:col-span-2 lg:col-span-1">
                    <label className="text-sm font-medium block mb-1">
                      Type
                      {errors.type && touched.type && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <Field
                      name="type"
                      type="text"
                      className="border-[1px] border-[#B9B9B9] rounded-md px-3 w-full focus:ring-2 focus:ring-[#274c77]/20 focus:outline-none transition-shadow h-9"
                    />
                    <p className="text-[11px] md:text-[13px] text-gray-500 mt-1">
                      Type of reservation - Event, Seminar, etc.
                    </p>
                  </div>
                  <div className="md:col-span-2 lg:col-span-1">
                    <label className="text-sm font-medium block mb-1">
                      Date of Reservation
                      {errors.dateOfReservation &&
                        touched.dateOfReservation && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                    </label>
                    <Field
                      name="dateOfReservation"
                      type="date"
                      max="2100-12-31"
                      className="border-[1px] border-[#B9B9B9] rounded-md px-3 w-full focus:ring-2 focus:ring-[#274c77]/20 focus:outline-none transition-shadow h-9"
                    />
                    {touched.dateOfReservation && errors.dateOfReservation && (
                      <div className="text-red-500 text-xs mt-1">
                        {errors.dateOfReservation}
                      </div>
                    )}
                  </div>
                  {/* Time Section in a Box */}
                  <div className="md:col-span-2">
                    <div className="border border-gray-300 rounded p-3 px-4 flex flex-col md:flex-row gap-4">
                      {/* Start Time */}
                      <div className="flex flex-col w-full md:w-1/2">
                        <label className="text-sm font-medium block mb-1">
                          Start Time
                          {errors.startTime && touched.startTime && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </label>
                        <div className="flex gap-2">
                          <Field
                            name="startTime"
                            as="select"
                            className="w-[80px] border rounded px-2 text-sm focus:ring-2 focus:ring-[#274c77]/20 focus:outline-none transition-shadow h-9"
                          >
                            <option value="" disabled>
                              00:00
                            </option>
                            {timeOptions.map((time) => (
                              <option key={`start-${time}`} value={time}>
                                {time}
                              </option>
                            ))}
                          </Field>
                          <TimePeriodSelector
                            timeFieldName="startTime"
                            periodFieldName="startPeriod"
                          />
                        </div>
                      </div>

                      {/* End Time */}
                      <div className="flex flex-col w-full md:w-1/2">
                        <label className="text-sm font-medium block mb-1">
                          End Time
                          {errors.endTime && touched.endTime && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </label>
                        <div className="flex gap-2">
                          <Field
                            name="endTime"
                            as="select"
                            className="w-[80px] border rounded px-2 text-sm focus:ring-2 focus:ring-[#274c77]/20 focus:outline-none transition-shadow h-9"
                          >
                            <option value="" disabled>
                              00:00
                            </option>
                            {timeOptions.map((time) => (
                              <option key={`end-${time}`} value={time}>
                                {time}
                              </option>
                            ))}
                          </Field>
                          <TimePeriodSelector
                            timeFieldName="endTime"
                            periodFieldName="endPeriod"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* NATURE OF WORK */}
              <fieldset className="border border-[#B9B9B9] rounded-lg px-4 md:px-6 py-4 pb-6 mx-6 mb-10 relative">
                <legend className="text-[16px] md:text-[18px] font-bold px-2 text-[#274C77]">
                  NATURE OF WORK
                  {errors.natureOfWork && touched.natureOfWork && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </legend>
                <div className="flex flex-col gap-3">
                  {/* Reservation/Set-up options as radio buttons */}
                  <div>
                    <span className="font-medium mb-2 block">
                      Reservation/Set-up of:
                    </span>
                    <div className="ml-6 flex flex-col gap-2">
                      <label className="flex items-center gap-2">
                        <Field
                          type="radio"
                          name="natureOfWork"  // Changed from nature_of_work
                          value="Room/Space"
                          className="h-4 w-4"
                        />
                        <span>Room/Space</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <Field
                          type="radio"
                          name="natureOfWork"  // Changed from nature_of_work
                          value="Equipment"
                          className="h-4 w-4"
                        />
                        <span>Equipment (LCD, Sound System, etc.)</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <Field
                          type="radio"
                          name="natureOfWork"  // Changed from nature_of_work
                          value="Transportation"
                          className="h-4 w-4"
                        />
                        <span>Vehicle Rental/Means of Transportation</span>
                      </label>
                    </div>
                  </div>

                  {/* Repairs */}
                  <div className="flex items-center gap-2">
                    <Field
                      type="radio"
                      value="Repairs"
                      name="natureOfWork"  // Changed from nature_of_work
                      className="h-4 w-4"
                    />
                    <span>Repairs</span>
                  </div>

                  {/* Activity/Program */}
                  <div className="flex items-center gap-2">
                    <Field
                      type="radio"
                      value="Activity/Program"
                      name="natureOfWork"  // Changed from nature_of_work
                      className="h-4 w-4"
                    />
                    <span>Activity/Program</span>
                  </div>

                  {/* Others */}
                  <div className="flex items-start gap-2">
                    <Field
                      type="radio"
                      value="Others"
                      name="natureOfWork"  // Changed from nature_of_work
                      className="h-4 w-4 mt-1"
                    />
                    <div className="flex flex-col gap-2">
                      <span>Others/Purpose:</span>
                      {values.natureOfWork === "Others" && (
                        <Field
                          type="text"
                          name="otherPurpose"
                          className="border border-[#B9B9B9] rounded px-2 py-1 w-[300px] text-sm focus:ring-2 focus:ring-[#274c77]/20 focus:outline-none transition-shadow h-9"
                          placeholder="Please specify"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row justify-between w-full gap-4 mt-1">
              <button
                type="button"
                className="bg-[#780D29] text-white font-medium px-6 py-[10px] rounded-[50px] transition-transform transform hover:scale-[1.03] order-2 md:order-1"
                onClick={() => router.back()}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#274C77] text-white font-medium px-6 py-[10px] rounded-[50px] transition-transform transform hover:scale-[1.03] order-1 md:order-2"
                onClick={() =>
                  router.push(
                    `/rooms/${encodeURIComponent(room?.id ?? decodedRoomId)}/reserve/page2`
                  )
            }
              >
                Submit for Approval
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ReservationDetails;
