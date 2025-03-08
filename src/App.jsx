import React from 'react'
import Login from './Component/Auth/Login';
import EmployeeDashboard from './Component/Dashboard/EmployeeDashboard';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AdminDashboard } from './Component/Dashboard/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/employee" element={<EmployeeDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}