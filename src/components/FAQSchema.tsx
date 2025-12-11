import React from 'react';
import { useSchema } from '@/lib/useSchema';

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

        <div className="space-y-6">
          {faqs.map((faq, index) => {
            const questionNumber = (index + 1).toString().padStart(2, '0');
            return (
              <div key={index} className="faq-item bg-[#070213]/80 border border-white/10 rounded-2xl p-6 shadow-[0_30px_80px_rgba(3,0,12,0.45)]">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-start">
                  <span
                    className="w-8 h-8 rounded-full bg-[#ff2f87] text-white flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  >
                    {questionNumber}
                  </span>
                  {faq.question}
                </h3>
                <div className="ml-11">
                  <div className="flex items-start mb-2">
                    <span className="w-6 h-6 bg-white/10 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                      A
                    </span>
                    <p className="text-white/75 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FAQSchema; 
