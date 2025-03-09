import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { LogOut } from "lucide-react";

export const Header = () => {
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const getCurrentUser = () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const role = localStorage.getItem("role");
        
        if (currentUser && currentUser.name) {
          setUserName(currentUser.name);
          setUserRole(role || "");
        } else {
          setUserName("Guest");
        }
      } catch (error) {
        console.error("Error getting current user:", error);
        setUserName("Guest");
      }
    };
    
    getCurrentUser();
  }, []);

  const handleLogout = () => {
    // Get the current user's name for the toast
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const name = currentUser?.name || "User";
    
    // Show loading toast
    toast.loading("Logging out...", {
      id: "logout",
      position: 'top-right',
      duration: 1000
    });

    // Add slight delay to simulate the process
    setTimeout(() => {
      // Clear user data from localStorage
      localStorage.removeItem("currentUser");
      localStorage.removeItem("role");
      
      // Dismiss loading toast and show success toast
      toast.success(`Goodbye, ${name}! Logged out successfully.`, {
        id: "logout",
        duration: 3000,
        icon: '👋',
        position: 'top-right',
        style: {
          background: '#333',
          color: '#fff'
        }
      });
      
      // Redirect to login page after a short delay to show the toast
      setTimeout(() => {
        navigate("/");
      }, 800);
    }, 500);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-4 bg-gray-800">
      {/* Add Toaster component */}
      <Toaster />
      
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-white">
          Hello 👋
          <br />
          <span className="text-amber-500 text-2xl sm:text-3xl capitalize">
            {userName}
            {userRole && <span className="text-sm text-gray-400 ml-2">({userRole})</span>}
          </span>
        </h1>
      </div>
      
      <div className="flex items-center gap-2 self-auto md:self-end">
        <button 
          onClick={handleLogout}
          className="bg-red-200 text-red-500 px-3 py-2 rounded-md hover:bg-red-500 hover:text-white font-medium transition-colors duration-200 flex items-center gap-1 cursor-pointer"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;