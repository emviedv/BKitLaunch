import React from 'react';
import { Button } from '@/components/ui/button';
import { usePublishedContent } from '@/hooks/usePublishedContent';

const Pricing = () => {
  const { content } = usePublishedContent();
  const { pricing } = content;
  
  // Return null if pricing section is set to hidden
  if (content.settings?.visibility?.pricing === false) {
    return null;
  }

  // Only show Coming Soon when explicitly configured; otherwise hide by default to avoid flash on SSR
  const isComingSoon = content.pricingSection?.isComingSoon === true || (content.pricingSection as any)?.is_coming_soon === true;

  if (isComingSoon) {
    return (
    <section id="pricing" className="py-20 px-4 scroll-mt-28" role="region" aria-label="Pricing coming soon">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Pricing</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Pricing information will be available soon.
            </p>
          <div className="inline-flex items-center justify-center px-6 py-3 border border-muted-foreground/20 rounded-lg bg-muted/10">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-muted-foreground font-medium">Plans in development</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // If not coming soon but pricing data is empty, hide section
  if (!Array.isArray(pricing) || pricing.length === 0) {
    return null;
  }

  return (
    <section id="pricing" className="py-20 px-4 scroll-mt-28">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Pricing</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {pricing.map((plan: any, index: number) => (
            <div 
              key={index} 
              className={`pricing-card ${plan.popular ? 'pricing-card-popular' : ''}`}
            >
              {plan.popular && (content.settings?.labels?.pricingBadges ?? true) && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="badge badge-primary px-4 py-1.5">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold price-value">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
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
                <Button asChild size="lg" variant={plan.popular ? 'default' : 'outline'} className="w-full">
                  <a 
                    href={plan.buttonLink}
                    target={plan.buttonLink.startsWith('http') ? '_blank' : '_self'}
                    rel={plan.buttonLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {plan.buttonText}
                  </a>
                </Button>
              ) : (
                <Button size="lg" variant={plan.popular ? 'default' : 'outline'} className="w-full">
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