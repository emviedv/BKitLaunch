import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLogin from './AdminLogin';
import productData from '@/data/products.json';

interface ContentEditorProps {
  onContentUpdate?: (newContent: any) => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ onContentUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editMode, setEditMode] = useState<'json' | 'sections'>('sections');
  const [jsonContent, setJsonContent] = useState(JSON.stringify(productData, null, 2));
  const [showEditor, setShowEditor] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [savedContent, setSavedContent] = useState(productData);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const { isAuthenticated, isAdmin, logout } = useAuth();

  const handleSave = () => {
    try {
      let contentToSave;
      if (editMode === 'json') {
        contentToSave = JSON.parse(jsonContent);
      } else {
        contentToSave = savedContent;
      }
      
      setSavedContent(contentToSave);
      
      // Store in localStorage for persistence during the session
      localStorage.setItem('bibliokit-content', JSON.stringify(contentToSave));
      
      // Notify parent component of content update
      if (onContentUpdate) {
        onContentUpdate(contentToSave);
      }
      
      // Force a page reload to show changes
      window.location.reload();
      
      setIsEditing(false);
    } catch (error) {
      alert('Invalid JSON format. Please check your syntax.');
    }
  };

  const handleReset = () => {
    setJsonContent(JSON.stringify(productData, null, 2));
    setSavedContent(productData);
    setIsEditing(false);
    localStorage.removeItem('bibliokit-content');
    window.location.reload();
  };

  const updateSection = (section: keyof typeof savedContent, newData: any) => {
    const updatedContent = {
      ...savedContent,
      [section]: newData
    };
    setSavedContent(updatedContent);
    setJsonContent(JSON.stringify(updatedContent, null, 2));
    setIsEditing(true);
  };

  const updateNestedField = (section: keyof typeof savedContent, index: number | null, field: string, value: any) => {
    const currentSection = savedContent[section];
    let updatedSection;
    
    if (Array.isArray(currentSection) && index !== null) {
      updatedSection = currentSection.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      );
    } else {
      updatedSection = { ...currentSection, [field]: value };
    }
    
    updateSection(section, updatedSection);
  };

  const updateSettingsVisibility = (section: 'hero' | 'features' | 'pricing' | 'cta', isVisible: boolean) => {
    const currentSettings = savedContent.settings || { visibility: {} };
    const updatedSettings = {
      ...currentSettings,
      visibility: {
        ...currentSettings.visibility,
        [section]: isVisible
      }
    };

    updateSection('settings', updatedSettings);
  };

  // Load saved content on component mount
  useEffect(() => {
    const saved = localStorage.getItem('bibliokit-content');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedContent(parsed);
        setJsonContent(JSON.stringify(parsed, null, 2));
      } catch (error) {
        console.error('Failed to load saved content:', error);
      }
    }
  }, []);

  const renderSectionEditor = () => {
    const sections = {
      settings: 'Visibility Settings',
      hero: 'Hero Section',
      features: 'Features Section',
      pricing: 'Pricing Section',
      product: 'Product Page',
      contact: 'Contact Info'
    };

    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
        {/* Section Navigation */}
        <div className="bg-muted/20 p-4 rounded-lg">
          <h3 className="font-semibold mb-4">Edit Sections</h3>
          <div className="space-y-2">
            {Object.entries(sections).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`w-full text-left p-2 rounded text-sm transition-colors ${
                  activeSection === key 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted/40'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-border">
            <button
              onClick={() => setEditMode('json')}
              className="w-full btn-secondary text-sm"
            >
              Advanced JSON Editor
            </button>
          </div>
        </div>

        {/* Section Content Editor */}
        <div className="lg:col-span-3 bg-muted/20 p-4 rounded-lg">
          {activeSection === 'settings' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Visibility Settings</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Control which sections are displayed on your website.
              </p>
              <div className="space-y-3">
                {(['hero', 'features', 'pricing', 'cta'] as const).map((section) => {
                  const isVisible = savedContent.settings?.visibility?.[section] !== false;
                  return (
                    <div key={section} className="flex items-center gap-3">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={isVisible}
                          onChange={() => updateSettingsVisibility(section, !isVisible)}
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                      </label>
                      <span className="capitalize">{section} Section</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {activeSection === 'hero' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Hero Section</h3>
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={savedContent.hero?.title || ''}
                  onChange={(e) => updateNestedField('hero', null, 'title', e.target.value)}
                  className="w-full p-2 border border-border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subtitle</label>
                <input
                  type="text"
                  value={savedContent.hero?.subtitle || ''}
                  onChange={(e) => updateNestedField('hero', null, 'subtitle', e.target.value)}
                  className="w-full p-2 border border-border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={savedContent.hero?.description || ''}
                  onChange={(e) => updateNestedField('hero', null, 'description', e.target.value)}
                  className="w-full p-2 border border-border rounded h-24"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Primary Button</label>
                  <input
                    type="text"
                    value={savedContent.hero?.primaryButton || ''}
                    onChange={(e) => updateNestedField('hero', null, 'primaryButton', e.target.value)}
                    className="w-full p-2 border border-border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Secondary Button</label>
                  <input
                    type="text"
                    value={savedContent.hero?.secondaryButton || ''}
                    onChange={(e) => updateNestedField('hero', null, 'secondaryButton', e.target.value)}
                    className="w-full p-2 border border-border rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'contact' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Contact Information</h3>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={savedContent.contact?.email || ''}
                  onChange={(e) => updateNestedField('contact', null, 'email', e.target.value)}
                  className="w-full p-2 border border-border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Twitter</label>
                <input
                  type="text"
                  value={savedContent.contact?.twitter || ''}
                  onChange={(e) => updateNestedField('contact', null, 'twitter', e.target.value)}
                  className="w-full p-2 border border-border rounded"
                  placeholder="@username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">GitHub</label>
                <input
                  type="text"
                  value={savedContent.contact?.github || ''}
                  onChange={(e) => updateNestedField('contact', null, 'github', e.target.value)}
                  className="w-full p-2 border border-border rounded"
                  placeholder="username"
                />
              </div>
            </div>
          )}

          {activeSection === 'features' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Features Section</h3>
              <div className="space-y-4">
                {savedContent.features?.map((feature, index) => (
                  <div key={index} className="p-3 border border-border rounded">
                    <div className="grid grid-cols-4 gap-2 text-sm">
                      <div>
                        <label className="block text-xs font-medium mb-1">Icon</label>
                        <input
                          type="text"
                          value={feature.icon}
                          onChange={(e) => updateNestedField('features', index, 'icon', e.target.value)}
                          className="p-1 border border-border rounded w-full"
                          placeholder="Icon"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium mb-1">Title</label>
                        <input
                          type="text"
                          value={feature.title}
                          onChange={(e) => updateNestedField('features', index, 'title', e.target.value)}
                          className="p-1 border border-border rounded w-full"
                          placeholder="Title"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Badge</label>
                        <input
                          type="text"
                          value={feature.badge}
                          onChange={(e) => updateNestedField('features', index, 'badge', e.target.value)}
                          className="p-1 border border-border rounded w-full"
                          placeholder="e.g. New, Coming Soon"
                        />
                      </div>
                      <div className="col-span-4">
                        <label className="block text-xs font-medium mb-1">Description</label>
                        <textarea
                          value={feature.description}
                          onChange={(e) => updateNestedField('features', index, 'description', e.target.value)}
                          className="p-1 border border-border rounded h-16 text-xs w-full"
                          placeholder="Description"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeSection === 'pricing' || activeSection === 'product') && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">
                {activeSection === 'pricing' ? 'Pricing Plans' : 'Product Details'}
              </h3>
              <p className="text-sm text-muted-foreground">
                For detailed {activeSection} editing, use the Advanced JSON Editor below.
              </p>
              <button
                onClick={() => setEditMode('json')}
                className="btn-primary text-sm"
              >
                Open Advanced Editor
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Show login modal if not authenticated but trying to access editor
  if (showLogin && !isAuthenticated) {
    return <AdminLogin onClose={() => setShowLogin(false)} />;
  }

  if (!showEditor) {
    // Only show edit button to authenticated admins
    if (isAuthenticated && isAdmin) {
      return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
          <button
            onClick={() => setShowEditor(true)}
            className="bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
            title="Edit Content"
          >
            ✏️
          </button>
          <button
            onClick={logout}
            className="bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-colors text-sm"
            title="Logout"
          >
            🚪
          </button>
        </div>
      );
    } else {
      // Show admin access button for non-authenticated users
      return (
        <button
          onClick={() => setShowLogin(true)}
          className="fixed bottom-4 right-4 bg-muted text-muted-foreground p-2 rounded-full shadow-lg hover:bg-muted/80 transition-colors z-50 text-xs"
          title="Admin Access"
        >
          🔒
        </button>
      );
    }
  }

  // Don't show editor if not authenticated
  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-lg w-full max-w-6xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">Content Editor</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setEditMode('sections')}
                className={`px-3 py-1 text-sm rounded ${
                  editMode === 'sections' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                Sections
              </button>
              <button
                onClick={() => setEditMode('json')}
                className={`px-3 py-1 text-sm rounded ${
                  editMode === 'json' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                JSON
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="btn-secondary text-sm"
            >
              Reset to Default
            </button>
            <button
              onClick={handleSave}
              className="btn-primary text-sm"
              disabled={!isEditing}
            >
              Save & Reload
            </button>
            <button
              onClick={() => setShowEditor(false)}
              className="btn-secondary text-sm"
            >
              Close
            </button>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-auto">
          {editMode === 'sections' ? (
            renderSectionEditor()
          ) : (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Edit the JSON below to change the website content. Click "Save & Reload" to apply changes.
              </p>
              <textarea
                value={jsonContent}
                onChange={(e) => {
                  setJsonContent(e.target.value);
                  setIsEditing(true);
                }}
                className="w-full h-full min-h-[500px] p-3 border border-border rounded-md font-mono text-sm bg-muted/20 resize-none"
                placeholder="Edit JSON content here..."
              />
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-border bg-muted/20 text-sm text-muted-foreground">
          <p><strong>Instructions:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>{editMode === 'sections' ? 'Use the section editor for easy content changes' : 'Edit the JSON structure to change website content'}</li>
            <li>Make sure to maintain valid {editMode === 'sections' ? 'content' : 'JSON syntax'}</li>
            <li>Click "Save & Reload" to see changes immediately</li>
            <li>Changes are saved in browser storage for this session</li>
            <li>Use "Reset to Default" to restore original content</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContentEditor; 