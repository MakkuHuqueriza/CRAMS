"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

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
  const { data: { user } } = await supabase.auth.getUser();

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
  const equipments = formData.get("equipments") as string;
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
        room_name: roomName,
        description: description,
        equipments: equipments,
        capacity: capacity ? parseInt(capacity) : null,
        floor: floor,
        room_type: roomType,
      })
      .eq("id", roomId)
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
    const { error } = await supabase.from("room").delete().eq("id", roomId);

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
  const roomName = formData.get("roomName") as string;
  const description = formData.get("description") as string;
  const equipments = formData.get("equipments") as string;
  const capacity = formData.get("capacity") as string;
  const floor = formData.get("floor") as string;
  const roomType = formData.get("roomType") as string;

  // Validate input
  if (!roomName || !floor || !roomType) {
    return {
      error: { message: "Room name, floor, and room type are required" },
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
    // Create new room
    const { data: newRoom, error } = await supabase
      .from("room")
      .insert({
        room_name: roomName,
        description: description,
        equipments: equipments,
        capacity: capacity ? parseInt(capacity) : null,
        floor: floor,
        room_type: roomType,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return { error: { message: "Failed to create room" } };
    }

    // Revalidate the room management page
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

export const getRoomEquipmentsAction = async (roomId: string) => {
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
    // Fetch equipments for the specific room
    const { data: equipments, error } = await supabase
      .from("equipment")
      .select("*")
      .eq("room_id", roomId)
      .order("equipment_name", { ascending: true });

    if (error) {
      return { error: { message: "Failed to fetch room equipments" } };
    }

    return { equipments: equipments || [] };
  } catch (error) {
    return { error: { message: "An unexpected error occurred" } };
  }
};

export const createEquipmentAction = async (formData: FormData) => {
  const roomId = formData.get("roomId") as string;
  const equipmentName = formData.get("equipmentName") as string;
  const condition = formData.get("condition") as string;
  const lastMaintenanceDate = formData.get("lastMaintenanceDate") as string;

  // Validate input
  if (!roomId || !equipmentName) {
    return {
      error: { message: "Room ID and equipment name are required" },
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
    // Create new equipment
    const { data: newEquipment, error } = await supabase
      .from("equipment")
      .insert({
        room_id: roomId,
        equipment_name: equipmentName,
        condition: condition as "Good" | "Fair" | "Poor" | "Needs Repair",
        last_maintenance_date: lastMaintenanceDate,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return { error: { message: "Failed to create equipment" } };
    }

    // Revalidate the room management page
    revalidatePath("/admin/room-management");

    return {
      message: "Equipment created successfully",
      equipment: newEquipment,
    };
  } catch (error) {
    return { error: { message: "An unexpected error occurred" } };
  }
};

export const updateEquipmentAction = async (formData: FormData) => {
  const equipmentId = formData.get("equipmentId") as string;
  const equipmentName = formData.get("equipmentName") as string;
  const condition = formData.get("condition") as string;
  const lastMaintenanceDate = formData.get("lastMaintenanceDate") as string;

  // Validate input
  if (!equipmentId || !equipmentName) {
    return {
      error: { message: "Equipment ID and equipment name are required" },
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
    // Update equipment
    const { data: updatedEquipment, error } = await supabase
      .from("equipment")
      .update({
        equipment_name: equipmentName,
        condition: condition as "Good" | "Fair" | "Poor" | "Needs Repair",
        last_maintenance_date: lastMaintenanceDate,
      })
      .eq("id", equipmentId)
      .select()
      .single();

    if (error) {
      return { error: { message: "Failed to update equipment" } };
    }

    // Revalidate the room management page
    revalidatePath("/admin/room-management");

    return {
      message: "Equipment updated successfully",
      equipment: updatedEquipment,
    };
  } catch (error) {
    return { error: { message: "An unexpected error occurred" } };
  }
};

export const deleteEquipmentAction = async (equipmentId: string) => {
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
    // Delete the equipment
    const { error } = await supabase
      .from("equipment")
      .delete()
      .eq("id", equipmentId);

    if (error) {
      return { error: { message: "Failed to delete equipment" } };
    }

    // Revalidate the room management page
    revalidatePath("/admin/room-management");

    return { message: "Equipment deleted successfully" };
  } catch (error) {
    return { error: { message: "An unexpected error occurred" } };
  }
};

export const getEquipmentsByConditionAction = async (condition: string) => {
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
    // Fetch equipments by condition across all rooms
    const { data: equipments, error } = await supabase
      .from("equipment")
      .select(`
        *,
        room:room_id (room_name, room_type)
      `)
      .eq("condition", condition)
      .order("last_maintenance_date", { ascending: true });

    if (error) {
      return { error: { message: "Failed to fetch equipments by condition" } };
    }

    return { equipments: equipments || [] };
  } catch (error) {
    return { error: { message: "An unexpected error occurred" } };
  }
};