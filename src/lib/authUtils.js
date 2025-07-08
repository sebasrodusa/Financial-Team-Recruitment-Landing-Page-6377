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

// Authentication helper functions
export const getSession = async () => {
  return await supabase.auth.getSession();
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const signIn = async (email, password) => {
  return await supabase.auth.signInWithPassword({
    email: email.trim(),
    password
  });
};

export const createMockSession = (email) => {
  const mockSession = {
    user: {
      id: 'mock-user-id',
      email: email,
      role: 'admin'
    },
    access_token: 'mock-token'
  };
  
  localStorage.setItem('mockAdminSession', JSON.stringify(mockSession));
  return mockSession;
};

export const getMockSession = () => {
  const mockSession = localStorage.getItem('mockAdminSession');
  return mockSession ? JSON.parse(mockSession) : null;
};

export const clearMockSession = () => {
  localStorage.removeItem('mockAdminSession');
};