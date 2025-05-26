"use server";

import { createClient } from "@/utils/supabase/server";
import { handleError } from "@/lib/utils";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { format } from "date-fns";

export const loginAction = async (email: string, password: string) => {
  const { auth } = await createClient();

  const { error } = await auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    return handleError(error);
  }

  revalidatePath("/", "layout");
  redirect("/");
};

export const signUpAction = async (email: string, password: string) => {
  const { auth } = await createClient();

  const { error } = await auth.signUp({
    email,
    password,
  });
  if (error) {
    return handleError(error);
  }
  revalidatePath("/", "layout");
};

export const logoutAction = async () => {
  const { auth } = await createClient();

  const { error } = await auth.signOut();

  if (error) {
    return handleError(error);
  }

  redirect("/login");
};

export const signInWithGoogle = async () => {
  const { auth } = await createClient();
  const originUrl = (await headers()).get("origin");

  const { data, error } = await auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${originUrl}/auth/callback`,
    },
  });

  if (error) {
    return handleError(error);
  }

  if (data.url) {
    redirect(data.url);
  }
};

export const resetPasswordAction = async (FormData: FormData) => {
  const email = FormData.get("email") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    return handleError(error);
  }
};

export const updatePasswordAction = async (FormData: FormData) => {
  const password = FormData.get("new_password") as string;

  const { auth } = await createClient();

  const { error } = await auth.updateUser({ password });
  if (error) {
    return handleError(error);
  }
};

export const getAllRoomsWithTimeslots = async () => {
  const supabase = await createClient();

  // Fetch all rooms
  const { data: rooms, error: roomError } = await supabase
    .from("room")
    .select("*")
    .order("name", { ascending: true });

  if (roomError) {
    console.error("Error fetching rooms:", roomError);
    return [];
  }

  // Fetch all timeslots
  const { data: timeslots, error: timeslotError } = await supabase
    .from("schedule")
    .select("*")
    .order("start_time", { ascending: true });

  if (timeslotError) {
    console.error("Error fetching timeslots:", timeslotError);
    return [];
  }

  const reservations = await getAllReservations();

  // get the current date in YYYY-MM-DD format
  const currentDate = format(new Date(), "yyyy-MM-dd");

  // Filter out reservations for the current date
  const reservationsForToday = reservations.filter((reservation) => {
    return reservation.date_requested === currentDate;
  });

  function get30MinIntervals(start: string, end: string): string[] {
    const intervals: string[] = [];
    let [h, m] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);

    while (h < endH || (h === endH && m < endM)) {
      const hourStr = h.toString().padStart(2, "0");
      const minStr = m.toString().padStart(2, "0");
      intervals.push(`${hourStr}:${minStr}:00`);
      m += 30;
      if (m >= 60) {
        m = 0;
        h += 1;
      }
    }
    return intervals;
  }

  const roomsWithAvailableTimeslots = rooms.map((room) => {
    // Get all reservations for this room for today
    const roomReservations = reservationsForToday.filter(
      (reservation) => reservation.room_id === room.room_id,
    );

    // Collect all booked 30-min intervals for this room
    let bookedIntervals: string[] = [];
    roomReservations.forEach((res) => {
      bookedIntervals = bookedIntervals.concat(
        get30MinIntervals(res.start_time, res.end_time),
      );
    });

    // Filter out timeslots that are booked (by start_time)
    const availableTimeslots = timeslots.filter(
      (slot) => !bookedIntervals.includes(slot.start_time),
    );

    return {
      ...room,
      availableTimeslots,
    };
  });

  return roomsWithAvailableTimeslots;
};

export const getAllRoomsWithTimeslotsInEachRoom = async (date?: string) => {
  const supabase = await createClient();

  // Fetch all rooms
  const { data: rooms, error: roomError } = await supabase
    .from("room")
    .select("*")
    .order("name", { ascending: true });

  if (roomError) {
    console.error("Error fetching rooms:", roomError);
    return [];
  }

  // Fetch all timeslots
  const { data: timeslots, error: timeslotError } = await supabase
    .from("schedule")
    .select("*")
    .order("start_time", { ascending: true });

  if (timeslotError) {
    console.error("Error fetching timeslots:", timeslotError);
    return [];
  }

  const reservations = await getAllReservations();

  const currentDate = date;

  console.log("Current Date:", currentDate);

  // Filter out reservations for the current date
  const reservationsForToday = reservations.filter((reservation) => {
    return reservation.date_requested === currentDate;
  });

  function get30MinIntervals(start: string, end: string): string[] {
    const intervals: string[] = [];
    let [h, m] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);

    while (h < endH || (h === endH && m < endM)) {
      const hourStr = h.toString().padStart(2, "0");
      const minStr = m.toString().padStart(2, "0");
      intervals.push(`${hourStr}:${minStr}:00`);
      m += 30;
      if (m >= 60) {
        m = 0;
        h += 1;
      }
    }
    return intervals;
  }

  const roomsWithAvailableTimeslots = rooms.map((room) => {
    // Get all reservations for this room for today
    const roomReservations = reservationsForToday.filter(
      (reservation) => reservation.room_id === room.room_id,
    );

    // Collect all booked 30-min intervals for this room
    let bookedIntervals: string[] = [];
    roomReservations.forEach((res) => {
      bookedIntervals = bookedIntervals.concat(
        get30MinIntervals(res.start_time, res.end_time),
      );
    });

    // Filter out timeslots that are booked (by start_time)
    const availableTimeslots = timeslots.filter(
      (slot) => !bookedIntervals.includes(slot.start_time),
    );

    return {
      ...room,
      availableTimeslots,
    };
  });

  return roomsWithAvailableTimeslots;
};

export const getAllReservations = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reservation")
    .select(
      `
    *,
    room:room_id (
      *
    )
  `,
    )
    .order("date_requested", { ascending: true })
    .eq("status", "Accepted");

  if (error) {
    console.error("Error fetching reservations:", error);
    return [];
  }
  return data;
};

export const searchAvailableRooms = async (formData: FormData) => {
  // Extract values
  const date = formData.get("date"); // You need to set name="date" on your date input
  const location = formData.get("location"); // name="location"
  const startTime = formData.get("startTime"); // name="startTime"
  const endTime = formData.get("endTime"); // name="endTime"
  const capacity = formData.get("capacity"); // name="capacity"

  const supabase = await createClient();

  const { data: rooms, error: roomError } = await supabase
    .from("room")
    .select("*")
    .order("name", { ascending: true });

  if (roomError) {
    console.error("Error fetching rooms:", roomError);
    return [];
  }

  // Fetch all timeslots
  const { data: timeslots, error: timeslotError } = await supabase
    .from("schedule")
    .select("*")
    .order("start_time", { ascending: true });

  if (timeslotError) {
    console.error("Error fetching timeslots:", timeslotError);
    return [];
  }

  const reservations = await getAllReservations();

  // Filter out reservations for the current date
  const reservationsForToday = reservations.filter((reservation) => {
    return reservation.date_requested === date;
  });

  function get30MinIntervals(start: string, end: string): string[] {
    const intervals: string[] = [];
    let [h, m] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);

    while (h < endH || (h === endH && m < endM)) {
      const hourStr = h.toString().padStart(2, "0");
      const minStr = m.toString().padStart(2, "0");
      intervals.push(`${hourStr}:${minStr}:00`);
      m += 30;
      if (m >= 60) {
        m = 0;
        h += 1;
      }
    }
    return intervals;
  }

  function to24Hour(time12h: string): string {
    // Example input: "7:00 AM" or "2:30 PM"
    const [time, modifier] = time12h.split(" ");
    let hours = Number(time.split(":")[0]);
    const minutes = Number(time.split(":")[1]);

    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    }
    if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:00`;
  }

  const roomsWithAvailableTimeslots = rooms.map((room) => {
    // Get all reservations for this room for today
    const roomReservations = reservationsForToday.filter(
      (reservation) => reservation.room_id === room.room_id,
    );

    // Collect all booked 30-min intervals for this room
    let bookedIntervals: string[] = [];
    roomReservations.forEach((res) => {
      bookedIntervals = bookedIntervals.concat(
        get30MinIntervals(res.start_time, res.end_time),
      );
    });

    // Filter out timeslots that are booked (by start_time)
    const availableTimeslots = timeslots.filter(
      (slot) => !bookedIntervals.includes(slot.start_time),
    );

    return {
      ...room,
      availableTimeslots,
    };
  });

  function mapLocation(location: string | null) {
    if (location === "Floor 1") return "1st Floor, CSM";
    if (location === "Floor 2") return "2nd Floor, CSM";
    return null; // For "All Rooms" or empty, match all
  }

  const mappedLocation = mapLocation(location as string | null);

  const searchIntervals = get30MinIntervals(
    to24Hour(startTime as string),
    to24Hour(endTime as string),
  );

  type Timeslot = {
    id: string;
    start_time: string;
    end_time: string;
  };

  const filteredRooms = roomsWithAvailableTimeslots.filter((room) => {
    // Location check
    const matchesLocation =
      !mappedLocation || room.room_location === mappedLocation;

    // Capacity check
    const matchesCapacity = !capacity || room.capacity >= Number(capacity);

    // Timeslot check: all search intervals must be available in availableTimeslots
    const availableStartTimes = (room.availableTimeslots ?? []).map(
      (slot: Timeslot) => slot.start_time,
    );
    const matchesTimeslot =
      searchIntervals.length > 0 &&
      searchIntervals.every((interval) =>
        availableStartTimes.includes(interval),
      );

    // Only include the room if all checks pass
    return matchesLocation && matchesCapacity && matchesTimeslot;
  });

  return filteredRooms;
};
