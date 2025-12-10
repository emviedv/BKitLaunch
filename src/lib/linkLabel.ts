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
