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

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      try {
        const token = localStorage.getItem('bibliokit-admin-token');
        const email = localStorage.getItem('bibliokit-admin-email');
        
        if (token && email) {
          // Verify token is still valid (you can enhance this with expiration checking)
          setAuthState({
            isAuthenticated: true,
            isAdmin: true,
            email: email,
            loading: false
          });
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
      // For now, we'll use environment variables for admin credentials
      // In production, this should use a proper authentication API
      const response = await fetch('/.netlify/functions/admin-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        localStorage.setItem('bibliokit-admin-token', result.token);
        localStorage.setItem('bibliokit-admin-email', email);
        
        setAuthState({
          isAuthenticated: true,
          isAdmin: true,
          email: email,
          loading: false
        });

        return { success: true };
      } else {
        return { success: false, error: result.error || 'Authentication failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  };

  const logout = () => {
    localStorage.removeItem('bibliokit-admin-token');
    localStorage.removeItem('bibliokit-admin-email');
    
    setAuthState({
      isAuthenticated: false,
      isAdmin: false,
      email: null,
      loading: false
    });
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