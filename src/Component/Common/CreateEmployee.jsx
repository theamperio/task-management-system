import React, { useState, useContext } from "react";
import { UserPlus } from "lucide-react";
import { getLocalStorage } from "../../Utils/Localstorage";
import { AuthContext } from "../../Context/AuthProvider";

export const CreateEmployee = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { userData } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create new employee object
      const newEmployee = {
        id: Date.now(), // Generate unique ID
        name,
        email,
        password,
        tasks: [] // Initialize with empty tasks array
      };
      
      // Get existing employee data
      const { employee } = getLocalStorage();
      
      // Check if email already exists
      const emailExists = employee.some(emp => emp.email === email);
      if (emailExists) {
        alert("An employee with this email already exists.");
        setLoading(false);
        return;
      }
      
      // Add new employee to the array
      const updatedEmployees = [...employee, newEmployee];
      
      // Update localStorage
      localStorage.setItem("employee", JSON.stringify(updatedEmployees));
      
      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      alert("Employee added successfully!");
      
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("Failed to add employee. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full sm:w-[90%] md:w-[70%] lg:w-[50%] mx-auto mt-10 text-white border border-gray-300 rounded-[8px]">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Add New Employee</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-lg font-medium">Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Enter employee name"
              className="w-full p-2 rounded-[8px] border border-gray-300"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-lg font-medium">Email</label>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter employee email"
              className="w-full p-2 rounded-[8px] border border-gray-300"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-lg font-medium">Password</label>
            <input
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter employee password"
              className="w-full p-2 rounded-[8px] border border-gray-300"
            />
            <p className="text-sm text-gray-400">
              Password must be at least 6 characters long
            </p>
          </div>
          
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 py-2.5 px-6 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 hover:cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                "Adding..."
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
