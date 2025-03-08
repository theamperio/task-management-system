import React, { useState, useEffect } from 'react'
import { getLocalStorage } from '../../Utils/Localstorage'

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = () => {
            try {
                setLoading(true);
                
                // Get current user and role from localStorage
                const currentUser = JSON.parse(localStorage.getItem("currentUser"));
                const userRole = localStorage.getItem("role");
                
                // Get employee data from localStorage
                const { employee } = getLocalStorage();
                
                let userTasks = [];
                
                if (userRole === "employee" && currentUser) {
                    // Find the logged-in employee
                    const currentEmployee = employee.find(emp => emp.id === currentUser.id);
                    
                    if (currentEmployee && currentEmployee.tasks && Array.isArray(currentEmployee.tasks)) {
                        // Map employee's tasks to the format we need
                        userTasks = currentEmployee.tasks.map(task => ({
                            id: Math.random().toString(36).substr(2, 9),
                            title: task.title,
                            description: task.description,
                            level: task.category || "Medium",
                            date: new Date(task.date).toLocaleDateString('en-US', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            }),
                            status: getTaskStatus(task)
                        }));
                    }
                } else if (userRole === "admin") {
                    // If admin, get all tasks
                    employee.forEach(emp => {
                        if (emp.tasks && Array.isArray(emp.tasks)) {
                            // Add employee tasks with employee name
                            const employeeTasks = emp.tasks.map(task => ({
                                id: Math.random().toString(36).substr(2, 9),
                                title: task.title,
                                description: task.description,
                                level: task.category || "Medium",
                                date: new Date(task.date).toLocaleDateString('en-US', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                }),
                                employeeName: emp.name,
                                status: getTaskStatus(task)
                            }));
                            
                            userTasks = [...userTasks, ...employeeTasks];
                        }
                    });
                }
                
                setTasks(userTasks);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchTasks();
    }, []);
    
    // Helper function to determine task status
    const getTaskStatus = (task) => {
        if (task.completed) return "Completed";
        if (task.failed) return "Failed";
        if (task.newTask) return "New";
        if (task.active) return "Active";
        return "Pending";
    };
    
    // Function to get color based on task level/category
    const getLevelColor = (level) => {
        const lowerLevel = level.toLowerCase();
        if (lowerLevel.includes('high') || lowerLevel.includes('urgent')) 
            return 'text-red-500 bg-red-100';
        if (lowerLevel.includes('medium')) 
            return 'text-orange-500 bg-orange-100';
        if (lowerLevel.includes('low')) 
            return 'text-green-500 bg-green-100';
        
        // Default colors based on category types
        if (lowerLevel.includes('design')) 
            return 'text-purple-500 bg-purple-100';
        if (lowerLevel.includes('develop') || lowerLevel.includes('code')) 
            return 'text-blue-500 bg-blue-100';
        if (lowerLevel.includes('market')) 
            return 'text-green-500 bg-green-100';
        
        return 'text-gray-500 bg-gray-100';
    };
    
    // Function to get color for status badge
    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'text-green-700 bg-green-100';
            case 'Failed': return 'text-red-700 bg-red-100';
            case 'New': return 'text-blue-700 bg-blue-100';
            case 'Active': return 'text-orange-700 bg-orange-100';
            default: return 'text-gray-700 bg-gray-100';
        }
    };
  
    return (
        <div id="task-list" className='mt-5 rounded-[8px] h-[500px] overflow-auto'>
            <h2 className="text-xl font-bold text-white mb-4">Your Tasks</h2>
            
            {loading ? (
                <div className="flex justify-center items-center h-32 text-white">
                    Loading tasks...
                </div>
            ) : tasks.length === 0 ? (
                <div className="flex justify-center items-center h-32 text-white">
                    No tasks available
                </div>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {tasks.map((item) => (
                        <div key={item.id} className='bg-white dark:bg-gray-800 rounded-[12px] p-4 shadow-md hover:shadow-lg transition-shadow duration-300'>
                            <div className='flex justify-between items-center'>
                                <h3 className={`text-sm px-2 py-1 rounded-md ${getLevelColor(item.level)}`}>{item.level}</h3>
                                <div className="flex flex-col items-end">
                                    <h4 className='text-sm dark:text-gray-300'>{item.date}</h4>
                                    {item.employeeName && <span className="text-xs text-gray-500 mt-1">{item.employeeName}</span>}
                                </div>
                            </div>
                            <h2 className='mt-3 text-xl font-semibold dark:text-white'>{item.title}</h2>
                            <p className='text-sm mt-2 text-gray-700 dark:text-gray-300 line-clamp-3'>{item.description}</p>
                            
                            <div className="mt-3 flex justify-between items-center">
                                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
                                    {item.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default TaskList;