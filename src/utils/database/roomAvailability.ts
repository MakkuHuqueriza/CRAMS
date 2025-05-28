import { createClient } from "@/utils/supabase/client";
import type { ReservationWithRoom, Schedule } from "./types";

export interface RoomAvailability {
  available: boolean;
  conflicts: Array<{
    type: "reservation" | "schedule";
    start_time: string;
    end_time: string;
    class?: string | null;
  }>;
}

export async function checkRoomAvailability(
  room_id: string,
  date_requested: string,
  start_time: string,
  end_time: string,
  excludeReservationId?: string,
): Promise<RoomAvailability> {
  const supabase = createClient();

  // Convert time to minutes for comparison
  const toMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const new_start = toMinutes(start_time);
  const new_end = toMinutes(end_time);

  // Get day of week (0-6, Sunday-Saturday)
  const day_of_week = new Date(date_requested).toLocaleDateString("en-US", {
    weekday: "long",
  });

  // Fetch reservations and schedules in parallel
  const [{ data: reservations }, { data: schedules }] = await Promise.all([
    supabase
      .from("reservation")
      .select("id, start_time, end_time, status")
      .eq("room_id", room_id)
      .eq("date_requested", date_requested)
      .neq("id", excludeReservationId || ""),

    supabase
      .from("schedule")
      .select("id, start_time, end_time, class")
      .eq("room_id", room_id)
      .or(`day.eq.${day_of_week},day.is.null`),
  ]);

  const conflicts: RoomAvailability["conflicts"] = [];

  // Check reservation conflicts
  reservations?.forEach((reservation) => {
    const existing_start = toMinutes(reservation.start_time);
    const existing_end = toMinutes(reservation.end_time);

    if (
      (new_start >= existing_start && new_start < existing_end) ||
      (new_end > existing_start && new_end <= existing_end) ||
      (new_start <= existing_start && new_end >= existing_end)
    ) {
      conflicts.push({
        type: "reservation",
        start_time: reservation.start_time,
        end_time: reservation.end_time,
        class: `Reservation (${reservation.status})`,
      });
    }
  });

  // Check schedule conflicts
  schedules?.forEach((schedule) => {
    const existing_start = toMinutes(schedule.start_time);
    const existing_end = toMinutes(schedule.end_time);

    if (
      (new_start >= existing_start && new_start < existing_end) ||
      (new_end > existing_start && new_end <= existing_end) ||
      (new_start <= existing_start && new_end >= existing_end)
    ) {
      conflicts.push({
        type: "schedule",
        start_time: schedule.start_time,
        end_time: schedule.end_time,
        class: schedule.class || "Scheduled event",
      });
    }
  });

  return {
    available: conflicts.length === 0,
    conflicts,
  };
}

export async function getRoomSchedule(
  room_id: string,
  date: string,
): Promise<{
  reservations: ReservationWithRoom[];
  schedules: Schedule[];
}> {
  const supabase = createClient();
  const day_of_week = new Date(date).getDay();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const current_day = days[day_of_week];

  const [{ data: reservations }, { data: schedules }] = await Promise.all([
    supabase
      .from("reservation")
      .select<string, ReservationWithRoom>(
        `
                id, 
                user_id, 
                room_id, 
                name, 
                email_address, 
                contact_number, 
                role, 
                course, 
                date_requested, 
                start_time, 
                end_time, 
                status, 
                nature_of_work, 
                created_at,
                room:room_id (room_id, name, capacity, status, room_type, room_location)
            `,
      )
      .eq("room_id", room_id)
      .eq("date_requested", date)
      .order("start_time", { ascending: true }),

    supabase
      .from("schedule")
      .select<string, Schedule>(
        `
                id,
                room_id,
                created_at,
                start_time,
                end_time,
                day,
                class
            `,
      )
      .eq("room_id", room_id)
      .or(`day.eq.${current_day},day.is.null`)
      .order("start_time", { ascending: true }),
  ]);

  return {
    reservations: reservations || [],
    schedules: schedules || [],
  };
}
