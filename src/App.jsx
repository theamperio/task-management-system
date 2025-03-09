import React from "react";
import Login from "./Component/Auth/Login";
import EmployeeDashboard from "./Component/Dashboard/EmployeeDashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import  {AdminDashboard} from "./Component/Dashboard/AdminDashboard";
import { MainLayout } from "./Layout/MainLayout";
import ProtectedRoute from "./Component/Auth/ProjectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<MainLayout />}>
          <Route
            path="/employee"
            element={
              <ProtectedRoute>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
