"use server";

import { createClient } from "@/utils/supabase/server";
import { handleError } from "@/lib/utils";
import { redirect } from "next/navigation";

export const loginAction = async (email: string, password: string) => {
  try {
    const { auth } = await createClient();

    const { error } = await auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  } catch (error) {
    console.error(error);
    return handleError(error);
  }

  redirect("/");
};

export const signUpAction = async (email: string, password: string) => {
  try {
    const { auth } = await createClient();

    const { error } = await auth.signUp({
      email,
      password,
    });
    if (error) throw error;
  } catch (error) {
    return handleError(error);
  }
};
export const logoutAction = async () => {
  try {
    const { auth } = await createClient();

    const { error } = await auth.signOut();
    if (error) throw error;
  } catch (error) {
    return handleError(error);
  }

  redirect("/login");
};
