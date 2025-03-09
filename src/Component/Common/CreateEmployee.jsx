import React, { useState, useContext } from "react";
import { UserPlus } from "lucide-react";
import { getLocalStorage } from "../../Utils/Localstorage";
import { AuthContext } from "../../Context/AuthProvider";
import toast, { Toaster } from "react-hot-toast";

export const CreateEmployee = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { userData } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long", {
        duration: 4000,
        style: {
          background: "#333",
          color: "#fff",
        },
      });
      return;
    }

    setLoading(true);

    try {
      // Create new employee object
      const newEmployee = {
        id: Date.now(), // Generate unique ID
        name,
        email,
        password,
        tasks: [], // Initialize with empty tasks array
      };

      // Get existing employee data
      const { employee } = getLocalStorage();

      // Check if email already exists
      const emailExists = employee.some((emp) => emp.email === email);
      if (emailExists) {
        toast.error("An employee with this email already exists.", {
          duration: 4000,
          icon: "🚫",
          position: 'top-right',
          style: {
            background: "#333",
            color: "#fff",
          },
        });
        setLoading(false);
        return;
      }

      // Add new employee to the array
      const updatedEmployees = [...employee, newEmployee];

      // Simulate network delay for better UX
      setTimeout(() => {
        // Update localStorage
        localStorage.setItem("employee", JSON.stringify(updatedEmployees));

        // Reset form
        setName("");
        setEmail("");
        setPassword("");

        // Show success message
        toast.success(`Employee ${name} added successfully!`, {
          duration: 4000,
          icon: "👤",
          position: 'top-right',
          style: {
            background: "#333",
            color: "#fff",
          },
          iconTheme: {
            primary: "#10B981",
            secondary: "#FFF",
          },
        });

        setLoading(false);
      }, 600);
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error("Failed to add employee. Please try again.", {
        duration: 4000,
        position: 'top-right',
        style: {
          background: "#333",
          color: "#fff",
        },
      });
      setLoading(false);
    }
  };

  return (
    <div className="w-full sm:w-[90%] md:w-[70%] lg:w-[50%] mx-auto mt-10 text-white border border-gray-300 rounded-[8px] shadow-md">
      {/* Toast container */}
      <Toaster />

      <div className="p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          Add New Employee
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-base sm:text-lg font-medium">Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Enter employee name"
              className="w-full p-2 rounded-[8px] border border-gray-300 text-white bg-gray-700"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-base sm:text-lg font-medium">Email</label>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter employee email"
              className="w-full p-2 rounded-[8px] border border-gray-300 text-white bg-gray-700"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-base sm:text-lg font-medium">Password</label>
            <input
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter employee password"
              className="w-full p-2 rounded-[8px] border border-gray-300 text-white bg-gray-700"
            />
            <p className="text-xs sm:text-sm text-gray-400">
              Password must be at least 6 characters long
            </p>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 py-2 px-4 sm:py-2.5 sm:px-6 text-sm font-medium text-white focus:outline-none bg-blue-600 rounded-lg border border-blue-700 hover:bg-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Adding...
                </span>
              ) : (
                <>
                  <UserPlus size={18} />
                  Add Employee
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
