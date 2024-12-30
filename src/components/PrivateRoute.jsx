// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

// This component checks if a user is authenticated
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');  // Check for the presence of a token
  
  // If no token exists, redirect to login page
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If token exists, render the children (protected component)
  return children;
};

export default PrivateRoute;