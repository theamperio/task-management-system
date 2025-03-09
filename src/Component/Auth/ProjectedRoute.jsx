import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

/**
 * ProtectedRoute component to guard routes that require authentication
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {string} props.allowedRole - Optional role required to access this route (e.g., 'admin', 'employee')
 * @returns {React.ReactNode} - Either the protected component or a redirect to login
 */
const ProtectedRoute = ({ children, allowedRole }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasRequiredRole, setHasRequiredRole] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      try {
        const currentUser = localStorage.getItem('currentUser');
        const userRole = localStorage.getItem('role');
        
        // Check if user is logged in
        if (!currentUser) {
          setIsAuthenticated(false);
          return;
        }
        
        setIsAuthenticated(true);
        
        // If a specific role is required, check if user has that role
        if (allowedRole) {
          setHasRequiredRole(userRole === allowedRole);
        } else {
          setHasRequiredRole(true);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
        setHasRequiredRole(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [allowedRole]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    toast.error('Please log in to access this page', {
      position: 'top-right',
      style: {
        background: '#333',
        color: '#fff'
      }
    });
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If authenticated but wrong role, redirect to appropriate dashboard
  if (isAuthenticated && allowedRole && !hasRequiredRole) {
    const userRole = localStorage.getItem('role');
    const redirectPath = userRole === 'admin' ? '/admin' : '/employee';
    
    toast.error(`You don't have permission to access this page`, {
      position: 'top-right',
      style: {
        background: '#333',
        color: '#fff'
      }
    });
    return <Navigate to={redirectPath} replace />;
  }

  // If all checks pass, render the protected component
  return children;
};

export default ProtectedRoute;