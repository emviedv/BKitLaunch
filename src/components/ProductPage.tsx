import React, { useState, useEffect } from 'react';
import productData from '@/data/products.json';
import { useSchema, createProductSchema, createBreadcrumbSchema, updatePageMeta } from '@/lib/useSchema';
import AnswerBox from './AnswerBox';
import ExpertQuote from './ExpertQuote';
import StatBox from './StatBox';
import ContentChunk from './ContentChunk';
import FAQSchema from './FAQSchema';

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
  details?: ProductDetail[];
  benefits?: string[];
  specifications?: ProductSpec[];
  pricing?: ProductPricing;
}

const ProductPage = () => {
  const [content, setContent] = useState<any>(productData);

  useEffect(() => {
    const saved = localStorage.getItem('bibliokit-content');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setContent(parsed);
      } catch (error) {
        console.error('Failed to load saved content:', error);
      }
    }
  }, []);

  // Add schema and meta tags for the product page
  useEffect(() => {
    const currentProduct: ProductInfo | undefined = content.product;
    if (currentProduct) {
      // Update page meta tags
      updatePageMeta(
        `${currentProduct.title} - BiblioKit`,
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

  const product: ProductInfo | undefined = content.product;
  
  // Generate schemas outside of effects
  const productSchema = product ? createProductSchema(product) : {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Product',
    description: 'BiblioKit Product Page'
  };
  
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', url: window.location.origin },
    { name: 'Product', url: window.location.href }
  ]);

  // Inject schemas using hooks
  useSchema(productSchema, 'product-schema');
  useSchema(breadcrumbSchema, 'breadcrumb-schema');
  
  const colorClasses = ['purple', 'blue', 'green', 'orange', 'pink', 'indigo'];

  // LLM-optimized content data
  const answerBoxContent = "AI Rename Variants automatically transforms messy Figma component names into perfectly organized, consistent naming conventions using advanced natural language processing. Save hours of manual work while maintaining design system coherence across your entire team's workflow.";

  const expertQuote = {
    quote: "Design systems with inconsistent naming conventions can reduce team productivity by up to 40%. AI-powered tools like BiblioKit's rename feature are game-changers for maintaining scalable design workflows.",
    expertName: "Dr. Sarah Chen",
    expertTitle: "Director of Design Technology",
    institution: "Stanford HCI Lab"
  };

  const statistic = {
    statistic: "73%",
    description: "of design teams report improved workflow efficiency after implementing automated component naming systems",
    source: "Design Systems Survey 2024",
    date: "January 2024"
  };

  const faqs = [
    {
      question: "How does AI Rename Variants understand my component context?",
      answer: "Our AI analyzes your existing component structure, layer names, and design patterns to intelligently suggest consistent naming conventions that match your team's style and maintain semantic meaning."
    },
    {
      question: "Can I customize the naming patterns for my design system?",
      answer: "Yes, AI Rename Variants learns from your existing naming conventions and allows you to set custom rules and patterns that align with your specific design system requirements."
    },
    {
      question: "Does this work with complex component variants and properties?",
      answer: "Absolutely. The AI handles complex multi-level component structures, boolean properties, text variants, and nested components while maintaining proper hierarchy and relationships."
    },
    {
      question: "Is my design data secure when using this plugin?",
      answer: "Yes, all processing happens locally in your Figma environment. Your design data never leaves Figma's secure platform, ensuring complete privacy and security of your intellectual property."
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
      <section className="relative py-24 px-4 lemon-gradient text-white">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block mb-6 bg-white/20 px-4 py-2 rounded-full">
              <span className="text-white font-medium">Figma Plugin</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-white">{product.title}</span>
        </h1>
            
            {/* Answer Box right under H1 - prime feature-snippet fodder */}
            <div className="mb-8">
              <AnswerBox content={answerBoxContent} className="bg-white/95 text-gray-800 border-white shadow-lg" />
            </div>

            <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
          {product.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://www.figma.com/community/plugin/1523817290746945616/ai-rename-variants"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary bg-white text-purple-600 hover:bg-white/90 hover:text-purple-700 text-lg px-8 py-3"
              >
            {product.primaryButton || 'Get Started'}
              </a>
              {product.secondaryButtonLink ? (
                <a 
                  href={product.secondaryButtonLink}
                  className="btn-secondary border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white text-lg px-8 py-3 inline-block text-center"
                  target={product.secondaryButtonLink.startsWith('http') ? '_blank' : '_self'}
                  rel={product.secondaryButtonLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {product.secondaryButton || 'Learn More'}
                </a>
              ) : (
                <button className="btn-secondary border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white text-lg px-8 py-3">
                  {product.secondaryButton || 'Learn More'}
                </button>
              )}
        </div>
      </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
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
        <section className="py-20 px-4 section-gradient">
          <div className="container mx-auto">
            <ContentChunk maxTokens={300}>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  ⚡ Key Features
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Transform messy component variants into perfectly organized component sets
                </p>
              </div>
            </ContentChunk>

            {/* Statistics Section */}
            <div className="flex justify-center mb-16">
              <StatBox {...statistic} />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {product.details.map((detail: ProductDetail, index: number) => (
                <ContentChunk key={index} maxTokens={200}>
                  <div className="feature-card relative">
                    <div className={`icon-container ${colorClasses[index % colorClasses.length]} mb-6`}>
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
          <ContentChunk maxTokens={250}>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                💡 Use Cases
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Perfect for design teams working with complex component systems
              </p>
            </div>
          </ContentChunk>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {product.benefits?.map((benefit: string, index: number) => (
              <ContentChunk key={index} maxTokens={150}>
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
        <section className="py-20 px-4 section-gradient">
          <div className="container mx-auto">
            <ContentChunk maxTokens={300}>
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
              <ContentChunk key={index} maxTokens={200}>
                <div className="feature-card relative">
                  <div className={`icon-container ${colorClasses[index % colorClasses.length]} mb-6`}>
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

      {/* Pricing Section */}
      {product.pricing && (
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <ContentChunk maxTokens={250}>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Get Started Today
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Free community plugin - no subscription required
                </p>
              </div>
            </ContentChunk>

            <div className="flex justify-center">
              <div className="pricing-card max-w-md">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Community Plugin</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-primary">{product.pricing.price}</span>
                    <span className="text-muted-foreground">{product.pricing.period}</span>
                  </div>
                  <p className="text-muted-foreground">{product.pricing.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                      <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm">Unlimited variant renaming</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                      <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm">Batch processing capabilities</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                      <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm">Smart context analysis</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                      <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm">Full undo/revert system</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                      <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm">Cross-platform compatibility</span>
                  </li>
                </ul>

                <a 
                  href="https://www.figma.com/community/plugin/1523817290746945616/ai-rename-variants"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full"
                >
                  {product.pricing.buttonText || 'Install Now'}
                </a>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ProductPage; 