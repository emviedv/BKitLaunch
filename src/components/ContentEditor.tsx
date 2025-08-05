import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLogin from './AdminLogin';
import productData from '@/data/products.json';
import { contentApi } from '@/lib/contentApi';
import { debugService } from '@/lib/debugService';
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
import { ContactSectionEditor } from './ContentEditor/ContactSectionEditor';
import { HeroSectionEditor } from './ContentEditor/HeroSectionEditor';
import { SettingsSectionEditor } from './ContentEditor/SettingsSectionEditor';
import { LLMSectionEditor } from './ContentEditor/LLMSectionEditor';
import { FeaturesSectionEditor } from './ContentEditor/FeaturesSectionEditor';
import { PricingProductSectionEditor } from './ContentEditor/PricingProductSectionEditor';

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

  // Build unified content object from database sections and contact info
  const buildUnifiedContentFromDatabase = (sections: any[], contactInfo: ContactInfo | null) => {
    debugService.contentUpdate('Building unified content from database sections', { sectionCount: sections.length });
    
    // Start with default structure from productData as fallback
    const unifiedContent: any = { ...productData };
    
    // Map database sections to content structure
    sections.forEach((section: any) => {
      const sectionData = section.section_data || {};
      
      switch (section.section_type) {
        case 'hero':
          unifiedContent.hero = {
            ...unifiedContent.hero,
            ...sectionData,
            // Ensure we preserve any structure from productData that might not be in DB
            settings: { ...unifiedContent.hero?.settings, ...sectionData.settings }
          };
          break;
        case 'features':
          unifiedContent.features = {
            ...unifiedContent.features,
            ...sectionData,
            // If section has related features, include them
            items: section.features || sectionData.items || unifiedContent.features?.items || []
          };
          break;
        case 'pricing':
          unifiedContent.pricing = {
            ...unifiedContent.pricing,
            ...sectionData,
            // If section has related plans, include them
            plans: section.plans || sectionData.plans || unifiedContent.pricing?.plans || []
          };
          break;
        case 'cta':
          if (!unifiedContent.cta) unifiedContent.cta = {};
          unifiedContent.cta = {
            ...unifiedContent.cta,
            ...sectionData
          };
          break;
        case 'waitlist':
          if (!unifiedContent.waitlist) unifiedContent.waitlist = {};
          unifiedContent.waitlist = {
            ...unifiedContent.waitlist,
            ...sectionData
          };
          break;
        case 'header':
          if (!unifiedContent.header) unifiedContent.header = {};
          unifiedContent.header = {
            ...unifiedContent.header,
            ...sectionData,
            // Include navigation items if present
            navigation: section.navigation_items || sectionData.navigation || unifiedContent.header?.navigation || []
          };
          break;
        case 'footer':
          if (!unifiedContent.footer) unifiedContent.footer = {};
          unifiedContent.footer = {
            ...unifiedContent.footer,
            ...sectionData,
            // Include footer links if present
            links: section.footer_links || sectionData.links || unifiedContent.footer?.links || []
          };
          break;
        default:
          // For any other section types, add them directly
          unifiedContent[section.section_type] = sectionData;
      }
    });
    
    // Add contact info if available
    if (contactInfo) {
      unifiedContent.contact = contactInfo;
    }
    
    debugService.contentUpdate('Unified content built successfully', { 
      sections: Object.keys(unifiedContent),
      hasContact: !!contactInfo 
    });
    
    return unifiedContent;
  };

  const handleSave = async () => {
    debugService.saveStart('Main content save', { editMode, databaseAvailable });
    
    try {
      let contentToSave;
      if (editMode === 'json') {
        try {
          contentToSave = JSON.parse(jsonContent);
          debugService.contentUpdate('JSON parsed successfully', { contentKeys: Object.keys(contentToSave) });
        } catch (parseError) {
          debugService.saveError('JSON parse failed', parseError);
          alert('Invalid JSON format. Please check your syntax.');
          return;
        }
      } else {
        contentToSave = savedContent;
        debugService.contentUpdate('Using current saved content', { contentKeys: Object.keys(contentToSave) });
      }
      
      let saveSuccess = false;
      
      // Try to save to database first if available
      if (databaseAvailable) {
        debugService.saveStart('Saving to database');
        try {
          const response = await contentApi.saveContent(contentToSave, true); // Save as published
          if (response.success) {
            debugService.saveSuccess('Database save completed', response.data);
            saveSuccess = true;
            
            // If this is JSON mode, also sync to content_sections tables
            if (editMode === 'json') {
              debugService.saveStart('Syncing JSON to sections tables');
              const syncResponse = await contentApi.syncJsonToSections(contentToSave);
              if (syncResponse.success) {
                debugService.saveSuccess('JSON to sections sync completed', syncResponse.message);
              } else {
                debugService.saveError('JSON to sections sync failed', syncResponse.error);
                // Continue anyway - at least site_content was saved
              }
            }
          } else {
            debugService.saveError('Database save failed', response.error);
            // Fall back to localStorage
          }
        } catch (error) {
          debugService.saveError('Database save exception', error);
          // Fall back to localStorage
        }
      }
      
      // Always save to localStorage as backup/fallback
      debugService.saveStart('Saving to localStorage');
      try {
        localStorage.setItem('bibliokit-content', JSON.stringify(contentToSave));
        debugService.saveSuccess('localStorage save completed');
        if (!saveSuccess) saveSuccess = true; // At least localStorage worked
      } catch (error) {
        debugService.saveError('localStorage save failed', error);
      }
      
      if (saveSuccess) {
        // Update state without page reload
        setSavedContent(contentToSave);
        setJsonContent(JSON.stringify(contentToSave, null, 2));
        setIsEditing(false);
        
        // Notify parent component of content update
        if (onContentUpdate) {
          debugService.contentUpdate('Notifying parent component');
          onContentUpdate(contentToSave);
        }
        
        debugService.saveSuccess('Content save completed successfully');
        
        // Show success message briefly
        const successMessage = databaseAvailable ? 'Content saved to database!' : 'Content saved locally!';
        showSaveNotification(successMessage, 'success');
        
        // Reload database content to reflect changes for both database and JSON modes
        if (databaseAvailable) {
          await loadDatabaseContent();
        }
      } else {
        debugService.saveError('All save methods failed', 'No successful save operation completed');
        showSaveNotification('Failed to save content. Please try again.', 'error');
      }
      
    } catch (error) {
      debugService.saveError('Unexpected error during save', error);
      showSaveNotification('An unexpected error occurred while saving.', 'error');
    }
  };

  // Add notification system for save feedback
  const [saveNotification, setSaveNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const showSaveNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setSaveNotification({ message, type });
    setTimeout(() => setSaveNotification(null), 3000);
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
      if (!isAuthenticated || !isAdmin) {
        debugService.authEvent('Content editor access denied - not authenticated or admin');
        return;
      }
      
      debugService.info('Starting database availability check');
      setLoading(true);
      
      try {
        const available = await contentApi.isDatabaseAvailable();
        setDatabaseAvailable(available);
        debugService.dbConnection(available ? 'Database available' : 'Database unavailable');
        
        if (available) {
          debugService.contentLoad('Loading content from database');
          await loadDatabaseContent();
        } else {
          debugService.contentLoad('Falling back to localStorage');
          // Fallback to localStorage
          const saved = localStorage.getItem('bibliokit-content');
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              setSavedContent(parsed);
              setJsonContent(JSON.stringify(parsed, null, 2));
              debugService.contentLoad('localStorage content loaded successfully', { keys: Object.keys(parsed) });
            } catch (error) {
              debugService.error('Failed to parse localStorage content', error);
            }
          } else {
            debugService.contentLoad('No localStorage content found, using defaults');
          }
        }
      } catch (error) {
        debugService.error('Database check failed', error);
        setDatabaseAvailable(false);
      } finally {
        setLoading(false);
      }
    };

    checkDatabase();
  }, [isAuthenticated, isAdmin]);

  // Load all content from database
  const loadDatabaseContent = async () => {
    debugService.contentLoad('Starting database content load');
    try {
      // Load both published content and sections data in parallel
      const [publishedResponse, sectionsResponse, contactResponse] = await Promise.all([
        contentApi.getCurrentContent(),
        contentApi.getAllSections(),
        contentApi.getContactInfo()
      ]);

      debugService.apiResponse('GET', 'published-content', publishedResponse);
      debugService.apiResponse('GET', 'sections', sectionsResponse);
      debugService.apiResponse('GET', 'contact', contactResponse);

      let liveContent;

      // Strategy: Use published content from site_content if available and recent,
      // otherwise rebuild from content_sections
      if (publishedResponse.success && publishedResponse.data?.content_data) {
        debugService.contentLoad('Using published content from site_content table');
        liveContent = publishedResponse.data.content_data;
        
        // Still update sections state for database mode editor
        if (sectionsResponse.success) {
          setSections(sectionsResponse.data || []);
        }
      } else {
        debugService.contentLoad('Published content not available, rebuilding from sections');
        
        // Set sections for database mode
        if (sectionsResponse.success) {
          setSections(sectionsResponse.data || []);
          debugService.contentLoad('Sections loaded', { count: sectionsResponse.data?.length || 0 });
        } else {
          debugService.error('Failed to load sections', sectionsResponse.error);
          setSections([]);
        }

        // Rebuild unified content object from database sections and contact info
        liveContent = buildUnifiedContentFromDatabase(
          sectionsResponse.success ? sectionsResponse.data || [] : [],
          contactResponse.success ? contactResponse.data || null : null
        );
      }

      // Update contact info state
      if (contactResponse.success) {
        setContactInfo(contactResponse.data || null);
        debugService.contentLoad('Contact info loaded', contactResponse.data);
      } else {
        debugService.error('Failed to load contact info', contactResponse.error);
        setContactInfo(null);
      }

      // Ensure contact info is in the unified content
      if (contactResponse.success && contactResponse.data) {
        liveContent = { 
          ...liveContent, 
          contact: contactResponse.data 
        };
      }

      // Update JSON editor state with live database content
      setSavedContent(liveContent);
      setJsonContent(JSON.stringify(liveContent, null, 2));
      debugService.contentLoad('Unified content loaded from database', { 
        source: publishedResponse.success && publishedResponse.data?.content_data ? 'site_content' : 'content_sections',
        sections: Object.keys(liveContent).filter(key => key !== 'contact'),
        hasContact: !!liveContent.contact 
      });

    } catch (error) {
      debugService.error('Database content load failed', error);
      setError('Failed to load content from database');
    }
  };

  // Save section to database
  const saveSection = async (section: Partial<ContentSection>) => {
    const operation = section.id ? 'update' : 'create';
    debugService.saveStart(`Section ${operation}`, { sectionType: section.section_type, id: section.id });
    
    try {
      let response;
      if (!section.id) {
        // Create new section
        debugService.apiRequest('POST', 'content-sections', section);
        response = await contentApi.createSection(section as Omit<ContentSection, 'id' | 'created_at' | 'updated_at'>);
      } else {
        // Update existing section
        debugService.apiRequest('PUT', `content-sections/${section.id}`, section);
        response = await contentApi.updateSection(section.id, section);
      }
      
      debugService.apiResponse(operation.toUpperCase(), 'content-sections', response);
      
      if (response.success) {
        debugService.saveSuccess(`Section ${operation} completed`, response.data);
        await loadDatabaseContent(); // This will rebuild unified content automatically
        setError(null);
        showSaveNotification(`${section.section_type} section ${operation}d successfully!`, 'success');
      } else {
        const errorMsg = response.error || `Failed to ${operation} section`;
        debugService.saveError(`Section ${operation} failed`, errorMsg);
        setError(errorMsg);
        showSaveNotification(errorMsg, 'error');
      }
    } catch (error) {
      debugService.saveError(`Section ${operation} exception`, error);
      const errorMsg = `Unexpected error during section ${operation}`;
      setError(errorMsg);
      showSaveNotification(errorMsg, 'error');
    }
  };

  // Delete section from database
  const deleteSection = async (sectionId: number) => {
    debugService.saveStart('Section delete', { sectionId });
    
    try {
      debugService.apiRequest('DELETE', `content-sections/${sectionId}`);
      const response = await contentApi.deleteSection(sectionId);
      debugService.apiResponse('DELETE', 'content-sections', response);
      
      if (response.success) {
        debugService.saveSuccess('Section delete completed', { sectionId });
        await loadDatabaseContent(); // This will rebuild unified content automatically
        setError(null);
        showSaveNotification('Section deleted successfully!', 'success');
      } else {
        const errorMsg = response.error || 'Failed to delete section';
        debugService.saveError('Section delete failed', errorMsg);
        setError(errorMsg);
        showSaveNotification(errorMsg, 'error');
      }
    } catch (error) {
      debugService.saveError('Section delete exception', error);
      const errorMsg = 'Unexpected error during section delete';
      setError(errorMsg);
      showSaveNotification(errorMsg, 'error');
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
            <SettingsSectionEditor
              settings={savedContent.settings}
              updateSettingsVisibility={updateSettingsVisibility}
            />
          )}

          {activeSection === 'llm' && (
            <LLMSectionEditor
              llmContent={(savedContent as any).llm}
              updateNestedField={updateNestedField}
              countWords={countWords}
              getWordStatus={getWordStatus}
            />
          )}
          
          {activeSection === 'hero' && (
            <HeroSectionEditor
              hero={savedContent.hero}
              updateNestedField={updateNestedField}
            />
          )}

          {activeSection === 'contact' && (
            <ContactSectionEditor
              contact={savedContent.contact}
              updateNestedField={updateNestedField}
            />
          )}

          {activeSection === 'features' && (
            <FeaturesSectionEditor
              features={savedContent.features}
              updateNestedField={updateNestedField}
            />
          )}

          {(activeSection === 'pricing' || activeSection === 'product') && (
            <PricingProductSectionEditor
              activeSection={activeSection}
              pricing={savedContent.pricing}
              product={savedContent.product}
              updateNestedField={updateNestedField}
              updateSection={updateSection}
              setEditMode={setEditMode}
            />
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
      {/* Save Notification */}
      {saveNotification && (
        <div className={`fixed top-4 right-4 z-[60] px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ${
          saveNotification.type === 'success' ? 'bg-green-500 text-white' :
          saveNotification.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          <div className="flex items-center gap-2">
            <span>
              {saveNotification.type === 'success' ? '✅' :
               saveNotification.type === 'error' ? '❌' : 'ℹ️'}
            </span>
            <span>{saveNotification.message}</span>
          </div>
        </div>
      )}
      
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