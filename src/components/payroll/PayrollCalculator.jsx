import { useState, useEffect } from "react";
import { EmployeeService } from "../../services/employeeService";
import { PayrollService } from "../../services/payrollService";
import { toast } from "react-hot-toast";

export default function PayrollCalculator() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [payrollData, setPayrollData] = useState(null);

  useEffect(() => {
    loadEmployees();
  }, []);
  const loadEmployees = async () => {
    try {
      const { data, error } = await EmployeeService.getAll();
      if (error) throw error;
      setEmployees(data ?? []);
    } catch (error) {
      toast.error("Failed to load employees: " + error.message);
    }
  };

  const calculatePayroll = async () => {
    if (!selectedEmployee) {
      toast.error("Please select an employee");
      return;
    }

    try {
      const result = await PayrollService.calculateMonthlyPayroll(
        selectedEmployee,
        selectedMonth
      );

      if (!result || typeof result !== "object") {
        throw new Error("Invalid payroll data received");
      }

      setPayrollData(result);
    } catch (error) {
      toast.error("Calculation failed: " + error.message);
    }
  };

  const savePayroll = async () => {
    try {
      if (!payrollData?.employee_id || !payrollData?.month_year) {
        throw new Error("Invalid payroll data");
      }

      const { error } = await PayrollService.savePayrollRecord({
        ...payrollData,
        deductions: JSON.stringify(payrollData.deductions), // If using JSONB
      });

      if (error) throw error;
      toast.success("Payroll record saved!");
    } catch (error) {
      console.error("Save failed:", {
        error,
        payrollData,
      });
      toast.error(`Save failed: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Employee
          </label>
          <select
            className="w-full p-2 border rounded-md text-black"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="">Choose Employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.full_name} ({emp.department})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Month
          </label>
          <input
            type="month"
            className="w-full p-2 border rounded-md text-black"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={calculatePayroll}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Calculate Payroll
      </button>

      {payrollData && (
        <div className="space-y-4">
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-4 text-black">
              Salary Breakdown
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-black">Gross Salary:</span>
                <span className="text-black">
                  ${payrollData?.gross_salary?.toFixed(2) || "0.00"}
                </span>
              </div>

              {Object.entries(payrollData.deductions).map(([key, value]) => (
                <div key={key} className="flex justify-between text-red-600">
                  <span className="text-black">
                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                  </span>
                  <span className="text-black">-${value.toFixed(2)}</span>
                </div>
              ))}

              <div className="flex justify-between font-bold border-t pt-2 ">
                <span className="text-black">Net Salary:</span>
                <span className="text-black">
                  ${payrollData?.net_salary?.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={savePayroll}
            disabled={!payrollData}
            className={`px-4 py-2 rounded-md text-white ${
              payrollData
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Save Payroll Record
          </button>
        </div>
      )}
    </div>
  );
}
