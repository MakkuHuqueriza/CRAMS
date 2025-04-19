import Navbar from "@/app/components/Navbar";
import AvailableRooms from "@/app/components/AvailableRooms";
<<<<<<< HEAD
=======
import { getUser } from "@/utils/supabase/server"; // Import your getUser function
import { redirect } from "next/navigation";
>>>>>>> d0168e8 (feat: available rooms)

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <AvailableRooms />
    </main>
  );
}
