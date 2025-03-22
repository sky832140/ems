import { supabase } from "./supabaseClient";

export const AttendanceService = {
  async getMonthlyAttendance(employeeId, month) {
    const start = new Date(month);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);

    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("employee_id", employeeId)
      .gte("date", start.toISOString().split("T")[0])
      .lte("date", end.toISOString().split("T")[0]);

    return { data, error };
  },

  async markAttendance(employeeId, dateString, status) {
    return await supabase.from("attendance").upsert({
      employee_id: employeeId,
      date: dateString,
      status: status,
    });
  },
};
