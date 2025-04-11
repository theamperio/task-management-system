import React, { useState } from "react";
import  AllTask  from "../Common/AllTask";
import { CreateEmployee } from "../Common/CreateEmployee";
import { CreateTask } from "../Common/CreateTask";
import { useParams } from "react-router-dom";


export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("create-task");  
  
  return (
    <div className="container mx-auto py-4 px-4">
      {/* <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1> */}
      
      <div className="flex text-[13px] md:text-base border-b border-gray-700">
        <button
          onClick={() => setActiveTab("create-task")}
          className={`px-4 py-2 mr-2 cursor-pointer ${
            activeTab === "create-task"
              ? "border-b-2 border-blue-500 text-blue-500 "
              : "text-white"
          }`}
        >
          Create Task
        </button>
        <button
          onClick={() => setActiveTab("add-employee")}
          className={`px-4 py-2 mr-2 cursor-pointer ${
            activeTab === "add-employee"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-white"
          }`}
        >
          Add Employee
        </button>
        <button
          onClick={() => setActiveTab("all-tasks")}
          className={`px-4 py-2 cursor-pointer ${
            activeTab === "all-tasks"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-white"
          }`}
        >
          View All Tasks
        </button>
      </div>
            
      {activeTab === "create-task" && <CreateTask />}
      {activeTab === "add-employee" && <CreateEmployee />}
      {activeTab === "all-tasks" && <AllTask />}
    </div>
  );
};
