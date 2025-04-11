import React, { useState, useEffect, useContext } from 'react';
import { getLocalStorage } from '../../Utils/Localstorage';
import { TaskContext } from '../../Context/TaskProvider';

const TaskListNumber = () => {
    const [taskStats, setTaskStats] = useState({
        newTasks: 0,
        activeTasks: 0,
        completedTasks: 0,
        failedTasks: 0
    });
    
    // Get the task update trigger from context
    const { taskUpdateTrigger } = useContext(TaskContext);

    useEffect(() => {
        // Fetch data from localStorage and count tasks by status
        const calculateTaskStats = () => {
            try {
                // Get the currently logged in user
                const currentUser = JSON.parse(localStorage.getItem("currentUser"));
                const userRole = localStorage.getItem("role");
                
                // Initialize counters
                let newCount = 0;
                let activeCount = 0;
                let completedCount = 0;
                let failedCount = 0;
                
                if (userRole === "admin") {
                    // If admin is logged in, count all tasks from all employees
                    const { employee } = getLocalStorage();
                    
                    employee.forEach(emp => {
                        if (emp.tasks && Array.isArray(emp.tasks)) {
                            emp.tasks.forEach(task => {
                                if (task.newTask) newCount++;
                                if (task.active && !task.newTask) activeCount++;
                                if (task.completed) completedCount++;
                                if (task.failed) failedCount++;
                            });
                        }
                    });
                } else if (userRole === "employee" && currentUser) {
                    // If employee is logged in, only count their tasks
                    const { employee } = getLocalStorage();
                    
                    // Find the logged-in employee
                    const currentEmployee = employee.find(emp => emp.id === currentUser.id);
                    
                    if (currentEmployee && currentEmployee.tasks && Array.isArray(currentEmployee.tasks)) {
                        currentEmployee.tasks.forEach(task => {
                            if (task.newTask) newCount++;
                            if (task.active && !task.newTask) activeCount++;
                            if (task.completed) completedCount++;
                            if (task.failed) failedCount++;
                        });
                    }
                }
                
                // Update state with the calculated counts
                setTaskStats({
                    newTasks: newCount,
                    activeTasks: activeCount,
                    completedTasks: completedCount,
                    failedTasks: failedCount
                });
            } catch (error) {
                console.error("Error calculating task statistics:", error);
            }
        };
        
        calculateTaskStats();
    }, [taskUpdateTrigger]); // Re-run when taskUpdateTrigger changes

    const data = [
        {
            id: 1,
            title: "New Task",
            number: taskStats.newTasks,
            bgColor: "bg-blue-100",
            textColor: "text-blue-700",
            titleColor: "text-blue-500"
        },
        {
            id: 2,
            title: "Active",
            number: taskStats.activeTasks,
            bgColor: "bg-green-100",
            textColor: "text-green-700",
            titleColor: "text-green-500"
        },
        {
            id: 3,
            title: "Completed",
            number: taskStats.completedTasks,
            bgColor: "bg-purple-100",
            textColor: "text-purple-700",
            titleColor: "text-purple-500"
        },
        {
            id: 4,
            title: "Failed",
            number: taskStats.failedTasks,
            bgColor: "bg-red-100",
            textColor: "text-red-700",
            titleColor: "text-red-500"
        }
    ];
    
    return (
        <div className=" grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.map((item) => (
                <div 
                    key={item.id} 
                    className={`${item.bgColor} p-4 rounded-xl shadow hover:shadow-md transition-shadow duration-300`}
                >
                    <h2 className={`text-2xl font-semibold ${item.textColor}`}>{item.number}</h2>
                    <h3 className={`text-sm sm:text-base font-bold ${item.titleColor}`}>{item.title}</h3>
                </div>
            ))}
        </div>
    );
};

export default TaskListNumber;