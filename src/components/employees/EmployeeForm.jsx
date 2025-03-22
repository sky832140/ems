import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { EmployeeService } from "../../services/employeeService";
export default function EmployeeForm({ employee, onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (employee) reset(employee);
  }, [employee, reset]);

  const onSubmit = async (formData) => {
    try {
      const { data, error } = employee?.id
        ? await EmployeeService.update(employee.id, formData)
        : await EmployeeService.create(formData);

      if (error) throw error;

      toast.success(`Employee ${employee?.id ? "updated" : "created"}!`);
      onSuccess?.(data); // Pass the new/updated data
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      console.error("Operation failed:", error);
    }
  };

  return (
    <form
      className=" space-y-6 p-8 bg-white rounded-lg shadow-xl max-w-4xl mx-auto mt-8 border border-gray-200 "
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Full Name
          </label>
          <input
            {...register("full_name", { required: "Name is required" })}
            className="text-black mt-1 block w-full rounded-lg border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
          {errors.full_name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.full_name.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Role
          </label>
          <input
            {...register("role", { required: "Role is required" })}
            className="text-black mt-1 block w-full rounded-lg border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Department
          </label>
          <input
            {...register("department", { required: "Department is required" })}
            className="text-black mt-1 block w-full rounded-lg border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
          {errors.department && (
            <p className="text-red-500 text-sm mt-1">
              {errors.department.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Salary
          </label>
          <input
            type="number"
            step="0.01"
            {...register("salary", {
              required: "Salary is required",
              min: { value: 0, message: "Salary must be positive" },
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
          />
          {errors.salary && (
            <p className="text-red-500 text-sm mt-1">{errors.salary.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Add other fields (role, department, salary) following same pattern */}
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="submit"
          className="inline-flex justify-center rounded-lg border border-transparent bg-teal-600 py-2 px-6 text-sm font-semibold text-white shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition ease-in-out duration-200"
        >
          {employee?.id ? "Update" : "Create"} Employee
        </button>
      </div>
    </form>
  );
}
