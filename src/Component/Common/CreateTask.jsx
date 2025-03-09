import React, { useState, useContext } from "react";
import { DiamondPlus } from "lucide-react";
import { getLocalStorage } from "../../Utils/Localstorage";
import { AuthContext } from "../../Context/AuthProvider";
import toast, { Toaster } from "react-hot-toast";
import { TaskContext } from "../../Context/TaskProvider";

export const CreateTask = () => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskAssignTo, setTaskAssignTo] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskCategory, setTaskCategory] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Get user data from context
  const { userData } = useContext(AuthContext);
  
  // Get task trigger update function from context
  const { triggerTaskUpdate } = useContext(TaskContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create new task object with proper structure
      const newTask = {
        title: taskTitle,
        description: taskDescription,
        date: taskDate,
        category: taskCategory,
        active: true,
        newTask: true,
        completed: false,
        failed: false
      };
      
      // Find the employee to assign the task to
      const { employee } = getLocalStorage();
      const employeeIndex = employee.findIndex(emp => 
        emp.name.toLowerCase() === taskAssignTo.toLowerCase()
      );
      
      // If employee exists, add task to their tasks array
      if (employeeIndex !== -1) {
        // Create a deep copy of employee array
        const updatedEmployees = JSON.parse(JSON.stringify(employee));
        
        // Add new task to the employee's tasks array
        updatedEmployees[employeeIndex].tasks.push(newTask);
        
        // Simulate network delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Update localStorage with the new data
        localStorage.setItem("employee", JSON.stringify(updatedEmployees));
        
        // Reset form fields
        setTaskTitle("");
        setTaskAssignTo("");
        setTaskDate("");
        setTaskCategory("");
        setTaskDescription("");
        
        // Show success toast
        toast.success(`Task assigned to ${taskAssignTo} successfully!`, {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#333',
            color: '#fff',
          },
          iconTheme: {
            primary: '#10B981',
            secondary: '#FFF',
          },
        });
        
        // Update other components that display task data
        triggerTaskUpdate();
      } else {
        // Show error toast for employee not found
        toast.error(`Employee "${taskAssignTo}" not found. Please check the name.`, {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#333',
            color: '#fff',
          },
        });
      }
    } catch (error) {
      console.error("Error creating task:", error);
      
      // Show error toast for general errors
      toast.error("Failed to create task. Please try again.", {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#333',
          color: '#fff',
        },
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%] mx-auto mt-6 sm:mt-10 text-white border border-gray-300 rounded-[8px] shadow-md">
      {/* Add the Toaster component */}
      <Toaster />
      
      <div className="p-3 sm:p-4 md:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center sm:text-left">Create New Task</h2>
        
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-4">
              <div className="flex flex-col gap-1 sm:gap-2">
                <label className="text-base sm:text-lg font-bold">Task Title</label>
                <input
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  type="text"
                  placeholder="Enter task title"
                  className="w-full p-2 rounded-[8px] border border-gray-300 text-white bg-gray-700"
                />
              </div>
              
              <div className="flex flex-col gap-1 sm:gap-2">
                <label className="text-base sm:text-lg font-bold">Assign To</label>
                <input
                  required
                  value={taskAssignTo}
                  onChange={(e) => setTaskAssignTo(e.target.value)}
                  type="text"
                  placeholder="Enter employee name"
                  className="w-full p-2 rounded-[8px] border border-gray-300 text-white bg-gray-700"
                />
              </div>

              <div className="flex flex-col gap-1 sm:gap-2">
                <label className="text-base sm:text-lg font-bold">Due Date</label>
                <input
                  required
                  value={taskDate}
                  onChange={(e) => setTaskDate(e.target.value)}
                  type="date"
                  className="w-full p-2 rounded-[8px] border border-gray-300 text-white bg-gray-700"
                />
              </div>
              
              <div className="flex flex-col gap-1 sm:gap-2">
                <label className="text-base sm:text-lg font-bold">Category</label>
                <input
                  required
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value)}
                  type="text"
                  placeholder="Design, Marketing, etc"
                  className="w-full p-2 rounded-[8px] border border-gray-300 text-white bg-gray-700"
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-1 sm:gap-2">
              <label className="text-base sm:text-lg font-bold">Task Description</label>
              <textarea
                required
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                rows="10"
                placeholder="Enter task details here..."
                className="w-full p-2 rounded-[8px] border border-gray-300 text-white bg-gray-700 flex-grow"
              ></textarea>
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 py-2 px-4 sm:py-2.5 sm:px-5 text-sm font-medium text-white focus:outline-none bg-blue-600 rounded-lg border border-blue-700 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                "Creating..."
              ) : (
                <>
                  <DiamondPlus size={16} />
                  Create Task
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;

