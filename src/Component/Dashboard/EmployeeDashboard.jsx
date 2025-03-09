import React from 'react'
import TaskListNumber from '../Common/TaskListNumber';
import TaskList from '../Tasklist/TaskList';

const EmployeeDashboard = () => {
  return (
    <div className="h-full w-full p-4" >
        <TaskListNumber/>
       <TaskList/>
    </div>
  )
}

export default EmployeeDashboard;
