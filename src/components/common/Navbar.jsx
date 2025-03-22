import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex space-x-4">
          <img
            src="/public/logo.jpeg"
            alt="Logo"
            className="h-8 rounded-full" // Adjust the size of the logo
          />
          <Link to="/" className="text-gray-700 hover:text-gray-900">
            Dashboard
          </Link>
          <Link to="/employees" className="text-gray-700 hover:text-gray-900">
            Employees
          </Link>
          <Link to="/attendance" className="text-gray-700 hover:text-gray-900">
            Attendance
          </Link>
          <Link to="/payroll" className="text-gray-700 hover:text-gray-900">
            Payroll
          </Link>
        </div>

        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">{user.email}</span>
            <button
              onClick={signOut}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
