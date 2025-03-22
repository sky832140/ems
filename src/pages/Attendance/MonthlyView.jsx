import { useState, useEffect } from "react";
// import { AttendanceService } from "../../services/attendanceService";
import { EmployeeService } from "../../services/employeeService";
import AttendanceCalendar from "../../components/attendance/AttendanceCalendar";

export default function MonthlyView() {
  const [employees, setEmployees] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  useEffect(() => {
    const loadEmployees = async () => {
      const { data } = await EmployeeService.getAll();
      setEmployees(data || []);
    };
    loadEmployees();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">
          Attendance -{" "}
          {new Date(selectedMonth).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
          })}
        </h2>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border rounded-lg px-4 py-2 text-black"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((employee) => (
          <div key={employee.id} className="border rounded-lg p-4 ">
            <h3 className="font-semibold mb-4 text-white">
              {employee.full_name}
            </h3>

            <AttendanceCalendar
              key={`${employee.id}-${selectedMonth}`} // Force remount on month change
              employeeId={employee.id}
              month={selectedMonth} // Pass current selected month
            />
          </div>
        ))}
      </div>
    </div>
  );
}
