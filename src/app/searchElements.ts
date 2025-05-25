export type AvailableTime = {
  availableTime: string;
};

export type RoomCapacity = {
  roomCapacity: string;
};

export type RoomFloors = {
  roomFloors: string;
};

export const roomFloors: RoomFloors[] = [
  { roomFloors: "Floor 1" },
  { roomFloors: "Floor 2" },
  { roomFloors: "All Floors" },
];

export const availableTime: AvailableTime[] = [
  { availableTime: "7:00 AM" },
  { availableTime: "7:30 AM" },
  { availableTime: "8:00 AM" },
  { availableTime: "8:30 AM" },
  { availableTime: "9:00 AM" },
  { availableTime: "9:30 AM" },
  { availableTime: "10:00 AM" },
  { availableTime: "10:30 AM" },
  { availableTime: "11:00 AM" },
  { availableTime: "11:30 AM" },
  { availableTime: "12:00 PM" },
  { availableTime: "12:30 PM" },
  { availableTime: "1:00 PM" },
  { availableTime: "1:30 PM" },
  { availableTime: "2:00 PM" },
  { availableTime: "2:30 PM" },
  { availableTime: "3:00 PM" },
  { availableTime: "3:30 PM" },
  { availableTime: "4:00 PM" },
  { availableTime: "4:30 PM" },
  { availableTime: "5:00 PM" },
  { availableTime: "5:30 PM" },
  { availableTime: "6:00 PM" },
  { availableTime: "6:30 PM" },
  { availableTime: "7:00 PM" },
];

export const roomCapacity: RoomCapacity[] = [
  { roomCapacity: "15" },
  { roomCapacity: "20" },
  { roomCapacity: "25" },
  { roomCapacity: "30" },
  { roomCapacity: "35" },
  { roomCapacity: "40" },
  { roomCapacity: "45" },
  { roomCapacity: "50" },
];
