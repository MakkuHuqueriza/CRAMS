interface Room {
  id: string;
  name: string;
  room_type: string;
  room_location: string;
  capacity: number;
  room_description: string;
  availableTimeslots: Timeslot[];
}

interface Timeslot {
  id: string;
  start_time: string;
  end_time: string;
}

interface AvailableRoomsProps {
  roomDetails: Room[];
}

type HeroProps = {
  onSearch?: (formData: FormData) => void;
};

export type { Room, Timeslot, AvailableRoomsProps, HeroProps };
