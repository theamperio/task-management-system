import React, { useState, useEffect, useContext } from 'react';
import { getLocalStorage } from '../../Utils/Localstorage';
import { TaskContext } from '../../Context/TaskProvider';
import toast, { Toaster } from 'react-hot-toast';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // Add filter state
    
    // Get the task update trigger function from context
    const { triggerTaskUpdate } = useContext(TaskContext);

    useEffect(() => {
        fetchTasks();
    }, []);

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
                    userTasks = currentEmployee.tasks.map((task, index) => ({
                        id: Math.random().toString(36).substr(2, 9),
                        title: task.title,
                        description: task.description,
                        level: task.category || "Medium",
                        date: task.date,
                        formattedDate: new Date(task.date).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        }),
                        status: getTaskStatus(task),
                        completed: task.completed,
                        failed: task.failed,
                        active: task.active,
                        newTask: task.newTask,
                        employeeId: currentEmployee.id,
                        taskIndex: index
                    }));
                }
            } else if (userRole === "admin") {
                // If admin, get all tasks
                employee.forEach((emp, empIndex) => {
                    if (emp.tasks && Array.isArray(emp.tasks)) {
                        // Add employee tasks with employee name
                        const employeeTasks = emp.tasks.map((task, taskIndex) => ({
                            id: Math.random().toString(36).substr(2, 9),
                            title: task.title,
                            description: task.description,
                            level: task.category || "Medium",
                            date: task.date,
                            formattedDate: new Date(task.date).toLocaleDateString('en-US', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            }),
                            employeeName: emp.name,
                            status: getTaskStatus(task),
                            completed: task.completed,
                            failed: task.failed,
                            active: task.active,
                            newTask: task.newTask,
                            employeeId: emp.id,
                            taskIndex: taskIndex
                        }));
                        
                        userTasks = [...userTasks, ...employeeTasks];
                    }
                });
            }
            
            setTasks(userTasks);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            toast.error("Failed to load tasks", {
                duration: 3000,
                position: 'top-right',
                style: {
                    background: '#333',
                    color: '#fff'
                }
            });
        } finally {
            setLoading(false);
        }
    };
    
    // Helper function to determine task status
    const getTaskStatus = (task) => {
        if (task.completed) return "Completed";
        if (task.failed) return "Failed";
        if (task.newTask) return "New";
        if (task.active) return "Active";
        return "Pending";
    };
    
    // Task action handlers
    const handleAcceptTask = (taskData) => {
        updateTaskStatus(
            taskData, 
            { newTask: false, active: true },
            `Task "${taskData.title}" accepted successfully!`,
            "success"
        );
    };
    
    const handleCompleteTask = (taskData) => {
        updateTaskStatus(
            taskData, 
            { active: false, completed: true },
            `Task "${taskData.title}" marked as completed!`,
            "success"
        );
    };
    
    const handleRejectTask = (taskData) => {
        updateTaskStatus(
            taskData, 
            { active: false, failed: true, newTask: false },
            `Task "${taskData.title}" rejected.`,
            "warning"
        );
    };
    
    // Function to update task status in localStorage
    const updateTaskStatus = (taskData, newStatus, message, notificationType) => {
        try {
            // Get current data from localStorage
            const { employee } = getLocalStorage();
            
            // Find the employee
            const employeeIndex = employee.findIndex(emp => emp.id === taskData.employeeId);
            if (employeeIndex === -1) {
                toast.error("Error: Employee not found", {
                    duration: 3000,
                    position: 'top-right',
                    style: {
                        background: '#333',
                        color: '#fff'
                    }
                });
                return;
            }
            
            // Create deep copy to avoid reference issues
            const updatedEmployees = JSON.parse(JSON.stringify(employee));
            
            // Update the specific task with new status
            const task = updatedEmployees[employeeIndex].tasks[taskData.taskIndex];
            Object.assign(task, newStatus);
            
            // Save back to localStorage
            localStorage.setItem("employee", JSON.stringify(updatedEmployees));
            
            // Show toast notification based on type
            if (notificationType === 'success') {
                toast.success(message, {
                    duration: 3000,
                    position: 'top-right',
                    style: {
                        background: '#333',
                        color: '#fff'
                    },
                    iconTheme: {
                        primary: '#10B981',
                        secondary: '#FFF'
                    }
                });
            } else if (notificationType === 'warning') {
                toast(message, {
                    duration: 3000,
                    position: 'top-right',
                    icon: '⚠️',
                    style: {
                        background: '#333',
                        color: '#fff'
                    }
                });
            } else {
                toast(message, {
                    duration: 3000,
                    position: 'top-right',
                    style: {
                        background: '#333',
                        color: '#fff'
                    }
                });
            }
            
            // Refresh task list
            fetchTasks();
            
            // Trigger update in other components
            triggerTaskUpdate();
            
        } catch (error) {
            console.error("Error updating task status:", error);
            toast.error("Error updating task status", {
                duration: 3000,
                position: 'top-right',
                style: {
                    background: '#333',
                    color: '#fff'
                }
            });
        }
    };
    
    // Check if task is overdue
    const isTaskOverdue = (date) => {
        const taskDate = new Date(date);
        const today = new Date();
        return taskDate < today;
    };
    
    // Auto-fail overdue tasks that are still active or new
    useEffect(() => {
        const checkOverdueTasks = () => {
            const tasksToUpdate = tasks.filter(task => 
                (task.active || task.newTask) && 
                !task.completed && 
                !task.failed && 
                isTaskOverdue(task.date)
            );
            
            tasksToUpdate.forEach(task => {
                handleRejectTask(task);
            });
        };
        
        if (tasks.length > 0) {
            checkOverdueTasks();
        }
    }, [tasks]);
    
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
  
    // Add filter change handler
    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    // Filter tasks based on selected filter
    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        if (filter === 'new') return task.status === 'New';
        if (filter === 'active') return task.status === 'Active';
        if (filter === 'completed') return task.status === 'Completed';
        if (filter === 'failed') return task.status === 'Failed';
        return true;
    });
  
    return (
        <div id="task-list" className='mt-5 rounded-[8px] h-[500px] overflow-auto'>
            {/* React Hot Toast container */}
            <Toaster />
            
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Your Tasks</h2>
                
                {/* Filter dropdown */}
                <div className="relative">
                    <select 
                        value={filter}
                        onChange={handleFilterChange}
                        className="bg-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 pr-8 appearance-none cursor-pointer"
                    >
                        <option value="all">All Tasks</option>
                        <option value="new">New</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </div>
                </div>
            </div>
            
            {loading ? (
                <div className="flex justify-center items-center h-32 text-white">
                    Loading tasks...
                </div>
            ) : tasks.length === 0 ? (
                <div className="flex justify-center items-center h-32 text-white">
                    No tasks available
                </div>
            ) : filteredTasks.length === 0 ? (
                <div className="flex justify-center items-center h-32 text-white">
                    No {filter !== 'all' ? filter : ''} tasks found
                </div>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {filteredTasks.map((item) => (
                        <div key={item.id} className='bg-white dark:bg-gray-800 rounded-[12px] p-4 shadow-md hover:shadow-lg transition-shadow duration-300'>
                            <div className='flex justify-between items-center'>
                                <h3 className={`text-sm px-2 py-1 rounded-md ${getLevelColor(item.level)}`}>{item.level}</h3>
                                <div className="flex flex-col items-end">
                                    <h4 className='text-sm dark:text-gray-300'>
                                        {item.formattedDate}
                                        {isTaskOverdue(item.date) && !item.completed && (
                                            <span className="ml-1 text-xs text-red-500">(Overdue)</span>
                                        )}
                                    </h4>
                                    {item.employeeName && <span className="text-xs text-gray-500 mt-1">{item.employeeName}</span>}
                                </div>
                            </div>
                            <h2 className='mt-3 text-xl font-semibold dark:text-white'>{item.title}</h2>
                            <p className='text-sm mt-2 text-gray-700 dark:text-gray-300 line-clamp-3'>{item.description}</p>
                            
                            <div className="mt-3 flex flex-wrap items-center justify-between">
                                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
                                    {item.status}
                                </span>
                                
                                {/* Show action buttons for employees only and based on task state */}
                                {localStorage.getItem("role") === "employee" && (
                                    <div className="flex gap-1 mt-2 sm:mt-0">
                                        {item.newTask && (
                                            <button 
                                                onClick={() => handleAcceptTask(item)}
                                                className="text-xs px-2 py-1 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600"
                                            >
                                                Accept
                                            </button>
                                        )}
                                        
                                        {item.active && (
                                            <button 
                                                onClick={() => handleCompleteTask(item)}
                                                className="text-xs px-2 py-1 bg-green-500 text-white rounded-md cursor-pointer hover:bg-green-600"
                                            >
                                                Complete
                                            </button>
                                        )}
                                        
                                        {(item.newTask || item.active) && (
                                            <button 
                                                onClick={() => handleRejectTask(item)}
                                                className="text-xs px-2 py-1 bg-red-500 text-white rounded-md cursor-pointer hover:bg-red-600"
                                            >
                                                Reject
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TaskList;