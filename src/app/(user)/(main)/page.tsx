import AvailableRooms from "@/app/components/AvailableRooms";
import Hero from "@/app/components/Hero";
import { getAllRooms, getAllTimeslots } from "@/actions/users";

export default async function HomePage() {
  const roomDetails = await getAllRooms();
  const roomTimes = await getAllTimeslots();

  return (
    <section>
      <Hero />
      <AvailableRooms roomDetails={roomDetails} roomTimes={roomTimes} />
    </section>
  );
}
