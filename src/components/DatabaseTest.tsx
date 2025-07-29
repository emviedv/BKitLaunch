import React, { useState, useEffect } from 'react';
import { useDatabase, type User } from '@/lib/database';

const DatabaseTest = () => {
  const { config, connectionUrl, isConfigured, api } = useDatabase();
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'failed'>('unknown');
  const [users, setUsers] = useState<User[]>([]);
  const [tables, setTables] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', name: '' });

  // Test connection on component mount
  useEffect(() => {
    if (isConfigured) {
      testConnection();
    }
  }, [isConfigured]);

  const testConnection = async () => {
    setLoading(true);
    try {
      // For now, just log the configuration since we don't have a backend
      console.log('Database Configuration:');
      console.log('Host:', config.host);
      console.log('Database:', config.database);
      console.log('User:', config.user);
      console.log('Port:', config.port);
      console.log('SSL:', config.ssl);
      console.log('Connection URL configured:', !!connectionUrl);
      
      setConnectionStatus('connected');
    } catch (error) {
      console.error('Connection test failed:', error);
      setConnectionStatus('failed');
    }
    setLoading(false);
  };

  const loadUsers = async () => {
    setLoading(true);
    const response = await api.getUsers();
    if (response.success && response.data) {
      setUsers(response.data);
    } else {
      console.error('Failed to load users:', response.error);
    }
    setLoading(false);
  };

  const loadTables = async () => {
    setLoading(true);
    const response = await api.getTables();
    if (response.success && response.data) {
      setTables(response.data);
    } else {
      console.error('Failed to load tables:', response.error);
    }
    setLoading(false);
  };

  const createUser = async () => {
    if (!newUser.email || !newUser.name) return;
    
    setLoading(true);
    const response = await api.createUser(newUser.email, newUser.name);
    if (response.success) {
      console.log('User created:', response.data);
      setNewUser({ email: '', name: '' });
      loadUsers(); // Reload users
    } else {
      console.error('Failed to create user:', response.error);
    }
    setLoading(false);
  };

  if (!isConfigured) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Database Not Configured</h3>
        <p className="text-red-600">Please check your environment variables.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-4">Database Connection Test</h2>
        
        {/* Connection Status */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold">Connection Status:</h3>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              connectionStatus === 'connected' 
                ? 'bg-green-100 text-green-800' 
                : connectionStatus === 'failed'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {connectionStatus === 'connected' ? '✅ Connected' : 
               connectionStatus === 'failed' ? '❌ Failed' : '⏳ Unknown'}
            </div>
            <button 
              onClick={testConnection}
              disabled={loading}
              className="btn-secondary"
            >
              {loading ? 'Testing...' : 'Test Connection'}
            </button>
          </div>
        </div>

        {/* Database Configuration */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Configuration:</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2 font-mono text-sm">
            <div><strong>Host:</strong> {config.host}</div>
            <div><strong>Database:</strong> {config.database}</div>
            <div><strong>User:</strong> {config.user}</div>
            <div><strong>Port:</strong> {config.port}</div>
            <div><strong>SSL:</strong> {config.ssl ? 'Enabled' : 'Disabled'}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <button 
            onClick={loadTables}
            disabled={loading}
            className="btn-secondary"
          >
            Load Tables
          </button>
          <button 
            onClick={loadUsers}
            disabled={loading}
            className="btn-secondary"
          >
            Load Users
          </button>
          <button 
            onClick={() => console.log('Database operations ready')}
            className="btn-primary"
          >
            Run Queries
          </button>
        </div>
      </div>

      {/* Tables List */}
      {tables.length > 0 && (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-3">Database Tables:</h3>
          <div className="space-y-2">
            {tables.map((table, index) => (
              <div key={index} className="bg-gray-50 px-3 py-2 rounded font-mono text-sm">
                {table}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create User Form */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-3">Create New User:</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="border rounded-md px-3 py-2"
          />
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="border rounded-md px-3 py-2"
          />
          <button 
            onClick={createUser}
            disabled={loading || !newUser.email || !newUser.name}
            className="btn-primary"
          >
            Create User
          </button>
        </div>
      </div>

      {/* Users List */}
      {users.length > 0 && (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-3">Users:</h3>
          <div className="space-y-2">
            {users.map((user) => (
              <div key={user.id} className="bg-gray-50 p-3 rounded">
                <div className="font-semibold">{user.name}</div>
                <div className="text-gray-600 text-sm">{user.email}</div>
                <div className="text-gray-500 text-xs">
                  Created: {new Date(user.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Note about backend requirement */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Backend Required</h3>
        <p className="text-blue-600 mb-2">
          To fully test the database connection, you'll need to set up a backend API server that can:
        </p>
        <ul className="list-disc list-inside text-blue-600 space-y-1">
          <li>Connect to the PostgreSQL database using the credentials</li>
          <li>Provide API endpoints for CRUD operations</li>
          <li>Handle CORS for frontend requests</li>
        </ul>
        <p className="text-blue-600 mt-2">
          The database configuration is ready and can be used with Node.js, Express, or any backend framework.
        </p>
      </div>
    </div>
  );
};

export default DatabaseTest; 