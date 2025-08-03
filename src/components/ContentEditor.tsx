import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLogin from './AdminLogin';
import productData from '@/data/products.json';
import { contentApi } from '@/lib/contentApi';
import { 
  ContentSection, 
  SectionType, 
  FeatureItem, 
  PricingPlan, 
  HeroSection,
  FeaturesSection,
  PricingSection,
  CTASection,
  WaitlistSection,
  HeaderSection,
  FooterSection,
  ContactInfo,
  ExpertQuoteData, 
  StatisticData, 
  FAQItem, 
  LLMOptimizedContent 
} from '@/lib/database';

interface ContentEditorProps {
  onContentUpdate?: (newContent: any) => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ onContentUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editMode, setEditMode] = useState<'json' | 'sections' | 'database'>('database');
  const [jsonContent, setJsonContent] = useState(JSON.stringify(productData, null, 2));
  const [showEditor, setShowEditor] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [savedContent, setSavedContent] = useState(productData);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [databaseAvailable, setDatabaseAvailable] = useState<boolean | null>(null);
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

  const updateSection = (section: string, newData: any) => {
    const updatedContent = {
      ...savedContent,
      [section]: newData
    };
    setSavedContent(updatedContent);
    setJsonContent(JSON.stringify(updatedContent, null, 2));
    setIsEditing(true);
  };

  const updateNestedField = (section: string, index: number | null, field: string, value: any) => {
    const currentSection = (savedContent as any)[section];
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

  // Check database availability and load content
  useEffect(() => {
    const checkDatabase = async () => {
      if (!isAuthenticated || !isAdmin) return;
      
      setLoading(true);
      const available = await contentApi.isDatabaseAvailable();
      setDatabaseAvailable(available);
      
      if (available) {
        await loadDatabaseContent();
      } else {
        // Fallback to localStorage
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
      }
      setLoading(false);
    };

    checkDatabase();
  }, [isAuthenticated, isAdmin]);

  // Load all content from database
  const loadDatabaseContent = async () => {
    try {
      const [sectionsResponse, contactResponse] = await Promise.all([
        contentApi.getAllSections(),
        contentApi.getContactInfo()
      ]);

      if (sectionsResponse.success) {
        setSections(sectionsResponse.data || []);
      }

      if (contactResponse.success) {
        setContactInfo(contactResponse.data || null);
      }
    } catch (error) {
      console.error('Failed to load database content:', error);
      setError('Failed to load content from database');
    }
  };

  // Save section to database
  const saveSection = async (section: Partial<ContentSection>) => {
    if (!section.id) {
      // Create new section
      const response = await contentApi.createSection(section as Omit<ContentSection, 'id' | 'created_at' | 'updated_at'>);
      if (response.success) {
        await loadDatabaseContent();
        setError(null);
      } else {
        setError(response.error || 'Failed to create section');
      }
    } else {
      // Update existing section
      const response = await contentApi.updateSection(section.id, section);
      if (response.success) {
        await loadDatabaseContent();
        setError(null);
      } else {
        setError(response.error || 'Failed to update section');
      }
    }
  };

  // Delete section from database
  const deleteSection = async (sectionId: number) => {
    const response = await contentApi.deleteSection(sectionId);
    if (response.success) {
      await loadDatabaseContent();
      setError(null);
    } else {
      setError(response.error || 'Failed to delete section');
    }
  };

  // Token counting utility
  const countTokens = (text: string): number => {
    return Math.ceil(text.length / 4); // Rough estimation: 1 token ≈ 4 characters
  };

  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getTokenStatus = (tokens: number, maxTokens: number = 300) => {
    if (tokens <= maxTokens) return { status: 'good', color: 'text-green-600', bg: 'bg-green-100' };
    if (tokens <= maxTokens * 1.2) return { status: 'warning', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { status: 'danger', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const getWordStatus = (words: number, min: number = 40, max: number = 70) => {
    if (words >= min && words <= max) return { status: 'good', color: 'text-green-600', bg: 'bg-green-100' };
    if (words < min) return { status: 'too-short', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { status: 'too-long', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const renderSectionEditor = () => {
    if (editMode === 'database' && databaseAvailable) {
      return renderDatabaseEditor();
    }

    const sections = {
      settings: 'Visibility Settings',
      llm: 'LLM Optimization',
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
          
          {/* Database/Local Mode Toggle */}
          <div className="mb-4 p-2 bg-muted/30 rounded">
            <div className="flex items-center gap-2 text-xs">
              <span className={`w-2 h-2 rounded-full ${databaseAvailable ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span>{databaseAvailable ? 'Database Connected' : 'Local Mode'}</span>
            </div>
            {databaseAvailable && (
              <button
                onClick={() => setEditMode('database')}
                className="mt-2 w-full btn-primary text-xs"
              >
                Switch to Database Editor
              </button>
            )}
          </div>

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

          {activeSection === 'llm' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">LLM Optimization Settings</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-blue-900 mb-2">🎯 LLM Citation Priority List</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>1. Expert quote (+41% citation lift)</li>
                    <li>2. Dated stat (+30% citation boost)</li>
                    <li>3. FAQ/HowTo schema (Copilot reads verbatim)</li>
                    <li>4. Answer box under H1 (40-70 words)</li>
                    <li>5. Fresh "Updated" timestamp</li>
                    <li>6. Community echo on Reddit (~47% of Perplexity answers)</li>
                  </ul>
                </div>
              </div>

              {/* Answer Box Section */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium mb-3">📝 Answer Box (Feature Snippet)</h4>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">40-70 Word Summary</label>
                                         <div className="flex items-center gap-2">
                       {(() => {
                         const text = (savedContent as any).llm?.answerBox || '';
                         const words = countWords(text);
                         const status = getWordStatus(words);
                         return (
                           <span className={`px-2 py-1 rounded text-xs ${status.bg} ${status.color}`}>
                             {words} words
                           </span>
                         );
                       })()}
                     </div>
                  </div>
                                     <textarea
                     value={(savedContent as any).llm?.answerBox || ''}
                     onChange={(e) => updateNestedField('llm', null, 'answerBox', e.target.value)}
                     className="w-full p-3 border border-border rounded-lg h-24 text-sm"
                     placeholder="Write a 40-70 word summary that answers the main question about your product..."
                   />
                  <p className="text-xs text-gray-500 mt-1">
                    Optimal for LLM feature snippets. Keep between 40-70 words for maximum citation potential.
                  </p>
                </div>
              </div>

              {/* Expert Quote Section */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium mb-3">👨‍🎓 Expert Quote (+41% Citation Lift)</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Quote</label>
                                         <textarea
                       value={(savedContent as any).llm?.expertQuote?.quote || ''}
                       onChange={(e) => {
                         const currentQuote = (savedContent as any).llm?.expertQuote || {};
                         updateNestedField('llm', null, 'expertQuote', { ...currentQuote, quote: e.target.value });
                       }}
                      className="w-full p-2 border border-border rounded text-sm h-20"
                      placeholder="Expert opinion or insight about your industry/product..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Expert Name</label>
                                             <input
                         type="text"
                         value={(savedContent as any).llm?.expertQuote?.expertName || ''}
                         onChange={(e) => {
                           const currentQuote = (savedContent as any).llm?.expertQuote || {};
                           updateNestedField('llm', null, 'expertQuote', { ...currentQuote, expertName: e.target.value });
                         }}
                        className="w-full p-2 border border-border rounded text-sm"
                        placeholder="Dr. Jane Smith"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                                             <input
                         type="text"
                         value={(savedContent as any).llm?.expertQuote?.expertTitle || ''}
                         onChange={(e) => {
                           const currentQuote = (savedContent as any).llm?.expertQuote || {};
                           updateNestedField('llm', null, 'expertQuote', { ...currentQuote, expertTitle: e.target.value });
                         }}
                        className="w-full p-2 border border-border rounded text-sm"
                        placeholder="Director of Design Technology"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Institution</label>
                                         <input
                       type="text"
                       value={(savedContent as any).llm?.expertQuote?.institution || ''}
                       onChange={(e) => {
                         const currentQuote = (savedContent as any).llm?.expertQuote || {};
                         updateNestedField('llm', null, 'expertQuote', { ...currentQuote, institution: e.target.value });
                       }}
                      className="w-full p-2 border border-border rounded text-sm"
                      placeholder="Stanford University, MIT, etc."
                    />
                  </div>
                </div>
              </div>

              {/* Statistics Section */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium mb-3">📊 Fresh Statistics (+30% Citation Boost)</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Statistic</label>
                                             <input
                         type="text"
                         value={(savedContent as any).llm?.statistic?.statistic || ''}
                         onChange={(e) => {
                           const currentStat = (savedContent as any).llm?.statistic || {};
                           updateNestedField('llm', null, 'statistic', { ...currentStat, statistic: e.target.value });
                         }}
                        className="w-full p-2 border border-border rounded text-sm"
                        placeholder="73%, 2.5x, $1.2M, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Date</label>
                                             <input
                         type="text"
                         value={(savedContent as any).llm?.statistic?.date || ''}
                         onChange={(e) => {
                           const currentStat = (savedContent as any).llm?.statistic || {};
                           updateNestedField('llm', null, 'statistic', { ...currentStat, date: e.target.value });
                         }}
                        className="w-full p-2 border border-border rounded text-sm"
                        placeholder="January 2024"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                                         <textarea
                       value={(savedContent as any).llm?.statistic?.description || ''}
                       onChange={(e) => {
                         const currentStat = (savedContent as any).llm?.statistic || {};
                         updateNestedField('llm', null, 'statistic', { ...currentStat, description: e.target.value });
                       }}
                      className="w-full p-2 border border-border rounded text-sm h-16"
                      placeholder="of design teams report improved workflow efficiency..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Source</label>
                                         <input
                       type="text"
                       value={(savedContent as any).llm?.statistic?.source || ''}
                       onChange={(e) => {
                         const currentStat = (savedContent as any).llm?.statistic || {};
                         updateNestedField('llm', null, 'statistic', { ...currentStat, source: e.target.value });
                       }}
                      className="w-full p-2 border border-border rounded text-sm"
                      placeholder="Design Systems Survey 2024, McKinsey Report, etc."
                    />
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium mb-3">❓ FAQ Schema (Copilot Reads Verbatim)</h4>
                <div className="space-y-4">
                                     {((savedContent as any).llm?.faqs || []).map((faq: FAQItem, index: number) => (
                    <div key={index} className="border border-gray-100 rounded p-3 bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">FAQ #{index + 1}</span>
                                                 <button
                           onClick={() => {
                             const currentFaqs = (savedContent as any).llm?.faqs || [];
                                                           const updatedFaqs = currentFaqs.filter((_: any, i: number) => i !== index);
                             updateNestedField('llm', null, 'faqs', updatedFaqs);
                           }}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs font-medium mb-1">Question</label>
                          <input
                            type="text"
                            value={faq.question}
                                                         onChange={(e) => {
                               const currentFaqs = [...((savedContent as any).llm?.faqs || [])];
                               currentFaqs[index] = { ...currentFaqs[index], question: e.target.value };
                               updateNestedField('llm', null, 'faqs', currentFaqs);
                             }}
                            className="w-full p-2 border border-border rounded text-sm"
                            placeholder="How does..."
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Answer</label>
                          <textarea
                            value={faq.answer}
                                                         onChange={(e) => {
                               const currentFaqs = [...((savedContent as any).llm?.faqs || [])];
                               currentFaqs[index] = { ...currentFaqs[index], answer: e.target.value };
                               updateNestedField('llm', null, 'faqs', currentFaqs);
                             }}
                            className="w-full p-2 border border-border rounded text-sm h-16"
                            placeholder="Our platform..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                                     <button
                     onClick={() => {
                       const currentFaqs = (savedContent as any).llm?.faqs || [];
                       const newFaq = { question: '', answer: '' };
                       updateNestedField('llm', null, 'faqs', [...currentFaqs, newFaq]);
                     }}
                    className="w-full p-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors"
                  >
                    + Add FAQ Item
                  </button>
                </div>
              </div>

              {/* Content Optimization Tips */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium mb-3">💡 Content Optimization Tips</h4>
                <ul className="text-sm space-y-2">
                  <li>• Keep paragraphs ≤ 300 tokens (~1200 characters)</li>
                  <li>• Break with H2 every ~250 words for vector chunks</li>
                  <li>• Avoid hard-sell CTAs in quotable content</li>
                  <li>• Include updated timestamps on all content</li>
                  <li>• Seed Reddit/Stack Overflow discussions for community echo</li>
                </ul>
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
                    <div className="grid grid-cols-6 gap-2 text-sm">
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
                      <div className="col-span-2">
                        <label className="block text-xs font-medium mb-1">Badge Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={feature.badgeColor || ''}
                            onChange={(e) => updateNestedField('features', index, 'badgeColor', e.target.value)}
                            className="p-1 border border-border rounded flex-1"
                            placeholder="#10b981 or green"
                          />
                          {feature.badgeColor && (
                            <div className="flex items-center gap-1">
                              {feature.badgeColor.startsWith('#') ? (
                                <div 
                                  className="w-4 h-4 rounded border"
                                  style={{ backgroundColor: feature.badgeColor }}
                                  title={`Color: ${feature.badgeColor}`}
                                />
                              ) : (
                                <span 
                                  className={`text-xs px-1 py-0.5 rounded ${
                                    feature.badgeColor === 'green' ? 'bg-green-100 text-green-800 border border-green-200' :
                                    feature.badgeColor === 'blue' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                    feature.badgeColor === 'orange' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                                    feature.badgeColor === 'purple' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                                    feature.badgeColor === 'red' ? 'bg-red-100 text-red-800 border border-red-200' :
                                    feature.badgeColor === 'yellow' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                    feature.badgeColor === 'pink' ? 'bg-pink-100 text-pink-800 border border-pink-200' :
                                    feature.badgeColor === 'gray' ? 'bg-gray-100 text-gray-800 border border-gray-200' :
                                    'bg-primary text-primary-foreground'
                                  }`}
                                >
                                  {feature.badgeColor}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Use hex (#10b981) or predefined (green, blue, orange, etc.)
                        </div>
                      </div>
                      <div className="col-span-6">
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

  // Database editor for CRUD operations
  const renderDatabaseEditor = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
        {/* Section Navigation */}
        <div className="bg-muted/20 p-4 rounded-lg">
          <h3 className="font-semibold mb-4">Database Sections</h3>
          
          {/* Status */}
          <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded">
            <div className="flex items-center gap-2 text-xs text-green-800">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span>Database Connected</span>
            </div>
            <button
              onClick={() => setEditMode('sections')}
              className="mt-2 w-full btn-secondary text-xs"
            >
              Switch to Local Editor
            </button>
          </div>

          {error && (
            <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800">
              {error}
            </div>
          )}

          {/* Section Types */}
          <div className="space-y-2">
            {['hero', 'features', 'pricing', 'cta', 'waitlist', 'header', 'footer', 'contact'].map((sectionType) => (
              <button
                key={sectionType}
                onClick={() => setActiveSection(sectionType)}
                className={`w-full text-left p-2 rounded text-sm transition-colors capitalize flex items-center justify-between ${
                  activeSection === sectionType 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted/40'
                }`}
              >
                <span>{sectionType} Section</span>
                {sections.find(s => s.section_type === sectionType) && (
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <button
              onClick={loadDatabaseContent}
              className="w-full btn-secondary text-sm mb-2"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Refresh Data'}
            </button>
          </div>
        </div>

        {/* Section Content Editor */}
        <div className="lg:col-span-3 bg-muted/20 p-4 rounded-lg overflow-y-auto max-h-[70vh]">
          {renderDatabaseSectionForm()}
        </div>
      </div>
    );
  };

  // Render form for each section type in database mode
  const renderDatabaseSectionForm = () => {
    const currentSection = sections.find(s => s.section_type === activeSection);

    if (activeSection === 'contact') {
      return renderContactForm();
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg capitalize">{activeSection} Section</h3>
          {currentSection && (
            <button
              onClick={() => deleteSection(currentSection.id!)}
              className="btn-secondary text-red-600 hover:bg-red-50 text-xs"
            >
              Delete Section
            </button>
          )}
        </div>

        {activeSection === 'hero' && renderHeroForm(currentSection as HeroSection)}
        {activeSection === 'features' && renderFeaturesForm(currentSection as FeaturesSection)}
        {activeSection === 'pricing' && renderPricingForm(currentSection as PricingSection)}
        {activeSection === 'cta' && renderCTAForm(currentSection as CTASection)}
        {activeSection === 'waitlist' && renderWaitlistForm(currentSection as WaitlistSection)}
        {activeSection === 'header' && renderHeaderForm(currentSection as HeaderSection)}
        {activeSection === 'footer' && renderFooterForm(currentSection as FooterSection)}
      </div>
    );
  };

  // Contact Info Form
  const renderContactForm = () => (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Contact Information</h3>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={contactInfo?.email || ''}
            onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value } as ContactInfo))}
            className="w-full p-2 border border-border rounded"
            placeholder="hello@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Twitter</label>
          <input
            type="text"
            value={contactInfo?.twitter || ''}
            onChange={(e) => setContactInfo(prev => ({ ...prev, twitter: e.target.value } as ContactInfo))}
            className="w-full p-2 border border-border rounded"
            placeholder="@username"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">GitHub</label>
          <input
            type="text"
            value={contactInfo?.github || ''}
            onChange={(e) => setContactInfo(prev => ({ ...prev, github: e.target.value } as ContactInfo))}
            className="w-full p-2 border border-border rounded"
            placeholder="username"
          />
        </div>
        <button
          onClick={async () => {
            if (contactInfo) {
              const response = await contentApi.updateContactInfo(contactInfo);
              if (response.success) {
                setError(null);
                await loadDatabaseContent();
              } else {
                setError(response.error || 'Failed to update contact info');
              }
            }
          }}
          className="btn-primary"
        >
          Save Contact Info
        </button>
      </div>
    </div>
  );

  // Hero Section Form
  const renderHeroForm = (section: HeroSection | undefined) => {
    const [formData, setFormData] = useState<Partial<HeroSection>>(
      section || {
        section_type: 'hero' as const,
        is_visible: true,
        title: '',
        subtitle: '',
        description: '',
        primary_button: '',
        secondary_button: ''
      }
    );

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-2 border border-border rounded"
              placeholder="Main title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Subtitle</label>
            <input
              type="text"
              value={formData.subtitle || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
              className="w-full p-2 border border-border rounded"
              placeholder="Subtitle"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-2 border border-border rounded h-24"
              placeholder="Hero description"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Primary Button</label>
              <input
                type="text"
                value={formData.primary_button || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, primary_button: e.target.value }))}
                className="w-full p-2 border border-border rounded"
                placeholder="Get Started"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Secondary Button</label>
              <input
                type="text"
                value={formData.secondary_button || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, secondary_button: e.target.value }))}
                className="w-full p-2 border border-border rounded"
                placeholder="Learn More"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="hero-visible"
              checked={formData.is_visible}
              onChange={(e) => setFormData(prev => ({ ...prev, is_visible: e.target.checked }))}
              className="rounded border-border"
            />
            <label htmlFor="hero-visible" className="text-sm">Visible on website</label>
          </div>
          <button
            onClick={async () => {
              await saveSection(formData);
              setFormData(section || formData);
            }}
            className="btn-primary"
          >
            {section ? 'Update Hero Section' : 'Create Hero Section'}
          </button>
        </div>
      </div>
    );
  };

  // Features Section Form (simplified for now - full CRUD would be more complex)
  const renderFeaturesForm = (section: FeaturesSection | undefined) => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Features section editing requires individual feature CRUD operations. 
        This would include adding/removing features, editing each feature's icon, title, description, and badge.
      </p>
      <p className="text-xs text-gray-500">
        Full feature management will be implemented with individual feature cards, 
        add/remove buttons, and drag-and-drop reordering.
      </p>
      {section && (
        <div className="p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
          Current section has {(section as any).features?.length || 0} features
        </div>
      )}
    </div>
  );

  // Pricing Section Form (simplified)
  const renderPricingForm = (section: PricingSection | undefined) => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Pricing section editing requires individual pricing plan CRUD operations.
      </p>
      {section && (
        <div className="p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
          Current section has {(section as any).plans?.length || 0} pricing plans
        </div>
      )}
    </div>
  );

  // CTA Section Form
  const renderCTAForm = (section: CTASection | undefined) => {
    const [formData, setFormData] = useState<Partial<CTASection>>(
      section || {
        section_type: 'cta' as const,
        is_visible: true,
        title: '',
        description: '',
        primary_button: '',
        secondary_button: ''
      }
    );

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-2 border border-border rounded"
              placeholder="Ready to get started?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-2 border border-border rounded h-24"
              placeholder="Call to action description"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Primary Button</label>
              <input
                type="text"
                value={formData.primary_button || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, primary_button: e.target.value }))}
                className="w-full p-2 border border-border rounded"
                placeholder="Start Free Trial"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Secondary Button</label>
              <input
                type="text"
                value={formData.secondary_button || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, secondary_button: e.target.value }))}
                className="w-full p-2 border border-border rounded"
                placeholder="Schedule Demo"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="cta-visible"
              checked={formData.is_visible}
              onChange={(e) => setFormData(prev => ({ ...prev, is_visible: e.target.checked }))}
              className="rounded border-border"
            />
            <label htmlFor="cta-visible" className="text-sm">Visible on website</label>
          </div>
          <button
            onClick={async () => {
              await saveSection(formData);
            }}
            className="btn-primary"
          >
            {section ? 'Update CTA Section' : 'Create CTA Section'}
          </button>
        </div>
      </div>
    );
  };

  // Waitlist Section Form
  const renderWaitlistForm = (section: WaitlistSection | undefined) => {
    const [formData, setFormData] = useState<Partial<WaitlistSection>>(
      section || {
        section_type: 'waitlist' as const,
        is_visible: true,
        title: '',
        description: '',
        button_text: '',
        success_message: ''
      }
    );

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-2 border border-border rounded"
              placeholder="Join the Waitlist"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-2 border border-border rounded h-24"
              placeholder="Be the first to know when we launch..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Button Text</label>
            <input
              type="text"
              value={formData.button_text || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, button_text: e.target.value }))}
              className="w-full p-2 border border-border rounded"
              placeholder="Join Waitlist"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Success Message</label>
            <input
              type="text"
              value={formData.success_message || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, success_message: e.target.value }))}
              className="w-full p-2 border border-border rounded"
              placeholder="Thank you for joining our waitlist!"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="waitlist-visible"
              checked={formData.is_visible}
              onChange={(e) => setFormData(prev => ({ ...prev, is_visible: e.target.checked }))}
              className="rounded border-border"
            />
            <label htmlFor="waitlist-visible" className="text-sm">Visible on website</label>
          </div>
          <button
            onClick={async () => {
              await saveSection(formData);
            }}
            className="btn-primary"
          >
            {section ? 'Update Waitlist Section' : 'Create Waitlist Section'}
          </button>
        </div>
      </div>
    );
  };

  // Header and Footer forms (simplified for now)
  const renderHeaderForm = (section: HeaderSection | undefined) => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Header section editing requires navigation items CRUD operations.
      </p>
    </div>
  );

  const renderFooterForm = (section: FooterSection | undefined) => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Footer section editing requires footer link groups and links CRUD operations.
      </p>
    </div>
  );

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
              {databaseAvailable && (
                <button
                  onClick={() => setEditMode('database')}
                  className={`px-3 py-1 text-sm rounded ${
                    editMode === 'database' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  Database
                </button>
              )}
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