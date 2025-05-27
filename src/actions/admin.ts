"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { format } from "date-fns";

// For room counts
type RoomCounts = {
  lectureRooms: number;
  dbsesLabs: number;
  dmpcsLabs: number;
  dfscLabs: number;
  totalRooms: number;
};

export const adminLoginAction = async (FormData: FormData) => {
  const loginCredentials = {
    email: FormData.get("email") as string,
    password: FormData.get("password") as string,
  };

  const supabase = await createClient();

  const { data, error } =
    await supabase.auth.signInWithPassword(loginCredentials);

  if (error) {
    return { success: false, message: error.message };
  }

  const { data: adminData, error: adminError } = await supabase
    .from("admin")
    .select("admin_id")
    .eq("admin_id", data.user?.id)
    .single();

  if (adminError || !adminData) {
    await supabase.auth.signOut();
    return { success: false, message: "You are not an admin" };
  }

  // Return success instead of redirecting
  return { success: true, message: "Login successful" };
};

export const adminLogoutAction = async () => {
  const { auth } = await createClient();

  const { error } = await auth.signOut();

  if (error) {
    return error;
  }

  redirect("/admin/login");
};

export const getAdminReservationsAction = async () => {
  const supabase = await createClient();

  // Get the current user (admin)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Verify user is an admin
  const { data: adminData, error: adminError } = await supabase
    .from("admin")
    .select("admin_id")
    .eq("admin_id", user.id)
    .single();

  if (adminError || !adminData) {
    redirect("/admin/login");
  }

  // Fetch ALL reservations
  const { data: reservations, error } = await supabase
    .from("reservation")
    .select(
      `
      *,
      room:room_id (*)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    return { error };
  }

  // Transform the data to match the expected AdminReservation structure
  const transformedReservations =
    reservations?.map((reservation) => ({
      id: `admin_${reservation.id}`, // Create a unique admin reservation ID
      admin_id: user.id,
      reservation_id: reservation.id,
      status: reservation.status,
      reason_for_rejection: reservation.reason_for_rejection,
      reservation: reservation,
    })) || [];

  return { reservations: transformedReservations };
};

export const getReservationDetailAction = async (reservationId: string) => {
  const supabase = await createClient();

  // Get the current user (admin)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Verify user is an admin
  const { data: adminData, error: adminError } = await supabase
    .from("admin")
    .select("admin_id")
    .eq("admin_id", user.id)
    .single();

  if (adminError || !adminData) {
    redirect("/admin/login");
  }

  // Fetch specific reservation with details
  const { data: reservation, error } = await supabase
    .from("reservation")
    .select(
      `
      *,
      room:room_id (*)
    `,
    )
    .eq("id", reservationId)
    .single();

  if (error) {
    return { error };
  }

  // Transform to match AdminReservation structure
  const transformedReservation = {
    id: `admin_${reservation.id}`,
    admin_id: user.id,
    reservation_id: reservation.id,
    status: reservation.status,
    reason_for_rejection: reservation.reason_for_rejection,
    reservation: reservation,
  };

  return { reservation: transformedReservation };
};

export const updateReservationStatusAction = async (formData: FormData) => {
  const reservationId = formData.get("reservationId") as string;
  const status = formData.get("status") as string;
  const reasonForRejection = formData.get("reasonForRejection") as
    | string
    | null;

  // Validate input
  if (!reservationId) {
    return { error: { message: "Reservation ID is required" } };
  }

  if (!status || !["Accepted", "Rejected"].includes(status)) {
    return {
      error: { message: "Status must be either 'Accepted' or 'Rejected'" },
    };
  }

  if (status === "Rejected" && !reasonForRejection) {
    return {
      error: {
        message: "Reason for rejection is required when status is 'Rejected'",
      },
    };
  }

  const supabase = await createClient();

  // Get the current user (admin)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Verify user is an admin
  const { data: adminData, error: adminError } = await supabase
    .from("admin")
    .select("admin_id")
    .eq("admin_id", user.id)
    .single();

  if (adminError || !adminData) {
    redirect("/admin/login");
  }

  try {
    // Update the reservation table with the new status and admin assignment
    const { data: updatedReservation, error: reservationError } = await supabase
      .from("reservation")
      .update({
        status: status,
        admin_id: user.id,
        reason_for_rejection: status === "Rejected" ? reasonForRejection : null,
      })
      .eq("id", reservationId)
      .select()
      .single();

    if (reservationError) {
      return { error: { message: "Failed to update reservation status" } };
    }

    // Revalidate the admin reservations page to reflect the changes
    revalidatePath("/admin/booking-management");

    return {
      message: `Reservation ${status === "Accepted" ? "accepted" : "rejected"} successfully`,
      reservation: updatedReservation,
    };
  } catch (error) {
    return { error: { message: "An unexpected error occurred" } };
  }
};

export const getRoomCountsAction = async () => {
  const supabase = await createClient();

  // Get the current user (admin)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Verify user is an admin
  const { data: adminData, error: adminError } = await supabase
    .from("admin")
    .select("admin_id")
    .eq("admin_id", user.id)
    .single();

  if (adminError || !adminData) {
    redirect("/admin/login");
  }

  try {
    // Get all rooms to count room types
    const { data: rooms, error: roomsError } = await supabase
      .from("room")
      .select("room_type");

    if (roomsError) {
      return { error: { message: "Failed to fetch room data" } };
    }

    // Initialize counters
    const counts: RoomCounts = {
      lectureRooms: 0,
      dbsesLabs: 0,
      dmpcsLabs: 0,
      dfscLabs: 0,
      totalRooms: rooms.length,
    };

    // Count each room type
    rooms.forEach((room) => {
      const roomType = room.room_type ? room.room_type : "";

      if (roomType.includes("LECTURE ROOM")) {
        counts.lectureRooms++;
      } else if (roomType.includes("DBSES LABORATORY ROOM")) {
        counts.dbsesLabs++;
      } else if (roomType.includes("DMPCS LABORATORY ROOM")) {
        counts.dmpcsLabs++;
      } else if (roomType.includes("DFSC LABORATORY ROOM")) {
        counts.dfscLabs++;
      }
    });

    return { counts };
  } catch (error) {
    return { error: { message: "An unexpected error occurred" } };
  }
};

export const getPendingReservationsCountAction = async () => {
  const supabase = await createClient();

  // Get the current user (admin)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Verify user is an admin
  const { data: adminData, error: adminError } = await supabase
    .from("admin")
    .select("admin_id")
    .eq("admin_id", user.id)
    .single();

  if (adminError || !adminData) {
    redirect("/admin/login");
  }

  try {
    // Count reservations with "Pending" status
    const { count, error } = await supabase
      .from("reservation")
      .select("*", { count: "exact", head: true })
      .eq("status", "Pending");

    if (error) {
      return {
        error: { message: "Failed to fetch pending reservations count" },
      };
    }

    return { count: count || 0 };
  } catch (error) {
    return { error: { message: "An unexpected error occurred" } };
  }
};

// Room Management APIs
export const getAllRoomsAction = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Verify user is an admin
  const { data: adminData, error: adminError } = await supabase
    .from("admin")
    .select("admin_id")
    .eq("admin_id", user.id)
    .single();

  if (adminError || !adminData) {
    redirect("/admin/login");
  }

  try {
    const { data: rooms, error } = await supabase
      .from("room")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Supabase error:", error);
      return { error: { message: "Failed to fetch rooms" } };
    }

    if (!rooms) {
      return { rooms: [] };
    }

    // No need for manual mapping since the types already match
    return { rooms };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { error: { message: "An unexpected error occurred" } };
  }
};

export const getRoomsByFloorAction = async (floor: string) => {
  const supabase = await createClient();

  // Get the current user (admin)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Verify user is an admin
  const { data: adminData, error: adminError } = await supabase
    .from("admin")
    .select("admin_id")
    .eq("admin_id", user.id)
    .single();

  if (adminError || !adminData) {
    redirect("/admin/login");
  }

  try {
    // Fetch rooms by floor
    const { data: rooms, error } = await supabase
      .from("room")
      .select("*")
      .eq("floor", floor)
      .order("room_name", { ascending: true });

    if (error) {
      return { error: { message: "Failed to fetch rooms by floor" } };
    }

    return { rooms: rooms || [] };
  } catch (error) {
    return { error: { message: "An unexpected error occurred" } };
  }
};

export const getRoomDetailsAction = async (roomId: string) => {
  const supabase = await createClient();

  // Get the current user (admin)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Verify user is an admin
  const { data: adminData, error: adminError } = await supabase
    .from("admin")
    .select("admin_id")
    .eq("admin_id", user.id)
    .single();

  if (adminError || !adminData) {
    redirect("/admin/login");
  }

  try {
    // Fetch specific room details
    const { data: room, error } = await supabase
      .from("room")
      .select("*")
      .eq("id", roomId)
      .single();

    if (error) {
      return { error: { message: "Failed to fetch room details" } };
    }

    return { room };
  } catch (error) {
    return { error: { message: "An unexpected error occurred" } };
  }
};

export const getRoomScheduleAction = async (roomId: string, date?: string) => {
  const supabase = await createClient();

  // Get the current user (admin)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Verify user is an admin
  const { data: adminData, error: adminError } = await supabase
    .from("admin")
    .select("admin_id")
    .eq("admin_id", user.id)
    .single();

  if (adminError || !adminData) {
    redirect("/admin/login");
  }

  try {
    let query = supabase
      .from("reservation")
      .select(
        `
        *,
        room:room_id (*)
      `,
      )
      .eq("room_id", roomId)
      .eq("status", "Accepted");

    // If date is provided, filter by date
    if (date) {
      query = query.eq("reservation_date", date);
    }

    const { data: reservations, error } = await query.order("start_time", {
      ascending: true,
    });

    if (error) {
      return { error: { message: "Failed to fetch room schedule" } };
    }

    return { schedule: reservations || [] };
  } catch (error) {
    return { error: { message: "An unexpected error occurred" } };
  }
};

export const updateRoomDetailsAction = async (formData: FormData) => {
  const roomId = formData.get("roomId") as string;
  const roomName = formData.get("roomName") as string;
  const description = formData.get("description") as string;
  const capacity = formData.get("capacity") as string;
  const floor = formData.get("floor") as string;
  const roomType = formData.get("roomType") as string;

  // Validate input
  if (!roomId) {
    return { error: { message: "Room ID is required" } };
  }

  const supabase = await createClient();

  // Get the current user (admin)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Verify user is an admin
  const { data: adminData, error: adminError } = await supabase
    .from("admin")
    .select("admin_id")
    .eq("admin_id", user.id)
    .single();

  if (adminError || !adminData) {
    redirect("/admin/login");
  }

  try {
    // Update room details
    const { data: updatedRoom, error } = await supabase
      .from("room")
      .update({
        name: roomName,
        room_description: description,
        capacity: capacity ? parseInt(capacity) : null,
        room_location: floor,
        room_type: roomType,
      })
      .eq("room_id", roomId)
      .select()
      .single();

    if (error) {
      return { error: { message: "Failed to update room details" } };
    }

    // Revalidate the room management page
    revalidatePath("/admin/room-management");

    return {
      message: "Room details updated successfully",
      room: updatedRoom,
    };
  } catch (error) {
    return { error: { message: "An unexpected error occurred" } };
  }
};

export const deleteRoomAction = async (roomId: string) => {
  const supabase = await createClient();

  // Get the current user (admin)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Verify user is an admin
  const { data: adminData, error: adminError } = await supabase
    .from("admin")
    .select("admin_id")
    .eq("admin_id", user.id)
    .single();

  if (adminError || !adminData) {
    redirect("/admin/login");
  }

  try {
    // Check if room has any reservations
    const { count: reservationCount, error: countError } = await supabase
      .from("reservation")
      .select("*", { count: "exact", head: true })
      .eq("room_id", roomId);

    if (countError) {
      return { error: { message: "Failed to check room reservations" } };
    }

    if (reservationCount && reservationCount > 0) {
      return {
        error: { message: "Cannot delete room with existing reservations" },
      };
    }

    // Delete the room
    const { error } = await supabase.from("room").delete().eq("room_id", roomId);

    if (error) {
      return { error: { message: "Failed to delete room" } };
    }

    // Revalidate the room management page
    revalidatePath("/admin/room-management");

    return { message: "Room deleted successfully" };
  } catch (error) {
    return { error: { message: "An unexpected error occurred" } };
  }
};

export const createRoomAction = async (formData: FormData) => {
  const supabase = await createClient();

  const name = formData.get("roomName") as string;
  const room_description = formData.get("description") as string;
  const capacity = formData.get("capacity") as string;
  const room_location = formData.get("floor") as string;
  const room_type = formData.get("roomType") as string;

  // Enum values (must match your Supabase enum exactly)
  const validRoomTypes = [
    "DBSES LABORATORY ROOM",
    "LECTURE ROOM",
    "DFSC LABORATORY ROOM",
    "DMPCS LABORATORY ROOM",
    "LECTURE ROOM/AUDITORIUM",
  ];
  const validRoomLocations = [
    "1st Floor, CSM",
    "2nd Floor, CSM",
  ];

  // Validate input
  if (
    !name ||
    !room_location ||
    !room_type ||
    !validRoomTypes.includes(room_type) ||
    !validRoomLocations.includes(room_location)
  ) {
    return {
      error: { message: "Invalid room type or location." },
    };
  }

  // Get the current user (admin)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Verify user is an admin
  const { data: adminData, error: adminError } = await supabase
    .from("admin")
    .select("admin_id")
    .eq("admin_id", user.id)
    .single();

  if (adminError || !adminData) {
    redirect("/admin/login");
  }

  try {
    const { data: newRoom, error } = await supabase
      .from("room")
      .insert({
        name,
        room_description,
        capacity: capacity ? parseInt(capacity) : null,
        room_location,
        room_type,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return { error: { message: error.message || "Failed to create room" } };
    }

    revalidatePath("/admin/room-management");

    return {
      message: "Room created successfully",
      room: newRoom,
    };
  } catch (error) {
    return { error: { message: "An unexpected error occurred" } };
  }
};

export const searchRoomsAction = async (searchTerm: string) => {
  const supabase = await createClient();

  // Get the current user (admin)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Verify user is an admin
  const { data: adminData, error: adminError } = await supabase
    .from("admin")
    .select("admin_id")
    .eq("admin_id", user.id)
    .single();

  if (adminError || !adminData) {
    redirect("/admin/login");
  }

  try {
    // Search rooms by name or room type
    const { data: rooms, error } = await supabase
      .from("room")
      .select("*")
      .or(`room_name.ilike.%${searchTerm}%,room_type.ilike.%${searchTerm}%`)
      .order("room_name", { ascending: true });

    if (error) {
      return { error: { message: "Failed to search rooms" } };
    }

    return { rooms: rooms || [] };
  } catch (error) {
    return { error: { message: "An unexpected error occurred" } };
  }
};

// Add this helper if not present
export const getAllReservations = async () => {
  const supabase = await createClient();
  // Get all reservations (customize fields as needed)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: adminData, error: adminError } = await supabase
    .from("admin")
    .select("admin_id")
    .eq("admin_id", user.id)
    .single();
  if (adminError || !adminData) redirect("/admin/login");
  const { data: reservations, error } = await supabase
    .from("reservation")
    .select("*");
  if (error) return [];
  return reservations || [];
};

// --- NEW FUNCTION: getAllRoomsWithTimeslots ---
export const getAllRoomsWithTimeslots = async () => {
  const supabase = await createClient();

  // Get the current user (admin)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  // Verify user is an admin
  const { data: adminData, error: adminError } = await supabase
    .from("admin")
    .select("admin_id")
    .eq("admin_id", user.id)
    .single();
  if (adminError || !adminData) redirect("/admin/login");

  // Fetch all rooms
  const { data: rooms, error: roomError } = await supabase
    .from("room")
    .select("*")
    .order("name", { ascending: true });

  if (roomError) {
    console.error("Error fetching rooms:", roomError);
    return { rooms: [] };
  }

  // Fetch all timeslots
  const { data: timeslots, error: timeslotError } = await supabase
    .from("schedule")
    .select("*")
    .order("start_time", { ascending: true });

  if (timeslotError) {
    console.error("Error fetching timeslots:", timeslotError);
    return { rooms: [] };
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

  return { rooms: roomsWithAvailableTimeslots };
};
