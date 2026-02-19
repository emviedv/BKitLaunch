import React from 'react';
import { renderTextWithLinks } from '@/lib/renderTextWithLinks';

export interface FAQListItem {
  question: string;
  answer: string;
}

interface FAQListProps {
  faqs: FAQListItem[];
  className?: string;
  variant?: 'dark' | 'light';
}

const FAQList: React.FC<FAQListProps> = ({ faqs, className = '', variant = 'dark' }) => {
  const isDark = variant === 'dark';
  const dividerClass = isDark ? 'divide-white/10' : 'divide-slate-200';
  const questionClass = isDark ? 'text-white' : 'text-slate-900';
  const answerClass = isDark ? 'text-white/75' : 'text-slate-600';

  return (
    <div className={className}>
      <div className={`divide-y ${dividerClass}`}>
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
                  <h3 className={`text-lg font-semibold ${questionClass}`}>{faq.question}</h3>
                  <p className={`text-base leading-relaxed ${answerClass}`}>
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
};

export default FAQList;
