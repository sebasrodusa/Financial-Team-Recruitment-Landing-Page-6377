import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import supabase from './supabase';
import { hasRole, ROLES, getMockSession } from './authUtils';

// Authentication hook with React components
export const useAuth = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for mock session
    const mockSession = getMockSession();
    if (mockSession) {
      setSession(mockSession);
      setLoading(false);
      return;
    }

    // Check Supabase session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { session, loading };
};

// Protected route component
export const ProtectedRoute = ({ children, requiredRole = ROLES.USER }) => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session || !hasRole(session.user, requiredRole)) {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

// Auth provider for context
export const AuthProvider = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

// Auth context
export const AuthContext = React.createContext(null);

// useAuthContext hook
export const useAuthContext = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};