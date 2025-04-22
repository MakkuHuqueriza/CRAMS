export type Room = {
  name: string;
  type: string;
  floor: string;
  capacity: number;
  image: string;
  times: string[];
};

export const roomData: Room[] = [
  {
    name: "ROOM 102",
    type: "DBSES LABORATORY ROOM",
    floor: "1st Floor, CSM",
    capacity: 50,
    image: "/room_sample.png",
    times: ["10:00 AM – 11:00 PM", "11:30 AM – 12:30 PM"],
  },
  {
    name: "ROOM 105",
    type: "LECTURE ROOM",
    floor: "1st Floor, CSM",
    capacity: 50,
    image: "/room_sample.png",
    times: ["10:00 AM – 11:00 PM", "11:30 AM – 12:30 PM"],
  },
  {
    name: "ROOM 108",
    type: "DBSES LABORATORY ROOM",
    floor: "1st Floor, CSM",
    capacity: 50,
    image: "/room_sample.png",
    times: ["10:00 AM – 11:00 PM", "11:30 AM – 12:30 PM"],
  },
  {
    name: "ROOM 112",
    type: "LECTURE ROOM",
    floor: "1st Floor, CSM",
    capacity: 50,
    image: "/room_sample.png",
    times: ["10:00 AM – 11:00 PM", "11:30 AM – 12:30 PM"],
  },
  {
    name: "ROOM 132",
    type: "DFSC LABORATORY ROOM",
    floor: "1st Floor, CSM",
    capacity: 50,
    image: "/room_sample.png",
    times: ["10:00 AM – 11:00 PM", "11:30 AM – 12:30 PM"],
  },
  {
    name: "ROOM 227",
    type: "LECTURE ROOM/AUDITORIUM",
    floor: "2nd Floor, CSM",
    capacity: 50,
    image: "/room_sample.png",
    times: ["10:00 AM – 11:00 PM", "11:30 AM – 12:30 PM"],
  },
  {
    name: "ROOM 225A",
    type: "DMPCS LABORATORY ROOM",
    floor: "2nd Floor, CSM",
    capacity: 50,
    image: "/room_sample.png",
    times: ["10:00 AM – 11:00 PM", "11:30 AM – 12:30 PM"],
  },
  {
    name: "ROOM 221",
    type: "DBSES LABORATORY ROOM",
    floor: "2nd Floor, CSM",
    capacity: 50,
    image: "/room_sample.png",
    times: ["10:00 AM – 11:00 PM", "11:30 AM – 12:30 PM"],
  },
  {
    name: "ROOM 223",
    type: "DFSC LABORATORY ROOM",
    floor: "2nd Floor, CSM",
    capacity: 50,
    image: "/room_sample.png",
    times: ["10:00 AM – 11:00 PM", "11:30 AM – 12:30 PM"],
  },
  {
    name: "ROOM 222",
    type: "LECTURE ROOM",
    floor: "2nd Floor, CSM",
    capacity: 50,
    image: "/room_sample.png",
    times: ["10:00 AM – 11:00 PM", "11:30 AM – 12:30 PM"],
  },
];
