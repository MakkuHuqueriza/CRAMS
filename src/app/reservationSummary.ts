// mock data for reservation summary
export interface ContactDetails {
  name: string;
  email: string;
  contactNumber: string;
  role: string;
  courseDeptOrg: string;
}

export interface JobOrder {
  room: string;
  locationBuilding: string;
  type: string;
  dateOfReservation: string;
  time: string;
  natureOfWork: string;
}

export interface Reservation {
  id: string;
  status: "Pending" | "Accepted" | "Rejected" | "Completed";
  contactDetails: ContactDetails;
  jobOrder: JobOrder;
}

// Mock reservation data
export const mockReservations: Reservation[] = [
  {
    id: "#111-69",
    status: "Pending",
    contactDetails: {
      name: "Makku Kuma",
      email: "makkukuma@g8.com",
      contactNumber: "+639462666969",
      role: "Student",
      courseDeptOrg: "BS Computer Science",
    },
    jobOrder: {
      room: "CSM 227",
      locationBuilding: "CSM, 2nd Floor",
      type: "Event",
      dateOfReservation: "04/13/2025",
      time: "12:00 AM - 2:00 PM",
      natureOfWork: "Reservation/Setup Room/Space",
    },
  },
  {
    id: "#111-70",
    status: "Accepted",
    contactDetails: {
      name: "Joditech Gabano",
      email: "joditech.com.ph.edu.org",
      contactNumber: "+639411234567",
      role: "Student",
      courseDeptOrg: "BS Computer Science",
    },
    jobOrder: {
      room: "CSM 228",
      locationBuilding: "CSM, 2nd Floor",
      type: "Event",
      dateOfReservation: "05/13/2025",
      time: "12:00 AM - 3:00 PM",
      natureOfWork: "Reservation/Setup Room/Space",
    },
  },
];
