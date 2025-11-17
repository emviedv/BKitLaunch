import { debugService } from './debugService';
import { getApiUrl } from './http';

type JoinWaitlistResult = {
  success: boolean;
  message?: string;
  error?: string;
};

const debugEnabled = () => {
  if (typeof process !== 'undefined' && process.env?.DEBUG_FIX) {
    return process.env.DEBUG_FIX !== '0';
  }
  if (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_DEBUG_FIX) {
    return (import.meta as any).env.VITE_DEBUG_FIX !== '0';
  }
  return false;
};

export const joinWaitlist = async (email: string): Promise<JoinWaitlistResult> => {
  const endpoint = getApiUrl('waitlist');
  const payload = { email };

  if (debugEnabled()) {
    console.debug('[cms-removal] joinWaitlist request', { endpoint, payload });
  }

  try {
    debugService.apiRequest('POST', endpoint, payload);
  } catch {}

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  let parsed: any = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      parsed = await response.json();
    } catch {
      parsed = null;
    }
  }

  if (!response.ok) {
    const errorMessage = parsed?.error || `HTTP ${response.status}`;
    if (debugEnabled()) {
      console.debug('[cms-removal] joinWaitlist failed', { endpoint, errorMessage, status: response.status });
    }
    return { success: false, error: errorMessage };
  }

  if (debugEnabled()) {
    console.debug('[cms-removal] joinWaitlist success', { endpoint, message: parsed?.message });
  }

  return {
    success: true,
    message: parsed?.message,
  };
};
