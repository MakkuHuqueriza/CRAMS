import AvailableRooms from "@/app/components/AvailableRooms";
import Hero from "@/app/components/Hero";
import { getUser } from "@/utils/supabase/server";
import { getAllRooms, getAllTimeslots } from "@/actions/users";

export default async function HomePage() {

  const roomDetails = await getAllRooms();
  const roomTimes = await getAllTimeslots();

  return (
    <main>
      <Hero />
      <AvailableRooms roomDetails={roomDetails} roomTimes={roomTimes} />
    </main>
  );
}
