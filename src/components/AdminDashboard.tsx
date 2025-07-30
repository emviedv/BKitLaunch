import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ContentEditor from './ContentEditor';
import AdminLogin from './AdminLogin';
import { contentApi, type ContentVersion } from '@/lib/contentApi';
import productData from '@/data/products.json';

// ContentVersion interface now imported from contentApi

const AdminDashboard: React.FC = () => {
  const { isAuthenticated, isAdmin, email, logout, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'content' | 'versions' | 'settings' | 'analytics'>('content');
  
  // Debug logging
  console.log('AdminDashboard render:', { isAuthenticated, isAdmin, email, authLoading });
  const [contentVersions, setContentVersions] = useState<ContentVersion[]>([]);
  const [currentContent, setCurrentContent] = useState(productData);
  const [loading, setLoading] = useState(false);
  const [showContentEditor, setShowContentEditor] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

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
              <button 
                onClick={() => setShowLoginModal(true)}
                className="btn-primary"
              >
                🔑 Sign In
              </button>
              <a href="/" className="btn-secondary">
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

  // Load content versions on mount
  useEffect(() => {
    loadContentVersions();
    loadCurrentContent();
  }, []);

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

  const loadCurrentContent = () => {
    const saved = localStorage.getItem('bibliokit-content');
    if (saved) {
      try {
        setCurrentContent(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load current content:', error);
      }
    }
  };

  const publishContent = async () => {
    try {
      setLoading(true);
      
      // Try to save to database first
      const dbAvailable = await contentApi.isDatabaseAvailable();
      if (dbAvailable) {
        const response = await contentApi.saveContent(currentContent, true);
        if (response.success) {
          alert(response.message || 'Content published successfully!');
          loadContentVersions(); // Reload versions
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

  const tabs = [
    { id: 'content', label: 'Content Editor', icon: '✏️' },
    { id: 'versions', label: 'Version History', icon: '🕒' },
    { id: 'settings', label: 'Site Settings', icon: '⚙️' },
    { id: 'analytics', label: 'Analytics', icon: '📊' }
  ] as const;

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
              <button onClick={logout} className="btn-secondary">
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
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
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
                    className="btn-primary"
                  >
                    ✏️ Edit Content
                  </button>
                  <button
                    onClick={publishContent}
                    disabled={loading}
                    className="btn-secondary"
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
                <button onClick={exportContent} className="btn-secondary">
                  📥 Export Content
                </button>
                <label className="btn-secondary cursor-pointer">
                  📤 Import Content
                  <input
                    type="file"
                    accept=".json"
                    onChange={importContent}
                    className="hidden"
                  />
                </label>
                <a href="/" className="btn-secondary">
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
                         className="btn-secondary text-sm"
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

export default AdminDashboard; 