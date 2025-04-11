import React, { useState, useEffect, useContext, useRef } from "react";
import { getLocalStorage } from "../../Utils/Localstorage";
import { Calendar, X, AlertCircle } from "lucide-react";
import { TaskContext } from "../../Context/TaskProvider";

const AllTask = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all"); // Add this state for filtering
  const { taskUpdateTrigger } = useContext(TaskContext);
  const modalRef = useRef(null);

  // Status background colors
  const statusColors = {
    new: "bg-blue-600 bg-opacity-80",
    active: "bg-yellow-500 bg-opacity-80",
    completed: "bg-green-600 bg-opacity-80",
    failed: "bg-red-600 bg-opacity-80",
  };

  useEffect(() => {
    fetchEmployeeData();
  }, [taskUpdateTrigger]);

  // Close modal when clicking escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowModal(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  // Handle outside click to close modal
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        showModal &&
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        setShowModal(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showModal]);

  const fetchEmployeeData = () => {
    try {
      setLoading(true);
      const { employee } = getLocalStorage();

      // Map employees with task statistics
      const employeesWithStats = employee.map((emp) => {
        // Initialize counters
        let newCount = 0;
        let activeCount = 0;
        let completedCount = 0;
        let failedCount = 0;

        // Count tasks for this employee
        if (emp.tasks && Array.isArray(emp.tasks)) {
          emp.tasks.forEach((task) => {
            if (task.newTask) newCount++;
            if (task.active && !task.newTask) activeCount++;
            if (task.completed) completedCount++;
            if (task.failed) failedCount++;
          });
        }

        // Return employee with stats
        return {
          ...emp,
          stats: {
            new: newCount,
            active: activeCount,
            completed: completedCount,
            failed: failedCount,
            total: newCount + activeCount + completedCount + failedCount,
          },
        };
      });

      setEmployees(employeesWithStats);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "No due date";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Check if date is overdue
  const isOverdue = (dateString) => {
    if (!dateString) return false;
    const dueDate = new Date(dateString);
    const today = new Date();
    return dueDate < today;
  };

  // Get status text
  const getStatusText = (task) => {
    if (task.completed) return "Completed";
    if (task.failed) return "Failed";
    if (task.newTask) return "New";
    if (task.active) return "Active";
    return "Unknown";
  };

  const handleViewTasks = (emp) => {
    setSelectedEmployee(emp);
    setShowModal(true);
    setActiveFilter("all"); // Reset filter when opening modal
  };

  // Add this function to handle filter changes
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <div className="w-full sm:w-[90%] md:w-[85%] lg:w-[80%] mx-auto mt-10 mb-10">
      <h1 className="text-xl sm:text-2xl font-bold text-white mb-6">
        Employee Task Dashboard
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-48 text-white bg-gray-800 rounded-lg">
          Loading employee data...
        </div>
      ) : employees.length === 0 ? (
        <div className="flex justify-center items-center h-48 text-white bg-gray-800 rounded-lg">
          No employees available
        </div>
      ) : (
        <div className="space-y-6">
          {/* Employee stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {employees.map((emp) => (
              <div
                key={emp.id}
                className="bg-gray-800 rounded-lg p-5 shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-white">
                    {emp.name}
                  </h2>
                  <button
                    onClick={() => handleViewTasks(emp)}
                    className="px-3 py-1 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors cursor-pointer"
                  >
                    View Tasks
                  </button>
                </div>

                {/* Task statistics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-700 p-3 rounded-md flex flex-col items-center">
                    <span className="text-sm text-gray-300">Total Tasks</span>
                    <span className="text-xl font-bold text-white">
                      {emp.stats.total}
                    </span>
                  </div>

                  <div className="bg-gray-700 p-3 rounded-md flex flex-col items-center">
                    <span className="text-sm text-gray-300">New</span>
                    <span className="text-xl font-bold text-blue-400">
                      {emp.stats.new}
                    </span>
                  </div>

                  <div className="bg-gray-700 p-3 rounded-md flex flex-col items-center">
                    <span className="text-sm text-gray-300">Active</span>
                    <span className="text-xl font-bold text-yellow-400">
                      {emp.stats.active}
                    </span>
                  </div>

                  <div className="bg-gray-700 p-3 rounded-md flex flex-col items-center">
                    <span className="text-sm text-gray-300">Completed</span>
                    <span className="text-xl font-bold text-green-400">
                      {emp.stats.completed}
                    </span>
                  </div>

                  <div className="bg-gray-700 p-3 rounded-md flex flex-col items-center col-span-2">
                    <span className="text-sm text-gray-300">Failed</span>
                    <span className="text-xl font-bold text-red-400">
                      {emp.stats.failed}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal dialog for tasks */}
      {showModal && selectedEmployee && (
        <div
          className="fixed inset-0 bg-gray-950/75 bg-opacity-10 flex items-center justify-center z-50 px-4 py-6"
          aria-modal="true"
          role="dialog"
        >
          <div
            ref={modalRef}
            className="bg-gray-800 rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
          >
            {/* Modal header */}
            <div className="border-b border-gray-700 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                {selectedEmployee.name}'s Tasks ({selectedEmployee.stats.total})
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal body */}
            <div className="p-4 overflow-y-auto flex-grow">
              {!selectedEmployee.tasks ||
              selectedEmployee.tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertCircle size={48} className="text-gray-500 mb-3" />
                  <p className="text-gray-400">
                    No tasks assigned to this employee
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Task filter tabs */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <button 
                      className={`${activeFilter === "all" ? "bg-blue-600" : "bg-gray-700 hover:bg-blue-600"} text-white text-xs px-3 py-1 rounded-full cursor-pointer transition-colors`}
                      onClick={() => handleFilterChange("all")}
                    >
                      All
                    </button>
                    <button 
                      className={`${activeFilter === "new" ? "bg-blue-600" : "bg-gray-700 hover:bg-blue-600"} text-white text-xs cursor-pointer px-3 py-1 rounded-full transition-colors`}
                      onClick={() => handleFilterChange("new")}
                    >
                      New
                    </button>
                    <button 
                      className={`${activeFilter === "active" ? "bg-yellow-500" : "bg-gray-700 hover:bg-yellow-500"} text-white text-xs cursor-pointer px-3 py-1 rounded-full transition-colors`}
                      onClick={() => handleFilterChange("active")}
                    >
                      Active
                    </button>
                    <button 
                      className={`${activeFilter === "completed" ? "bg-green-600" : "bg-gray-700 hover:bg-green-600"} text-white text-xs cursor-pointer px-3 py-1 rounded-full transition-colors`}
                      onClick={() => handleFilterChange("completed")}
                    >
                      Completed
                    </button>
                    <button 
                      className={`${activeFilter === "failed" ? "bg-red-600" : "bg-gray-700 hover:bg-red-600"} text-white text-xs cursor-pointer px-3 py-1 rounded-full transition-colors`}
                      onClick={() => handleFilterChange("failed")}
                    >
                      Failed
                    </button>
                  </div>

                  {/* Sort tasks by date - newest first */}
                  {(() => {
                    const filteredTasks = [...selectedEmployee.tasks].filter(task => {
                      if (activeFilter === "all") return true;
                      if (activeFilter === "new") return task.newTask;
                      if (activeFilter === "active") return task.active && !task.newTask;
                      if (activeFilter === "completed") return task.completed;
                      if (activeFilter === "failed") return task.failed;
                      return true;
                    });

                    if (filteredTasks.length === 0) {
                      return (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <AlertCircle size={48} className="text-gray-500 mb-3" />
                          <p className="text-gray-400">
                            No {activeFilter !== "all" ? activeFilter : ""} tasks found
                          </p>
                        </div>
                      );
                    }

                    return filteredTasks
                      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
                      .map((task, index) => (
                        <div
                          key={index}
                          className="bg-gray-700 p-4 rounded-lg hover:bg-gray-650 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                            <h3 className="text-white font-medium text-lg">
                              {task.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs px-2 py-1 rounded-full text-white ${
                                  statusColors[
                                    getStatusText(task).toLowerCase()
                                  ] || "bg-gray-500"
                                }`}
                              >
                                {getStatusText(task)}
                              </span>
                              <span className="text-xs px-2 py-1 bg-gray-600 text-gray-300 rounded-full">
                                {task.category}
                              </span>
                            </div>
                          </div>

                          <p className="text-gray-300 mb-4">{task.description}</p>

                          <div className="flex items-center text-sm">
                            <Calendar size={16} className="text-gray-400 mr-2" />
                            <span
                              className={`${
                                isOverdue(task.date) &&
                                !task.completed &&
                                !task.failed
                                  ? "text-red-400"
                                  : "text-gray-400"
                              }`}
                            >
                              Due: {formatDate(task.date)}
                              {isOverdue(task.date) &&
                                !task.completed &&
                                !task.failed && (
                                  <span className="ml-2 text-red-400 font-medium">
                                    (Overdue)
                                  </span>
                                )}
                            </span>
                          </div>
                        </div>
                      ));
                  })()}
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="border-t border-gray-700 p-4 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllTask;
