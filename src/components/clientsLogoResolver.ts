import { CLIENT_LOGO_ASSET_MAP } from './clientsLogoAssets';

export interface ClientLogoInput {
  name?: string | null;
  logo?: string | null;
}

export type ResolvedClientLogo =
  | { type: 'inline'; token: string; label: string }
  | { type: 'image'; src: string; label: string }
  | { type: 'text'; label: string };

const INLINE_LOGO_TOKENS = new Set(['superhuman', 'pitch', 'aarp', 'fisher-price', 'geico']);

const ASSET_TOKEN_ALIASES: Record<string, string> = Object.keys(CLIENT_LOGO_ASSET_MAP).reduce(
  (acc, token) => {
    acc[token] = token;
    return acc;
  },
  {} as Record<string, string>
);

const NAME_TO_TOKEN: Record<string, string> = {
  ...ASSET_TOKEN_ALIASES,
  superhuman: 'superhuman',
  pitch: 'pitch',
  aarp: 'aarp',
  fisher: 'fisher-price',
  'fisher-price': 'fisher-price',
  fisherprice: 'fisher-price',
  geico: 'geico',
  'bang-and-olufsen': 'bang-olufsen',
  bangandolufsen: 'bang-olufsen',
  'open-ai': 'openai',
  'tik-tok': 'tiktok',
  'intuit-mailchimp': 'mailchimp',
  intuitmailchimp: 'mailchimp',
  'electronic-arts': 'ea',
  'google-workspace': 'google',
  'googleworkspace': 'google',
  'google-cloud': 'google',
  'microsoft-corporation': 'microsoft',
  'meta-platforms': 'meta',
  facebook: 'meta',
  'e-bay': 'ebay',
  squareup: 'square',
  'lyft-inc': 'lyft'
};

const isUrlLike = (value: string): boolean => /^(https?:\/\/|\/|\.{1,2}\/|data:)/i.test(value);

const normalize = (value?: string | null): string => {
  if (!value) return '';
  return value.trim();
};

const normalizeToken = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export const resolveClientLogoSource = (client: ClientLogoInput): ResolvedClientLogo => {
  const label = normalize(client.name) || 'Client';
  const rawLogo = normalize(client.logo);
  const resolveFromToken = (token?: string | null): ResolvedClientLogo | null => {
    if (!token) return null;
    const normalizedToken = normalizeToken(token).replace(/^-+|-+$/g, '');
    if (!normalizedToken) return null;
    if (CLIENT_LOGO_ASSET_MAP[normalizedToken]) {
      return { type: 'image', src: CLIENT_LOGO_ASSET_MAP[normalizedToken], label };
    }
    if (INLINE_LOGO_TOKENS.has(normalizedToken)) {
      return { type: 'inline', token: normalizedToken, label };
    }
    return null;
  };

  if (rawLogo) {
    if (isUrlLike(rawLogo)) {
      return { type: 'image', src: rawLogo, label };
    }

    const inlineOrAsset = resolveFromToken(rawLogo);
    if (inlineOrAsset) {
      return inlineOrAsset;
    }
  }

  const normalizedNameToken = normalizeToken(client.name ?? '').replace(/^-+|-+$/g, '');
  if (normalizedNameToken) {
    const direct = resolveFromToken(normalizedNameToken);
    if (direct) {
      return direct;
    }

    const found = Object.keys(NAME_TO_TOKEN).find((token) =>
      normalizedNameToken.includes(token)
    );
    if (found) {
      const resolved = resolveFromToken(NAME_TO_TOKEN[found]);
      if (resolved) {
        return resolved;
      }
    }
  }

  return { type: 'text', label };
};

export const listInlineLogoTokens = (): string[] => Array.from(INLINE_LOGO_TOKENS);
