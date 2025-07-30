import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const AdminDashboard: React.FC = () => {
  const { isAuthenticated, isAdmin, email, logout, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  // Show loading state while authentication is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Checking Access...</h2>
          <p className="text-muted-foreground">Please wait while we verify your credentials.</p>
        </div>
      </div>
    );
  }

  // Show login modal if not authenticated
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center pt-16">
        <div className="container mx-auto px-4 py-16 text-center max-w-md">
          <div className="bg-background rounded-lg border p-8 shadow-sm">
            <h1 className="text-4xl font-bold mb-4 text-foreground">Admin Access Required</h1>
            <p className="text-muted-foreground mb-8">
              Please sign in with your admin credentials to access the dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="btn-primary">🔑 Sign In</button>
              <a href="/" className="btn-secondary">← Go Home</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Simple useEffect with empty dependency array
  useEffect(() => {
    console.log('AdminDashboard mounted');
  }, []);

  return (
    <div className="min-h-screen bg-muted/20 pt-16">
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {email}</p>
            </div>
            <button
              onClick={logout}
              className="btn-secondary"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-background rounded-lg border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Dashboard Content</h2>
          <p className="text-muted-foreground">This is a simplified admin dashboard to test React Hook issues.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;