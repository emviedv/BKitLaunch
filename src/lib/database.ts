// Database configuration for frontend
interface DatabaseConfig {
  host: string;
  database: string;
  user: string;
  password: string;
  port: number;
  ssl: boolean;
}

// Get database config from environment variables
export const getDbConfig = (): DatabaseConfig => {
  return {
    host: import.meta.env.VITE_DB_HOST || '',
    database: import.meta.env.VITE_DB_NAME || '',
    user: import.meta.env.VITE_DB_USER || '',
    password: import.meta.env.VITE_DB_PASSWORD || '',
    port: parseInt(import.meta.env.VITE_DB_PORT || '5432'),
    ssl: import.meta.env.VITE_DB_SSL === 'true'
  };
};

// Database connection URL
export const getDatabaseUrl = (): string => {
  return import.meta.env.VITE_DATABASE_URL || '';
};

// Get API base URL based on environment
const getApiBaseUrl = (): string => {
  // In production (Netlify), use the current domain
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return window.location.origin;
  }
  // In development, use localhost
  return 'http://localhost:9501';
};

// Test connection function (for backend use)
export const testDatabaseConnection = async (): Promise<boolean> => {
  try {
    // This would be called via an API endpoint in a real app
    console.log('Database config:', getDbConfig());
    console.log('Database URL configured:', !!getDatabaseUrl());
    return true;
  } catch (error) {
    console.error('Database configuration error:', error);
    return false;
  }
};

// Types for database entities
export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// API functions that call backend endpoints
export const apiClient = {
  // Test database connection via API
  async testConnection(): Promise<DatabaseResponse<boolean>> {
    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/db-test`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return { 
        success: true, 
        data: data.connected,
        error: data.connected ? undefined : data.error 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to test connection' 
      };
    }
  },

  // Get all users
  async getUsers(): Promise<DatabaseResponse<User[]>> {
    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/users`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch users' 
      };
    }
  },

  // Create a new user
  async createUser(email: string, name: string): Promise<DatabaseResponse<User>> {
    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create user' 
      };
    }
  },

  // Get database tables
  async getTables(): Promise<DatabaseResponse<string[]>> {
    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/db-tables`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch tables' 
      };
    }
  }
};

// Hook for database operations in React components
export const useDatabase = () => {
  const config = getDbConfig();
  const connectionUrl = getDatabaseUrl();

  return {
    config,
    connectionUrl,
    isConfigured: !!connectionUrl,
    api: apiClient
  };
}; 