import type { 
  ContentSection, 
  SectionType, 
  FeatureItem, 
  PricingPlan, 
  ContactInfo 
} from './database';
import { debugService } from './debugService';

interface ContentVersion {
  id: number;
  content_key: string;
  content_data: any;
  version: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ContentAPI {
  private getAuthToken(): string | null {
    return localStorage.getItem('bibliokit-admin-token');
  }

  private getHeaders(): HeadersInit {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private getApiUrl(endpoint: string): string {
    // Always use relative paths - works in both dev and production
    // Netlify dev proxy handles localhost routing automatically
    // Production deployment serves from same origin
    return `/.netlify/functions/${endpoint}`;
  }

  // Get current published content
  async getCurrentContent(): Promise<ApiResponse<ContentVersion>> {
    try {
      const response = await fetch(
        `${this.getApiUrl('content-management')}?action=current`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get current content'
      };
    }
  }

  // Get all content versions
  async getContentVersions(): Promise<ApiResponse<ContentVersion[]>> {
    try {
      const response = await fetch(
        `${this.getApiUrl('content-management')}?action=versions`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get content versions'
      };
    }
  }

  // Save new content (draft or published)
  async saveContent(contentData: any, isPublished: boolean = false): Promise<ApiResponse<ContentVersion>> {
    const url = this.getApiUrl('content-management');
    const payload = { contentData, isPublished };
    
    debugService.apiRequest('POST', url, payload);
    debugService.saveStart(`Content save (${isPublished ? 'published' : 'draft'})`, { 
      contentKeys: Object.keys(contentData), 
      isPublished 
    });
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      debugService.apiResponse('POST', url, responseData);

      if (!response.ok) {
        debugService.apiError('POST', url, `HTTP ${response.status}: ${response.statusText}`);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (responseData.success) {
        debugService.saveSuccess('Content save API completed', responseData.data);
      } else {
        debugService.saveError('Content save API failed', responseData.error);
      }

      return responseData;
    } catch (error) {
      debugService.saveError('Content save API exception', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save content'
      };
    }
  }

  // Publish existing content version
  async publishContent(contentId: number): Promise<ApiResponse<ContentVersion>> {
    try {
      const response = await fetch(this.getApiUrl('content-management'), {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({
          contentId,
          action: 'publish'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to publish content'
      };
    }
  }

  // Delete content version (only drafts)
  async deleteContent(contentId: number): Promise<ApiResponse<null>> {
    try {
      const response = await fetch(
        `${this.getApiUrl('content-management')}?id=${contentId}`,
        {
          method: 'DELETE',
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete content'
      };
    }
  }

  // Check if database is available (fallback to localStorage if not)
  async isDatabaseAvailable(): Promise<boolean> {
    debugService.dbConnection('Checking database availability');
    try {
      const response = await this.getCurrentContent();
      const available = response.success;
      debugService.dbConnection(available ? 'Database available' : 'Database unavailable', response);
      return available;
    } catch (error) {
      debugService.dbConnection('Database check failed', error);
      return false;
    }
  }

  // Sync JSON content to content_sections tables
  async syncJsonToSections(jsonContent: any): Promise<ApiResponse<null>> {
    debugService.saveStart('Syncing JSON content to sections tables');
    
    try {
      const syncResults = [];
      
      // Helper function to upsert a section
      const upsertSection = async (sectionType: string, sectionData: any) => {
        // First, try to get existing section
        const existingResponse = await this.getSection(sectionType);
        
        if (existingResponse.success && existingResponse.data) {
          // Update existing section
          const updateResponse = await this.updateSection(existingResponse.data.id, {
            section_data: sectionData,
            updated_at: new Date().toISOString()
          });
          return { operation: 'updated', sectionType, success: updateResponse.success };
        } else {
          // Create new section
          const createResponse = await this.createSection({
            section_type: sectionType,
            section_data: sectionData,
            is_visible: true,
            sort_order: 0
          });
          return { operation: 'created', sectionType, success: createResponse.success };
        }
      };

      // Sync hero section
      if (jsonContent.hero) {
        const result = await upsertSection('hero', jsonContent.hero);
        syncResults.push(result);
      }

      // Sync features section
      if (jsonContent.features) {
        // For features, we need to handle the array structure
        const featuresSection = {
          title: "Everything you need to build and scale",
          description: "From secure API management to comprehensive support systems, we provide all the tools you need for professional SaaS development.",
          items: jsonContent.features
        };
        const result = await upsertSection('features', featuresSection);
        syncResults.push(result);
      }

      // Sync pricing section
      if (jsonContent.pricing) {
        const pricingSection = {
          title: "Choose your plan",
          description: "Start free and scale as you grow. No hidden fees, no surprises.",
          plans: jsonContent.pricing
        };
        const result = await upsertSection('pricing', pricingSection);
        syncResults.push(result);
      }

      // Sync settings visibility as CTA section
      if (jsonContent.settings?.visibility?.cta !== false) {
        const ctaSection = {
          title: "Ready to get started?",
          description: "Join thousands of developers and designers who trust BiblioKit for their SaaS and plugin development needs.",
          primary_button: "Start Free Trial",
          secondary_button: "Schedule Demo",
          is_visible: jsonContent.settings?.visibility?.cta !== false
        };
        const result = await upsertSection('cta', ctaSection);
        syncResults.push(result);
      }

      // Sync contact info if present
      if (jsonContent.contact) {
        try {
          const contactResponse = await this.updateContactInfo({
            email: jsonContent.contact.email,
            twitter: jsonContent.contact.twitter,
            github: jsonContent.contact.github
          });
          syncResults.push({ 
            operation: 'updated', 
            sectionType: 'contact', 
            success: contactResponse.success 
          });
        } catch (error) {
          debugService.error('Failed to sync contact info', error);
          syncResults.push({ 
            operation: 'failed', 
            sectionType: 'contact', 
            success: false 
          });
        }
      }

      const allSuccessful = syncResults.every(result => result.success);
      
      debugService.saveSuccess('JSON to sections sync completed', { 
        results: syncResults,
        allSuccessful 
      });

      return {
        success: allSuccessful,
        data: null,
        message: `Synced ${syncResults.filter(r => r.success).length}/${syncResults.length} sections successfully`
      };

    } catch (error) {
      debugService.saveError('JSON to sections sync failed', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to sync JSON to sections'
      };
    }
  }

  // Content Sections CRUD Operations

  // Get all sections
  async getAllSections(): Promise<ApiResponse<ContentSection[]>> {
    try {
      const response = await fetch(this.getApiUrl('content-sections'), {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get sections'
      };
    }
  }

  // Get specific section by type
  async getSection<T extends ContentSection>(sectionType: SectionType): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(this.getApiUrl(`content-sections/${sectionType}`), {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : `Failed to get ${sectionType} section`
      };
    }
  }

  // Create a new section
  async createSection<T extends ContentSection>(section: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(this.getApiUrl('content-sections'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(section),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create section'
      };
    }
  }

  // Update an existing section
  async updateSection<T extends ContentSection>(id: number, section: Partial<T>): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(this.getApiUrl(`content-sections/${id}`), {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(section),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update section'
      };
    }
  }

  // Delete a section
  async deleteSection(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await fetch(this.getApiUrl(`content-sections/${id}`), {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete section'
      };
    }
  }

  // Feature Items CRUD

  // Create a new feature
  async createFeature(sectionId: number, feature: Omit<FeatureItem, 'id'>): Promise<ApiResponse<FeatureItem>> {
    try {
      const response = await fetch(this.getApiUrl('features'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ section_id: sectionId, ...feature }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create feature'
      };
    }
  }

  // Update a feature
  async updateFeature(featureId: number, feature: Partial<FeatureItem>): Promise<ApiResponse<FeatureItem>> {
    try {
      const response = await fetch(this.getApiUrl(`features/${featureId}`), {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(feature),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update feature'
      };
    }
  }

  // Delete a feature
  async deleteFeature(featureId: number): Promise<ApiResponse<null>> {
    try {
      const response = await fetch(this.getApiUrl(`features/${featureId}`), {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete feature'
      };
    }
  }

  // Pricing Plans CRUD

  // Create a new pricing plan
  async createPricingPlan(sectionId: number, plan: Omit<PricingPlan, 'id'>): Promise<ApiResponse<PricingPlan>> {
    try {
      const response = await fetch(this.getApiUrl('pricing-plans'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ section_id: sectionId, ...plan }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create pricing plan'
      };
    }
  }

  // Update a pricing plan
  async updatePricingPlan(planId: number, plan: Partial<PricingPlan>): Promise<ApiResponse<PricingPlan>> {
    try {
      const response = await fetch(this.getApiUrl(`pricing-plans/${planId}`), {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(plan),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update pricing plan'
      };
    }
  }

  // Delete a pricing plan
  async deletePricingPlan(planId: number): Promise<ApiResponse<null>> {
    try {
      const response = await fetch(this.getApiUrl(`pricing-plans/${planId}`), {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete pricing plan'
      };
    }
  }

  // Contact Info CRUD

  // Get contact info
  async getContactInfo(): Promise<ApiResponse<ContactInfo>> {
    try {
      const response = await fetch(this.getApiUrl('contact-info'), {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get contact info'
      };
    }
  }

  // Update contact info
  async updateContactInfo(contactInfo: Partial<ContactInfo>): Promise<ApiResponse<ContactInfo>> {
    try {
      const response = await fetch(this.getApiUrl('contact-info'), {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(contactInfo),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update contact info'
      };
    }
  }

  // Waitlist Operations

  // Join waitlist - adds email to users table
  async joinWaitingList(email: string): Promise<ApiResponse<any>> {
    const url = this.getApiUrl('users');
    const payload = { email, name: 'Waitlist User' };
    
    debugService.apiRequest('POST', url, payload);
    debugService.info('Waitlist signup started', { email });
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      debugService.apiResponse('POST', url, responseData);

      if (!response.ok) {
        debugService.apiError('POST', url, `HTTP ${response.status}: ${response.statusText}`);
        return {
          success: false,
          error: responseData.error || `HTTP ${response.status}: ${response.statusText}`
        };
      }

      debugService.info('Waitlist signup successful', { email, userData: responseData });
      return {
        success: true,
        data: responseData,
        message: 'Successfully joined waitlist'
      };
    } catch (error) {
      debugService.apiError('POST', url, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to join waitlist'
      };
    }
  }
}

export const contentApi = new ContentAPI();
export type { ContentVersion, ApiResponse }; 