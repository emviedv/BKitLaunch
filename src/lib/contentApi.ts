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
    // In production (Netlify), use the current domain
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      return `${window.location.origin}/.netlify/functions/${endpoint}`;
    }
    // In development, use netlify dev URL
    return `http://localhost:8888/.netlify/functions/${endpoint}`;
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
    try {
      const response = await fetch(this.getApiUrl('content-management'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          contentData,
          isPublished
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
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
    try {
      const response = await this.getCurrentContent();
      return response.success;
    } catch {
      return false;
    }
  }
}

export const contentApi = new ContentAPI();
export type { ContentVersion, ApiResponse }; 