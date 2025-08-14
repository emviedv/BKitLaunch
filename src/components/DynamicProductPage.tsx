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
import { HeroBackground } from './HeroBackground';

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
  emoji?: string;
  title: string;
  description: string;
  primaryButton?: string;
  primaryButtonLink?: string;
  secondaryButton?: string;
  secondaryButtonLink?: string;
  badgeLabel?: string;
  llm?: {
    answerBox?: string;
    faqs?: Array<{ question: string; answer: string }>;
    expertQuote?: {
      quote?: string;
      expertName?: string;
      expertTitle?: string;
      institution?: string;
    };
    statistic?: {
      statistic?: string;
      description?: string;
      source?: string;
      date?: string;
    };
  };
  details?: ProductDetail[];
  benefits?: string[];
  specifications?: ProductSpec[];
  pricing?: ProductPricing;
  visibility?: { waitlist?: boolean };
}

type DynamicProductPageProps = {
  slug: string;
};

const DynamicProductPage: React.FC<DynamicProductPageProps> = ({ slug }) => {
  const { content } = usePublishedContent();

  useEffect(() => {
    debugService.info('DynamicProductPage mounted', {
      slug,
      timestamp: new Date().toISOString()
    });
  }, [slug]);

  const product: ProductInfo | undefined = content.products?.[slug];

  useEffect(() => {
    if (product) {
      updatePageMeta(`${product.title} | BiblioKit`, product.description);
    }
  }, [product]);

  const productSchema = product
    ? createProductSchema(product)
    : {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Product',
        description: 'BiblioKit Product Page',
      };

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://bibliokit.com';
  const href = typeof window !== 'undefined' ? window.location.href : `${origin}/${slug}`;
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', url: origin },
    { name: 'Product', url: href },
  ]);

  useSchema(productSchema, `product-schema-${slug}`);
  useSchema(breadcrumbSchema, `breadcrumb-schema-${slug}`);

  const colorClasses = ['icon-purple', 'icon-blue', 'icon-green', 'icon-orange', 'icon-pink', 'icon-indigo'];

  const fallbackAnswerBox =
    'BiblioKit provides professional-grade software and plugins designed to help teams ship faster with best-in-class UX.';

  const answerBoxContent = product?.llm?.answerBox || fallbackAnswerBox;

  const expertQuote = {
    quote: product?.llm?.expertQuote?.quote || 'High-quality design systems drive faster delivery and better UX outcomes.',
    expertName: product?.llm?.expertQuote?.expertName || 'Design Ops Team',
    expertTitle: product?.llm?.expertQuote?.expertTitle || 'Best Practices',
    institution: product?.llm?.expertQuote?.institution || 'BiblioKit',
  };

  const statistic = {
    statistic: product?.llm?.statistic?.statistic || '90%',
    description: product?.llm?.statistic?.description || 'of teams ship features faster with a strong design system',
    source: product?.llm?.statistic?.source || 'Internal study',
    date: product?.llm?.statistic?.date || '2024',
  };

  const faqs =
    product?.llm?.faqs || [
      {
        question: 'What is this product?',
        answer:
          'A professional tool crafted by BiblioKit to improve design system workflows and accelerate delivery.',
      },
      {
        question: 'How do I get started?',
        answer: 'Use the primary call-to-action to try the product or contact us for a demo.',
      },
    ];

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground">We couldn’t find this product. Check the URL or pick another page.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="section-hero relative overflow-hidden py-24 px-4 min-h-[calc(100vh-60px)] flex items-center">
        <HeroBackground />
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            {product?.badgeLabel && (
              <div className="inline-block mb-6 bg-primary/10 px-4 py-2 rounded-full">
                <span className="text-primary font-medium">{product.badgeLabel}</span>
              </div>
            )}
            {product.emoji && (
              <div className="mb-4">
                <span role="img" aria-label="product emoji" className="text-5xl md:text-6xl">
                  {product.emoji}
                </span>
              </div>
            )}
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-gray-900">{product.title}</span>
            </h1>
            <div className="mb-8">
              <AnswerBox content={answerBoxContent} className="bg-white/95 text-gray-800 border-gray-200 shadow-lg" />
            </div>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">{product.description}</p>
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
                <button className="button text-lg px-8 py-3">{product.primaryButton || 'Get Started'}</button>
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
                <button className="button-secondary text-lg px-8 py-3">{product.secondaryButton || 'Learn More'}</button>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="text-center py-4 text-sm text-muted-foreground bg-gray-50">
        <span className="updated-date">Updated {new Date().toISOString().split('T')[0]}</span>
      </div>

      {product.details && (
        <section className="py-20 px-4 section-background">
          <div className="container mx-auto">
            <ContentChunk>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">⚡ Key Features</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Comprehensive analytics with automated integrations and ROI tracking
                </p>
              </div>
            </ContentChunk>

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
                    <p className="text-muted-foreground">{detail.description}</p>
                  </div>
                </ContentChunk>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <ContentChunk>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">💡 Use Cases</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Built for product teams seeking data-driven optimization and better outcomes
              </p>
            </div>
          </ContentChunk>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {(product.benefits || []).map((benefit: string, index: number) => (
              <ContentChunk key={index}>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-lg">{benefit}</span>
                </div>
              </ContentChunk>
            ))}
          </div>
        </div>
      </section>

      {product.specifications && (
        <section className="py-20 px-4 section-background">
          <div className="container mx-auto">
            <ContentChunk>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Technical Capabilities</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Built with powerful features for professional workflows
                </p>
              </div>
            </ContentChunk>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {product.specifications.map((spec: ProductSpec, index: number) => (
                <ContentChunk key={index}>
                  <div className="card relative">
                    <div className={`icon ${colorClasses[index % colorClasses.length]} mb-6`}>{spec.icon}</div>
                    <h3 className="text-xl font-semibold mb-3">{spec.name}</h3>
                    <p className="text-muted-foreground">{spec.value}</p>
                  </div>
                </ContentChunk>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <FAQSchema faqs={faqs} />
        </div>
      </section>

      <Waitlist visibleOverride={product?.visibility?.waitlist} />
    </>
  );
};

export default DynamicProductPage;


