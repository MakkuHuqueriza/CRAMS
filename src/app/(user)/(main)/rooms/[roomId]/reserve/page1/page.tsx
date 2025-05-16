"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { roomData } from "@/app/roomData";
import { Field, Form, Formik, useFormikContext } from "formik";
import * as Yup from "yup";

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
  reservationOption?: string;
  otherPurpose?: string;
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
      // For AM times (7:30-11:30), force AM
      if (
        [
          "07:30",
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
      // For PM times (12:00-6:30), force PM
      else if (
        [
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
        ].includes(selectedTime)
      ) {
        setFieldValue(periodFieldName, "PM");
      }
      // For 07:00, don't force either AM or PM - user can choose
    }
  }, [selectedTime, setFieldValue, periodFieldName]);

  // Determine if the time period is locked based on selected time (07:00 is NOT locked)
  const isLocked = [
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
  ].includes(selectedTime);

  return (
    <Field
      name={periodFieldName}
      as="select"
      className={`border rounded p-1 text-sm w-[60px] ${isLocked ? "bg-gray-100" : ""}`}
      disabled={isLocked}
    >
      {["AM", "PM"].map((period) => {
        // Disable PM option for morning times (except 07:00)
        if (
          period === "PM" &&
          [
            "07:30",
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
          return (
            <option key={period} value={period} disabled>
              {period}
            </option>
          );
        }
        // Disable AM option for afternoon times
        else if (
          period === "AM" &&
          [
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
          ].includes(selectedTime)
        ) {
          return (
            <option key={period} value={period} disabled>
              {period}
            </option>
          );
        }
        return (
          <option key={period} value={period}>
            {period}
          </option>
        );
      })}
    </Field>
  );
};

