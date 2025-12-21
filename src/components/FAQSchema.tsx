import React from 'react';
import { useSchema } from '@/lib/useSchema';
import FAQList from '@/components/FAQList';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
  className?: string;
  productName?: string;
}

const FAQSchema: React.FC<FAQSchemaProps> = ({ faqs, className = '', productName }) => {
  const productLabel = (productName || 'BiblioKit').trim() || 'BiblioKit';

  // Generate JSON-LD schema for FAQs
  const faqSchema = {
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
  };

  // Inject the schema
  useSchema(faqSchema, 'faq-schema');

  return (
    <div className={`faq-schema text-white ${className}`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-white/70">
            {`Quick answers to common questions about ${productLabel}`}
          </p>
        </div>

        <FAQList faqs={faqs} />
      </div>
    </div>
  );
};

export default FAQSchema; 
