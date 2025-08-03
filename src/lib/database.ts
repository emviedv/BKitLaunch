// Database configuration for frontend
interface DatabaseConfig {
  host: string;
  database: string;
  user: string;
  password: string;
  port: number;
  ssl: boolean;
}

// Get database config from environment variables
export const getDbConfig = (): DatabaseConfig => {
  return {
    host: import.meta.env.VITE_DB_HOST || '',
    database: import.meta.env.VITE_DB_NAME || '',
    user: import.meta.env.VITE_DB_USER || '',
    password: import.meta.env.VITE_DB_PASSWORD || '',
    port: parseInt(import.meta.env.VITE_DB_PORT || '5432'),
    ssl: import.meta.env.VITE_DB_SSL === 'true'
  };
};

// Database connection URL
export const getDatabaseUrl = (): string => {
  return import.meta.env.VITE_DATABASE_URL || '';
};

// Get API base URL based on environment
const getApiBaseUrl = (): string => {
  // In production (Netlify), use the current domain
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return window.location.origin;
  }
  // In development, use localhost
  return 'http://localhost:9501';
};

// Test connection function (for backend use)
export const testDatabaseConnection = async (): Promise<boolean> => {
  try {
    // This would be called via an API endpoint in a real app
    console.log('Database config:', getDbConfig());
    console.log('Database URL configured:', !!getDatabaseUrl());
    return true;
  } catch (error) {
    console.error('Database configuration error:', error);
    return false;
  }
};

// Types for database entities
export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

// Content Section Base Type
export interface BaseContentSection {
  id?: number;
  section_type: string;
  is_visible: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

// Hero Section
export interface HeroSection extends BaseContentSection {
  section_type: 'hero';
  title: string;
  subtitle: string;
  description: string;
  primary_button: string;
  secondary_button: string;
}

// Feature Item
export interface FeatureItem {
  id?: number;
  icon: string;
  title: string;
  description: string;
  badge?: string;
  badge_color?: string;
  sort_order?: number;
}

// Features Section
export interface FeaturesSection extends BaseContentSection {
  section_type: 'features';
  title: string;
  description: string;
  features: FeatureItem[];
}

// Pricing Plan
export interface PricingPlan {
  id?: number;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  button_text: string;
  is_popular: boolean;
  sort_order?: number;
}

// Pricing Section
export interface PricingSection extends BaseContentSection {
  section_type: 'pricing';
  title: string;
  description: string;
  plans: PricingPlan[];
}

// CTA Section
export interface CTASection extends BaseContentSection {
  section_type: 'cta';
  title: string;
  description: string;
  primary_button: string;
  secondary_button: string;
}

// Waitlist Section
export interface WaitlistSection extends BaseContentSection {
  section_type: 'waitlist';
  title: string;
  description: string;
  button_text: string;
  success_message: string;
}

// Header Section
export interface HeaderSection extends BaseContentSection {
  section_type: 'header';
  logo_text: string;
  navigation_items: NavigationItem[];
  sign_in_text: string;
  get_started_text: string;
}

export interface NavigationItem {
  id?: number;
  label: string;
  href: string;
  sort_order?: number;
}

// Footer Section
export interface FooterSection extends BaseContentSection {
  section_type: 'footer';
  logo_text: string;
  description: string;
  footer_links: FooterLinkGroup[];
  copyright_text: string;
}

export interface FooterLinkGroup {
  id?: number;
  title: string;
  links: FooterLink[];
  sort_order?: number;
}

export interface FooterLink {
  id?: number;
  label: string;
  href: string;
  sort_order?: number;
}

// Contact Information
export interface ContactInfo {
  id?: number;
  email: string;
  twitter: string;
  github: string;
  updated_at?: string;
}

// LLM Optimization Types
export interface ExpertQuoteData {
  quote: string;
  expertName: string;
  expertTitle: string;
  institution: string;
}

export interface StatisticData {
  statistic: string;
  description: string;
  source: string;
  date: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface LLMOptimizedContent {
  id?: number;
  title: string;
  answerBox: string; // 40-70 word snippet
  expertQuote?: ExpertQuoteData;
  statistic?: StatisticData;
  faqs?: FAQItem[];
  content: string;
  lastUpdated: string;
  citationCount?: number;
  tokenCount?: number;
  created_at?: string;
  updated_at?: string;
}

// Union type for all content sections
export type ContentSection = 
  | HeroSection 
  | FeaturesSection 
  | PricingSection 
  | CTASection 
  | WaitlistSection 
  | HeaderSection 
  | FooterSection;

export type SectionType = 'hero' | 'features' | 'pricing' | 'cta' | 'waitlist' | 'header' | 'footer';

export interface DatabaseResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// API functions that call backend endpoints
export const apiClient = {
  // Test database connection via API
  async testConnection(): Promise<DatabaseResponse<boolean>> {
    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/db-test`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return { 
        success: true, 
        data: data.connected,
        error: data.connected ? undefined : data.error 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to test connection' 
      };
    }
  },

  // Get all users
  async getUsers(): Promise<DatabaseResponse<User[]>> {
    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/users`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch users' 
      };
    }
  },

