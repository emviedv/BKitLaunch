import React, { useState, useEffect } from 'react';
import DesignSystem from './DesignSystem';
import { useAuth } from '@/contexts/AuthContext';
import ContentEditor from './ContentEditor';
import AdminLogin from './AdminLogin';
import { contentApi, type ContentVersion } from '@/lib/contentApi';
import productData from '@/data/products.json';

// Error Boundary Component for graceful fallback
class AdminErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: () => React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('AdminDashboard Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback();
    }
    return this.props.children;
  }
}

// Minimal fallback component for critical errors
const AdminFallback: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-md text-center shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
      <p className="text-gray-600 mb-6">
        There was an issue loading the full admin dashboard. This fallback mode ensures basic access.
      </p>
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded p-3">
          <p className="text-green-800 text-sm">✅ Dashboard routing is working</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <p className="text-blue-800 text-sm">🛡️ Error boundary is active</p>
        </div>
      </div>
      <div className="mt-6 space-x-3">
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          🔄 Reload Dashboard
        </button>
        <a 
          href="/" 
          className="inline-block bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          ← Go Home
        </a>
      </div>
    </div>
  </div>
);

const AdminDashboard: React.FC = () => {
  // ALL HOOKS MUST BE AT THE TOP - BEFORE ANY CONDITIONAL LOGIC
  const { isAuthenticated, isAdmin, email, logout, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'content' | 'versions' | 'settings' | 'analytics' | 'waitlist' | 'designsystem'>('content');
  const [waitlist, setWaitlist] = useState<Array<{ id: number; email: string; name?: string; source?: string; created_at: string }>>([]);
  const [waitlistLoading, setWaitlistLoading] = useState(false);
  const [contentVersions, setContentVersions] = useState<ContentVersion[]>([]);
  const [currentContent, setCurrentContent] = useState(productData);
  const [loading, setLoading] = useState(false);
  const [showContentEditor, setShowContentEditor] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Tabs configuration (used by effects and UI)
  const tabs = [
    { id: 'content', label: 'Content Editor', icon: '✏️' },
    { id: 'versions', label: 'Version History', icon: '🕒' },
    { id: 'waitlist', label: 'Waitlist', icon: '📧' },
    { id: 'settings', label: 'Site Settings', icon: '⚙️' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'designsystem', label: 'Design System', icon: '🎨' }
  ] as const;

  // Debug logging - Enhanced
  console.log('AdminDashboard render:', { isAuthenticated, isAdmin, email, authLoading });

  // Load content versions function
  const loadContentVersions = async () => {
    try {
      setLoading(true);
      
      // Try to load from database first
      const dbAvailable = await contentApi.isDatabaseAvailable();
      if (dbAvailable) {
        const response = await contentApi.getContentVersions();
        if (response.success && response.data) {
          setContentVersions(response.data);
        }
      } else {
        // Fallback to localStorage
        const history = localStorage.getItem('bibliokit-content-history');
        if (history) {
          const localVersions = JSON.parse(history);
          // Convert local format to database format
          const converted: ContentVersion[] = localVersions.map((v: any) => ({
            id: parseInt(v.id),
            content_key: 'main',
            content_data: v.content,
            version: v.version,
            is_published: v.is_published,
            created_at: v.created_at,
            updated_at: v.created_at
          }));
          setContentVersions(converted);
        }
      }
    } catch (error) {
      console.error('Failed to load content versions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load waitlist function
  const loadWaitlist = async () => {
    try {
      setWaitlistLoading(true);
      const result = await contentApi.getWaitlistSignups(100, 0);
      if (result.success && result.data) {
        setWaitlist(result.data as any);
      }
    } catch (error) {
      console.error('Failed to load waitlist:', error);
    } finally {
      setWaitlistLoading(false);
    }
  };

  // Load content versions on mount
  useEffect(() => {
    // Load current content
    const loadCurrent = () => {
      const saved = localStorage.getItem('bibliokit-content');
      if (saved) {
        try {
          setCurrentContent(JSON.parse(saved));
        } catch (error) {
          console.error('Failed to load current content:', error);
        }
      }
    };

    loadContentVersions();
    loadCurrent();
    loadWaitlist(); // Auto-load waitlist on mount
  }, []); // Empty dependency array - runs only once on mount

  // Sync tab selection with URL hash for deep-linking (e.g., /admin#designsystem)
  useEffect(() => {
    const applyHash = () => {
      const hash = (window.location.hash || '').replace('#', '');
      if (!hash) return;
      const validIds = tabs.map(t => t.id);
      if ((validIds as ReadonlyArray<string>).includes(hash)) {
        setActiveTab(hash as typeof tabs[number]['id']);
      }
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  // Keep hash updated when the active tab changes
  useEffect(() => {
    const nextHash = `#${activeTab}`;
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    }
  }, [activeTab]);

  // NOW DO CONDITIONAL RENDERING AFTER ALL HOOKS
  // Show loading state while authentication is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Checking Access...</h2>
          <p className="text-gray-600">Please wait while we verify your credentials.</p>
          <p className="text-sm text-red-600 mt-2">Debug: authLoading = {String(authLoading)}</p>
        </div>
      </div>
    );
  }

  // Show login modal if not authenticated
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="container mx-auto px-4 py-16 text-center max-w-md">
          <div className="bg-white rounded-lg border p-8 shadow">
            <h1 className="text-3xl font-bold mb-4 text-gray-900">Admin Access Required</h1>
            <p className="text-gray-600 mb-8">
              Please sign in with your admin credentials to access the dashboard.
            </p>
            <div className="text-sm text-red-600 mb-4">
              Debug: isAuth={String(isAuthenticated)}, isAdmin={String(isAdmin)}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={() => setShowLoginModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                🔑 Sign In
              </button>
              <a href="/" className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                Go Home
              </a>
            </div>
          </div>
        </div>
        
        {/* Login Modal */}
        {showLoginModal && (
          <AdminLogin 
            onClose={() => setShowLoginModal(false)}
          />
        )}
      </div>
    );
  }

  const publishContent = async () => {
    try {
      setLoading(true);
      
      // Try to save to database first
      const dbAvailable = await contentApi.isDatabaseAvailable();
      if (dbAvailable) {
        const response = await contentApi.saveContent(currentContent, true);
        if (response.success) {
          alert(response.message || 'Content published successfully!');
          await loadContentVersions(); // Reload versions
        } else {
          throw new Error(response.error || 'Failed to publish');
        }
      } else {
        // Fallback to localStorage
        const newVersion: ContentVersion = {
          id: Date.now(),
          content_key: 'main',
          content_data: currentContent,
          version: contentVersions.length + 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_published: true
        };

        const updatedVersions = [...contentVersions, newVersion];
        setContentVersions(updatedVersions);
        localStorage.setItem('bibliokit-content-history', JSON.stringify(updatedVersions));
        localStorage.setItem('bibliokit-content', JSON.stringify(currentContent));
        alert('Content published successfully! (saved locally)');
      }
    } catch (error) {
      console.error('Failed to publish content:', error);
      alert('Failed to publish content: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const revertToVersion = (version: ContentVersion) => {
    const contentData = version.content_data;
    setCurrentContent(contentData);
    localStorage.setItem('bibliokit-content', JSON.stringify(contentData));
    alert(`Reverted to version ${version.version}`);
    window.location.reload();
  };

  const exportContent = () => {
    const dataStr = JSON.stringify(currentContent, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bibliokit-content-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          setCurrentContent(imported);
          localStorage.setItem('bibliokit-content', JSON.stringify(imported));
          alert('Content imported successfully!');
          window.location.reload();
        } catch (error) {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 pt-16">
      {/* Admin Dashboard Header */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your BiblioKit content and settings</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Logged in as: {email}</span>
              <button onClick={logout} className="button-secondary">
                Logout
              </button>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex gap-2 mt-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                style={{ borderRadius: '6px' }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="bg-background rounded-lg border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Content Management</h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowContentEditor(true)}
                    className="button"
                  >
                    ✏️ Edit Content
                  </button>
                  <button
                    onClick={publishContent}
                    disabled={loading}
                    className="button-secondary"
                  >
                    📤 Publish Changes
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-muted/30 p-4 rounded">
                  <h3 className="font-medium mb-2">Current Version</h3>
                  <p className="text-muted-foreground">
                    Last modified: {new Date().toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-muted/30 p-4 rounded">
                  <h3 className="font-medium mb-2">Total Versions</h3>
                  <p className="text-muted-foreground">
                    {contentVersions.length} saved versions
                  </p>
                </div>
                <div className="bg-muted/30 p-4 rounded">
                  <h3 className="font-medium mb-2">Status</h3>
                  <p className="text-green-600 font-medium">Published</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-background rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button onClick={exportContent} className="button-secondary">
                  📥 Export Content
                </button>
                <label className="button-secondary cursor-pointer">
                  📤 Import Content
                  <input
                    type="file"
                    accept=".json"
                    onChange={importContent}
                    className="hidden"
                  />
                </label>
                <a href="/" className="button-secondary">
                  👀 Preview Site
                </a>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'versions' && (
          <div className="bg-background rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-6">Version History</h2>
            {contentVersions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No version history available. Start by making some changes to your content.
              </p>
            ) : (
                             <div className="space-y-3">
                 {[...contentVersions].reverse().map((version) => (
                   <div key={version.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                     <div>
                       <h4 className="font-medium">Version {version.version}</h4>
                       <p className="text-sm text-muted-foreground">
                         {new Date(version.created_at).toLocaleString()}
                       </p>
                     </div>
                     <div className="flex items-center gap-3">
                       <span className={`px-2 py-1 rounded text-xs ${
                         version.is_published 
                           ? 'bg-green-100 text-green-700' 
                           : 'bg-gray-100 text-gray-700'
                       }`}>
                         {version.is_published ? 'Published' : 'Draft'}
                       </span>
                       <button
                         onClick={() => revertToVersion(version)}
                         className="button-secondary text-sm"
                       >
                         Revert
                       </button>
                     </div>
                   </div>
                 ))}
               </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-background rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-6">Site Settings</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Security</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-border rounded">
                    <span>Admin Authentication</span>
                    <span className="text-green-600 font-medium">✅ Enabled</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-border rounded">
                    <span>Content Editor Protection</span>
                    <span className="text-green-600 font-medium">✅ Active</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Content</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-border rounded">
                    <span>Auto-save</span>
                    <span className="text-green-600 font-medium">✅ Enabled</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-border rounded">
                    <span>Version Control</span>
                    <span className="text-green-600 font-medium">✅ Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'waitlist' && (
          <div className="bg-background rounded-lg border p-6">
            <div className="flex items-center justify-between mb  -6">
              <h2 className="text-xl font-semibold">Waitlist Signups</h2>
              <div className="flex gap-2">
                <button
                  className="button-secondary"
                  onClick={loadWaitlist}
                >
                  Refresh
                </button>
                <button
                  className="button"
                  onClick={() => {
                    const csv = ['Email,Name,Source,Created At', ...waitlist.map(w => `${w.email},${w.name || ''},${w.source || ''},${new Date(w.created_at).toISOString()}`)].join('\n');
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `waitlist-${new Date().toISOString().slice(0,10)}.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  Export CSV
                </button>
              </div>
            </div>

            {waitlistLoading ? (
              <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : waitlist.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No waitlist signups yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-2 pr-4">Email</th>
                      <th className="py-2 pr-4">Name</th>
                      <th className="py-2 pr-4">Source</th>
                      <th className="py-2 pr-4">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {waitlist.map((w) => (
                      <tr key={w.id} className="border-b last:border-0">
                        <td className="py-2 pr-4">{w.email}</td>
                        <td className="py-2 pr-4">{w.name || '-'}</td>
                        <td className="py-2 pr-4">{w.source || 'website'}</td>
                        <td className="py-2 pr-4">{new Date(w.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-background rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-6">Site Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-muted/30 p-6 rounded-lg text-center">
                <h3 className="text-2xl font-bold text-primary">🔐</h3>
                <p className="text-lg font-semibold mt-2">Secure</p>
                <p className="text-sm text-muted-foreground">Admin protected</p>
              </div>
              <div className="bg-muted/30 p-6 rounded-lg text-center">
                <h3 className="text-2xl font-bold text-primary">✅</h3>
                <p className="text-lg font-semibold mt-2">Live</p>
                <p className="text-sm text-muted-foreground">Site operational</p>
              </div>
              <div className="bg-muted/30 p-6 rounded-lg text-center">
                <h3 className="text-2xl font-bold text-primary">⚡</h3>
                <p className="text-lg font-semibold mt-2">Fast</p>
                <p className="text-sm text-muted-foreground">Optimized delivery</p>
              </div>
            </div>
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800">
                <strong>Note:</strong> Detailed analytics integration with services like Google Analytics 
                can be added in future updates.
              </p>
            </div>
          </div>
        )}
        {activeTab === 'designsystem' && (
          <div className="bg-background rounded-lg border p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Design System</h2>
              <p className="text-muted-foreground text-sm">Internal reference for tokens and components.</p>
            </div>
            <DesignSystem />
          </div>
        )}
      </div>

      {/* Content Editor Modal */}
      {showContentEditor && (
        <ContentEditor onContentUpdate={(content) => {
          setCurrentContent(content);
          setShowContentEditor(false);
        }} />
      )}
    </div>
  );
};

// Main export with error boundary protection
const AdminDashboardWithErrorBoundary: React.FC = () => (
  <AdminErrorBoundary fallback={() => <AdminFallback />}>
    <AdminDashboard />
  </AdminErrorBoundary>
);

export default AdminDashboardWithErrorBoundary; 