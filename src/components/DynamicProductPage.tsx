import React, { useEffect, useMemo } from 'react';
import { usePublishedContent } from '@/hooks/usePublishedContent';
import { generateMetadata, updatePageMetadata } from '@/lib/seo';
import { debugService } from '@/lib/debugService';
import ProductContentSections from './ProductContentSections';
import ProductHero from './ProductHero';
import productData from '@/data/products.json' with { type: 'json' };

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
  subtitle?: string;
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
  testimonials?: Array<{ quote: string; author: string; role?: string; company?: string; avatarUrl?: string }>;
  pricing?: ProductPricing;
  visibility?: { waitlist?: boolean };
}

type DynamicProductPageProps = {
  slug: string;
};

const DynamicProductPage: React.FC<DynamicProductPageProps> = ({ slug }) => {
  const { content, loading } = usePublishedContent();

  const fallbackProduct = useMemo(() => {
    try {
      return (productData as any)?.products?.[slug];
    } catch {
      return undefined;
    }
  }, [slug]);

  const effectiveContent = useMemo(() => {
    if (!content) {
      return content;
    }
    const hasPublishedProduct = Boolean((content as any)?.products?.[slug]);
    if (hasPublishedProduct || !fallbackProduct) {
      return content;
    }
    return {
      ...content,
      products: {
        ...(content.products ?? {}),
        [slug]: fallbackProduct
      }
    };
  }, [content, fallbackProduct, slug]);

  useEffect(() => {
    if (!content) return;
    const hasPublishedProduct = Boolean((content as any)?.products?.[slug]);
    if (!hasPublishedProduct && fallbackProduct) {
      debugService.warn('DynamicProductPage using static fallback product data', { slug });
    }
  }, [content, fallbackProduct, slug]);

  useEffect(() => {
    debugService.info('DynamicProductPage mounted', {
      slug,
      timestamp: new Date().toISOString()
    });
  }, [slug]);

  const product: ProductInfo | undefined = (effectiveContent as any)?.products?.[slug];

  useEffect(() => {
    try {
      const keys = Object.keys((effectiveContent as any)?.products || {});
      console.log('DynamicProductPage content.products keys:', keys);
    } catch {}
  }, [effectiveContent]);

  useEffect(() => {
    // Debug: Which optional sections will render
    try {
      debugService.info('DynamicProductPage sections visibility', {
        hasFaqs: Array.isArray((product as any)?.faqs) && (((product as any)?.faqs?.length) || 0) > 0,
        hasDetails: Array.isArray(product?.details) && (product?.details?.length || 0) > 0,
        hasSpecifications: Array.isArray(product?.specifications) && (product?.specifications?.length || 0) > 0,
      });
    } catch {}
  }, [product]);

  useEffect(() => {
    if (product) {
      const path = `/${slug}`;
      const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : 'https://www.bibliokit.com';
      const metadata = generateMetadata(path, effectiveContent, baseUrl);
      updatePageMetadata(metadata);
    }
  }, [product, slug, effectiveContent]);

  const colorClasses = ['icon-purple', 'icon-blue', 'icon-green', 'icon-orange', 'icon-pink', 'icon-indigo'];

  const faqs =
    (product as any)?.faqs || [
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
        <div className="container mx-auto py-20">
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
      <div className="container mx-auto py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground">We couldn’t find this product. Check the URL or pick another page.</p>
        </div>
      </div>
    );
  }

  const isUXBiblio = slug === 'uxbiblio';

  const heroProps = isUXBiblio
    ? {
        headlineColorOverride: 'text-white',
        withBottomPadding: false,
        containerPaddingOverride: 'px-0 md:px-0',
      }
    : {
        withBottomPadding: false,
        containerPaddingOverride: 'px-0 md:px-0',
      };

  return (
    <>
      <ProductHero
        product={product as any}
        {...heroProps}
      />
      <ProductContentSections product={product} faqs={faqs} />
    </>
  );
};

export default DynamicProductPage;
