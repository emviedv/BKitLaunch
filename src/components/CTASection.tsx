import React from 'react';
import { Button } from '@/components/ui/button';

/**
 * CTA Section Props
 */
interface CTASectionProps {
  title?: string;
  description?: string;
  primaryButton?: string;
  secondaryButton?: string;
  primaryButtonLink?: string;
  secondaryButtonLink?: string;
  visible?: boolean;
  className?: string;
}

//   - secondaryButtonLink (string)
//   - align ('left' | 'center')

/**
 * CTASection - Reusable call-to-action component
 * 
 * Features:
 * - Configurable title, description, and buttons
 * - Conditional visibility support
 * - Consistent styling with site design
 * - Optional button links
 * 
 * @example
 * ```tsx
 * <CTASection 
 *   title="Ready to get started?"
 *   description="Join thousands of users today"
 *   primaryButton="Get Started"
 *   secondaryButton="Learn More"
 *   visible={true}
 * />
 * ```
 */
export const CTASection: React.FC<CTASectionProps> = ({
  title = "Ready to get started?",
  description = "Join thousands of users who trust our platform.",
  primaryButton = "Get Started",
  secondaryButton = "Learn More",
  primaryButtonLink,
  secondaryButtonLink,
  visible = true,
  className = ""
}) => {
  // Don't render if visibility is false
  if (!visible) {
    return null;
  }

  return (
    <section className={`py-20 bg-muted/30 ${className}`}>
      <div className="section-content text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="section-title mb-4">
            {title}
          </h2>
          <p className="section-description mb-8 text-center">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {primaryButtonLink ? (
              <Button asChild size="lg">
                <a 
                  href={primaryButtonLink}
                  target={primaryButtonLink.startsWith('http') ? '_blank' : '_self'}
                  rel={primaryButtonLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {primaryButton}
                </a>
              </Button>
            ) : (
              <Button size="lg">{primaryButton}</Button>
            )}
            
            {secondaryButtonLink ? (
              <Button asChild size="lg" variant="outline">
                <a 
                  href={secondaryButtonLink}
                  target={secondaryButtonLink.startsWith('http') ? '_blank' : '_self'}
                  rel={secondaryButtonLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {secondaryButton}
                </a>
              </Button>
            ) : (
              <Button size="lg" variant="outline">{secondaryButton}</Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * ContentBasedCTASection - CTA that uses content from usePublishedContent
 * 
 * This wrapper component handles the content loading and visibility logic
 * so individual pages don't need to manage this themselves.
 */
interface ContentBasedCTASectionProps {
  content: any; // Should be typed based on your content structure
}

export const ContentBasedCTASection: React.FC<ContentBasedCTASectionProps> = ({ content }) => {
  // Check if CTA section should be visible
  const shouldShowCTA = content.settings?.visibility?.cta !== false;
  
  // Don't render if no CTA data or visibility is false
  if (!shouldShowCTA || !content.cta) {
    return null;
  }

  return (
    <CTASection
      title={content.cta.title}
      description={content.cta.description}
      primaryButton={content.cta.primaryButton}
      secondaryButton={content.cta.secondaryButton}
      primaryButtonLink={content.cta.primaryButtonLink}
      secondaryButtonLink={content.cta.secondaryButtonLink}
      visible={shouldShowCTA}
    />
  );
};

export default CTASection;
