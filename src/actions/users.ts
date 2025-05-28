"use server";

import { createClient } from "@/utils/supabase/server";
import { handleError } from "@/lib/utils";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { format } from "date-fns";
import { Room, Reservation, ReservationFormValues } from "@/utils/database/types";

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
  return data as Reservation[];
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

// Store pending reservation in a temporary table instead of cookies
export async function createReservation(formData: FormData) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    // Extract reservation form values
    const reservationFormValues: ReservationFormValues = {
      name: formData.get("name") as string,
      email: formData.get("email_address") as string,
      contact_number: formData.get("contact_number") as string,
      role: formData.get("role") as string,
      course: formData.get("course") as string,
      date: formData.get("date_requested") as string,
      start_time: formData.get("start_time") as string,
      end_time: formData.get("end_time") as string,
      room_id: formData.get("room_id") as string,
      room_location: formData.get("room_location") as string,
      type: formData.get("type") as string,
      nature_of_work: formData.get("nature_of_work") as string,
      others_purpose: (formData.get("others_purpose") as string) || "", // Add default or extract from formData
    };

    // First, clean up any existing pending reservations for this user
    await supabase.from("pending_reservation").delete().eq("user_id", user.id);

    // Then insert the new reservation
    const { data, error } = await supabase
      .from("pending_reservation")
      .insert({
        user_id: user.id,
        reservation_data: reservationFormValues,
      })
      .select();

    if (error) {
      return handleError(error);
    }

    return {
      success: true,
      data: {
        id: data[0]?.id, // Assuming the inserted data contains the id
        ...data[0],
      },
    };
  } catch {
    alert("An unexpected error occurred");
  }
}

// Helper function to return consistent error format
const returnError = (error: unknown) => {
  let message = "An unexpected error occurred";
  if (error instanceof Error) {
    message = error.message;
  }
  return {
    error: true,
    errorMessage: message,
  };
};

// Updated getReservationSummary function
export const getReservationSummary = async () => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    // Get the most recent pending reservation (in case there are multiple)
    const { data: pendingData, error: pendingError } = await supabase
      .from("pending_reservation")
      .select("reservation_data, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1);

    if (pendingError) {
      console.error("Pending reservation error:", pendingError);
      return returnError(new Error("Failed to fetch pending reservation"));
    }

    if (!pendingData || pendingData.length === 0) {
      return returnError(new Error("No pending reservation found"));
    }

    const reservationData = pendingData[0]
      .reservation_data as ReservationFormValues;

    // Get room details if needed
    if (reservationData.room_id) {
      const { data: roomData } = await supabase
        .from("room")
        .select("*")
        .eq("room_id", reservationData.room_id)
        .single();

      if (roomData) {
        // Add the room name and other details if not already present
        if (!reservationData.room_location) {
          reservationData.room_location = roomData.room_location;
        }
        if (!reservationData.type) {
          reservationData.type = roomData.room_type;
        }
      }
    }

    return reservationData;
  } catch (error: unknown) {
    console.error("getReservationSummary error:", error);
    return returnError(error);
  }
};

// Updated submitReservation function
export async function submitReservation() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    // 1. Fetch pending reservation
    const { data: pendingData, error: pendingError } = await supabase
      .from("pending_reservation")
      .select("reservation_data")
      .eq("user_id", user.id)
      .single();

    if (pendingError || !pendingData)
      throw new Error("No pending reservation found");

    const { data: roomID, error: roomError } = await supabase
      .from("room")
      .select("room_id")
      .eq("name", pendingData.reservation_data.room_id)
      .single();

    if (roomError || !roomID) {
      throw new Error("Room not found or invalid room name");
    }

    // 2. Map reservation_data to reservation table columns
    const d = pendingData.reservation_data;
    const newReservation = {
      user_id: user.id,
      room_id: roomID?.room_id,
      name: d.name,
      email_address: d.email,
      contact_number: d.contact_number,
      role: d.role,
      course: d.course,
      date_requested: d.date,
      start_time: d.start_time,
      end_time: d.end_time,
      type: d.type,
      nature_of_work: d.nature_of_work,
      status: "Pending",
      others_purpose: d.others_purpose ?? "",
    };

    // 3. Insert into reservation table
    const { data: reservation, error: insertError } = await supabase
      .from("reservation")
      .insert(newReservation)
      .select()
      .single();

    if (insertError) throw new Error(insertError.message);

    // 4. Delete from pending_reservation
    await supabase.from("pending_reservation").delete().eq("user_id", user.id);

    return {
      success: true,
      data: { id: reservation.id, ...reservation },
    };
  } catch (error) {
    console.error("Error in submitReservation:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to submit reservation",
      data: null,
    };
  }
}

