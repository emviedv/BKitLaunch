import React from 'react';
import { renderTextWithLinks } from '@/lib/renderTextWithLinks';

export interface FAQListItem {
  question: string;
  answer: string;
}

interface FAQListProps {
  faqs: FAQListItem[];
  className?: string;
}

const FAQList: React.FC<FAQListProps> = ({ faqs, className = '' }) => (
  <div className={className}>
    <div className="divide-y divide-white/10">
      {faqs.map((faq, index) => {
        const questionNumber = (index + 1).toString().padStart(2, '0');
        return (
          <div key={`faq-${index}`} className="py-4 first:pt-0 last:pb-0">
            <div className="flex items-start gap-3">
              <span
                className="mt-0.5 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#ff2f87] text-sm font-bold text-white"
                aria-hidden="true"
              >
                {questionNumber}
              </span>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                <p className="text-base leading-relaxed text-white/75">
                  {renderTextWithLinks(faq.answer)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default FAQList;
