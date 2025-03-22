
import { useAuth } from "../context/AuthContext";
import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement, // This is needed for pie and doughnut charts
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const { user } = useAuth();

  // Hardcoded data
  const stats = {
    totalEmployees: 150,
    thisMonthAttendance: 145,
    payrollSummary: {
      totalGross: 50000,
      totalNet: 45000,
      totalDeductions: 5000,
    },
    recentPayrolls: [
      {
        employeeId: 1,
        name: "John Doe",
        grossSalary: 3000,
        netSalary: 2700,
        deductions: { tax: 300, insurance: 100 },
      },
      {
        employeeId: 2,
        name: "Jane Smith",
        grossSalary: 2800,
        netSalary: 2500,
        deductions: { tax: 250, insurance: 80 },
      },
      // More payroll records here
    ],
    attendanceTrend: [
      { date: "2025-02-01", present: 1 },
      { date: "2025-02-02", present: 1 },
      { date: "2025-02-03", present: 0 },
      { date: "2025-02-04", present: 1 },
      { date: "2025-02-05", present: 1 },
      // More attendance records here
    ],
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Employee Management Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.email}</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Employees Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">
                Total Employees
              </h3>
              <p className="text-4xl font-bold text-blue-600 mt-2">
                {stats.totalEmployees}
              </p>
            </div>
            <span className="text-4xl text-blue-200">👥</span>
          </div>
          <p className="text-sm text-gray-400 mt-2">+5% from last month</p>
        </div>

        {/* This Month Attendance Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">
                This Month Attendance
              </h3>
              <p className="text-4xl font-bold text-green-600 mt-2">
                {stats.thisMonthAttendance}
              </p>
            </div>
            <span className="text-4xl text-green-200">📅</span>
          </div>
          <p className="text-sm text-gray-400 mt-2">95% attendance rate</p>
        </div>

        {/* Payroll Summary Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">
                Payroll Processed
              </h3>
              <p className="text-4xl font-bold text-purple-600 mt-2">
                ${stats.payrollSummary.totalNet.toFixed(2)}
              </p>
            </div>
            <span className="text-4xl text-purple-200">💰</span>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Gross: ${stats.payrollSummary.totalGross.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Attendance Trend Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Attendance Trend
          </h3>
          <Chart
            type="bar"
            data={{
              labels: stats.attendanceTrend.map((record) => record.date),
              datasets: [
                {
                  label: "Present",
                  data: stats.attendanceTrend.map((record) => record.present),
                  backgroundColor: "rgba(99, 102, 241, 0.2)",
                  borderColor: "rgba(99, 102, 241, 1)",
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                title: { display: false },
              },
            }}
          />
        </div>

        {/* Payroll Distribution Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Payroll Distribution
          </h3>
          <Chart
            type="pie"
            data={{
              labels: ["Gross Salary", "Deductions", "Net Salary"],
              datasets: [
                {
                  data: [
                    stats.payrollSummary.totalGross,
                    stats.payrollSummary.totalDeductions,
                    stats.payrollSummary.totalNet,
                  ],
                  backgroundColor: [
                    "rgba(99, 102, 241, 0.6)",
                    "rgba(239, 68, 68, 0.6)",
                    "rgba(16, 185, 129, 0.6)",
                  ],
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "bottom" },
                title: { display: false },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
