export const prettifyUrlLabel = (raw: string): string => {
  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, '');
    const path = url.pathname.replace(/\/$/, '');
    const compact = path && path !== '/' ? `${host}${path}` : host;
    if (compact.length > 48) {
      return `${compact.slice(0, 45)}...`;
    }
    return compact;
  } catch {
    const stripped = raw.replace(/^https?:\/\//, '').replace(/\/$/, '');
    return stripped.length > 48 ? `${stripped.slice(0, 45)}...` : stripped;
  }
};

export const sanitizeUrl = (value?: string): string | undefined => {
  if (typeof value !== 'string') return value;
  // Remove whitespace that can break markdown URL parsing, e.g., "https: //example.com"
  return value.replace(/\s+/g, '');
};
