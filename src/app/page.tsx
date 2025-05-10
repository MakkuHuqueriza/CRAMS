import Navbar from "@/app/components/Navbar";
import AvailableRooms from "@/app/components/AvailableRooms";
import Hero from "@/app/components/Hero";
import { getUser } from "@/utils/supabase/server";
import { getAllRooms, getAllTimeslots } from "@/actions/users";

export default async function HomePage() {
  const user = await getUser();

  const name = user?.user_metadata.full_name;
  const avatar_url = user?.user_metadata.avatar_url;
  const email = user?.user_metadata.email;

  const roomDetails = await getAllRooms();
  const roomTimes = await getAllTimeslots();

  return (
    <main>
      <Navbar name={name} avatar_url={avatar_url} email={email} />
      <Hero />
      <AvailableRooms roomDetails={roomDetails} roomTimes={roomTimes} />
    </main>
  );
}
