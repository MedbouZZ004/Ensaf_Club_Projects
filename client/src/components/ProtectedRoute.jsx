import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  let hasUser = false;
  try {
    const raw = localStorage.getItem('user');
    hasUser = !!raw && JSON.parse(raw);
  } catch {
    hasUser = false;
  }
  const location = useLocation();
  if (!hasUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
};

export default ProtectedRoute;
