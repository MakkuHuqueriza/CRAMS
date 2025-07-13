import * as React from "react";

interface EmailReservationSummaryProps {
  reservation: {
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
}

const AcceptEmailTemplate: React.FC<EmailReservationSummaryProps> = ({ reservation }) => (
  <div>
    <h2 style={{ color: "green" }}>Your Reservation is ACCEPTED</h2>
    <p>
      Congratulations! Your reservation has been accepted. Here are the details:
    </p>
    <ul>
      <li><strong>Name:</strong> {reservation.name}</li>
      <li><strong>Email:</strong> {reservation.email}</li>
      <li><strong>Contact Number:</strong> {reservation.contact_number}</li>
      <li><strong>Role:</strong> {reservation.role}</li>
      <li><strong>Course/Department:</strong> {reservation.course}</li>
      <li><strong>Room:</strong> {reservation.room_id}</li>
      <li><strong>Location:</strong> {reservation.room_location}</li>
      <li><strong>Type:</strong> {reservation.type}</li>
      <li><strong>Date:</strong> {reservation.date}</li>
      <li><strong>Time:</strong> {reservation.start_time} - {reservation.end_time}</li>
      <li><strong>Nature of Work:</strong> {reservation.nature_of_work}</li>
      {reservation.others_purpose && <li><strong>Other Purpose:</strong> {reservation.others_purpose}</li>}
    </ul>
    <p>
      Please arrive on time and bring any necessary documents or identification. If you have questions, contact the admin.
    </p>
  </div>
);

export default AcceptEmailTemplate;