const ReservationDetails = () => {
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

  const validationSchema = Yup.object({
    contactName: Yup.string().required("Contact Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    contactNumber: Yup.string()
      .matches(/^\d{10}$/, "Contact Number must be 10 digits")
      .required("Contact Number is required"),
    role: Yup.string().required("Role is required"),
    course: Yup.string().required("Course/Department/Organization is required"),
    type: Yup.string().required("Type is required"),
    dateOfReservation: Yup.date().required("Date of Reservation is required"),
    startTime: Yup.string().required("Start Time is required"),
    startPeriod: Yup.string().required("Start Period is required"),
    endTime: Yup.string().required("End Time is required"),
    endPeriod: Yup.string().required("End Period is required"),
    natureOfWork: Yup.string().required("Nature of Work is required"),
    reservationOption: Yup.string().when("natureofWork", {
      is: (val: string) => val === "Reservation/Set-up",
      then: (schema) =>
        schema.required("Please select the reason from the choices"),
      otherwise: (schema) => schema.notRequired(),
    }),
    otherPurpose: Yup.string().when("natureOfWork", {
      is: (val: string) => val === "Others",
      then: (schema) => schema.required("Please describe your purpose"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const handleSubmit = (values: ReservationFormValues) => {
    // If the form is valid, navigate to the next page
    alert(JSON.stringify(values, null, 2));

    window.location.href = `/rooms/${encodeURIComponent(room?.id)}/reserve/page2`;
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
    natureOfWork: "",
    reservationOption: "",
    otherPurpose: "",
  };

  return (
    <>
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
        </div>
      </section>

      <Formik<ReservationFormValues>
        enableReinitialize
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({ values, errors }) => (
          <Form className="flex flex-col items-center gap-6 px-5">
            {/* Error Messages Box */}
            {Object.keys(errors).length > 0 && (
              <div className="bg-red-100 border border-red-500 text-red-700 text-sm w-full px-4 py-2 rounded mb-2">
                <p>{Object.values(errors)[0]}</p>{" "}
                {/* Display the first error message */}
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
                    {errors.contactName && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                    <Field
                      name="contactName"
                      type="text"
                      className="border-[1px] border-[#B9B9B9] rounded-md px-2 p-[1px] w-full"
                    ></Field>
                  </label>
                  <p className="text-[13px] text-gray-500 pt-[2px]">
                    Enter your name (First Name, Last Name)
                  </p>
                </div>

                {/* Email Address */}
                <div>
                  <label className="text-[16px] font-medium">
                    Email Address
                    {errors.email && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                    <Field
                      name="email"
                      type="email"
                      className="border-[1px] border-[#B9B9B9] rounded-md px-2 p-[1px] w-full"
                    ></Field>
                  </label>
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
                      {errors.contactNumber && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value="+63"
                          readOnly
                          className="border-[1px] border-[#B9B9B9] rounded-md p-[1px] w-[65px] bg-gray-100 text-center"
                        />
                        <Field
                          name="contactNumber"
                          type="text"
                          className="border-[1px] border-[#B9B9B9] rounded-md p-[1px] px-2 w-[200px]"
                        ></Field>
                      </div>
                    </label>
                    <p className="text-[13px] text-gray-500 pt-[2px] w-[200px]">
                      Enter your contact number
                    </p>
                  </div>

                  {/* Role */}
                  <div>
                    <label className="text-[16px] font-medium">
                      Role
                      {errors.role && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                      <Field
                        name="role"
                        className="border-[1px] border-[#B9B9B9] rounded-md p-[2px] px-2 w-full"
                        as="select"
                      >
                        <option value="" disabled hidden></option>
                        <option value="Student">Student</option>
                        <option value="Faculty">Professor</option>
                        <option value="Outsider">Outsider</option>
                      </Field>
                    </label>
                    <p className="text-[13px] text-gray-500 pt-[2px]">
                      Select a role
                    </p>
                  </div>
                </div>

                {/* Right Column: Course/Department/Organization */}
                <div>
                  <label className="text-[16px] font-medium">
                    Course/Department/Organization
                    {errors.course && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                    <Field
                      name="course"
                      type="text"
                      className="border-[1px] border-[#B9B9B9] rounded-md p-[1px] px-2 w-full"
                    ></Field>
                  </label>
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
                      {errors.type && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                      <Field
                        name="type"
                        type="text"
                        className="border-[1px] border-[#B9B9B9] rounded-md px-2 p-[1px] w-full"
                      ></Field>
                    </label>
                    <p className="text-[13px] text-gray-500 pt-[2px]">
                      Type of reservation
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">
                      Date of Reservation
                      {errors.dateOfReservation && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                      <Field
                        name="dateOfReservation"
                        type="date"
                        className="border-[1px] border-[#B9B9B9] rounded-md px-2 p-[1px] w-[180px]"
                      ></Field>
                    </label>
                  </div>
                  {/* Time Section in a Box */}
                  <div className="md:col-span-2">
                    <div className="border border-gray-300 rounded p-2 px-3 justify-center flex flex-col md:flex-row gap-x-4">
                      {/* Start Time */}
                      <div className="flex flex-col w-full md:w-1/2">
                        <label className="text-sm font-medium block mb-1">
                          Start Time
                          {errors.startTime && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                          <div className="flex gap-1">
                            <Field
                              name="startTime"
                              as="select"
                              className="w-[70px] border rounded px-1 py-[2px] text-sm"
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
                        </label>
                      </div>

                      {/* End Time */}
                      <div className="flex flex-col w-full md:w-1/2">
                        <label className="text-sm font-medium block mb-1">
                          End Time
                          {errors.endTime && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                          <div className="flex gap-1">
                            <Field
                              name="endTime"
                              as="select"
                              className="w-[70px] border rounded px-1 py-[2px] text-sm"
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
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* NATURE OF WORK */}
              <fieldset className="border border-[#B9B9B9] rounded-lg px-6 py-4 pb-6 mx-10 mb-10 relative">
                <legend className="text-[18px] font-bold px-2 text-[#274C77]">
                  NATURE OF WORK
                  {errors.natureOfWork && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </legend>
                <div className="flex flex-col gap-1">
                  <label className="flex items-center gap-2">
                    {/* Reservation/Set-up */}
                    <Field
                      type="radio"
                      name="natureOfWork"
                      value="Reservation/Set-up"
                      className="h-4 w-4"
                    />
                    <span>Reservation/Set-up of:</span>
                    {values.natureOfWork === "Reservation/Set-up" && (
                      <Field
                        as="select"
                        name="reservationOption"
                        className="border border-[#B9B9B9] rounded p-[1px] w-full max-w-[250px] text-sm"
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
                      </Field>
                    )}
                  </label>

                  {/* Repairs */}
                  <label className="flex items-center gap-2">
                    <Field
                      type="radio"
                      value="Repairs"
                      name="natureOfWork"
                      className="h-4 w-4"
                    />
                    <span>Repairs</span>
                  </label>

                  {/* Activity/Program */}
                  <label className="flex items-center gap-2">
                    <Field
                      type="radio"
                      value="Activity/Program"
                      name="natureOfWork"
                      className="h-4 w-4"
                    />
                    <span>Activity/Program</span>
                  </label>

                  {/* Others */}
                  <label className="flex items-center gap-2">
                    <Field
                      type="radio"
                      value="Others"
                      name="natureOfWork"
                      className="h-4 w-4"
                    />
                    <span>Others/Purpose:</span>
                  </label>
                  {values.natureOfWork === "Others" && (
                    <Field
                      type="text"
                      name="otherPurpose"
                      className="border border-[#B9B9B9] rounded p-[1px] w-full max-w-[300px] text-sm"
                      placeholder="Please specify"
                    />
                  )}
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
          </Form>
        )}
      </Formik>
    </>
  );
};

export default ReservationDetails;
