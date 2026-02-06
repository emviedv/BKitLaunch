/**
 * Centralized URL normalization utilities.
 *
 * IMPORTANT: All URL-generating code (sitemaps, canonical tags, OG URLs,
 * structured data) MUST use these utilities to ensure consistency.
 *
 * This prevents www/non-www mismatches that cause SEO issues.
 */

/** The canonical base URL for production - always use www */
export const CANONICAL_BASE_URL = 'https://www.bibliokit.com';

/** Hosts that should be normalized to the canonical www version */
const PRODUCTION_HOSTS = new Set(['bibliokit.com', 'www.bibliokit.com']);

/** Development hosts that should NOT be normalized */
const DEV_HOSTS = new Set(['localhost', '127.0.0.1']);

/**
 * Checks if a hostname is a production BiblioKit domain.
 */
export function isProductionHost(hostname: string): boolean {
  return PRODUCTION_HOSTS.has(hostname.toLowerCase());
}

/**
 * Checks if a hostname is a development host.
 */
export function isDevHost(hostname: string): boolean {
  return DEV_HOSTS.has(hostname.toLowerCase());
}

/**
 * Normalizes a base URL to the canonical www.bibliokit.com for production.
 *
 * - Production domains (bibliokit.com, www.bibliokit.com) -> https://www.bibliokit.com
 * - Dev hosts (localhost, 127.0.0.1) -> preserved as-is
 * - Other domains -> preserved as-is (for preview deploys, etc.)
 * - Invalid/empty input -> returns CANONICAL_BASE_URL
 *
 * @param raw - A URL string, origin, or hostname
 * @returns The normalized origin (protocol + host, no trailing slash)
 */
export function normalizeBaseUrl(raw?: string | null): string {
  if (!raw) return CANONICAL_BASE_URL;

  try {
    const url = new URL(raw);
    const hostname = url.hostname.toLowerCase();

    // Always normalize production hosts to www
    if (isProductionHost(hostname)) {
      return CANONICAL_BASE_URL;
    }

    // Preserve dev hosts and other domains as-is
    return url.origin;
  } catch {
    // Try adding https:// prefix
    try {
      const url = new URL(`https://${raw}`);
      const hostname = url.hostname.toLowerCase();

      if (isProductionHost(hostname)) {
        return CANONICAL_BASE_URL;
      }

      return url.origin;
    } catch {
      return CANONICAL_BASE_URL;
    }
  }
}

/**
 * Resolves the base URL for client-side code.
 * Uses window.location when available, falls back to canonical.
 *
 * @returns The normalized base URL for the current environment
 */
export function resolveClientBaseUrl(): string {
  if (typeof window !== 'undefined' && window.location) {
    // Extract hostname - prefer hostname property, fall back to parsing host
    const hostname = (
      window.location.hostname ||
      (window.location.host ? window.location.host.split(':')[0] : '')
    ).toLowerCase();

    if (!hostname) {
      return CANONICAL_BASE_URL;
    }

    // Normalize production to www
    if (isProductionHost(hostname)) {
      return CANONICAL_BASE_URL;
    }

    return `${window.location.protocol}//${window.location.host}`;
  }

  return CANONICAL_BASE_URL;
}

/**
 * Converts a path to an absolute URL using the given base.
 * Normalizes trailing slashes (removes them except for root).
 *
 * @param baseUrl - The base URL (will be normalized)
 * @param path - The path to append (can be relative or absolute)
 * @returns The full absolute URL, or null if path is invalid
 */
export function toAbsoluteUrl(baseUrl: string, path?: string | null): string | null {
  if (!path || typeof path !== 'string') return null;

  // If already absolute, return as-is
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const base = normalizeBaseUrl(baseUrl);
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  // Remove trailing slashes except for root
  const cleanPath = normalizedPath === '/' ? '/' : normalizedPath.replace(/\/+$/, '');

  return `${base}${cleanPath}`;
}
