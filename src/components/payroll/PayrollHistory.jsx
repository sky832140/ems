import { useEffect, useState, useCallback } from "react";
import DataTable from "../../components/common/DataTable";
import { PayrollService } from "../../services/payrollService";
import { toast } from "react-hot-toast";

export default function PayrollHistory({ employeeId }) {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    { header: "Month", accessor: "month" },
    { header: "Gross Salary", accessor: "gross" },
    { header: "Deductions", accessor: "deductions" },
    { header: "Net Salary", accessor: "net" },
  ];

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await PayrollService.getPayrollHistory(employeeId);
      setPayrolls(data?.map(formatPayroll) || []);
    } catch (error) {
      toast.error("Failed to load history: " + error.message);
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  const formatPayroll = (payroll) => ({
    id: payroll.id,
    month: new Date(payroll.month_year).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    }),
    gross: `$${payroll.gross_salary.toFixed(2)}`,
    deductions: `$${Object.values(payroll.deductions)
      .reduce((a, b) => a + b, 0)
      .toFixed(2)}`,
    net: `$${payroll.net_salary.toFixed(2)}`,
  });

  useEffect(() => {
    if (employeeId) loadHistory();
  }, [employeeId, loadHistory]);
  return (
    <div className="mt-8">
      <DataTable
        columns={columns}
        data={payrolls}
        loading={loading}
        onRefresh={loadHistory}
      />
    </div>
  );
}
