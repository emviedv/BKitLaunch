import { useEffect } from 'react';

export interface SchemaData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

export function useSchema(schema: SchemaData | SchemaData[], elementId?: string) {
  useEffect(() => {
    const id = elementId || `schema-${Date.now()}`;
    
    // Remove existing schema with this ID
    const existing = document.getElementById(id);
    if (existing) {
      existing.remove();
    }

    // Create new script element
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.textContent = JSON.stringify(schema, null, 2);
    
    // Add to head
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const element = document.getElementById(id);
      if (element) {
        element.remove();
      }
    };
  }, [schema, elementId]);
}

// Schema generators for different page types
export const createProductSchema = (productData: any) => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.bibliokit.com';
  const rawImage = productData?.image || productData?.ogImage || productData?.heroImage;
  const normalizedImage = typeof rawImage === 'string' && rawImage.trim().length > 0
    ? (rawImage.startsWith('http') ? rawImage : `${baseUrl}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`)
    : `${baseUrl}/og/og-default.svg`;

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: productData.title,
    description: productData.description,
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Web Browser, Figma',
    softwareVersion: '1.0',
    dateModified: new Date().toISOString().split('T')[0],
    image: normalizedImage,
    author: {
      '@type': 'Organization',
      name: 'BiblioKit'
    },
    featureList: productData.details?.map((detail: any) => detail.title) || [],
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    }
  };
};

export const createArticleSchema = (title: string, description: string, dateModified?: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: title,
  description: description,
  dateModified: dateModified || new Date().toISOString().split('T')[0],
  datePublished: '2024-01-01',
  author: {
    '@type': 'Organization',
    name: 'BiblioKit'
  },
  publisher: {
    '@type': 'Organization',
    name: 'BiblioKit',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.bibliokit.com/logo.svg'
      }
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': window.location.href
  }
});

export const createBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url
  }))
});

export const createFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }))
});
