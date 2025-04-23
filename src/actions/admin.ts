"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const adminLoginAction = async (FormData: FormData) => {
  const loginCredentials = {
    email: FormData.get("email") as string,
    password: FormData.get("password") as string,
  };

  const { auth } = await createClient();

  const { data, error } = await auth.signInWithPassword(loginCredentials);

  if (error) {
    return error;
  }

  if (data.user?.user_metadata?.is_admin) {
    redirect("/admin");
  } else {
    await auth.signOut();
    redirect("/admin/login");
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
