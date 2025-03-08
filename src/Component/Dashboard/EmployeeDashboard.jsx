import React from 'react'
import { Header } from '../Common/Header'
import TaskListNumber from '../Common/TaskListNumber';
import TaskList from '../Tasklist/TaskList';

const EmployeeDashboard = () => {
  return (
    <div className="h-screen w-full p-8" >
        <Header/>
        <TaskListNumber/>
       <TaskList/>
    </div>
  )
}

export default EmployeeDashboard;
