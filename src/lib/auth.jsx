import React from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from './supabase';

// Role definitions
export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user'
};

// Check if user has required role
export const hasRole = (user, requiredRole) => {
  if (!user || !user.role) return false;
  
  // Role hierarchy
  const roleHierarchy = {
    [ROLES.ADMIN]: 3,
    [ROLES.MANAGER]: 2,
    [ROLES.USER]: 1
  };
  
  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
};

// Protected route HOC
export const withAuth = (WrappedComponent, requiredRole = ROLES.USER) => {
  return function WithAuthComponent(props) {
    const [session, setSession] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const navigate = useNavigate();

    React.useEffect(() => {
      // Check for mock session first
      const mockSession = localStorage.getItem('mockAdminSession');
      if (mockSession) {
        const parsedSession = JSON.parse(mockSession);
        setSession(parsedSession);
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

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (!session || !hasRole(session.user, requiredRole)) {
      navigate('/admin/login');
      return null;
    }

    return <WrappedComponent {...props} session={session} />;
  };
};

// Authentication hooks
export const useAuth = () => {
  const [session, setSession] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Check for mock session
    const mockSession = localStorage.getItem('mockAdminSession');
    if (mockSession) {
      setSession(JSON.parse(mockSession));
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