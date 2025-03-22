import { useState, useEffect } from "react";
import { EmployeeService } from "../../services/employeeService";
import DataTable from "../../components/common/DataTable";
import EmployeeForm from "../../components/employees/EmployeeForm";
import { toast } from "react-hot-toast";

export default function ListEmployees() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loadEmployees = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await EmployeeService.getAll(searchTerm);

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      toast.error("Failed to load employees: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, [searchTerm]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        const { error } = await EmployeeService.delete(id);
        if (error) throw error;

        setEmployees((prev) => prev.filter((emp) => emp.id !== id));
        toast.success("Employee deleted successfully");
      } catch (error) {
        toast.error("Delete failed: " + error.message);
      }
    }
  };

  const handleFormSuccess = (newEmployee) => {
    setShowForm(false);
    setSelectedEmployee(null);

    if (selectedEmployee) {
      // Update existing employee in state
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === newEmployee.id ? newEmployee : emp))
      );
    } else {
      // Add new employee to state
      setEmployees((prev) => [newEmployee, ...prev]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search employees..."
          className="w-96 px-4 py-2 border rounded-lg text-black"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => {
            setSelectedEmployee(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Employee
        </button>
      </div>

      <DataTable
        columns={[
          { header: "Name", accessor: "full_name" },
          { header: "Email", accessor: "email" },
          { header: "Role", accessor: "role" },
          { header: "Department", accessor: "department" },
          {
            header: "Salary",
            accessor: "salary",
            render: (value) => `$${Number(value).toLocaleString()}`,
          },
        ]}
        data={employees}
        loading={isLoading}
        onEdit={(employee) => {
          setSelectedEmployee(employee);
          setShowForm(true);
        }}
        onDelete={handleDelete}
      />

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-lg w-full max-w-2xl relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <EmployeeForm
              employee={selectedEmployee}
              onSuccess={handleFormSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
}
