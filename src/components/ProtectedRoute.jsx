import React from 'react';
import { ProtectedRoute as AuthProtectedRoute } from '../lib/authComponents';

// Simple re-export of ProtectedRoute from authComponents
const ProtectedRoute = ({ children, requiredRole }) => {
  return (
    <AuthProtectedRoute requiredRole={requiredRole}>
      {children}
    </AuthProtectedRoute>
  );
};

export default ProtectedRoute;