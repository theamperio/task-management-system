import React, { createContext, useEffect, useState } from "react";
import { getLocalStorage, setLocalStorage } from "../Utils/Localstorage";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    // Check if localStorage already has data
    const storedEmployee = localStorage.getItem("employee");
    const storedAdmin = localStorage.getItem("admin");
    
    // If not set, initialize it
    if (!storedEmployee || !storedAdmin) {
      setLocalStorage();
    }
    
    // Get the data (now it's guaranteed to exist)
    const { employee, admin } = getLocalStorage();
    setUserData({employee, admin});
  }, []);

  return (
    <AuthContext.Provider value={{userData}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
