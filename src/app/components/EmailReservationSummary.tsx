import * as React from "react";

interface EmailReservationSummaryProps {
  name: string;
  email: string;
  contact_number: string;
  role: string;
  course: string;
  room_id: string;
  room_location: string;
  type: string;
  date: string;
  start_time: string;
  end_time: string;
  nature_of_work: string;
  others_purpose?: string;
}

export const EmailTemplate: React.FC<EmailReservationSummaryProps> = ({
  name,
  email,
  contact_number,
  role,
  course,
  room_id,
  room_location,
  type,
  date,
  start_time,
  end_time,
  nature_of_work,
  others_purpose,
}) => (
  <div>
    <h2>Reservation Summary</h2>
    <ul>
      <li><strong>Name:</strong> {name}</li>
      <li><strong>Email:</strong> {email}</li>
      <li><strong>Contact Number:</strong> {contact_number}</li>
      <li><strong>Role:</strong> {role}</li>
      <li><strong>Course/Department:</strong> {course}</li>
      <li><strong>Room:</strong> {room_id}</li>
      <li><strong>Location:</strong> {room_location}</li>
      <li><strong>Type:</strong> {type}</li>
      <li><strong>Date:</strong> {date}</li>
      <li><strong>Time:</strong> {start_time} - {end_time}</li>
      <li><strong>Nature of Work:</strong> {nature_of_work}</li>
      {others_purpose && <li><strong>Other Purpose:</strong> {others_purpose}</li>}
    </ul>
    <p>Please wait for an email confirmation if your reservation is accepted or not</p>
  </div>
);

export default EmailTemplate;
