import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';

const AdminHeader: React.FC = () => {
  const { isAuthenticated, isAdmin, email, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [pathInput, setPathInput] = useState<string>('');

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-amber-100 border-b border-amber-200 text-amber-800 px-4 py-2 z-40">
      <div className="container mx-auto flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <span className="font-medium">🔧 Admin Mode</span>
          <span className="text-amber-600">Logged in as: {email}</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/admin"
            className="bg-amber-200 hover:bg-amber-300 text-amber-800 px-3 py-1 rounded text-xs font-medium transition-colors"
          >
            📊 Admin Dashboard
          </a>
          <a
            href="/"
            className="bg-amber-200 hover:bg-amber-300 text-amber-800 px-3 py-1 rounded text-xs font-medium transition-colors"
          >
            🏠 Home
          </a>
          <a
            href="/editor"
            className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
          >
            ✏️ Content Editor
          </a>

          <div className="hidden md:flex items-center gap-2">
            <label htmlFor="admin-path-input" className="sr-only">Navigate to path</label>
            <input
              id="admin-path-input"
              type="text"
              inputMode="text"
              className="px-2 py-1 rounded border border-amber-300 bg-white/80 placeholder-amber-500 text-amber-900 text-xs w-56 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="/path (press Enter)"
              value={pathInput}
              onChange={(e) => setPathInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && pathInput.trim().length > 0) {
                  const next = pathInput.startsWith('/') ? pathInput : `/${pathInput}`;
                  setLocation(next);
                  setPathInput('');
                }
              }}
              aria-label="Navigate to arbitrary path"
            />
            <button
              onClick={() => {
                if (pathInput.trim().length > 0) {
                  const next = pathInput.startsWith('/') ? pathInput : `/${pathInput}`;
                  setLocation(next);
                  setPathInput('');
                }
              }}
              className="bg-amber-200 hover:bg-amber-300 text-amber-800 px-2 py-1 rounded text-xs font-medium transition-colors"
              aria-label="Go to entered path"
            >
              Go
            </button>
          </div>

          <button
            onClick={logout}
            className="bg-amber-200 hover:bg-amber-300 text-amber-800 px-3 py-1 rounded text-xs font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader; 