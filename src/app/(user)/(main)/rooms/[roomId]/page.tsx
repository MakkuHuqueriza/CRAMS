import { getAllRooms, getAllTimeslots } from "@/actions/users";
import RoomDetails from "@/app/components/RoomDetails";

export default async function RoomInfo() {
  const roomData = await getAllRooms();
  const roomTimes = await getAllTimeslots();

  return <RoomDetails roomDetails={roomData} roomTimes={roomTimes} />;
}
