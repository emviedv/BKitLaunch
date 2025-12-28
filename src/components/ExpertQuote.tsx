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
    <div className={`expert-quote rounded-3xl border border-white/10 bg-[#070213]/80 p-8 shadow-[0_40px_120px_rgba(3,0,12,0.6)] text-white ${className}`}>
      <div className="flex items-start gap-6">
        <div className="flex-shrink-0">
          <svg className="w-8 h-8 text-white/40" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z" />
          </svg>
        </div>
        <div className="flex-1">
      <p className="text-xl md:text-3xl font-serif italic text-white leading-tight">
        &ldquo;{quote}&rdquo;
      </p>
          <div className="flex items-center text-sm text-white/70">
            <div className="w-12 h-12 bg-gradient-to-br from-[#f871a0] via-[#b970ff] to-[#5bceff] rounded-full flex items-center justify-center text-white font-semibold mr-4">
              {expertName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <div className="font-semibold text-white">{expertName}</div>
              <div className="text-white/70">{expertTitle}</div>
              <div className="text-white/50 text-xs">{institution}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertQuote; 
