import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AdminLoginProps {
  onClose?: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      
      if (result.success) {
        if (onClose) onClose();
        // If we're on the admin page, reload to show the dashboard
        if (window.location.pathname === '/admin') {
          window.location.reload();
        }
      } else {
        if (result.error === 'Server configuration error') {
          setError('Admin credentials not configured. Please contact the site administrator.');
        } else {
          setError(result.error || 'Login failed');
        }
      }
    } catch (error) {
      setError('Network error: Unable to connect to the authentication server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Admin Login</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="admin@bibliokit.com"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-sm text-muted-foreground">
          <p><strong>Note:</strong> This is the admin login for content management.</p>
          <p className="mt-2 text-xs">
            <strong>Development:</strong> If admin credentials are not configured, 
            please check the environment variables setup in your deployment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin; 