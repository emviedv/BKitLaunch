// Shared default content utility to avoid placeholder marketing copy
// Used by SSR and client hooks to ensure empty sections render gracefully

export interface DefaultContent {
  hero: {
    badgeLabel: string;
    title: string;
    subtitle: string;
    description: string;
    primaryButton: string;
    secondaryButton: string;
    primaryButtonLink: string;
    secondaryButtonLink: string;
    emoji: string;
  };
  features: {
    title: string;
    description: string;
    items: any[];
  } | any[];
  pricing: any[];
  pricingSection: {
    isComingSoon: boolean;
    title?: string;
    description?: string;
  };
  settings: {
    visibility: Record<string, boolean>;
    labels: Record<string, boolean>;
  };
  cta: any | null;
  products: Record<string, any>;
  header: Record<string, any>;
  footer: Record<string, any>;
  waitlist: Record<string, any>;
}

export const createEmptyContent = (): DefaultContent => ({
  hero: {
    badgeLabel: '',
    title: '',
    subtitle: '',
    description: '',
    primaryButton: '',
    secondaryButton: '',
    primaryButtonLink: '',
    secondaryButtonLink: '',
    emoji: ''
  },
  features: {
    title: '',
    description: '',
    items: []
  },
  pricing: [],
  pricingSection: { isComingSoon: true },
  settings: { visibility: {}, labels: {} },
  cta: null,
  products: {},
  header: {},
  footer: {},
  waitlist: {}
});


