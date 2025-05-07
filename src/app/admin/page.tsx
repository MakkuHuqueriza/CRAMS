import Sidebar from "@/app/admin/Sidebar";
// import HolidayList from "@/components/HolidayList";
// import { roomData } from "@/app/roomData";
import { Card } from "@/components/ui/card";

// const holidays2024 = [
//   { date: "08/21", day: "Wednesday", name: "Ninoy Aquino Day" },
//   { date: "08/26", day: "Monday", name: "National Heroes Day" },
//   { date: "09/01", day: "Friday", name: "All Saints Day" },
//   { date: "09/02", day: "Saturday", name: "Special Non-working Holiday" },
//   { date: "09/30", day: "Saturday", name: "Bonifacio Day" },
//   {
//     date: "12/08",
//     day: "Sunday",
//     name: "Feast of the Immaculate Conception of Mary",
//   },
//   { date: "12/24", day: "Tuesday", name: "Special Non-working Holiday" },
//   { date: "12/25", day: "Wednesday", name: "Christmas Day" },
//   { date: "12/30", day: "Monday", name: "Rizal Day" },
// ];

// const holidays2025 = [
//   { date: "01/01", day: "Wednesday", name: "New Year's Day" },
//   { date: "01/29", day: "Wednesday", name: "Lunar New Year" },
//   { date: "02/25", day: "Tuesday", name: "EDSA Anniversary" },
//   { date: "03/01", day: "Saturday", name: "Araw ng Dabaw" },
//   { date: "04/09", day: "Wednesday", name: "Day of Valor" },
//   { date: "04/17", day: "Thursday", name: "Maundy Thursday" },
//   { date: "04/18", day: "Friday", name: "Good Friday" },
//   { date: "05/01", day: "Thursday", name: "Labor Day" },
//   { date: "06/12", day: "Thursday", name: "Independence Day" },
// ];

export default function DashboardPage() {
  // const totalRooms = roomData.reduce((acc, room) => acc + (room.count || 0), 0);
  const pendingReservations = 5;

  const roomTypes = [
    { name: "Lecture Rooms", count: 69 },
    { name: "DMPCS Labs", count: 5 },
    { name: "DBSES Labs", count: 5 },
    { name: "DFSC Labs", count: 5 },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 bg-[#f5eeea] p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="flex flex-col md:flex-row flex-wrap gap-6 mb-6 w-full">
          <Card className="bg-white p-4 flex flex-col gap-2 w-full md:w-1/3">
            <h2 className="text-sm text-gray-500">New Reservations</h2>
            <p className="text-3xl font-bold text-black">
              {pendingReservations.toString().padStart(2, "0")}
            </p>
            <p className="text-sm text-gray-600">
              Check the management tab to see pending reservations that may
              require your attention.
            </p>
          </Card>

          <Card className="bg-white p-4 w-full md:w-2/3">
            <h2 className="text-sm text-gray-500 mb-4">Room Types</h2>
            <div className="flex space-x-2 mb-4">
              <div className="h-4 flex-1 bg-blue-300" />
              <div className="h-4 flex-1 bg-blue-500" />
              <div className="h-4 flex-1 bg-blue-700" />
              <div className="h-4 flex-1 bg-blue-900" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              {roomTypes.map((type, idx) => (
                <div key={idx}>
                  <p className="text-sm text-gray-500">{type.name}</p>
                  <p className="text-2xl font-bold">
                    {type.count.toString().padStart(2, "0")}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <HolidayList year={2024} holidays={holidays2024} />
          <HolidayList year={2025} holidays={holidays2025} />
        </div> */}
      </main>
    </div>
  );
}
