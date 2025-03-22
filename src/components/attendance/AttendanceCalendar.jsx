import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AttendanceService } from "../../services/attendanceService";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";

export default function AttendanceCalendar({ employeeId, month }) {
  const [attendance, setAttendance] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Use the month prop instead of local state
  useEffect(() => {
    const fetchAttendance = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await AttendanceService.getMonthlyAttendance(
          employeeId,
          month // Use the prop directly
        );
        if (error) throw error;
        setAttendance(data || []);
      } catch (error) {
        toast.error("Failed to load attendance: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (employeeId) fetchAttendance();
  }, [employeeId, month]); // Depend on prop instead of local state

  const handleStatusChange = async (date, status) => {
    const dateString = date.toISOString().split("T")[0];
    try {
      // Optimistic update
      setAttendance((prev) =>
        prev
          .filter((a) => a.date !== dateString)
          .concat(
            status ? { date: dateString, status, employee_id: employeeId } : []
          )
      );

      const { error } = await AttendanceService.markAttendance(
        employeeId,
        dateString,
        status
      );

      if (error) throw error;
      toast.success("Attendance updated");
    } catch (error) {
      toast.error("Failed to update attendance: " + error.message);
      // Revert on error
      const { data } = await AttendanceService.getMonthlyAttendance(
        employeeId,
        month
      );
      setAttendance(data || []);
    }
  };

  const renderDayContents = (day, date) => {
    const status = attendance.find(
      (a) => a.date === date.toISOString().split("T")[0]
    )?.status;

    return (
      <div className="p-1 group relative">
        <div className="flex flex-col items-center">
          {/* Date number */}
          <span className="text-gray-900 font-medium">{date.getDate()}</span>

          {/* Status indicator dot */}
          {status && (
            <div
              className={`mt-1 w-2.5 h-2.5 rounded-full ${
                status === "present"
                  ? "bg-green-500"
                  : status === "absent"
                  ? "bg-red-500"
                  : "bg-yellow-500"
              }`}
            />
          )}
        </div>

        {/* Hidden select that appears on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <select
            className="text-xs w-3/4 bg-white border rounded shadow-lg z-10"
            value={status || ""}
            onChange={(e) => handleStatusChange(date, e.target.value || null)}
            onClick={(e) => e.stopPropagation()}
            disabled={isLoading}
          >
            <option value="">-</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="leave">Leave</option>
          </select>
        </div>
      </div>
    );
  };
  const dateClassName = (date) => {
    if (isLoading) return "opacity-50 pointer-events-none";
    const status = attendance.find(
      (a) => a.date === date.toISOString().split("T")[0]
    )?.status;
    return (
      {
        present: "bg-green-100 border-green-500",
        absent: "bg-red-100 border-red-500",
        leave: "bg-yellow-100 border-yellow-500",
      }[status] || ""
    );
  };
  return (
    <div className="border rounded-lg p-4 relative bg-white">
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
        </div>
      )}

      <DatePicker
        inline
        selected={new Date(month)} // Use the prop directly
        onMonthChange={() => {}} // Disable month change
        dayClassName={dateClassName}
        renderDayContents={renderDayContents}
        disabledKeyboardNavigation
      />
    </div>
  );
}
