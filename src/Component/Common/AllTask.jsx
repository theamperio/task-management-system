import React, { useState, useEffect } from 'react';
import { getLocalStorage } from '../../Utils/Localstorage';

export const AllTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Array of Tailwind border colors for random selection
  const bgColors = [
    'border-blue-500', 'border-green-500', 'border-yellow-500', 'border-purple-500',
    'border-pink-500', 'border-indigo-500', 'border-red-500', 'border-teal-500',
    'border-orange-500', 'border-cyan-500'
  ];

  // Function to get random background color
  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * bgColors.length);
    return bgColors[randomIndex];
  };

  // Get status text and styling based on task properties
  const getStatusInfo = (task) => {
    if (task.completed) return { text: "Completed", class: "border-green-500 bg-opacity-20" };
    if (task.failed) return { text: "Failed", class: "border-red-500 bg-opacity-20" };
    if (task.newTask) return { text: "New", class: "border-blue-500 bg-opacity-20" };
    if (task.active) return { text: "In Progress", class: "border-yellow-500 bg-opacity-20" };
    return { text: "Unknown", class: "border-gray-500 bg-opacity-20" };
  };

  useEffect(() => {
    // Fetch data from localStorage
    const fetchTasks = () => {
      try {
        setLoading(true);
        const { employee } = getLocalStorage();
        
        // Create a flat array of all tasks with employee names
        const allTasks = [];
        
        employee.forEach(emp => {
          if (emp.tasks && Array.isArray(emp.tasks)) {
            emp.tasks.forEach(task => {
              allTasks.push({
                id: Math.random().toString(36).substr(2, 9), // Generate random ID
                name: emp.name,
                task: task.title,
                description: task.description,
                date: task.date,
                category: task.category,
                completed: task.completed,
                failed: task.failed,
                active: task.active,
                newTask: task.newTask
              });
            });
          }
        });
        
        setTasks(allTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div id='all-task-container' className='w-full sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] mx-auto mt-10 h-[430px] border border-gray-300 rounded-[8px] overflow-y-auto p-3 sm:p-5'>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-500 pb-2 mb-4">
        <div className='w-full sm:w-1/4 mb-2 sm:mb-0'>
          <div className="text-white text-sm sm:text-base font-medium">Employee</div>
        </div>
        <div className='w-full sm:w-2/4 mb-2 sm:mb-0'> 
          <div className="text-white text-sm sm:text-base font-medium">Task</div>
        </div>
        <div className='w-full sm:w-1/4 text-left sm:text-right pr-1'>
          <div className="text-white text-sm sm:text-base font-medium">Status</div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-48 text-white">
          Loading tasks...
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex justify-center items-center h-48 text-white">
          No tasks available
        </div>
      ) : (
        tasks.map((task) => {
          const status = getStatusInfo(task);
          return (
            <div 
              key={task.id}
              className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 sm:p-4 border-2 ${getRandomColor()} mb-2 rounded-md hover:shadow-md transition-shadow`}
            >
              <div className="w-full sm:w-1/4 mb-2 sm:mb-0">
                <h2 className="font-medium text-white text-sm sm:text-base">{task.name}</h2>
              </div>
              <div className="w-full sm:w-2/4 mb-2 sm:mb-0">
                <h3 className="text-white text-sm sm:text-base break-words">{task.task}</h3>
              </div>
              <div className="w-full sm:w-1/4 text-left sm:text-right">
                <span className={`inline-block px-2 py-1 rounded-full text-white text-xs sm:text-sm ${status.class}`}>
                  {status.text}
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
