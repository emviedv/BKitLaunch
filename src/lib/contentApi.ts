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
}

export const contentApi = new ContentAPI();
export type { ContentVersion, ApiResponse }; 