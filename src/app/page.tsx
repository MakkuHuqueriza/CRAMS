import Navbar from "@/app/components/Navbar";
import AvailableRooms from "@/app/components/AvailableRooms";

export default async function HomePage() {
  return (
    <main>
      <Navbar />
      <AvailableRooms />
    </main>
  );
}
