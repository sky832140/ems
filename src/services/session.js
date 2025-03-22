import { supabase } from "./supabaseClient";

export const checkSession = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  return { session, error };
};
