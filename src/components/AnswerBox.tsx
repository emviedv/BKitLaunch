import React from 'react';

interface AnswerBoxProps {
  content: string;
  className?: string;
}

const AnswerBox: React.FC<AnswerBoxProps> = ({ content, className = '' }) => {
  // Count words to ensure 40-70 word limit for LLM SEO optimization
  const wordCount = content.trim().split(/\s+/).length;
  const isOptimalLength = wordCount >= 40 && wordCount <= 70;

  return (
    <div className={`answer-box bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-primary p-6 rounded-lg shadow-sm mb-8 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-3">
            <svg className="w-5 h-5 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-primary uppercase tracking-wide">Quick Answer</span>
          </div>
          <p className="text-lg leading-relaxed text-gray-800 font-medium">
            {content}
          </p>
        </div>
        <div className="ml-4 text-xs text-gray-500">
          <span className={`px-2 py-1 rounded ${isOptimalLength ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {wordCount} words
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnswerBox; 