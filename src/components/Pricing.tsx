import React from 'react';
import { usePublishedContent } from '@/hooks/usePublishedContent';

const Pricing = () => {
  const { content } = usePublishedContent();
  const { pricing } = content;
  
  // Return null if pricing section is set to hidden
  if (content.settings?.visibility?.pricing === false) {
    return null;
  }

  return (
    <section id="pricing" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your needs. Start free and scale as you grow.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {pricing.map((plan: any, index: number) => (
            <div 
              key={index} 
              className={`pricing-card ${plan.popular ? 'popular' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                                      {plan.features.map((feature: any, featureIndex: number) => (
                  <li key={featureIndex} className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                      <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.buttonLink ? (
                <a 
                  href={plan.buttonLink}
                  className={`w-full inline-block text-center ${
                    plan.popular
                      ? 'btn-primary'
                      : 'btn-secondary'
                  }`}
                  target={plan.buttonLink.startsWith('http') ? '_blank' : '_self'}
                  rel={plan.buttonLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {plan.buttonText}
                </a>
              ) : (
                <button 
                  className={`w-full ${
                    plan.popular
                      ? 'btn-primary'
                      : 'btn-secondary'
                  }`}
                >
                  {plan.buttonText}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing; 