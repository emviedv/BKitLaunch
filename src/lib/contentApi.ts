import type { 
  ContentSection, 
  SectionType, 
  FeatureItem, 
  PricingPlan, 
  ContactInfo 
} from './database';
import { debugService } from './debugService';
import { apiRequest, getApiUrl } from './http';

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

  private getApiUrl(endpoint: string): string { return getApiUrl(endpoint); }

  // Get current published content
  async getCurrentContent(): Promise<ApiResponse<ContentVersion>> {
    const token = this.getAuthToken() || undefined;
    return apiRequest<ContentVersion>(`content-management?action=current`, 'GET', undefined, token);
  }

  // Get all content versions
  async getContentVersions(): Promise<ApiResponse<ContentVersion[]>> {
    const token = this.getAuthToken() || undefined;
    return apiRequest<ContentVersion[]>(`content-management?action=versions`, 'GET', undefined, token);
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
    
    const token = this.getAuthToken() || undefined;
    const res = await apiRequest<ContentVersion>('content-management', 'POST', payload, token);
    if (res.success) {
      debugService.saveSuccess('Content save API completed', res.data);
    } else {
      debugService.saveError('Content save API failed', res.error);
    }
    return res;
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
      const syncResults: Array<{ operation: string; sectionType: SectionType | string; success: boolean }> = [];
      
      // Helper function to upsert a section
      const upsertSection = async (sectionType: SectionType, sectionData: any, isVisible?: boolean) => {
        // First, try to get existing section
        const existingResponse = await this.getSection(sectionType);
        
        if (existingResponse.success && existingResponse.data) {
          // Update existing section
          const updatePayload: any = {
            section_data: sectionData,
            updated_at: new Date().toISOString()
          };
          if (typeof isVisible === 'boolean') updatePayload.is_visible = isVisible;
          const updateResponse = await this.updateSection((existingResponse.data as any).id, updatePayload);
          return { operation: 'updated', sectionType, success: updateResponse.success };
        } else {
          // Create new section
          const createResponse = await this.createSection({
            section_type: sectionType,
            section_data: sectionData,
            is_visible: typeof isVisible === 'boolean' ? isVisible : true,
            sort_order: 0
          });
          return { operation: 'created', sectionType, success: createResponse.success };
        }
      };

      // Sync hero section
      if (jsonContent.hero) {
        const result = await upsertSection('hero', jsonContent.hero, jsonContent.settings?.visibility?.hero !== false);
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
        const result = await upsertSection('features', featuresSection, jsonContent.settings?.visibility?.features !== false);
        syncResults.push(result);
      }

      // Sync pricing section
      if (jsonContent.pricing || jsonContent.pricingSection) {
        const pricingSection = {
          title: "Choose your plan",
          description: "Start free and scale as you grow. No hidden fees, no surprises.",
          plans: jsonContent.pricing || [],
          isComingSoon: jsonContent.pricingSection?.isComingSoon !== false // Default to true if not explicitly set to false
        };
        const result = await upsertSection('pricing', pricingSection, jsonContent.settings?.visibility?.pricing !== false);
        syncResults.push(result);
      }

      // Sync settings visibility as CTA section
      if (jsonContent.cta) {
        const ctaSection = {
          title: jsonContent.cta.title || "Ready to get started?",
          description: jsonContent.cta.description || "Join thousands of developers and designers who trust BiblioKit for their SaaS and plugin development needs.",
          primary_button: jsonContent.cta.primaryButton || "Start Free Trial",
          secondary_button: jsonContent.cta.secondaryButton || "Schedule Demo"
        };
        const result = await upsertSection('cta', ctaSection, jsonContent.settings?.visibility?.cta !== false);
        syncResults.push(result);
      }

      // Sync waitlist section
      if (jsonContent.waitlist) {
        const waitlistSection = {
          title: jsonContent.waitlist.title || '',
          description: jsonContent.waitlist.description || '',
          button_text: jsonContent.waitlist.buttonText || '',
          success_message: jsonContent.waitlist.successMessage || ''
        };
        const result = await upsertSection('waitlist', waitlistSection, jsonContent.settings?.visibility?.waitlist !== false);
        syncResults.push(result);
      }

      // Sync header and navigation items
      if (jsonContent.header) {
        const headerData = {
          logo_text: jsonContent.header.logoText || 'BiblioKit',
          sign_in_text: jsonContent.header.signInText || 'Sign In',
          get_started_text: jsonContent.header.getStartedText || 'Get Started',
          sign_in_href: jsonContent.header.signInHref || '',
          get_started_href: jsonContent.header.getStartedHref || '',
          show_sign_in: jsonContent.header.showSignIn !== false,
          show_get_started: jsonContent.header.showGetStarted !== false
        };
        await upsertSection('header', headerData, jsonContent.settings?.visibility?.header !== false);

        // Ensure we have the section ID
        const headerResponse = await this.getSection('header');
        if (headerResponse.success && headerResponse.data) {
          const headerSection: any = headerResponse.data;
          const sectionId = headerSection.id;

          // Remove existing nav items then re-create from JSON to keep it simple
          const existingItems: any[] = headerSection.navigation_items || [];
          for (const item of existingItems) {
            if (item.id) {
              await this.deleteNavigationItem(item.id);
            }
          }
          const navItems: Array<{ label: string; href: string }> = jsonContent.header.navigation || [];
          for (let i = 0; i < navItems.length; i++) {
            const item = navItems[i];
            await this.createNavigationItem(sectionId, { label: item.label, href: item.href, sort_order: i });
          }
          syncResults.push({ operation: 'synced', sectionType: 'header-navigation', success: true });
        } else {
          syncResults.push({ operation: 'synced', sectionType: 'header-navigation', success: false });
        }
      }

      // Sync footer link groups and links
      if (jsonContent.footer) {
        const footerData = {
          description: jsonContent.footer.description || '',
          copyright_text: jsonContent.footer.copyright || ''
        };
        await upsertSection('footer', footerData, jsonContent.settings?.visibility?.footer !== false);

        // Ensure we have the section ID
        const footerResponse = await this.getSection('footer');
        if (footerResponse.success && footerResponse.data) {
          const footerSection: any = footerResponse.data;
          const sectionId = footerSection.id;

          // Delete existing groups (cascade deletes links)
          const existingGroups: any[] = footerSection.footer_links || [];
          for (const group of existingGroups) {
            if (group.id) {
              await this.deleteFooterLinkGroup(group.id);
            }
          }

          // Create groups and links from JSON footer.sections
          const groups: Array<{ title: string; links: Array<{ label: string; href: string }> }> = jsonContent.footer.sections || [];
          for (let gi = 0; gi < groups.length; gi++) {
            const group = groups[gi];
            const createGroupRes = await this.createFooterLinkGroup(sectionId, group.title, gi);
            if (createGroupRes.success && (createGroupRes.data as any)?.id) {
              const groupId = (createGroupRes.data as any).id;
              const links = group.links || [];
              for (let li = 0; li < links.length; li++) {
                const link = links[li];
                await this.createFooterLink(groupId, { label: link.label, href: link.href, sort_order: li });
              }
            }
          }
          syncResults.push({ operation: 'synced', sectionType: 'footer-links', success: true });
        } else {
          syncResults.push({ operation: 'synced', sectionType: 'footer-links', success: false });
        }
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

      // Sync pages (CRUD mapped from JSON)
      if (Array.isArray(jsonContent.pages)) {
        try {
          const pagesResponse = await this.getPages(false);
          const existingPages: any[] = pagesResponse.success && pagesResponse.data ? (pagesResponse.data as any[]) : [];
          const existingBySlug = new Map<string, any>();
          for (const p of existingPages) existingBySlug.set(p.slug, p);

          const incomingBySlug = new Map<string, any>();
          for (const p of jsonContent.pages) incomingBySlug.set(p.slug, p);

          // Delete pages not present anymore
          for (const p of existingPages) {
            if (!incomingBySlug.has(p.slug)) {
              await this.deletePage(p.id);
            }
          }

          // Create or update pages
          for (const page of jsonContent.pages) {
            const existing = existingBySlug.get(page.slug);
            const payload = {
              slug: page.slug,
              title: page.title,
              content: page.content || {},
              is_published: page.isPublished ?? page.is_published ?? false
            } as any;
            if (existing && existing.id) {
              await this.updatePage(existing.id, payload);
            } else {
              await this.createPage(payload);
            }
          }

          syncResults.push({ operation: 'synced', sectionType: 'pages', success: true });
        } catch (error) {
          debugService.saveError('Failed to sync pages', error);
          syncResults.push({ operation: 'failed', sectionType: 'pages', success: false });
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

  // Create a new section (accepts unified payload shape used by server)
  async createSection<T = any>(section: any): Promise<ApiResponse<T>> {
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

  // Update an existing section (accepts partial unified payload)
  async updateSection<T = any>(id: number, section: Partial<T>): Promise<ApiResponse<T>> {
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

  // Footer Link Groups CRUD
  async createFooterLinkGroup(sectionId: number, title: string, sortOrder: number = 0): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(this.getApiUrl('content-sections/footer-link-groups'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ section_id: sectionId, title, sort_order: sortOrder }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to create footer link group' };
    }
  }

  async updateFooterLinkGroup(groupId: number, updates: { title?: string; sort_order?: number }): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(this.getApiUrl(`content-sections/footer-link-groups/${groupId}`), {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to update footer link group' };
    }
  }

  async deleteFooterLinkGroup(groupId: number): Promise<ApiResponse<null>> {
    try {
      const response = await fetch(this.getApiUrl(`content-sections/footer-link-groups/${groupId}`), {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to delete footer link group' };
    }
  }

  // Footer Links CRUD
  async createFooterLink(groupId: number, link: { label: string; href: string; sort_order?: number }): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(this.getApiUrl('content-sections/footer-links'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ group_id: groupId, ...link }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to create footer link' };
    }
  }

  async updateFooterLink(linkId: number, updates: { label?: string; href?: string; sort_order?: number }): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(this.getApiUrl(`content-sections/footer-links/${linkId}`), {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to update footer link' };
    }
  }

  async deleteFooterLink(linkId: number): Promise<ApiResponse<null>> {
    try {
      const response = await fetch(this.getApiUrl(`content-sections/footer-links/${linkId}`), {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to delete footer link' };
    }
  }

  // Navigation Items CRUD
  async createNavigationItem(sectionId: number, item: { label: string; href: string; sort_order?: number; type?: string; isExternal?: boolean; nofollow?: boolean; isButton?: boolean }): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(this.getApiUrl('content-sections/navigation-items'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          section_id: sectionId,
          label: item.label,
          href: item.href,
          sort_order: item.sort_order,
          type: item.type,
          is_external: item.isExternal,
          nofollow: item.nofollow,
          is_button: item.isButton
        }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to create navigation item' };
    }
  }

  async updateNavigationItem(itemId: number, updates: { label?: string; href?: string; sort_order?: number; type?: string; isExternal?: boolean; nofollow?: boolean; isButton?: boolean }): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(this.getApiUrl(`content-sections/navigation-items/${itemId}`), {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({
          label: updates.label,
          href: updates.href,
          sort_order: updates.sort_order,
          type: updates.type,
          is_external: updates.isExternal,
          nofollow: updates.nofollow,
          is_button: updates.isButton
        }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to update navigation item' };
    }
  }

  async deleteNavigationItem(itemId: number): Promise<ApiResponse<null>> {
    try {
      const response = await fetch(this.getApiUrl(`content-sections/navigation-items/${itemId}`), {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to delete navigation item' };
    }
  }

  // Pages CRUD
  async getPages(publishedOnly: boolean = false): Promise<ApiResponse<any[]>> {
    try {
      const qs = publishedOnly ? '?published=true' : '';
      const response = await fetch(this.getApiUrl(`pages${qs}`), {
        method: 'GET',
        headers: this.getHeaders(),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch pages' };
    }
  }

  async getPage(idOrSlug: number | string): Promise<ApiResponse<any>> {
    try {
      const idPath = typeof idOrSlug === 'number' ? `${idOrSlug}` : `${idOrSlug}`;
      const response = await fetch(this.getApiUrl(`pages/${idPath}`), {
        method: 'GET',
        headers: this.getHeaders(),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch page' };
    }
  }

  async createPage(page: { slug: string; title: string; content: any; is_published?: boolean }): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(this.getApiUrl('pages'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(page),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to create page' };
    }
  }

  async updatePage(id: number, page: Partial<{ slug: string; title: string; content: any; is_published: boolean }>): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(this.getApiUrl(`pages/${id}`), {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(page),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to update page' };
    }
  }

  async deletePage(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await fetch(this.getApiUrl(`pages/${id}`), {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to delete page' };
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
    // Use public waitlist endpoint (unauthenticated)
    const url = this.getApiUrl('waitlist');
    const payload = { email, name: 'Waitlist User', source: 'website' };
    
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

  // Admin: fetch waitlist signups (requires auth token)
  async getWaitlistSignups(limit: number = 50, offset: number = 0): Promise<ApiResponse<any[]>> {
    const url = `${this.getApiUrl('waitlist')}?limit=${encodeURIComponent(String(limit))}&offset=${encodeURIComponent(String(offset))}`;
    debugService.apiRequest('GET', url);
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      const data = await response.json();
      debugService.apiResponse('GET', url, data);
      if (!response.ok || data.success === false) {
        return { success: false, error: data.error || `HTTP ${response.status}: ${response.statusText}` };
      }
      return { success: true, data: data.data };
    } catch (error) {
      debugService.apiError('GET', url, error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch waitlist signups' };
    }
  }
}

export const contentApi = new ContentAPI();
export type { ContentVersion, ApiResponse }; 