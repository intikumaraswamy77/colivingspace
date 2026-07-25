import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  if (!userInfo) {
    // Not logged in, kick to home
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userInfo.role)) {
    // Logged in, but wrong role, kick to home
    return <Navigate to="/" replace />;
  }

  // Authorized, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
