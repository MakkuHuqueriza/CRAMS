"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const adminLoginAction = async (FormData: FormData) => {
  const loginCredentials = {
    email: FormData.get("email") as string,
    password: FormData.get("password") as string,
  };

  const supabase = await createClient();

  const { data, error } =
    await supabase.auth.signInWithPassword(loginCredentials);

  if (error) {
    return error;
  }

  const { data: adminData } = await supabase
    .from("admin")
    .select("admin_id")
    .eq("admin_id", data.user?.id)
    .single();

  if (adminData) {
    redirect("/admin");
  } else {
    await supabase.auth.signOut();
    return { message: "You are not an admin" };
  }
};

export const adminLogoutAction = async () => {
  const { auth } = await createClient();

  const { error } = await auth.signOut();

  if (error) {
    return error;
  }

  redirect("/admin/login");
};