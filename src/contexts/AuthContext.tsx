import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  email: string | null;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isAdmin: false,
    email: null,
    loading: true
  });

  // Check session using HttpOnly cookie via /me endpoint
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/.netlify/functions/me', { credentials: 'include' });
        const data = await res.json();
        if (data.authenticated) {
          setAuthState({ isAuthenticated: true, isAdmin: true, email: data.user?.email || null, loading: false });
        } else {
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('Session check failed:', error);
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    };
    checkSession();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/.netlify/functions/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Cookie already set by server
        setAuthState({ isAuthenticated: true, isAdmin: true, email, loading: false });

        return { success: true };
      } else {
        return { success: false, error: result.error || 'Authentication failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/.netlify/functions/logout', { credentials: 'include' });
    } finally {
      setAuthState({ isAuthenticated: false, isAdmin: false, email: null, loading: false });
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 