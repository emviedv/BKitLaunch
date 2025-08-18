import React, { useEffect } from 'react';
import { usePublishedContent } from '@/hooks/usePublishedContent';
import { useSchema, createProductSchema, createBreadcrumbSchema } from '@/lib/useSchema';
import { generateMetadata, updatePageMetadata } from '@/lib/seo';
import { debugService } from '@/lib/debugService';
import AnswerBox from './AnswerBox';
import ExpertQuote from './ExpertQuote';
import StatBox from './StatBox';
import ContentChunk from './ContentChunk';
import FAQSchema from './FAQSchema';
import Waitlist from './Waitlist';
import { BlocksHeroBackground } from './BlocksHeroBackground';
import AnimatedGradientBackground from '@/components/ui/animated-gradient-background';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

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
  const { content, loading } = usePublishedContent();
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    debugService.info('DynamicProductPage mounted', {
      slug,
      timestamp: new Date().toISOString()
    });
  }, [slug]);

  const product: ProductInfo | undefined = content.products?.[slug];

  useEffect(() => {
    try {
      const keys = Object.keys((content as any)?.products || {});
      console.log('DynamicProductPage content.products keys:', keys);
    } catch {}
  }, [content]);

  useEffect(() => {
    if (product) {
      const path = `/${slug}`;
      const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : 'https://bibliokit.com';
      const metadata = generateMetadata(path, content, baseUrl);
      updatePageMetadata(metadata);
    }
  }, [product, slug, content]);

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
    if (loading) {
      return (
        <div className="container mx-auto px-4 py-20">
          <div className="animate-pulse space-y-6 max-w-3xl mx-auto">
            <div className="h-6 bg-gray-200 rounded w-40" />
            <div className="h-10 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-11/12" />
            <div className="h-10 bg-gray-200 rounded w-48" />
          </div>
        </div>
      );
    }
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
      <section className="section-hero relative overflow-hidden py-28 md:py-32 px-4 min-h-screen flex items-center">
        <BlocksHeroBackground
          emoji={product?.emoji}
          emojiY={(isAuthenticated && isAdmin) ? 160 : 110}
          minEmojiViewportTop={(isAuthenticated && isAdmin) ? 96 : 0}
        />
        <AnimatedGradientBackground
          Breathing
          startingGap={118}
          topOffset={-20}
          gradientColors={((product as any)?.gradientColors && Array.isArray((product as any).gradientColors) && (product as any).gradientColors.length > 0) ? (product as any).gradientColors : ["#ecfeff00","#ecfeff10","#c7d2fe40","#a7f3d040","#a5b4fc50","#93c5fd40","#ffffff00"]}
          gradientStops={[18, 44, 58, 70, 82, 90, 100]}
          containerClassName="pointer-events-none"
        />
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            {product?.badgeLabel && (
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-primary/20 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
                <span className="inline-flex h-2 w-2 rounded-full bg-primary" />
                <span className="text-sm font-medium text-gray-800">{product.badgeLabel}</span>
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
                <Button asChild size="lg" className="w-full sm:w-auto min-w-[12rem]">
                  <a
                    href={product.primaryButtonLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {product.primaryButton || 'Get Started'}
                  </a>
                </Button>
              ) : (
                <Button size="lg" className="w-full sm:w-auto min-w-[12rem]">{product.primaryButton || 'Get Started'}</Button>
              )}
              {product.secondaryButtonLink ? (
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto min-w-[12rem]">
                  <a
                    href={product.secondaryButtonLink}
                    className="inline-block text-center"
                    target={product.secondaryButtonLink.startsWith('http') ? '_blank' : '_self'}
                    rel={product.secondaryButtonLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {product.secondaryButton || 'Learn More'}
                  </a>
                </Button>
              ) : (
                <Button size="lg" variant="outline" className="w-full sm:w-auto min-w-[12rem]">{product.secondaryButton || 'Learn More'}</Button>
              )}
            </div>
          </div>
        </div>
      </section>



      {product.details && (
        <section className="py-20 px-4 section-background">
          <div className="container mx-auto">
            <ContentChunk>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{(product as any)?.sections?.features?.title || '⚡ Key Features'}</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  {(product as any)?.sections?.features?.description || 'Comprehensive design system analytics platform with automated Figma integration and ROI tracking'}
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{(product as any)?.sections?.useCases?.title || '💡 Use Cases'}</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {(product as any)?.sections?.useCases?.description || 'Perfect for product teams seeking data-driven design system optimization and ROI measurement'}
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
                <h2 className="text-3xl md:text-4xl font-bold mb-6">{(product as any)?.sections?.specifications?.title || 'Technical Capabilities'}</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  {(product as any)?.sections?.specifications?.description || 'Built with powerful features for professional design workflows'}
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


