"use server";

import { createClient } from "@/utils/supabase/server";
import { handleError } from "@/lib/utils";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

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

  const { data, error } = await supabase.auth.resetPasswordForEmail(email);

  console.log("data", data);

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

export const getAllRooms = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("room")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching rooms:", error);
    return [];
  }
  return data;
};

export const getAllTimeslots = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("schedule")
    .select("*")
    .order("start_time", { ascending: true });

  if (error) {
    console.error("Error fetching timeslots:", error);
    return [];
  }
  return data;
};
