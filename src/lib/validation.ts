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

const isValidHexColor = (color: string): boolean => {
  return /^#[0-9A-F]{6}$/i.test(color);
};

const isValidColorName = (color: string): boolean => {
  const validColors = ['green', 'blue', 'orange', 'purple', 'red', 'yellow', 'indigo', 'pink', 'gray', 'primary'];
  return validColors.includes(color);
};

// Section validation functions
export const validateHeroSection = (section: Partial<HeroSection>): ValidationResult => {
  const errors: string[] = [];

  if (!section.title || section.title.trim().length === 0) {
    errors.push('Title is required');
  } else if (section.title.length > 100) {
    errors.push('Title must be 100 characters or less');
  }

  if (!section.subtitle || section.subtitle.trim().length === 0) {
    errors.push('Subtitle is required');
  } else if (section.subtitle.length > 100) {
    errors.push('Subtitle must be 100 characters or less');
  }

  if (!section.description || section.description.trim().length === 0) {
    errors.push('Description is required');
  } else if (section.description.length > 500) {
    errors.push('Description must be 500 characters or less');
  }

  if (!section.primary_button || section.primary_button.trim().length === 0) {
    errors.push('Primary button text is required');
  } else if (section.primary_button.length > 50) {
    errors.push('Primary button text must be 50 characters or less');
  }

  if (!section.secondary_button || section.secondary_button.trim().length === 0) {
    errors.push('Secondary button text is required');
  } else if (section.secondary_button.length > 50) {
    errors.push('Secondary button text must be 50 characters or less');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateFeatureItem = (feature: Partial<FeatureItem>): ValidationResult => {
  const errors: string[] = [];

  if (!feature.icon || feature.icon.trim().length === 0) {
    errors.push('Icon is required');
  } else if (feature.icon.length > 10) {
    errors.push('Icon must be 10 characters or less (emoji or short text)');
  }

  if (!feature.title || feature.title.trim().length === 0) {
    errors.push('Title is required');
  } else if (feature.title.length > 100) {
    errors.push('Title must be 100 characters or less');
  }

  if (!feature.description || feature.description.trim().length === 0) {
    errors.push('Description is required');
  } else if (feature.description.length > 500) {
    errors.push('Description must be 500 characters or less');
  }

  if (feature.badge && feature.badge.length > 50) {
    errors.push('Badge text must be 50 characters or less');
  }

  if (feature.badge_color) {
    if (!isValidHexColor(feature.badge_color) && !isValidColorName(feature.badge_color)) {
      errors.push('Badge color must be a valid hex color (#ffffff) or predefined color name');
    }
  }

  if (feature.sort_order !== undefined && (feature.sort_order < 0 || feature.sort_order > 1000)) {
    errors.push('Sort order must be between 0 and 1000');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validatePricingPlan = (plan: Partial<PricingPlan>): ValidationResult => {
  const errors: string[] = [];

  if (!plan.name || plan.name.trim().length === 0) {
    errors.push('Plan name is required');
  } else if (plan.name.length > 50) {
    errors.push('Plan name must be 50 characters or less');
  }

  if (!plan.price || plan.price.trim().length === 0) {
    errors.push('Price is required');
  } else if (plan.price.length > 20) {
    errors.push('Price must be 20 characters or less');
  }

  if (plan.period && plan.period.length > 20) {
    errors.push('Period must be 20 characters or less');
  }

  if (plan.description && plan.description.length > 200) {
    errors.push('Description must be 200 characters or less');
  }

  if (!plan.features || !Array.isArray(plan.features) || plan.features.length === 0) {
    errors.push('At least one feature is required');
  } else if (plan.features.length > 20) {
    errors.push('Maximum 20 features allowed');
  } else {
    plan.features.forEach((feature, index) => {
      if (!feature || feature.trim().length === 0) {
        errors.push(`Feature ${index + 1} cannot be empty`);
      } else if (feature.length > 100) {
        errors.push(`Feature ${index + 1} must be 100 characters or less`);
      }
    });
  }

  if (!plan.button_text || plan.button_text.trim().length === 0) {
    errors.push('Button text is required');
  } else if (plan.button_text.length > 50) {
    errors.push('Button text must be 50 characters or less');
  }

  if (plan.sort_order !== undefined && (plan.sort_order < 0 || plan.sort_order > 1000)) {
    errors.push('Sort order must be between 0 and 1000');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateCTASection = (section: Partial<CTASection>): ValidationResult => {
  const errors: string[] = [];

  if (!section.title || section.title.trim().length === 0) {
    errors.push('Title is required');
  } else if (section.title.length > 100) {
    errors.push('Title must be 100 characters or less');
  }

  if (!section.description || section.description.trim().length === 0) {
    errors.push('Description is required');
  } else if (section.description.length > 300) {
    errors.push('Description must be 300 characters or less');
  }

  if (!section.primary_button || section.primary_button.trim().length === 0) {
    errors.push('Primary button text is required');
  } else if (section.primary_button.length > 50) {
    errors.push('Primary button text must be 50 characters or less');
  }

  if (!section.secondary_button || section.secondary_button.trim().length === 0) {
    errors.push('Secondary button text is required');
  } else if (section.secondary_button.length > 50) {
    errors.push('Secondary button text must be 50 characters or less');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateWaitlistSection = (section: Partial<WaitlistSection>): ValidationResult => {
  const errors: string[] = [];

  if (!section.title || section.title.trim().length === 0) {
    errors.push('Title is required');
  } else if (section.title.length > 100) {
    errors.push('Title must be 100 characters or less');
  }

  if (!section.description || section.description.trim().length === 0) {
    errors.push('Description is required');
  } else if (section.description.length > 300) {
    errors.push('Description must be 300 characters or less');
  }

  if (!section.button_text || section.button_text.trim().length === 0) {
    errors.push('Button text is required');
  } else if (section.button_text.length > 50) {
    errors.push('Button text must be 50 characters or less');
  }

  if (!section.success_message || section.success_message.trim().length === 0) {
    errors.push('Success message is required');
  } else if (section.success_message.length > 200) {
    errors.push('Success message must be 200 characters or less');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateContactInfo = (contact: Partial<ContactInfo>): ValidationResult => {
  const errors: string[] = [];

  if (!contact.email || contact.email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!isValidEmail(contact.email)) {
    errors.push('Email must be a valid email address');
  }

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