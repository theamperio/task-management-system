import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
    // Clear user data from localStorage
    localStorage.removeItem("currentUser");
    localStorage.removeItem("role");
    
    // Redirect to login page
    navigate("/login");
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 p-2 sm:p-4 bg-gray-800 rounded-lg mb-4">
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
      
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <button 
          onClick={handleLogout}
          className="bg-red-200 text-red-500 px-3 py-2 rounded-md hover:bg-red-500 hover:text-white font-medium transition-colors duration-200 flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;