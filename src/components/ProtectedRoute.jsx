import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, roleRequired, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roleRequired && user.role !== roleRequired) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
