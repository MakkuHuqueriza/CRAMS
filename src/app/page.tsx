import Navbar from "@/app/components/Navbar";
import AvailableRooms from "@/app/components/AvailableRooms";
import { getUser } from "@/utils/supabase/server"; // Import your getUser function
import { redirect } from "next/navigation";

export default async function HomePage() {
  return (
    <main>
      <Navbar />
      <AvailableRooms />
    </main>
  );
}
