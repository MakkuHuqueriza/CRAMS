import Navbar from "@/app/components/Navbar";
import AvailableRooms from "@/app/components/AvailableRooms/page";
import { getUser } from "@/utils/supabase/server";

export default async function HomePage() {
  const user = await getUser();

  const name = user?.user_metadata.full_name;
  const avatar_url = user?.user_metadata.avatar_url;
  const email = user?.user_metadata.email;

  return (
    <main>
      <Navbar name={name} avatar_url={avatar_url} email={email} />
      <AvailableRooms roomDetails={[]} roomTimes={[]} />
    </main>
  );
}
