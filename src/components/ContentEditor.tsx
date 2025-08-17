import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLogin from './AdminLogin';
import productData from '@/data/products.json';
import { contentApi } from '@/lib/contentApi';
import { debugService } from '@/lib/debugService';
import { reorderArray } from '@/lib/utils';
import { useContentEditorState } from './ContentEditor/useContentEditorState';
import { HeaderNavigationEditor } from './ContentEditor/HeaderNavigationEditor';
import { FooterEditor } from './ContentEditor/FooterEditor';
import { HeaderCtasEditor } from './ContentEditor/HeaderCtasEditor';
import { ProductsManager } from './ContentEditor/ProductsManager';
import { PagesEditor } from './ContentEditor/PagesEditor';
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
import { IndividualProductEditor } from './ContentEditor/IndividualProductEditor';

interface ContentEditorProps {
  onContentUpdate?: (newContent: any) => void;
  initialOpen?: boolean;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ onContentUpdate, initialOpen = false }) => {
  const [editMode, setEditMode] = useState<'json' | 'sections' | 'database'>('database');
  const [showEditor, setShowEditor] = useState(initialOpen);
  const [showLogin, setShowLogin] = useState(false);
  const {
    savedContent,
    setSavedContent,
    jsonContent,
    setJsonContent,
    isEditing,
    setIsEditing,
    updateSection,
    updateNestedField,
  } = useContentEditorState();
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [databaseAvailable, setDatabaseAvailable] = useState<boolean | null>(null);
  const { isAuthenticated, isAdmin, logout } = useAuth();

  // Local product CRUD UI state
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [newProductSlug, setNewProductSlug] = useState('');
  const [newProductTitle, setNewProductTitle] = useState('');

  const normalizeSlug = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  const ensureUniqueSlug = (baseSlug: string) => {
    const existing = Object.keys(((savedContent as any)?.products) || {});
    if (!existing.includes(baseSlug)) return baseSlug;
    let i = 2;
    let candidate = `${baseSlug}-${i}`;
    while (existing.includes(candidate)) {
      i += 1;
      candidate = `${baseSlug}-${i}`;
    }
    return candidate;
  };

  const addHeaderNavigationForProduct = (slug: string, title: string) => {
    const currentNav: Array<{ label: string; href: string }> = Array.isArray((savedContent as any)?.header?.navigation)
      ? ([...(savedContent as any).header.navigation] as any)
      : [];
    const href = `/${slug}`;
    const exists = currentNav.some((n) => n.href === href);
    if (exists) return; // no-op if already present
    const updatedNav = [...currentNav, { label: title || slug.replace(/-/g, ' '), href }];
    const nextHeader = { ...((savedContent as any)?.header || {}), navigation: updatedNav };
    updateSection('header', nextHeader);
  };

  const removeHeaderNavigationForProduct = (slug: string) => {
    const currentNav: Array<{ label: string; href: string }> = Array.isArray((savedContent as any)?.header?.navigation)
      ? ([...(savedContent as any).header.navigation] as any)
      : [];
    const href = `/${slug}`;
    const filtered = currentNav.filter((n) => n.href !== href);
    const nextHeader = { ...((savedContent as any)?.header || {}), navigation: filtered };
    updateSection('header', nextHeader);
  };

  const handleCreateProduct = () => {
    const normalized = normalizeSlug(newProductSlug || newProductTitle);
    if (!normalized) {
      showSaveNotification('Enter a slug or title to create a product page', 'error');
      return;
    }
    const unique = ensureUniqueSlug(normalized);
    const title = newProductTitle || unique.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const newProduct = {
      visibility: { waitlist: true },
      badgeLabel: '',
      title,
      description: '',
      primaryButton: 'Get Started',
      primaryButtonLink: '',
      secondaryButton: 'Learn More',
      secondaryButtonLink: '',
      details: [],
      benefits: [],
      specifications: [],
      pricing: { price: '', period: '', description: '', buttonText: '' },
      llm: {
        answerBox: '',
        expertQuote: {},
        statistic: {},
        faqs: []
      }
    };
    const nextProducts = { ...((savedContent as any).products || {}) } as any;
    nextProducts[unique] = newProduct;
    updateSection('products', nextProducts);
    addHeaderNavigationForProduct(unique, title);
    setShowNewProductForm(false);
    setNewProductSlug('');
    setNewProductTitle('');
    setActiveSection(`product-${unique}`);
    showSaveNotification('Product page created. Remember to Publish Changes.', 'success');
  };

  const handleDuplicateProduct = (productKey: string) => {
    const source = (savedContent as any)?.products?.[productKey];
    if (!source) return;
    const baseSlug = normalizeSlug(`${productKey}-copy`);
    const unique = ensureUniqueSlug(baseSlug);
    const cloned = JSON.parse(JSON.stringify(source));
    const title = `${cloned.title || productKey} (Copy)`;
    cloned.title = title;
    const nextProducts = { ...((savedContent as any).products || {}) } as any;
    nextProducts[unique] = cloned;
    updateSection('products', nextProducts);
    addHeaderNavigationForProduct(unique, title);
    setActiveSection(`product-${unique}`);
    showSaveNotification('Product duplicated. Remember to Publish Changes.', 'success');
  };

  const handleDeleteProduct = (productKey: string) => {
    const current = { ...((savedContent as any).products || {}) } as any;
    if (!current[productKey]) return;
    delete current[productKey];
    updateSection('products', current);
    removeHeaderNavigationForProduct(productKey);
    if (activeSection === `product-${productKey}`) setActiveSection('settings');
    showSaveNotification('Product removed. Remember to Publish Changes.', 'info');
  };

  // Migrate content to ensure it has the new products structure
  const migrateContentStructure = (content: any) => {
    // If products object doesn't exist, create it from current productData
    if (!content.products && productData.products) {
      content.products = { ...productData.products };
      debugService.contentUpdate('Migrated content to include products structure');
    }
    
    // Ensure all required sections exist
    const defaultContent = { ...productData } as any;
    Object.keys(defaultContent).forEach(key => {
      if (!content[key]) {
        content[key] = defaultContent[key];
      }
    });
    
    // Ensure all visibility settings exist
    if (!content.settings) {
      content.settings = { visibility: {} };
    }
    if (!content.settings.visibility) {
      content.settings.visibility = {};
    }
    // Ensure labels settings exist and have defaults
    if (!content.settings.labels) {
      (content.settings as any).labels = {
        featuresBadges: true,
        pricingBadges: true,
        heroBadges: true,
        productBadges: true,
        ctaBadges: true,
      };
    } else {
      const labels = (content.settings as any).labels;
      if (labels.featuresBadges === undefined) labels.featuresBadges = true;
      if (labels.pricingBadges === undefined) labels.pricingBadges = true;
      if (labels.heroBadges === undefined) labels.heroBadges = true;
      if (labels.productBadges === undefined) labels.productBadges = true;
      if (labels.ctaBadges === undefined) labels.ctaBadges = true;
    }
    
                // Add default visibility for all sections
    const defaultVisibility = {
      hero: true,
      features: true,
      pricing: false,
      'bibliokit-blocks': true,
      'ai-rename-variants': true,
      product: true,
      contact: true,
      cta: true,
      waitlist: true,
      header: true,
      footer: true
    };
    
    Object.entries(defaultVisibility).forEach(([key, defaultValue]) => {
      if (content.settings.visibility[key] === undefined) {
        content.settings.visibility[key] = defaultValue;
      }
    });
    
    return content;
  };

  // Build unified content object from database sections and contact info
  const buildUnifiedContentFromDatabase = (sections: any[], contactInfo: ContactInfo | null) => {
    debugService.contentUpdate('Building unified content from database sections', { sectionCount: sections.length });
    
    // Start with default structure from productData as fallback
    const unifiedContent: any = { ...productData };
    if (!unifiedContent.settings) unifiedContent.settings = {};
    if (!unifiedContent.settings.visibility) unifiedContent.settings.visibility = {};
    
    // Map database sections to content structure
    sections.forEach((section: any) => {
      const sectionData = section.section_data || {};
      // Mirror DB visibility into content.settings.visibility
      if (section.section_type) {
        unifiedContent.settings.visibility[section.section_type] = section.is_visible !== false;
      }
      
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
            // normalize snake_case -> camelCase
            title: sectionData.title ?? unifiedContent.waitlist.title,
            description: sectionData.description ?? unifiedContent.waitlist.description,
            buttonText: sectionData.buttonText ?? sectionData.button_text ?? unifiedContent.waitlist.buttonText,
            successMessage: sectionData.successMessage ?? sectionData.success_message ?? unifiedContent.waitlist.successMessage
          };
          break;
         case 'header': {
          if (!unifiedContent.header) unifiedContent.header = {};
          const mappedHeader = {
            logoText: sectionData.logoText || sectionData.logo_text || unifiedContent.header?.logoText,
            signInText: sectionData.signInText || sectionData.sign_in_text || unifiedContent.header?.signInText,
            getStartedText: sectionData.getStartedText || sectionData.get_started_text || unifiedContent.header?.getStartedText,
             signInHref: sectionData.signInHref || sectionData.sign_in_href || unifiedContent.header?.signInHref,
             getStartedHref: sectionData.getStartedHref || sectionData.get_started_href || unifiedContent.header?.getStartedHref,
             showSignIn: (sectionData.showSignIn ?? sectionData.show_sign_in ?? unifiedContent.header?.showSignIn ?? true),
             showGetStarted: (sectionData.showGetStarted ?? sectionData.show_get_started ?? unifiedContent.header?.showGetStarted ?? true),
            navigation: section.navigation_items || sectionData.navigation || sectionData.navigation_items || unifiedContent.header?.navigation || []
          };
          unifiedContent.header = {
            ...unifiedContent.header,
            ...mappedHeader
          };
          break;
        }
        case 'footer': {
          if (!unifiedContent.footer) unifiedContent.footer = {};
          const mappedFooter = {
            description: sectionData.description || unifiedContent.footer?.description,
            sections: section.footer_links || sectionData.sections || unifiedContent.footer?.sections || []
          };
          unifiedContent.footer = {
            ...unifiedContent.footer,
            ...mappedFooter
          };
          break;
        }
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
      let dbSaveSuccess = false;
      
      // Try to save to database first if available
      if (databaseAvailable) {
        debugService.saveStart('Saving to database');
        try {
          const response = await contentApi.saveContent(contentToSave, true); // Save as published
          if (response.success) {
            debugService.saveSuccess('Database save completed', response.data);
            saveSuccess = true;
            dbSaveSuccess = true;
            
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
        const successMessage = dbSaveSuccess ? 'Content saved to database!' : 'Content saved locally!';
        showSaveNotification(successMessage, 'success');
        
        // Reload database content to reflect changes for both database and JSON modes
        if (dbSaveSuccess) {
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

  // updateSection and updateNestedField now come from useContentEditorState

  const updateVisibility = (sectionKey: string, isVisible: boolean) => {
    const currentSettings: any = savedContent.settings || { visibility: {}, labels: {} };
    const updatedSettings = { ...currentSettings } as any;
    // Support nested label toggles via "labels.{key}" path
    if (sectionKey.startsWith('labels.')) {
      const labelKey = sectionKey.split('.')[1];
      updatedSettings.labels = { ...(currentSettings.labels || {}), [labelKey]: isVisible };
    } else {
      updatedSettings.visibility = {
        ...(currentSettings.visibility || {}),
        [sectionKey]: isVisible,
      };
    }
    updateSection('settings', updatedSettings);
  };

  // Legacy function for backward compatibility
  const updateSettingsVisibility = (section: string, isVisible: boolean) => {
    updateVisibility(section, isVisible);
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
              const migratedContent = migrateContentStructure(parsed);
              setSavedContent(migratedContent);
              setJsonContent(JSON.stringify(migratedContent, null, 2));
              debugService.contentLoad('localStorage content loaded and migrated successfully', { keys: Object.keys(migratedContent) });
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
      const migratedLiveContent = migrateContentStructure(liveContent);
      setSavedContent(migratedLiveContent);
      setJsonContent(JSON.stringify(migratedLiveContent, null, 2));
      try {
        localStorage.setItem('bibliokit-content', JSON.stringify(migratedLiveContent));
      } catch {}
      if (onContentUpdate) {
        try { onContentUpdate(migratedLiveContent); } catch {}
      }
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
      cta: 'CTA Section',
      waitlist: 'Waitlist Section',
      header: 'Header Section',
      footer: 'Footer Section',
      contact: 'Contact Info',
      pages: 'Pages'
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
                className="mt-2 w-full button text-xs"
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
          <ProductsManager
            products={(savedContent as any)?.products || {}}
            activeSection={activeSection}
            showNewProductForm={showNewProductForm}
            newProductSlug={newProductSlug}
            newProductTitle={newProductTitle}
            setActiveSection={setActiveSection}
            setShowNewProductForm={setShowNewProductForm}
            setNewProductSlug={setNewProductSlug}
            setNewProductTitle={setNewProductTitle}
            onDuplicate={handleDuplicateProduct}
            onDelete={handleDeleteProduct}
            onCreate={handleCreateProduct}
          />
          <div className="mt-6 pt-4 border-t border-border">
            <button
              onClick={() => setEditMode('json')}
              className="w-full button-secondary text-sm"
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
              visible={savedContent.settings?.visibility?.hero ?? true}
              updateVisibility={(isVisible) => updateVisibility('hero', isVisible)}
            />
          )}

          {activeSection === 'pages' && (
            <PagesEditor
              pages={(savedContent as any).pages || []}
              onChange={(next) => updateSection('pages', next)}
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
              visible={savedContent.settings?.visibility?.features ?? true}
              updateVisibility={(isVisible) => updateVisibility('features', isVisible)}
              updateSection={updateSection}
              sectionData={(savedContent as any).featuresSection}
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
              pricingVisible={savedContent.settings?.visibility?.pricing ?? false}
              productVisible={(savedContent.settings?.visibility as any)?.product ?? true}
              updateVisibility={updateVisibility}
            />
          )}

          {activeSection === 'cta' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">CTA Section</h3>
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  id="cta-visible"
                  checked={savedContent.settings?.visibility?.cta ?? true}
                  onChange={(e) => updateVisibility('cta', e.target.checked)}
                  className="rounded border-border"
                />
                <label htmlFor="cta-visible" className="text-sm">Visible on website</label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={savedContent.cta?.title || ''}
                  onChange={(e) => updateNestedField('cta', null, 'title', e.target.value)}
                  className="w-full p-2 border border-border rounded"
                  placeholder="Ready to get started?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={savedContent.cta?.description || ''}
                  onChange={(e) => updateNestedField('cta', null, 'description', e.target.value)}
                  className="w-full p-2 border border-border rounded h-24"
                  placeholder="Description text"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Primary Button</label>
                  <input
                    type="text"
                    value={savedContent.cta?.primaryButton || ''}
                    onChange={(e) => updateNestedField('cta', null, 'primaryButton', e.target.value)}
                    className="w-full p-2 border border-border rounded"
                    placeholder="Start Free Trial"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Secondary Button</label>
                  <input
                    type="text"
                    value={savedContent.cta?.secondaryButton || ''}
                    onChange={(e) => updateNestedField('cta', null, 'secondaryButton', e.target.value)}
                    className="w-full p-2 border border-border rounded"
                    placeholder="Schedule Demo"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'waitlist' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Waitlist Section</h3>
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  id="waitlist-visible"
                  checked={savedContent.settings?.visibility?.waitlist ?? true}
                  onChange={(e) => updateVisibility('waitlist', e.target.checked)}
                  className="rounded border-border"
                />
                <label htmlFor="waitlist-visible" className="text-sm">Visible on website</label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={savedContent.waitlist?.title || ''}
                  onChange={(e) => updateNestedField('waitlist', null, 'title', e.target.value)}
                  className="w-full p-2 border border-border rounded"
                  placeholder="Join the Waitlist"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={savedContent.waitlist?.description || ''}
                  onChange={(e) => updateNestedField('waitlist', null, 'description', e.target.value)}
                  className="w-full p-2 border border-border rounded h-24"
                  placeholder="Be the first to know when we launch..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Button Text</label>
                <input
                  type="text"
                  value={savedContent.waitlist?.buttonText || ''}
                  onChange={(e) => updateNestedField('waitlist', null, 'buttonText', e.target.value)}
                  className="w-full p-2 border border-border rounded"
                  placeholder="Join Waitlist"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Success Message</label>
                <input
                  type="text"
                  value={savedContent.waitlist?.successMessage || ''}
                  onChange={(e) => updateNestedField('waitlist', null, 'successMessage', e.target.value)}
                  className="w-full p-2 border border-border rounded"
                  placeholder="Thank you for joining our waitlist!"
                />
              </div>
            </div>
          )}

          {activeSection === 'header' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Header Section</h3>
              <HeaderCtasEditor
                visibility={savedContent.settings?.visibility?.header ?? true}
                logoText={savedContent.header?.logoText || ''}
                signInText={savedContent.header?.signInText || ''}
                getStartedText={savedContent.header?.getStartedText || ''}
                signInHref={(savedContent.header as any)?.signInHref || ''}
                getStartedHref={(savedContent.header as any)?.getStartedHref || ''}
                showSignIn={(savedContent.header as any)?.showSignIn ?? true}
                showGetStarted={(savedContent.header as any)?.showGetStarted ?? true}
                onChangeVisibility={(isVisible) => updateVisibility('header', isVisible)}
                onChangeLogoText={(value) => updateNestedField('header', null, 'logoText', value)}
                onChangeSignInText={(value) => updateNestedField('header', null, 'signInText', value)}
                onChangeGetStartedText={(value) => updateNestedField('header', null, 'getStartedText', value)}
                onChangeSignInHref={(value) => updateNestedField('header', null, 'signInHref', value)}
                onChangeGetStartedHref={(value) => updateNestedField('header', null, 'getStartedHref', value)}
                onChangeShowSignIn={(checked) => updateNestedField('header', null, 'showSignIn', checked)}
                onChangeShowGetStarted={(checked) => updateNestedField('header', null, 'showGetStarted', checked)}
              />
              <HeaderNavigationEditor
                items={(((savedContent as any)?.header?.navigation as any[]) || [])}
                onChange={(next) => updateSection('header.navigation', next)}
              />
            </div>
          )}

          {activeSection === 'footer' && (
            <FooterEditor
              description={savedContent.footer?.description || ''}
              sections={(((savedContent as any)?.footer?.sections as any[]) || [])}
              visibility={savedContent.settings?.visibility?.footer ?? true}
              onChangeDescription={(value) => updateNestedField('footer', null, 'description', value)}
              onChangeSections={(next) => updateNestedField('footer', null, 'sections', next)}
              onChangeVisibility={(isVisible) => updateVisibility('footer', isVisible)}
            />
          )}

          {Object.keys((savedContent as any)?.products || {}).map((productKey) => (
            activeSection === `product-${productKey}` && (
              <IndividualProductEditor
                key={productKey}
                productKey={productKey}
                productData={(savedContent as any).products?.[productKey]}
                updateNestedField={updateNestedField}
                updateSection={updateSection}
                setEditMode={setEditMode}
              />
            )
          ))}
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
              className="mt-2 w-full button-secondary text-xs"
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
              className="w-full button-secondary text-sm mb-2"
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

    // Database mode intentionally excludes Pages; primary editing is in Sections/JSON

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg capitalize">{activeSection} Section</h3>
          {currentSection && (
            <button
              onClick={() => deleteSection(currentSection.id!)}
              className="button-secondary text-red-600 hover:bg-red-50 text-xs"
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

  // Pages CRUD Form (database mode)
  const renderPagesForm = () => {
    const [pages, setPages] = useState<Array<{ id?: number; slug: string; title: string; is_published?: boolean }>>([]);
    const [loadingPages, setLoadingPages] = useState(false);
    const [editingPage, setEditingPage] = useState<{ id?: number; slug: string; title: string; content: any; is_published?: boolean } | null>(null);

    useEffect(() => {
      const load = async () => {
        setLoadingPages(true);
        const res = await contentApi.getPages(false);
        if (res.success && res.data) {
          const list = (res.data as any[]).map(p => ({ id: p.id, slug: p.slug, title: p.title, is_published: p.is_published }));
          setPages(list);
        }
        setLoadingPages(false);
      };
      load();
    }, []);

    const startCreate = () => {
      setEditingPage({ slug: '', title: '', content: {}, is_published: false });
    };

    const startEdit = async (id: number) => {
      const res = await contentApi.getPage(id);
      if (res.success && res.data) {
        setEditingPage({
          id: (res.data as any).id,
          slug: (res.data as any).slug,
          title: (res.data as any).title,
          content: (res.data as any).content || {},
          is_published: (res.data as any).is_published || false
        });
      }
    };

    const savePage = async () => {
      if (!editingPage) return;
      if (editingPage.id) {
        const res = await contentApi.updatePage(editingPage.id, {
          slug: editingPage.slug,
          title: editingPage.title,
          content: editingPage.content,
          is_published: editingPage.is_published
        });
        if (res.success) {
          setEditingPage(null);
          const refreshed = await contentApi.getPages(false);
          if (refreshed.success && refreshed.data) setPages((refreshed.data as any[]).map(p => ({ id: p.id, slug: p.slug, title: p.title, is_published: p.is_published })));
        }
      } else {
        const res = await contentApi.createPage({
          slug: editingPage.slug,
          title: editingPage.title,
          content: editingPage.content,
          is_published: editingPage.is_published
        });
        if (res.success) {
          setEditingPage(null);
          const refreshed = await contentApi.getPages(false);
          if (refreshed.success && refreshed.data) setPages((refreshed.data as any[]).map(p => ({ id: p.id, slug: p.slug, title: p.title, is_published: p.is_published })));
        }
      }
    };

    // Duplicate a page in the database and ensure it is added to the Product Pages list
    const duplicatePage = async (pageToDuplicate: { id?: number; slug: string; title: string }) => {
      if (!pageToDuplicate?.id) return;
      // Build a unique slug based on existing pages list
      const baseSlug = `${pageToDuplicate.slug}-copy`;
      const existingSlugs = pages.map(p => p.slug);
      let uniqueSlug = baseSlug;
      let counter = 2;
      while (existingSlugs.includes(uniqueSlug)) {
        uniqueSlug = `${baseSlug}-${counter}`;
        counter += 1;
      }

      // Fetch full page content to clone
      const sourceRes = await contentApi.getPage(pageToDuplicate.id!);
      const sourceContent = sourceRes.success && sourceRes.data ? (sourceRes.data as any).content || {} : {};
      const newTitle = `${pageToDuplicate.title} (Copy)`;

      // Create the duplicated page record
      const createRes = await contentApi.createPage({
        slug: uniqueSlug,
        title: newTitle,
        content: sourceContent,
        is_published: false
      });

      if (createRes.success) {
        // Refresh list
        const refreshed = await contentApi.getPages(false);
        if (refreshed.success && refreshed.data) {
          setPages((refreshed.data as any[]).map(p => ({ id: p.id, slug: p.slug, title: p.title, is_published: p.is_published })));
        }

        // Also add a corresponding product entry so it appears under Product Pages
        const currentProducts = { ...(((savedContent as any) || {}).products || {}) } as Record<string, any>;
        if (!currentProducts[uniqueSlug]) {
          const newProduct = {
            visibility: { waitlist: true },
            badgeLabel: '',
            title: newTitle,
            description: '',
            primaryButton: 'Get Started',
            primaryButtonLink: '',
            secondaryButton: 'Learn More',
            secondaryButtonLink: '',
            details: [],
            benefits: [],
            specifications: [],
            pricing: { price: '', period: '', description: '', buttonText: '' },
            llm: { answerBox: '', expertQuote: {}, statistic: {}, faqs: [] }
          };
          const nextProducts = { ...currentProducts, [uniqueSlug]: newProduct } as Record<string, any>;
          updateSection('products', nextProducts);
          addHeaderNavigationForProduct(uniqueSlug, newTitle);
          setActiveSection(`product-${uniqueSlug}`);
          showSaveNotification('Page duplicated and added to Product Pages. Remember to Publish Changes.', 'success');
        }
      } else {
        showSaveNotification('Failed to duplicate page. Please try again.', 'error');
      }
    };

    const deletePage = async (id: number) => {
      const res = await contentApi.deletePage(id);
      if (res.success) {
        setPages(prev => prev.filter(p => p.id !== id));
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Pages</h3>
          <button onClick={startCreate} className="button-secondary text-sm">+ New Page</button>
        </div>

        {loadingPages ? (
          <div className="text-sm text-muted-foreground">Loading pages...</div>
        ) : (
          <div className="space-y-2">
            {pages.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 border rounded">
                <div className="text-sm">
                  <div className="font-medium">{p.title}</div>
                  <div className="text-muted-foreground">/{p.slug}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${p.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{p.is_published ? 'Published' : 'Draft'}</span>
                  <button onClick={() => duplicatePage(p)} className="button-secondary text-xs">Duplicate</button>
                  <button onClick={() => startEdit(p.id!)} className="button-secondary text-xs">Edit</button>
                  <button onClick={() => deletePage(p.id!)} className="text-red-600 text-xs hover:bg-red-50 px-2 py-1 rounded">Delete</button>
                </div>
              </div>
            ))}
            {pages.length === 0 && (
              <div className="text-sm text-muted-foreground">No pages yet.</div>
            )}
          </div>
        )}

        {editingPage && (
          <div className="border-t pt-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input type="text" value={editingPage.slug} onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })} className="w-full p-2 border rounded" placeholder="about"/>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input type="text" value={editingPage.title} onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })} className="w-full p-2 border rounded" placeholder="About Us"/>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Content (JSON)</label>
              <textarea
                value={JSON.stringify(editingPage.content || {}, null, 2)}
                onChange={(e) => {
                  try { setEditingPage({ ...editingPage, content: JSON.parse(e.target.value) }); } catch {}
                }}
                className="w-full p-2 border rounded font-mono text-sm h-48"
                placeholder='{"blocks":[{"type":"paragraph","text":"Hello"}]}'
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!editingPage.is_published} onChange={(e) => setEditingPage({ ...editingPage, is_published: e.target.checked })} className="rounded border-border"/>
              <span>Published</span>
            </label>
            <div className="flex gap-2">
              <button onClick={savePage} className="button">Save Page</button>
              <button onClick={() => setEditingPage(null)} className="button-secondary">Cancel</button>
            </div>
          </div>
        )}
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
          className="button"
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
        badgeLabel: '',
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
            <label className="block text-sm font-medium mb-2">Badge Label</label>
            <input
              type="text"
              value={(formData as any).badgeLabel || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, badgeLabel: e.target.value }))}
              className="w-full p-2 border border-border rounded"
              placeholder="SaaS Analytics Platform"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Emoji</label>
            <input
              type="text"
              value={(formData as any).emoji || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, emoji: e.target.value }))}
              className="w-full p-2 border border-border rounded"
              placeholder="e.g. ✨"
            />
          </div>
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
            className="button"
          >
            {section ? 'Update Hero Section' : 'Create Hero Section'}
          </button>
        </div>
      </div>
    );
  };

  // Features Section Form
  const renderFeaturesForm = (section: FeaturesSection | undefined) => {
    const [formData, setFormData] = useState<Partial<FeaturesSection>>(
      section || {
        section_type: 'features' as const,
        is_visible: true,
        title: '',
        description: ''
      }
    );

    const [features, setFeatures] = useState<FeatureItem[]>(
      (section as any)?.features || []
    );

    const addFeature = () => {
      const newFeature: FeatureItem = {
        icon: '🚀',
        title: 'New Feature',
        description: 'Feature description',
        badge: '',
        badge_color: 'green',
        is_featured: false
      };
      setFeatures([...features, newFeature]);
    };

    const updateFeature = (index: number, field: string, value: any) => {
      const updatedFeatures = features.map((feature, i) => 
        i === index ? { ...feature, [field]: value } : feature
      );
      setFeatures(updatedFeatures);
    };

    const removeFeature = (index: number) => {
      setFeatures(features.filter((_, i) => i !== index));
    };

    const saveFeatures = async () => {
      try {
        // 1) Create or update the features section metadata (title/description/visibility)
        let sectionId = section?.id;
        const payload = {
          section_type: 'features' as const,
          is_visible: formData.is_visible !== false,
          section_data: {
            title: formData.title,
            description: formData.description
          }
        };

        if (!sectionId) {
          const createRes = await contentApi.createSection(payload as any);
          if (!createRes.success || !(createRes.data as any)?.id) throw new Error(createRes.error || 'Failed to create features section');
          sectionId = (createRes.data as any).id;
        } else {
          const updateRes = await contentApi.updateSection(sectionId, payload as any);
          if (!updateRes.success) throw new Error(updateRes.error || 'Failed to update features section');
        }

        if (!sectionId) throw new Error('Features section ID unavailable');

        // 2) Diff feature items and sync via API
        const originalItems: any[] = ((section as any)?.features || []).map((f: any, idx: number) => ({ ...f, sort_order: f.sort_order ?? idx }));
        const originalIds = new Set(originalItems.filter(f => f.id).map(f => f.id as number));
        const currentItems = features.map((f, idx) => ({ ...f, sort_order: idx }));
        const currentIds = new Set(currentItems.filter(f => (f as any).id).map(f => (f as any).id as number));

        // Deletes
        for (const id of originalIds) {
          if (!currentIds.has(id)) {
            await contentApi.deleteFeature(id);
          }
        }

        // Creates and updates
        for (const item of currentItems) {
          const body = {
            icon: item.icon,
            title: item.title,
            description: item.description,
            badge: item.badge || '',
            badge_color: item.badge_color || null,
            sort_order: item.sort_order ?? 0,
            is_featured: item.is_featured || false,
            button_text: item.button_text || null,
            button_link: item.button_link || null
          } as any;

          if (!(item as any).id) {
            await contentApi.createFeature(sectionId, body);
          } else {
            await contentApi.updateFeature((item as any).id, body);
          }
        }

        // Refresh local editor state from DB
        await loadDatabaseContent();

        // Publish unified content so live site reflects DB changes immediately
        try {
          const [sectionsRes, contactRes] = await Promise.all([
            contentApi.getAllSections(),
            contentApi.getContactInfo()
          ]);
          const unified = buildUnifiedContentFromDatabase(
            sectionsRes.success ? (sectionsRes.data as any[]) : [],
            contactRes.success ? (contactRes.data as any) : null
          );
          await contentApi.saveContent(unified, true);
        } catch (publishErr) {
          // Non-fatal: editor state updated even if publish failed
          console.warn('Auto-publish after features update failed', publishErr);
        }

        showSaveNotification('Features updated and published', 'success');
      } catch (err) {
        showSaveNotification(err instanceof Error ? err.message : 'Failed to save features', 'error');
      }
    };

    return (
      <div className="space-y-6">
        {/* Section Header Fields */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Section Title</label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-2 border border-border rounded"
              placeholder="Features"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Section Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-2 border border-border rounded h-20"
              placeholder="Brief description of the features section"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="features-visible"
              checked={formData.is_visible}
              onChange={(e) => setFormData(prev => ({ ...prev, is_visible: e.target.checked }))}
              className="rounded border-border"
            />
            <label htmlFor="features-visible" className="text-sm">Visible on website</label>
          </div>
        </div>

        {/* Features Management */}
        <div className="border-t border-border pt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Individual Features</h4>
            <button
              onClick={addFeature}
              className="button-secondary text-sm"
            >
              + Add Feature
            </button>
          </div>

    <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className={`p-4 border rounded-lg ${feature.is_featured ? 'border-primary/30 bg-primary/5' : 'border-border'}`}>
                {/* Featured Toggle */}
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!feature.is_featured}
                      onChange={(e) => updateFeature(index, 'is_featured', e.target.checked)}
                      className="rounded border-border"
                    />
                    <span className="text-sm font-medium">Featured Card</span>
                    {feature.is_featured && (
                      <span className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded-full">
                        FEATURED
                      </span>
                    )}
                  </label>
                  <button
                    onClick={() => removeFeature(index)}
                    className="text-red-600 hover:bg-red-50 px-2 py-1 rounded text-sm"
                  >
                    Remove
                  </button>
                </div>

                {/* Feature Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">Icon</label>
                    <input
                      type="text"
                      value={feature.icon}
                      onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                      className="w-full p-2 border border-border rounded text-sm"
                      placeholder="🚀 or icon name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Title</label>
                    <input
                      type="text"
                      value={feature.title}
                      onChange={(e) => updateFeature(index, 'title', e.target.value)}
                      className="w-full p-2 border border-border rounded text-sm"
                      placeholder="Feature title"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Badge</label>
                    <input
                      type="text"
                      value={feature.badge || ''}
                      onChange={(e) => updateFeature(index, 'badge', e.target.value)}
                      className="w-full p-2 border border-border rounded text-sm"
                      placeholder="New, Coming Soon"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Badge Color</label>
                    <select
                      value={feature.badge_color || 'green'}
                      onChange={(e) => updateFeature(index, 'badge_color', e.target.value)}
                      className="w-full p-2 border border-border rounded text-sm"
                    >
                      <option value="green">Green</option>
                      <option value="blue">Blue</option>
                      <option value="orange">Orange</option>
                      <option value="purple">Purple</option>
                      <option value="red">Red</option>
                      <option value="yellow">Yellow</option>
                      <option value="pink">Pink</option>
                      <option value="gray">Gray</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium mb-1">Description</label>
                    <textarea
                      value={feature.description}
                      onChange={(e) => updateFeature(index, 'description', e.target.value)}
                      className="w-full p-2 border border-border rounded text-sm h-20"
                      placeholder="Feature description"
                    />
                  </div>
                </div>

                {/* Featured Card Button Fields */}
                {feature.is_featured && (
                  <div className="border-t border-border/50 pt-3 mt-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">Button Text</label>
                        <input
                          type="text"
                          value={feature.button_text || ''}
                          onChange={(e) => updateFeature(index, 'button_text', e.target.value)}
                          className="w-full p-2 border border-border rounded text-sm"
                          placeholder="Learn More"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Button Link</label>
                        <input
                          type="text"
                          value={feature.button_link || ''}
                          onChange={(e) => updateFeature(index, 'button_link', e.target.value)}
                          className="w-full p-2 border border-border rounded text-sm"
                          placeholder="/pricing or https://example.com"
                        />
                      </div>
                    </div>
        </div>
      )}
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={saveFeatures}
          className="button w-full"
        >
          {section ? 'Update Features Section' : 'Create Features Section'}
        </button>
    </div>
  );
  };

  // Pricing Section Form
  const renderPricingForm = (section: PricingSection | undefined) => {
    const [formData, setFormData] = useState<Partial<PricingSection>>(
      section || {
        section_type: 'pricing' as const,
        is_visible: true,
        title: '',
        description: '',
        isComingSoon: false
      }
    );

    const [plans, setPlans] = useState<PricingPlan[]>(
      (section as any)?.plans || []
    );

    const addPlan = () => {
      const newPlan: PricingPlan = {
        name: 'New Plan',
        price: '$0',
        period: 'month',
        description: 'Plan description',
        features: [],
        is_popular: false,
        button_text: 'Get Started',
        button_link: '#'
      };
      setPlans([...plans, newPlan]);
    };

    const updatePlan = (index: number, field: string, value: any) => {
      const updatedPlans = plans.map((plan, i) => 
        i === index ? { ...plan, [field]: value } : plan
      );
      setPlans(updatedPlans);
    };

    const removePlan = (index: number) => {
      setPlans(plans.filter((_, i) => i !== index));
    };

    const addFeatureToPlan = (planIndex: number) => {
      const updatedPlans = [...plans];
      if (!updatedPlans[planIndex].features) {
        updatedPlans[planIndex].features = [];
      }
      updatedPlans[planIndex].features!.push('New feature');
      setPlans(updatedPlans);
    };

    const updatePlanFeature = (planIndex: number, featureIndex: number, value: string) => {
      const updatedPlans = [...plans];
      updatedPlans[planIndex].features![featureIndex] = value;
      setPlans(updatedPlans);
    };

    const removePlanFeature = (planIndex: number, featureIndex: number) => {
      const updatedPlans = [...plans];
      updatedPlans[planIndex].features!.splice(featureIndex, 1);
      setPlans(updatedPlans);
    };

    const savePricing = async () => {
      const sectionToSave = {
        ...formData,
        section_data: {
          title: formData.title,
          description: formData.description,
          isComingSoon: formData.isComingSoon,
          plans: plans
        }
      };
      
      await saveSection(sectionToSave);
    };

    return (
      <div className="space-y-6">
        {/* Section Header Fields */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Section Title</label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-2 border border-border rounded"
              placeholder="Pricing"
            />
        </div>

          <div>
            <label className="block text-sm font-medium mb-2">Section Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-2 border border-border rounded h-20"
              placeholder="Brief description of the pricing section"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="pricing-visible"
              checked={formData.is_visible}
              onChange={(e) => setFormData(prev => ({ ...prev, is_visible: e.target.checked }))}
              className="rounded border-border"
            />
            <label htmlFor="pricing-visible" className="text-sm">Visible on website</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="pricing-coming-soon"
              checked={formData.isComingSoon}
              onChange={(e) => setFormData(prev => ({ ...prev, isComingSoon: e.target.checked }))}
              className="rounded border-border"
            />
            <label htmlFor="pricing-coming-soon" className="text-sm">Coming Soon Mode</label>
          </div>

        </div>

        {/* Pricing Plans Management */}
        {!formData.isComingSoon && (
          <div className="border-t border-border pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Pricing Plans</h4>
              <button
                onClick={addPlan}
                className="button-secondary text-sm"
              >
                + Add Plan
              </button>
            </div>

            <div className="space-y-6">
              {plans.map((plan, planIndex) => (
                <div key={planIndex} className={`p-4 border rounded-lg ${plan.is_popular ? 'border-primary/30 bg-primary/5' : 'border-border'}`}>
                  {/* Plan Header */}
                  <div className="flex items-center justify-between mb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!plan.is_popular}
                        onChange={(e) => updatePlan(planIndex, 'is_popular', e.target.checked)}
                        className="rounded border-border"
                      />
                      <span className="text-sm font-medium">Featured Plan</span>
                      {plan.is_popular && (
                        <span className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded-full">
                          POPULAR
                        </span>
                      )}
                    </label>
                    <button
                      onClick={() => removePlan(planIndex)}
                      className="text-red-600 hover:bg-red-50 px-2 py-1 rounded text-sm"
                    >
                      Remove Plan
                    </button>
                  </div>

                  {/* Plan Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                    <div>
                      <label className="block text-xs font-medium mb-1">Plan Name</label>
                      <input
                        type="text"
                        value={plan.name}
                        onChange={(e) => updatePlan(planIndex, 'name', e.target.value)}
                        className="w-full p-2 border border-border rounded text-sm"
                        placeholder="Starter, Pro, Enterprise"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Price</label>
                      <input
                        type="text"
                        value={plan.price}
                        onChange={(e) => updatePlan(planIndex, 'price', e.target.value)}
                        className="w-full p-2 border border-border rounded text-sm"
                        placeholder="$19, Free, Custom"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Period</label>
                      <select
                        value={plan.period || 'month'}
                        onChange={(e) => updatePlan(planIndex, 'period', e.target.value)}
                        className="w-full p-2 border border-border rounded text-sm"
                      >
                        <option value="month">per month</option>
                        <option value="year">per year</option>
                        <option value="one-time">one-time</option>
                        <option value="custom">custom</option>
                      </select>
                    </div>

                  </div>

                  {/* Plan Description */}
                  <div className="mb-4">
                    <label className="block text-xs font-medium mb-1">Description</label>
                    <textarea
                      value={plan.description}
                      onChange={(e) => updatePlan(planIndex, 'description', e.target.value)}
                      className="w-full p-2 border border-border rounded text-sm h-20"
                      placeholder="Plan description"
                    />
                  </div>

                  {/* Plan Button */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="block text-xs font-medium mb-1">Button Text</label>
                      <input
                        type="text"
                        value={plan.button_text || ''}
                        onChange={(e) => updatePlan(planIndex, 'button_text', e.target.value)}
                        className="w-full p-2 border border-border rounded text-sm"
                        placeholder="Get Started, Contact Sales"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Button Link</label>
                      <input
                        type="text"
                        value={plan.button_link || ''}
                        onChange={(e) => updatePlan(planIndex, 'button_link', e.target.value)}
                        className="w-full p-2 border border-border rounded text-sm"
                        placeholder="/signup, /contact"
                      />
                    </div>
                  </div>

                  {/* Plan Features */}
                  <div className="border-t border-border/50 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-sm font-medium">Features</h5>
                      <button
                        onClick={() => addFeatureToPlan(planIndex)}
                        className="text-primary hover:bg-primary/10 px-2 py-1 rounded text-xs"
                      >
                        + Add Feature
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(plan.features || []).map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => updatePlanFeature(planIndex, featureIndex, e.target.value)}
                            className="flex-1 p-2 border border-border rounded text-sm"
                            placeholder="Feature description"
                          />
                          <button
                            onClick={() => removePlanFeature(planIndex, featureIndex)}
                            className="text-red-600 hover:bg-red-50 px-2 py-1 rounded text-xs"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={savePricing}
          className="button w-full"
        >
          {section ? 'Update Pricing Section' : 'Create Pricing Section'}
        </button>
    </div>
  );
  };

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
            className="button"
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
            className="button"
          >
            {section ? 'Update Waitlist Section' : 'Create Waitlist Section'}
          </button>
        </div>
      </div>
    );
  };

  // Header Section Form
  const renderHeaderForm = (section: HeaderSection | undefined) => {
    const [formData, setFormData] = useState<Partial<HeaderSection>>(
      section || {
        section_type: 'header' as const,
        is_visible: true,
        logo_text: '',
        sign_in_text: 'Sign In',
        get_started_text: 'Get Started',
        sign_in_href: '',
        get_started_href: '',
        show_sign_in: true,
        show_get_started: true
      }
    );

    const [navigationItems, setNavigationItems] = useState<any[]>(
      (section as any)?.navigation_items || []
    );

    const addNavigationItem = () => {
      const newItem = {
        label: 'New Link',
        href: '#',
        sort_order: navigationItems.length
      };
      setNavigationItems([...navigationItems, newItem]);
    };

    const updateNavigationItem = (index: number, field: string, value: any) => {
      const updatedItems = navigationItems.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      );
      setNavigationItems(updatedItems);
    };

    const removeNavigationItem = (index: number) => {
      setNavigationItems(navigationItems.filter((_, i) => i !== index));
    };

    const moveNavigationItem = (index: number, direction: 'up' | 'down') => {
      const newItems = [...navigationItems];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      
      if (targetIndex >= 0 && targetIndex < newItems.length) {
        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
                                // Update order values
                        newItems.forEach((item, i) => {
                          item.sort_order = i;
                        });
        setNavigationItems(newItems);
      }
    };

    const saveHeader = async () => {
      // First create or update the header section to ensure we have a section ID
      let sectionId = section?.id;
      try {
        const payload = {
          section_type: 'header' as const,
          is_visible: formData.is_visible !== false,
          section_data: {
            logo_text: formData.logo_text,
            sign_in_text: formData.sign_in_text,
            get_started_text: formData.get_started_text,
            sign_in_href: (formData as any).sign_in_href,
            get_started_href: (formData as any).get_started_href,
            show_sign_in: (formData as any).show_sign_in,
            show_get_started: (formData as any).show_get_started
          }
        };

        if (!sectionId) {
          const createRes = await contentApi.createSection(payload as any);
          if (!createRes.success || !(createRes.data as any)?.id) throw new Error(createRes.error || 'Failed to create header section');
          sectionId = (createRes.data as any).id;
        } else {
          const updateRes = await contentApi.updateSection(sectionId, payload as any);
          if (!updateRes.success) throw new Error(updateRes.error || 'Failed to update header section');
        }

        if (!sectionId) throw new Error('Header section ID unavailable');

        // Prepare diffs for navigation items
        const originalItems: any[] = ((section as any)?.navigation_items || []).map((i: any, idx: number) => ({ ...i, sort_order: i.sort_order ?? idx }));
        const originalIds = new Set(originalItems.filter(i => i.id).map(i => i.id as number));
        const currentItems = navigationItems.map((i: any, idx: number) => ({ ...i, sort_order: idx }));
        const currentIds = new Set(currentItems.filter(i => i.id).map(i => i.id as number));

        // Deletes
        for (const id of originalIds) {
          if (!currentIds.has(id)) {
            await contentApi.deleteNavigationItem(id);
          }
        }

        // Creates and updates
        for (const item of currentItems) {
          if (!item.id) {
            await contentApi.createNavigationItem(sectionId, {
              label: item.label,
              href: item.href,
              sort_order: item.sort_order ?? 0,
              type: item.type,
              isExternal: item.isExternal,
              nofollow: item.nofollow,
              isButton: item.isButton,
            });
          } else {
            await contentApi.updateNavigationItem(item.id, {
              label: item.label,
              href: item.href,
              sort_order: item.sort_order ?? 0,
              type: item.type,
              isExternal: item.isExternal,
              nofollow: item.nofollow,
              isButton: item.isButton,
            });
          }
        }

        await loadDatabaseContent();
        showSaveNotification('Header updated successfully', 'success');
      } catch (err) {
        showSaveNotification(err instanceof Error ? err.message : 'Failed to save header', 'error');
      }
    };

    return (
      <div className="space-y-6">
        {/* Header Configuration */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Logo Text</label>
            <input
              type="text"
              value={formData.logo_text || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, logo_text: e.target.value }))}
              className="w-full p-2 border border-border rounded"
              placeholder="BiblioKit"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Sign In Text</label>
            <input
              type="text"
              value={formData.sign_in_text || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, sign_in_text: e.target.value }))}
              className="w-full p-2 border border-border rounded"
              placeholder="Sign In"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Sign In Link</label>
            <input
              type="text"
              value={(formData as any).sign_in_href || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, sign_in_href: e.target.value } as any))}
              className="w-full p-2 border border-border rounded"
              placeholder="/admin or /login"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Get Started Text</label>
            <input
              type="text"
              value={formData.get_started_text || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, get_started_text: e.target.value }))}
              className="w-full p-2 border border-border rounded"
              placeholder="Get Started"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Get Started Link</label>
            <input
              type="text"
              value={(formData as any).get_started_href || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, get_started_href: e.target.value } as any))}
              className="w-full p-2 border border-border rounded"
              placeholder="/#contact or /signup"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="header-visible"
              checked={formData.is_visible}
              onChange={(e) => setFormData(prev => ({ ...prev, is_visible: e.target.checked }))}
              className="rounded border-border"
            />
            <label htmlFor="header-visible" className="text-sm">Visible on website</label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(formData as any).show_sign_in !== false}
                onChange={(e) => setFormData(prev => ({ ...prev, show_sign_in: e.target.checked } as any))}
                className="rounded border-border"
              />
              <span className="text-sm">Show Sign In Button</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(formData as any).show_get_started !== false}
                onChange={(e) => setFormData(prev => ({ ...prev, show_get_started: e.target.checked } as any))}
                className="rounded border-border"
              />
              <span className="text-sm">Show Get Started Button</span>
            </label>
          </div>
        </div>

        {/* Navigation Items Management */}
        <div className="border-t border-border pt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Navigation Items</h4>
            <button
              onClick={addNavigationItem}
              className="button-secondary text-sm"
            >
              + Add Navigation Item
            </button>
          </div>

    <div className="space-y-4">
            {navigationItems.map((item, index) => (
              <div key={index} className={`p-4 border rounded-lg ${item.isButton ? 'border-primary/30 bg-primary/5' : 'border-border'}`}>
                {/* Item Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">#{index + 1}</span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!item.isButton}
                        onChange={(e) => updateNavigationItem(index, 'isButton', e.target.checked)}
                        className="rounded border-border"
                      />
                      <span className="text-sm">Button Style</span>
                      {item.isButton && (
                        <span className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded-full">
                          BUTTON
                        </span>
                      )}
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => moveNavigationItem(index, 'up')}
                      disabled={index === 0}
                      className="text-gray-500 hover:text-gray-700 disabled:opacity-50 px-2 py-1"
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveNavigationItem(index, 'down')}
                      disabled={index === navigationItems.length - 1}
                      className="text-gray-500 hover:text-gray-700 disabled:opacity-50 px-2 py-1"
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => removeNavigationItem(index)}
                      className="text-red-600 hover:bg-red-50 px-2 py-1 rounded text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Item Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">Link Text</label>
                                          <input
                        type="text"
                        value={item.label}
                        onChange={(e) => updateNavigationItem(index, 'label', e.target.value)}
                        className="w-full p-2 border border-border rounded text-sm"
                        placeholder="Home, About, Pricing"
                      />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Link URL</label>
                    <input
                      type="text"
                      value={item.href}
                      onChange={(e) => updateNavigationItem(index, 'href', e.target.value)}
                      className="w-full p-2 border border-border rounded text-sm"
                      placeholder="/about, #pricing, https://example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Link Type</label>
                    <select
                      value={item.type || 'link'}
                      onChange={(e) => updateNavigationItem(index, 'type', e.target.value)}
                      className="w-full p-2 border border-border rounded text-sm"
                    >
                      <option value="link">Regular Link</option>
                      <option value="scroll">Scroll to Section</option>
                      <option value="external">External Link</option>
                      <option value="dropdown">Dropdown Menu</option>
                    </select>
                  </div>
                </div>

                {/* Additional Options */}
                <div className="mt-3 pt-3 border-t border-border/50">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!item.isExternal}
                        onChange={(e) => updateNavigationItem(index, 'isExternal', e.target.checked)}
                        className="rounded border-border"
                      />
                      <span className="text-xs">Open in new tab</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!item.nofollow}
                        onChange={(e) => updateNavigationItem(index, 'nofollow', e.target.checked)}
                        className="rounded border-border"
                      />
                      <span className="text-xs">Add rel="nofollow"</span>
                    </label>
                  </div>
                </div>

                {/* Dropdown Items (if dropdown type) */}
                {item.type === 'dropdown' && (
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <div className="text-xs font-medium mb-2">Dropdown Items</div>
                    <div className="text-xs text-muted-foreground">
                      Dropdown menu functionality requires additional implementation for nested items management.
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {navigationItems.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No navigation items yet.</p>
              <p className="text-xs">Click "Add Navigation Item" to get started.</p>
            </div>
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={saveHeader}
          className="button w-full"
        >
          {section ? 'Update Header Section' : 'Create Header Section'}
        </button>
    </div>
  );
  };

  const renderFooterForm = (section: FooterSection | undefined) => {
    type FooterLink = { id?: number; label: string; href: string; sort_order?: number };
    type FooterLinkGroupEditor = { id?: number; title: string; links: FooterLink[]; sort_order?: number };

    const [formData, setFormData] = useState<Partial<FooterSection>>(
      section || {
        section_type: 'footer' as const,
        is_visible: true,
        description: '',
        copyright_text: ''
      }
    );

    const initialGroups: FooterLinkGroupEditor[] = (() => {
      // Prefer relational data if present
      const fromRel = (section as any)?.footer_links as any[] | undefined;
      if (fromRel && Array.isArray(fromRel) && fromRel.length > 0) {
        return fromRel.map((group: any) => ({
          id: group.id,
          title: group.title || '',
          sort_order: group.sort_order || 0,
          links: (group.links || []).map((l: any) => ({
            id: l.id,
            label: l.label || '',
            href: l.href || '',
            sort_order: l.sort_order || 0
          }))
        }));
      }
      // Fallback to JSON stored sections
      const fromJson = (section as any)?.section_data?.sections as any[] | undefined;
      if (fromJson && Array.isArray(fromJson)) {
        return fromJson.map((group: any) => ({
          title: group.title || '',
          sort_order: group.sort_order || 0,
          links: (group.links || []).map((l: any) => ({
            label: l.label || '',
            href: l.href || '',
            sort_order: l.sort_order || 0
          }))
        }));
      }
      return [];
    })();

    const [linkGroups, setLinkGroups] = useState<FooterLinkGroupEditor[]>(initialGroups);

    const addGroup = () => {
      setLinkGroups(prev => [
        ...prev,
        { title: 'New Group', links: [], sort_order: prev.length }
      ]);
    };

    const updateGroupTitle = (index: number, title: string) => {
      setLinkGroups(prev => prev.map((g, i) => i === index ? { ...g, title } : g));
    };

    const removeGroup = (index: number) => {
      setLinkGroups(prev => prev.filter((_, i) => i !== index).map((g, i2) => ({ ...g, sort_order: i2 })));
    };

    const moveGroup = (index: number, direction: 'up' | 'down') => {
      setLinkGroups(prev => {
        const arr = [...prev];
        const target = direction === 'up' ? index - 1 : index + 1;
        if (target < 0 || target >= arr.length) return prev;
        [arr[index], arr[target]] = [arr[target], arr[index]];
        return arr.map((g, i) => ({ ...g, sort_order: i }));
      });
    };

    const addLinkToGroup = (groupIndex: number) => {
      setLinkGroups(prev => prev.map((g, i) => (
        i === groupIndex
          ? { ...g, links: [...g.links, { label: 'New Link', href: '#', sort_order: g.links.length }] }
          : g
      )));
    };

    const updateLinkInGroup = (groupIndex: number, linkIndex: number, field: 'label' | 'href', value: string) => {
      setLinkGroups(prev => prev.map((g, i) => {
        if (i !== groupIndex) return g;
        const links = g.links.map((l, li) => li === linkIndex ? { ...l, [field]: value } : l);
        return { ...g, links };
      }));
    };

    const removeLinkFromGroup = (groupIndex: number, linkIndex: number) => {
      setLinkGroups(prev => prev.map((g, i) => {
        if (i !== groupIndex) return g;
        const links = g.links.filter((_, li) => li !== linkIndex).map((l, li2) => ({ ...l, sort_order: li2 }));
        return { ...g, links };
      }));
    };

    const moveLinkInGroup = (groupIndex: number, linkIndex: number, direction: 'up' | 'down') => {
      setLinkGroups(prev => prev.map((g, i) => {
        if (i !== groupIndex) return g;
        const links = [...g.links];
        const target = direction === 'up' ? linkIndex - 1 : linkIndex + 1;
        if (target < 0 || target >= links.length) return g;
        [links[linkIndex], links[target]] = [links[target], links[linkIndex]];
        return { ...g, links: links.map((l, li) => ({ ...l, sort_order: li })) };
      }));
    };

    const saveFooter = async () => {
      // Ensure footer section exists
      let sectionId = section?.id;
      try {
        const payload = {
          section_type: 'footer' as const,
          is_visible: formData.is_visible !== false,
          section_data: {
            description: formData.description || '',
            copyright_text: (formData as any)?.copyright_text || ''
          }
        };

        if (!sectionId) {
          const createRes = await contentApi.createSection(payload as any);
          if (!createRes.success || !(createRes.data as any)?.id) throw new Error(createRes.error || 'Failed to create footer section');
          sectionId = (createRes.data as any).id;
        } else {
          const updateRes = await contentApi.updateSection(sectionId, payload as any);
          if (!updateRes.success) throw new Error(updateRes.error || 'Failed to update footer section');
        }

        if (!sectionId) throw new Error('Footer section ID unavailable');

        // Original groups/links from section
        const originalGroups: any[] = ((section as any)?.footer_links || []).map((g: any, gi: number) => ({
          ...g,
          sort_order: g.sort_order ?? gi,
          links: (g.links || []).map((l: any, li: number) => ({ ...l, sort_order: l.sort_order ?? li }))
        }));
        const originalGroupIdSet = new Set(originalGroups.filter(g => g.id).map(g => g.id as number));
        const currentGroups = linkGroups.map((g, gi) => ({ ...g, sort_order: gi }));
        const currentGroupIdSet = new Set(currentGroups.filter(g => g.id).map(g => g.id as number));

        // Delete removed groups
        for (const gid of originalGroupIdSet) {
          if (!currentGroupIdSet.has(gid)) {
            await contentApi.deleteFooterLinkGroup(gid);
          }
        }

        // Upsert groups and their links
        for (const group of currentGroups) {
          let groupId = group.id;
          if (!groupId) {
          const created = await contentApi.createFooterLinkGroup(sectionId, group.title, group.sort_order ?? 0);
          if (!created.success || !(created.data as any)?.id) throw new Error(created.error || 'Failed to create footer group');
          groupId = (created.data as any).id;
          } else {
            await contentApi.updateFooterLinkGroup(groupId, { title: group.title, sort_order: group.sort_order ?? 0 });
          }

          // Original links for this group (by id)
          const originalGroup = originalGroups.find(g => g.id === group.id);
          const originalLinks: any[] = (originalGroup?.links || []);
          const originalLinkIdSet = new Set(originalLinks.filter(l => l.id).map(l => l.id as number));

          const currentLinks = (group.links || []).map((l, li) => ({ ...l, sort_order: li }));
          const currentLinkIdSet = new Set(currentLinks.filter(l => l.id).map(l => l.id as number));

          // Delete removed links
          for (const lid of originalLinkIdSet) {
            if (!currentLinkIdSet.has(lid)) {
              await contentApi.deleteFooterLink(lid);
            }
          }

          // Create or update links
          for (const link of currentLinks) {
            if (!link.id) {
              await contentApi.createFooterLink(groupId!, { label: link.label, href: link.href, sort_order: link.sort_order ?? 0 });
            } else {
              await contentApi.updateFooterLink(link.id, { label: link.label, href: link.href, sort_order: link.sort_order ?? 0 });
            }
          }
        }

        await loadDatabaseContent();
        showSaveNotification('Footer updated successfully', 'success');
      } catch (err) {
        showSaveNotification(err instanceof Error ? err.message : 'Failed to save footer', 'error');
      }
    };

    return (
      <div className="space-y-6">
        {/* Footer Header Fields */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-2 border border-border rounded h-24"
              placeholder="Footer description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Copyright Text</label>
            <input
              type="text"
              value={(formData as any)?.copyright_text || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, copyright_text: e.target.value } as any))}
              className="w-full p-2 border border-border rounded"
              placeholder={`© ${new Date().getFullYear()} BiblioKit. All rights reserved.`}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="footer-visible"
              checked={formData.is_visible}
              onChange={(e) => setFormData(prev => ({ ...prev, is_visible: e.target.checked }))}
              className="rounded border-border"
            />
            <label htmlFor="footer-visible" className="text-sm">Visible on website</label>
          </div>
        </div>

        {/* Footer Link Groups Management */}
        <div className="border-t border-border pt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Footer Link Groups</h4>
            <button onClick={addGroup} className="button-secondary text-sm">+ Add Group</button>
          </div>

          <div className="space-y-4">
            {linkGroups.map((group, gi) => (
              <div key={gi} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">Group #{gi + 1}</span>
                    <input
                      type="text"
                      value={group.title}
                      onChange={(e) => updateGroupTitle(gi, e.target.value)}
                      className="p-2 border border-border rounded text-sm"
                      placeholder="Group title (e.g., Product)"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => moveGroup(gi, 'up')} disabled={gi === 0} className="text-gray-500 hover:text-gray-700 disabled:opacity-50 px-2 py-1" title="Move up">↑</button>
                    <button onClick={() => moveGroup(gi, 'down')} disabled={gi === linkGroups.length - 1} className="text-gray-500 hover:text-gray-700 disabled:opacity-50 px-2 py-1" title="Move down">↓</button>
                    <button onClick={() => removeGroup(gi)} className="text-red-600 hover:bg-red-50 px-2 py-1 rounded text-sm">Remove</button>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">Links</div>
                    <button onClick={() => addLinkToGroup(gi)} className="text-primary hover:bg-primary/10 px-2 py-1 rounded text-xs">+ Add Link</button>
                  </div>
                  <div className="space-y-2">
                    {group.links.map((link, li) => (
                      <div key={li} className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => updateLinkInGroup(gi, li, 'label', e.target.value)}
                          className="p-2 border border-border rounded text-sm"
                          placeholder="Link label (e.g., Pricing)"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={link.href}
                            onChange={(e) => updateLinkInGroup(gi, li, 'href', e.target.value)}
                            className="flex-1 p-2 border border-border rounded text-sm"
                            placeholder="#pricing or https://example.com"
                          />
                          <button onClick={() => moveLinkInGroup(gi, li, 'up')} disabled={li === 0} className="text-gray-500 hover:text-gray-700 disabled:opacity-50 px-2 py-1" title="Move up">↑</button>
                          <button onClick={() => moveLinkInGroup(gi, li, 'down')} disabled={li === group.links.length - 1} className="text-gray-500 hover:text-gray-700 disabled:opacity-50 px-2 py-1" title="Move down">↓</button>
                          <button onClick={() => removeLinkFromGroup(gi, li)} className="text-red-600 hover:bg-red-50 px-2 py-1 rounded text-sm">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button onClick={saveFooter} className="button w-full">
          {section ? 'Update Footer Section' : 'Create Footer Section'}
        </button>
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
          <a
            href="/admin"
            className="bg-amber-500 text-white p-3 rounded-full shadow-lg hover:bg-amber-600 transition-colors text-base text-center"
            title="Admin Dashboard"
            aria-label="Admin Dashboard"
          >
            📊
          </a>
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
              className="button-secondary text-sm"
            >
              Reset to Default
            </button>
            <button
              onClick={handleSave}
              className="button text-sm"
              disabled={!isEditing}
            >
              Save & Reload
            </button>
            <button
              onClick={() => setShowEditor(false)}
              className="button-secondary text-sm"
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