  // Create a new user
  async createUser(email: string, name: string): Promise<DatabaseResponse<User>> {
    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create user' 
      };
    }
  },

  // Get database tables
  async getTables(): Promise<DatabaseResponse<string[]>> {
    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/db-tables`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch tables' 
      };
    }
  },

  // LLM Optimized Content API methods
  async createLLMContent(content: Omit<LLMOptimizedContent, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseResponse<LLMOptimizedContent>> {
    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/llm-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create LLM content' 
      };
    }
  },

  async getLLMContent(): Promise<DatabaseResponse<LLMOptimizedContent[]>> {
    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/llm-content`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch LLM content' 
      };
    }
  },

  async updateLLMContent(id: number, content: Partial<LLMOptimizedContent>): Promise<DatabaseResponse<LLMOptimizedContent>> {
    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/llm-content/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update LLM content' 
      };
    }
  },

  // Content Sections CRUD Operations
  async getSection<T extends ContentSection>(sectionType: SectionType): Promise<DatabaseResponse<T>> {
    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/content-sections/${sectionType}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : `Failed to fetch ${sectionType} section` 
      };
    }
  },

  async getAllSections(): Promise<DatabaseResponse<ContentSection[]>> {
    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/content-sections`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch sections' 
      };
    }
  },

  async createSection<T extends ContentSection>(section: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseResponse<T>> {
    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/content-sections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(section),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create section' 
      };
    }
  },

  async updateSection<T extends ContentSection>(id: number, section: Partial<T>): Promise<DatabaseResponse<T>> {
    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/content-sections/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(section),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update section' 
      };
    }
  },

  async deleteSection(id: number): Promise<DatabaseResponse<void>> {
    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/content-sections/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete section' 
      };
    }
  },

  // Feature Items CRUD
  async createFeature(sectionId: number, feature: Omit<FeatureItem, 'id'>): Promise<DatabaseResponse<FeatureItem>> {
    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/content-sections/${sectionId}/features`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feature),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create feature' 
      };
    }
  },

  async updateFeature(featureId: number, feature: Partial<FeatureItem>): Promise<DatabaseResponse<FeatureItem>> {
    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/features/${featureId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feature),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update feature' 
      };
    }
  },

  async deleteFeature(featureId: number): Promise<DatabaseResponse<void>> {
    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/features/${featureId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete feature' 
      };
    }
  },

  // Pricing Plans CRUD
  async createPricingPlan(sectionId: number, plan: Omit<PricingPlan, 'id'>): Promise<DatabaseResponse<PricingPlan>> {
    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/content-sections/${sectionId}/pricing-plans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(plan),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create pricing plan' 
      };
    }
  },

  async updatePricingPlan(planId: number, plan: Partial<PricingPlan>): Promise<DatabaseResponse<PricingPlan>> {
    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/pricing-plans/${planId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(plan),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update pricing plan' 
      };
    }
  },

  async deletePricingPlan(planId: number): Promise<DatabaseResponse<void>> {
    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/pricing-plans/${planId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete pricing plan' 
      };
    }
  },

  // Contact Info CRUD
  async getContactInfo(): Promise<DatabaseResponse<ContactInfo>> {
    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/contact-info`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch contact info' 
      };
    }
  },

  async updateContactInfo(contactInfo: Partial<ContactInfo>): Promise<DatabaseResponse<ContactInfo>> {
    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/contact-info`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactInfo),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update contact info' 
      };
    }
  }
};

// Hook for database operations in React components
export const useDatabase = () => {
  const config = getDbConfig();
  const connectionUrl = getDatabaseUrl();

  return {
    config,
    connectionUrl,
    isConfigured: !!connectionUrl,
    api: apiClient
  };
}; 