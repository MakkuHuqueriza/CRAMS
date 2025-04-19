import Navbar from "@/app/components/Navbar";
import AvailableRooms from "@/app/components/AvailableRooms";
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> 1ebcc56 (feat: available rooms)
import { getUser } from "@/utils/supabase/server"; // Import your getUser function
import { redirect } from "next/navigation";
>>>>>>> 7a26ef5 (feat: available rooms)

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <AvailableRooms />
    </main>
  );
}
