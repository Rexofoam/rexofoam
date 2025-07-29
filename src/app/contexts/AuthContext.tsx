// Authentication context for managing login state and JWT tokens
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    if (savedToken) {
      // Validate token with backend
      validateToken(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const validateToken = async (token: string) => {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await fetch('/api/auth/validate', {
      //   method: 'GET',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json',
      //   },
      // });

      // const data = await response.json();

      // if (data.success && data.valid) {
      //   setToken(token);
      //   setIsAuthenticated(true);
      // } else {
      //   // Token is invalid, remove it
      //   localStorage.removeItem('auth_token');
      //   setToken(null);
      //   setIsAuthenticated(false);
      // }

      // TEMPORARY: Mock validation - validate token format
      if (token && token.startsWith('mock_jwt_token_')) {
        setToken(token);
        setIsAuthenticated(true);
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('auth_token');
        setToken(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      localStorage.removeItem('auth_token');
      setToken(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ password }),
      // });

      // const data = await response.json();

      // if (data.success) {
      //   setToken(data.token);
      //   setIsAuthenticated(true);
      //   localStorage.setItem('auth_token', data.token);
      //   return { success: true };
      // } else {
      //   return { success: false, message: data.message || 'Login failed' };
      // }

      // TEMPORARY: Mock authentication - use "demo123" as the password
      if (password === 'demo123') {
        const mockToken = `mock_jwt_token_${Date.now()}`;
        setToken(mockToken);
        setIsAuthenticated(true);
        localStorage.setItem('auth_token', mockToken);
        return { success: true };
      } else {
        return { success: false, message: 'Invalid password. Try "demo123" for demo.' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        // TODO: Replace with actual API call when backend is ready
        // await fetch('/api/auth/logout', {
        //   method: 'POST',
        //   headers: {
        //     'Authorization': `Bearer ${token}`,
        //     'Content-Type': 'application/json',
        //   },
        // });

        // TEMPORARY: Mock logout - just log the action
        console.log('Logging out user (mock)');
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local state regardless of API call success
      setToken(null);
      setIsAuthenticated(false);
      localStorage.removeItem('auth_token');
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    token,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
