import React, { useEffect } from 'react';
import { usePublishedContent } from '@/hooks/usePublishedContent';
import { useSchema, createProductSchema, createBreadcrumbSchema, updatePageMeta } from '@/lib/useSchema';
import { debugService } from '@/lib/debugService';
import AnswerBox from './AnswerBox';
import ExpertQuote from './ExpertQuote';
import StatBox from './StatBox';
import ContentChunk from './ContentChunk';
import FAQSchema from './FAQSchema';
import Waitlist from './Waitlist';

interface ProductDetail {
  title: string;
  description: string;
}

interface ProductSpec {
  icon: string;
  name: string;
  value: string;
}

interface ProductPricing {
  price: string;
  period: string;
  description: string;
  buttonText?: string;
}

interface ProductInfo {
  title: string;
  description: string;
  primaryButton?: string;
  primaryButtonLink?: string;
  secondaryButton?: string;
  secondaryButtonLink?: string;
  badgeLabel?: string;
  llm?: {
    answerBox?: string;
  };
  details?: ProductDetail[];
  benefits?: string[];
  specifications?: ProductSpec[];
  pricing?: ProductPricing;
}

const BiblioKitBlocksPage = () => {
  const { content } = usePublishedContent();

  // Debug service for detailed logging
  debugService.info('BiblioKitBlocksPage mounted', { 
    timestamp: new Date().toISOString() 
  });

  useEffect(() => {
    debugService.info('BiblioKit Blocks: Content loaded', {
      source: 'usePublishedContent',
    });
  }, []);

  // Add schema and meta tags for the product page
  useEffect(() => {
    const currentProduct: ProductInfo | undefined =
      content.products?.['bibliokit-blocks'] || content.product;
    if (currentProduct) {
      // Update page meta tags
      updatePageMeta(
        `${currentProduct.title} - Design System Analytics | BiblioKit`,
        currentProduct.description
      );
      
      // Add timestamp to content
      const currentDate = new Date().toISOString().split('T')[0];
      const updatedDiv = document.querySelector('.updated-date');
      if (updatedDiv) {
        updatedDiv.textContent = `Updated ${currentDate}`;
      }
    }
  }, [content]);

  const product: ProductInfo | undefined =
    content.products?.['bibliokit-blocks'] || content.product;
  
  // Debug: Log what content is actually being displayed
  useEffect(() => {
    console.log('🔍 BiblioKit Blocks Debug:', {
      productTitle: product?.title,
      productDescription: product?.description,
    });
  }, [product]);
  
  // Generate schemas outside of effects
  const productSchema = product ? createProductSchema(product) : {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Product',
    description: 'BiblioKit Product Page'
  };
  
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://bibliokit.com';
  const href = typeof window !== 'undefined' ? window.location.href : 'https://bibliokit.com/bibliokit-blocks';
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', url: origin },
    { name: 'Product', url: href }
  ]);

  // Inject schemas using hooks
  useSchema(productSchema, 'product-schema');
  useSchema(breadcrumbSchema, 'breadcrumb-schema');
  
  const colorClasses = ['icon-purple', 'icon-blue', 'icon-green', 'icon-orange', 'icon-pink', 'icon-indigo'];

  // LLM-optimized content data
  const answerBoxContent =
    product?.llm?.answerBox ||
    "BiblioKit Blocks provides comprehensive design system analytics that automatically tracks Figma component usage, measures ROI, and delivers actionable insights to optimize component libraries. Increase adoption rates by 25%+ and reduce maintenance overhead through data-driven decision making for product teams.";

  const expertQuote = {
    quote: "66.7% of organizations do not measure the ROI of their design system.",
    expertName: "Romina Kavcic",
    expertTitle: "Design System Researcher",
    institution: "The Design System Guide"
  };  

  const statistic = {
    statistic: "85%",
    description: "of product teams achieve higher component reuse rates when using design system analytics platforms",
    source: "Product Team Analytics Report 2024",
    date: "February 2024"
  };

  const faqs = [
    {
      question: "How does BiblioKit Blocks track component usage across my design files?",
      answer: "BiblioKit Blocks connects to your Figma account via secure OAuth and automatically scans your design libraries and files to track component instances, usage frequency, and adoption patterns in real-time without manual setup."
    },
    {
      question: "Can I measure the ROI of my design system investment?",
      answer: "Yes, BiblioKit Blocks provides comprehensive ROI reporting with quantifiable metrics including time savings, efficiency gains, component reuse rates, and productivity improvements that demonstrate clear business value to stakeholders."
    },
    {
      question: "What kind of analytics insights will I get about my components?",
      answer: "You'll receive detailed analytics on component usage trends, adoption rates, over-used vs. under-used components, team collaboration patterns, and actionable recommendations for optimizing your design system performance."
    },
    {
      question: "Is my Figma data secure with BiblioKit Blocks?",
      answer: "Absolutely. We use enterprise-grade security with SOC 2 compliance, encrypted data transmission, and secure OAuth integration. Your design data is protected with the same security standards used by Fortune 500 companies."
    },
    {
      question: "How quickly can I see results after connecting my Figma account?",
      answer: "Initial analytics appear within 24 hours of connecting your account. The platform continuously syncs with your Figma files to provide real-time insights and updated reports as your design system evolves."
    }
  ];

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Product Information</h1>
          <p className="text-muted-foreground">
            Product details will appear here once you add them to the content.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section - matches home page styling */}
      <section className="section-hero py-24 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            {product?.badgeLabel && (
              <div className="inline-block mb-6 bg-primary/10 px-4 py-2 rounded-full">
                <span className="text-primary font-medium">{product.badgeLabel}</span>
              </div>
            )}
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-gray-900">{product.title}</span>
        </h1>
            
            {/* Answer Box right under H1 - prime feature-snippet fodder */}
            <div className="mb-8">
              <AnswerBox content={answerBoxContent} className="bg-white/95 text-gray-800 border-gray-200 shadow-lg" />
            </div>

            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
          {product.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {product.primaryButtonLink ? (
                <a 
                  href={product.primaryButtonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button text-lg px-8 py-3"
                >
                  {product.primaryButton || 'Get Started'}
                </a>
              ) : (
                <button className="button text-lg px-8 py-3">
                  {product.primaryButton || 'Get Started'}
                </button>
              )}
              {product.secondaryButtonLink ? (
                <a 
                  href={product.secondaryButtonLink}
                  className="button-secondary text-lg px-8 py-3 inline-block text-center"
                  target={product.secondaryButtonLink.startsWith('http') ? '_blank' : '_self'}
                  rel={product.secondaryButtonLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {product.secondaryButton || 'Learn More'}
                </a>
              ) : (
                <button className="button-secondary text-lg px-8 py-3">
                  {product.secondaryButton || 'Learn More'}
                </button>
              )}
        </div>
      </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
      </section>

      {/* Updated timestamp for AI crawlers */}
      <div className="text-center py-4 text-sm text-muted-foreground bg-gray-50">
        <span className="updated-date">Updated {new Date().toISOString().split('T')[0]}</span>
      </div>

      {/* Expert Quote Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <ExpertQuote {...expertQuote} />
        </div>
      </section>

      {/* Key Features Section */}
      {product.details && (
        <section className="py-20 px-4 section-background">
          <div className="container mx-auto">
            <ContentChunk>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  ⚡ Key Features
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Comprehensive design system analytics platform with automated Figma integration and ROI tracking
                </p>
              </div>
            </ContentChunk>

            {/* Statistics Section */}
            <div className="flex justify-center mb-16">
              <StatBox {...statistic} />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {product.details.map((detail: ProductDetail, index: number) => (
                <ContentChunk key={index}>
                  <div className="card relative">
                    <div className={`icon ${colorClasses[index % colorClasses.length]} mb-6`}>
                      {['⚡', '🧠', '↩️', '🔍', '🌐'][index] || '✨'}
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{detail.title}</h3>
                    <p className="text-muted-foreground">
                      {detail.description}
                    </p>
                  </div>
                </ContentChunk>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Use Cases Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <ContentChunk>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                💡 Use Cases
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Perfect for product teams seeking data-driven design system optimization and ROI measurement
              </p>
            </div>
          </ContentChunk>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {product.benefits?.map((benefit: string, index: number) => (
              <ContentChunk key={index}>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  <span className="text-lg">{benefit}</span>
                </div>
              </ContentChunk>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      {product.specifications && (
        <section className="py-20 px-4 section-background">
          <div className="container mx-auto">
            <ContentChunk>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Technical Capabilities
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Built with powerful features for professional design workflows
                </p>
              </div>
            </ContentChunk>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {product.specifications.map((spec: ProductSpec, index: number) => (
              <ContentChunk key={index}>
                <div className="card relative">
                  <div className={`icon ${colorClasses[index % colorClasses.length]} mb-6`}>
                    {spec.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{spec.name}</h3>
                  <p className="text-muted-foreground">
                    {spec.value}
                  </p>
              </div>
              </ContentChunk>
            ))}
          </div>
        </div>
        </section>
      )}

      {/* FAQ Section with Schema */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <FAQSchema faqs={faqs} />
        </div>
      </section>

      {/* Waitlist Section */}
      <Waitlist visibleOverride={(product as any)?.visibility?.waitlist} />

      
    </>
  );
};

export default BiblioKitBlocksPage; 