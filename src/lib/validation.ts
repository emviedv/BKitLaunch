// Validation utilities for content sections
import type {
  HeroSection,
  FeaturesSection,
  PricingSection,
  CTASection,
  WaitlistSection,
  HeaderSection,
  FooterSection,
  FeatureItem,
  PricingPlan,
  ContactInfo
} from './database';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Validation helpers
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Reusable validation helpers
const validateRequiredString = (value: string | undefined, fieldName: string, maxLength: number): string[] => {
  const errors: string[] = [];
  
  if (!value || value.trim().length === 0) {
    errors.push(`${fieldName} is required`);
  } else if (value.length > maxLength) {
    errors.push(`${fieldName} must be ${maxLength} characters or less`);
  }
  
  return errors;
};

const validateOptionalString = (value: string | undefined, fieldName: string, maxLength: number): string[] => {
  const errors: string[] = [];
  
  if (value && value.length > maxLength) {
    errors.push(`${fieldName} must be ${maxLength} characters or less`);
  }
  
  return errors;
};

const validateNumericRange = (value: number | undefined, fieldName: string, min: number, max: number): string[] => {
  const errors: string[] = [];
  
  if (value !== undefined && (value < min || value > max)) {
    errors.push(`${fieldName} must be between ${min} and ${max}`);
  }
  
  return errors;
};

const isValidColor = (color: string): boolean => {
  const isValidHex = /^#[0-9A-F]{6}$/i.test(color);
  const validColors = ['green', 'blue', 'orange', 'purple', 'red', 'yellow', 'indigo', 'pink', 'gray', 'primary'];
  const isValidColorName = validColors.includes(color);
  return isValidHex || isValidColorName;
};

// Section validation functions
export const validateHeroSection = (section: Partial<HeroSection>): ValidationResult => {
  const errors: string[] = [];

  errors.push(...validateRequiredString(section.title, 'Title', 100));
  errors.push(...validateRequiredString(section.subtitle, 'Subtitle', 100));
  errors.push(...validateRequiredString(section.description, 'Description', 500));
  errors.push(...validateRequiredString(section.primary_button, 'Primary button text', 50));
  errors.push(...validateRequiredString(section.secondary_button, 'Secondary button text', 50));

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateFeatureItem = (feature: Partial<FeatureItem>): ValidationResult => {
  const errors: string[] = [];

  errors.push(...validateRequiredString(feature.icon, 'Icon', 10));
  errors.push(...validateRequiredString(feature.title, 'Title', 100));
  errors.push(...validateRequiredString(feature.description, 'Description', 500));
  errors.push(...validateOptionalString(feature.badge, 'Badge text', 50));

  if (feature.badge_color) {
    if (!isValidColor(feature.badge_color)) {
      errors.push('Badge color must be a valid hex color (#ffffff) or predefined color name');
    }
  }

  errors.push(...validateNumericRange(feature.sort_order, 'Sort order', 0, 1000));

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validatePricingPlan = (plan: Partial<PricingPlan>): ValidationResult => {
  const errors: string[] = [];

  // Helper for validating individual feature strings
  const validateFeature = (feature: string, index: number): string[] => {
    const featureErrors: string[] = [];
    if (!feature || feature.trim().length === 0) {
      featureErrors.push(`Feature ${index + 1} cannot be empty`);
    } else if (feature.length > 100) {
      featureErrors.push(`Feature ${index + 1} must be 100 characters or less`);
    }
    return featureErrors;
  };

  errors.push(...validateRequiredString(plan.name, 'Plan name', 50));
  errors.push(...validateRequiredString(plan.price, 'Price', 20));
  errors.push(...validateOptionalString(plan.period, 'Period', 20));
  errors.push(...validateOptionalString(plan.description, 'Description', 200));

  if (!plan.features || !Array.isArray(plan.features) || plan.features.length === 0) {
    errors.push('At least one feature is required');
  } else if (plan.features.length > 20) {
    errors.push('Maximum 20 features allowed');
  } else {
    plan.features.forEach((feature, index) => {
      errors.push(...validateFeature(feature, index));
    });
  }

  errors.push(...validateRequiredString(plan.button_text, 'Button text', 50));
  errors.push(...validateNumericRange(plan.sort_order, 'Sort order', 0, 1000));

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateCTASection = (section: Partial<CTASection>): ValidationResult => {
  const errors: string[] = [];

  errors.push(...validateRequiredString(section.title, 'Title', 100));
  errors.push(...validateRequiredString(section.description, 'Description', 300));
  errors.push(...validateRequiredString(section.primary_button, 'Primary button text', 50));
  errors.push(...validateRequiredString(section.secondary_button, 'Secondary button text', 50));

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateWaitlistSection = (section: Partial<WaitlistSection>): ValidationResult => {
  const errors: string[] = [];

  errors.push(...validateRequiredString(section.title, 'Title', 100));
  errors.push(...validateRequiredString(section.description, 'Description', 300));
  errors.push(...validateRequiredString(section.button_text, 'Button text', 50));
  errors.push(...validateRequiredString(section.success_message, 'Success message', 200));

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateContactInfo = (contact: Partial<ContactInfo>): ValidationResult => {
  const errors: string[] = [];

  // Email validation with custom logic
  if (!contact.email || contact.email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!isValidEmail(contact.email)) {
    errors.push('Email must be a valid email address');
  }

  // Twitter validation (keep custom logic as-is)
  if (contact.twitter) {
    const twitter = contact.twitter.trim();
    if (twitter.length > 0) {
      // Remove @ if present for validation
      const twitterHandle = twitter.startsWith('@') ? twitter.slice(1) : twitter;
      if (!/^[A-Za-z0-9_]{1,15}$/.test(twitterHandle)) {
        errors.push('Twitter handle must be 1-15 characters, letters, numbers, and underscores only');
      }
    }
  }

  // GitHub validation (keep custom logic as-is)
  if (contact.github) {
    const github = contact.github.trim();
    if (github.length > 0) {
      if (!/^[A-Za-z0-9-]{1,39}$/.test(github)) {
        errors.push('GitHub username must be 1-39 characters, letters, numbers, and hyphens only');
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Universal section validator
export const validateSection = (section: any): ValidationResult => {
  if (!section.section_type) {
    return {
      isValid: false,
      errors: ['Section type is required']
    };
  }

  switch (section.section_type) {
    case 'hero':
      return validateHeroSection(section);
    case 'cta':
      return validateCTASection(section);
    case 'waitlist':
      return validateWaitlistSection(section);
    default:
      return {
        isValid: true,
        errors: []
      };
  }
};

// Form validation helpers
export const displayValidationErrors = (errors: string[]): string => {
  if (errors.length === 0) return '';
  if (errors.length === 1) return errors[0];
  return `Multiple errors: ${errors.join(', ')}`;
};

export const hasValidationErrors = (errors: string[]): boolean => {
  return errors.length > 0;
};