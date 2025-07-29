import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

const AdminHeader: React.FC = () => {
  const { isAuthenticated, isAdmin, email, logout } = useAuth();

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
          <span className="text-amber-600">Content editing is available</span>
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