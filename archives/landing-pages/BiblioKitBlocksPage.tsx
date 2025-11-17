import React, { useEffect } from 'react';
import { usePublishedContent } from '@/hooks/usePublishedContent';
import { useSchema, createProductSchema, createBreadcrumbSchema } from '@/lib/useSchema';
import { generateMetadata, updatePageMetadata } from '@/lib/seo';
import { debugService } from '@/lib/debugService';
import ProductHero from './ProductHero';
import ProductContentSections from './ProductContentSections';

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
  };
  details?: ProductDetail[];
  benefits?: string[];
  specifications?: ProductSpec[];
  testimonials?: Array<{ quote: string; author: string; role?: string; company?: string; avatarUrl?: string }>;
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
      const path = '/bibliokit-blocks';
      const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : 'https://bibliokit.com';
      const metadata = generateMetadata(path, content, baseUrl);
      updatePageMetadata(metadata);
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
    <div className="container mx-auto py-16">
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
      <ProductHero product={product as any} />
      <ProductContentSections product={product as any} faqs={faqs} />
    </>
  );
};

export default BiblioKitBlocksPage; 
