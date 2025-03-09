import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [taskUpdateTrigger, setTaskUpdateTrigger] = useState(0);

  // Function to trigger updates across components
  const triggerTaskUpdate = () => {
    setTaskUpdateTrigger(prev => prev + 1);
  };

  return (
    <TaskContext.Provider value={{ taskUpdateTrigger, triggerTaskUpdate }}>
      {children}
    </TaskContext.Provider>
  );
};