export const cancelReservation = async (reservationId: string) => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    // First verify the reservation belongs to the current user
    const { data: reservation, error: fetchError } = await supabase
      .from("reservation")
      .select("*")
      .eq("id", reservationId)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !reservation) {
      return {
        error: true,
        errorMessage:
          "Reservation not found or you don't have permission to cancel it",
      };
    }

    // Check if reservation can be cancelled (only pending reservations)
    if (reservation.status !== "Pending") {
      return {
        error: true,
        errorMessage: "Only pending reservations can be cancelled",
      };
    }

    // Delete the reservation entirely
    const { error: deleteError } = await supabase
      .from("reservation")
      .delete()
      .eq("id", reservationId)
      .eq("user_id", user.id);

    if (deleteError) {
      return {
        error: true,
        errorMessage: deleteError.message || "Failed to cancel reservation",
      };
    }

    // Revalidate the reservations path
    revalidatePath("/pending-reservations");

    return {
      success: true,
      message: "Reservation cancelled successfully",
    };
  } catch (error: unknown) {
    console.error("cancelReservation error:", error);
    return {
      error: true,
      errorMessage: error instanceof Error
        ? error.message
        : "An unexpected error occurred",
    };
  }
};

// Get all reservations for the current user
export const getUserReservations = async () => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    const { data, error } = await supabase
      .from("reservation")
      .select(
        `
        *,
        rooms:room_id (*)
      `,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return handleError(error);
    }

    return data;
  } catch (error: unknown) {
    return handleError(error);
  }
};

// Check room availability for a given date and time range
export const checkRoomAvailability = async (
  roomId: string,
  date: string,
  startTime: string,
  endTime: string,
) => {
  try {
    const supabase = await createClient();

    // Check if there are any overlapping reservations
    const { data, error } = await supabase
      .from("reservation")
      .select("*")
      .eq("room_id", roomId)
      .eq("date_requested", date)
      .or(`start_time.lt.${endTime},end_time.gt.${startTime}`)
      .not("status", "eq", "Rejected");

    if (error) {
      return handleError(error);
    }

    // If there are overlapping reservations, the room is not available
    return {
      available: data.length === 0,
      conflictingReservations: data,
    };
  } catch (error: unknown) {
    return handleError(error);
  }
};

// Get a single reservation by id
export async function getReservationById(id: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("reservation")
      .select(
        `
        *,
        rooms:room_id (*)
      `,
      )
      .eq("id", id)
      .single();

    if (error) {
      // Return an error object with a consistent structure
      return {
        errorMessage: error.message || "Failed to fetch reservation",
      };
    }

    return data as Reservation & { rooms: Room };
  } catch (error: unknown) {
    // Return an error object with a consistent structure
    return {
      errorMessage: error instanceof Error
        ? error.message
        : "An unexpected error occurred",
    };
  }
}

export const EditReservationDetails = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Fetch the latest pending reservation for this user
  const { data, error } = await supabase
    .from("pending_reservation")
    .select("id, reservation_data")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return null;
  }

  // Return both id and reservation_data
  return { id: data.id, ...data.reservation_data };
}

export const deletePendingReservation = async (reservationId: string) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("pending_reservation")
    .delete()
    .eq("id", reservationId); // or use another unique identifier

  if (error) {
    throw error;
  }
}