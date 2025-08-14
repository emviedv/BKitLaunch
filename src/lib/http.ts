import { debugService } from './debugService';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export const getApiUrl = (endpoint: string): string => `/.netlify/functions/${endpoint}`;

export const buildAuthHeaders = (token?: string, extra?: HeadersInit): HeadersInit => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
  ...(extra || {}),
});

export async function apiRequest<T>(
  endpoint: string,
  method: HttpMethod,
  payload?: unknown,
  token?: string
): Promise<ApiResponse<T>> {
  const url = getApiUrl(endpoint);
  try {
    debugService.apiRequest(method, url, payload);
    const response = await fetch(url, {
      method,
      headers: buildAuthHeaders(token),
      credentials: 'include',
      body: method === 'GET' || method === 'DELETE' ? undefined : JSON.stringify(payload),
    });
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const parsed = isJson ? await response.json() : undefined;

    debugService.apiResponse(method, url, parsed);

    if (!response.ok) {
      const errMsg = (parsed && parsed.error) || `HTTP ${response.status}: ${response.statusText}`;
      debugService.apiError(method, url, errMsg);
      return { success: false, error: errMsg };
    }

    // Normalize to ApiResponse<T>
    if (parsed && typeof parsed === 'object' && 'success' in parsed) {
      return parsed as ApiResponse<T>;
    }
    return { success: true, data: parsed as T };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Network error';
    debugService.apiError(method, url, errMsg);
    return { success: false, error: errMsg };
  }
}


