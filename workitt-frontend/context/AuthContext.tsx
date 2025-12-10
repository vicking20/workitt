/**
 * Authentication Context
 * Provides global authentication state and functions
 * Handles user state, loading, and authentication logic
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '../services/api';

interface User {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  is_admin: boolean;
  verified: boolean;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string, confirmPassword: string) => Promise<boolean>;
  logout: () => Promise<void>;
  verifyEmail: (token: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, password: string, confirmPassword: string) => Promise<boolean>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Always check backend for session cookie
        const response = await apiClient.getCurrentUser();
        if (response.success && response.user) {
          setUser(response.user);
        } else {
          // Not authenticated
          setUser(null);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await apiClient.login(email, password);

      if (response.success && response.user) {
        setUser(response.user);
        return true;
      } else {
        setError(response.error || 'Login failed');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<boolean> => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await apiClient.signup(username, email, password, confirmPassword);

      if (response.success) {
        // Don't set user yet - they need to verify email first
        return true;
      } else {
        setError(response.error || 'Signup failed');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setError(null);
    setIsLoading(true);

    try {
      await apiClient.logout();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  const verifyEmail = async (token: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await apiClient.verifyEmail(token);

      if (response.success) {
        return true;
      } else {
        setError(response.error || 'Email verification failed');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await apiClient.forgotPassword(email);

      if (response.success) {
        return true;
      } else {
        setError(response.error || 'Password reset request failed');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (
    token: string,
    password: string,
    confirmPassword: string
  ): Promise<boolean> => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await apiClient.resetPassword(token, password, confirmPassword);

      if (response.success) {
        return true;
      } else {
        setError(response.error || 'Password reset failed');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    signup,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use authentication context
 * Must be used within AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
