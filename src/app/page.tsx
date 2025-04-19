import Navbar from "@/app/components/Navbar";
import AvailableRooms from "@/app/components/AvailableRooms";
import { getUser } from "@/utils/supabase/server"; // Import your getUser function
import { redirect } from "next/navigation";

export default async function HomePage() {
  // Fetch the user from Supabase
  const user = await getUser();
  // If no user exists, redirect to login
  if (!user) {
    redirect("/login");
  }

  return (
    <main>
      <Navbar />
      <AvailableRooms />
    </main>
  );
}
