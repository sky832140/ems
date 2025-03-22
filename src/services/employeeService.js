import { supabase } from "./supabaseClient";
export const EmployeeService = {
  async getAll(searchTerm = "") {
    const query = supabase
      .from("employees")
      .select("*")
      .order("created_at", { ascending: false });

    if (searchTerm) {
      query.or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
    }

    const { data, error } = await query;
    return { data, error };
  },

  async create(employeeData) {
    const { data, error } = await supabase
      .from("employees")
      .insert(employeeData)
      .select()
      .single(); // Add single()

    return { data, error };
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from("employees")
      .update(updates)
      .eq("id", id)
      .select()
      .single(); // Add single()

    return { data, error };
  },

  async delete(id) {
    return await supabase.from("employees").delete().eq("id", id);
  },
};
