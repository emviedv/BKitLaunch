import React from 'react';

interface ExpertQuoteProps {
  quote: string;
  expertName: string;
  expertTitle: string;
  institution: string;
  className?: string;
}

const ExpertQuote: React.FC<ExpertQuoteProps> = ({ 
  quote, 
  expertName, 
  expertTitle, 
  institution, 
  className = '' 
}) => {
  return (
    <div className={`expert-quote bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-4">
          <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z" />
          </svg>
        </div>
        <div className="flex-1">
          <blockquote className="text-lg text-gray-800 italic mb-4 leading-relaxed">
            "{quote}"
          </blockquote>
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
              {expertName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <div className="font-semibold text-gray-900">{expertName}</div>
              <div className="text-gray-600">{expertTitle}</div>
              <div className="text-gray-500 text-xs">{institution}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertQuote; 