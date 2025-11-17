import React from 'react';
import { Button } from '@/components/ui/button';
import { usePublishedContent } from '@/hooks/usePublishedContent';
import { LANDING_PRICING_ID } from '@/config/sectionAnchors';

const Pricing = () => {
  const { content } = usePublishedContent();
  const { pricing } = content;

  if (content.settings?.visibility?.pricing === false) {
    return null;
  }

  const comingSoonConfigured =
    content.pricingSection?.isComingSoon === true ||
    (content.pricingSection as any)?.is_coming_soon === true;

  if (comingSoonConfigured) {
    return null;
  }

  if (!Array.isArray(pricing) || pricing.length === 0) {
    return null;
  }

  return (
    <section id={LANDING_PRICING_ID} className="landing-pricing-section py-20 scroll-mt-28">
      <div className="landing-pricing-content section-content">
        <div className="landing-pricing-heading text-center mb-16">
          <h2 className="landing-pricing-title section-title mx-auto mb-6 text-center">Pricing</h2>
        </div>

        <div className="landing-pricing-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {pricing.map((plan: any, index: number) => (
            <div 
              key={index} 
              className={`landing-pricing-card pricing-card ${plan.popular ? 'pricing-card-popular' : ''}`}
            >
              {plan.popular && (content.settings?.labels?.pricingBadges ?? true) && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="landing-pricing-card-badge badge badge-primary px-4 py-1.5">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="landing-pricing-card-header text-center mb-8">
                <h3 className="landing-pricing-card-title text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="landing-pricing-card-price text-4xl font-bold price-value">{plan.price}</span>
                  <span className="landing-pricing-card-period text-muted-foreground">{plan.period}</span>
                </div>
                <p className="landing-pricing-card-description text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="landing-pricing-card-features space-y-4 mb-8">
                                      {plan.features.map((feature: any, featureIndex: number) => (
                  <li key={featureIndex} className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.buttonLink ? (
                <Button asChild size="lg" variant={plan.popular ? 'default' : 'outline'} className="landing-pricing-card-cta w-full">
                  <a 
                    href={plan.buttonLink}
                    target={plan.buttonLink.startsWith('http') ? '_blank' : '_self'}
                    rel={plan.buttonLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {plan.buttonText}
                  </a>
                </Button>
              ) : (
                <Button size="lg" variant={plan.popular ? 'default' : 'outline'} className="landing-pricing-card-cta w-full">
                  {plan.buttonText}
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing; 
