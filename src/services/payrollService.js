import { supabase } from "./supabaseClient";

export const PayrollService = {
  async calculateMonthlyPayroll(employeeId, month) {
    try {
      // Validate input
      if (!employeeId || !month) throw new Error("Missing required parameters");

      // Get date range
      const startDate = new Date(`${month}-01`);
      const endDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        0
      );

      // Get employee details
      const { data: employee, error: empError } = await supabase
        .from("employees")
        .select("salary")
        .eq("id", employeeId)
        .single();

      if (empError) throw empError;

      // Get attendance records
      const { data: attendance, error: attError } = await supabase
        .from("attendance")
        .select("date, status, hours_worked")
        .eq("employee_id", employeeId)
        .gte("date", startDate.toISOString().split("T")[0])
        .lte("date", endDate.toISOString().split("T")[0]);

      if (attError) throw attError;

      // Calculate values
      const workingDays = attendance.filter(
        (a) => a.status === "present"
      ).length;
      const totalHours = attendance.reduce(
        (sum, a) => sum + (a.hours_worked || 0),
        0
      );
      const grossSalary = employee.salary;
      const deductions = {
        tax: grossSalary * 0.2,
        insurance: 500,
      };
      const netSalary = grossSalary - deductions.tax - deductions.insurance;

      return {
        employee_id: employeeId,
        month_year: startDate.toISOString().split("T")[0],
        gross_salary: grossSalary,
        deductions,
        net_salary: netSalary,
        working_days: workingDays,
        total_hours: totalHours,
      };
    } catch (error) {
      console.error("Payroll calculation error:", error);
      throw error;
    }
  },

  async savePayrollRecord(payrollData) {
    try {
      const { data, error } = await supabase
        .from("payroll")
        .upsert({
          employee_id: payrollData.employee_id,
          month_year: payrollData.month_year,
          gross_salary: payrollData.gross_salary,
          deductions: payrollData.deductions,
          net_salary: payrollData.net_salary,
          working_days: payrollData.working_days, // Add this
          total_hours: payrollData.total_hours, // Add this
        })
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Save payroll error:", error);
      throw error;
    }
  },

  async getPayrollHistory(employeeId) {
    const { data, error } = await supabase
      .from("payroll")
      .select("*")
      .eq("employee_id", employeeId)
      .order("month_year", { ascending: false });

    if (error) throw error;
    return data;
  },

  // async getPayrollByMonth(month) {
  //   const startDate = new Date(`${month}-01`);
  //   const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

  //   const { data, error } = await supabase
  //     .from('payroll')
  //     .select(`
  //       id,
  //       month_year,
  //       gross_salary,
  //       deductions,
  //       net_salary,
  //       employees(full_name, department)
  //     `)
  //     .gte('month_year', startDate.toISOString().split('T')[0])
  //     .lte('month_year', endDate.toISOString().split('T')[0]);

  //   if (error) throw error;
  //   return data;
  // }
  async getPayrollByMonth(month) {
    try {
      const startDate = new Date(`${month}-01`);
      const endDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        0
      );

      const { data, error } = await supabase
        .from("payroll")
        .select(`*`)
        .gte("month_year", startDate.toISOString().split("T")[0])
        .lte("month_year", endDate.toISOString().split("T")[0]);

      if (error) throw error;
      return data || []; // Return empty array if no data
    } catch (error) {
      console.error("Payroll fetch error:", error);
      return [];
    }
  },
};
