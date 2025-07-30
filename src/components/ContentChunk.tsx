import React, { useEffect, useState } from 'react';

interface ContentChunkProps {
  children: React.ReactNode;
  maxTokens?: number;
  autoH2Break?: boolean;
  className?: string;
}

const ContentChunk: React.FC<ContentChunkProps> = ({ 
  children, 
  maxTokens = 300, 
  autoH2Break = true,
  className = '' 
}) => {
  const [tokenCount, setTokenCount] = useState(0);
  const [isOptimal, setIsOptimal] = useState(true);

  useEffect(() => {
    // Rough token estimation (1 token ≈ 4 characters)
    const content = React.Children.toArray(children).join('').toString();
    const estimatedTokens = Math.ceil(content.length / 4);
    setTokenCount(estimatedTokens);
    setIsOptimal(estimatedTokens <= maxTokens);
  }, [children, maxTokens]);

  return (
    <div className={`content-chunk ${className}`}>
      {/* Token count indicator (only shown in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="token-indicator text-xs text-gray-400 mb-2 flex items-center">
          <span className={`px-2 py-1 rounded ${isOptimal ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {tokenCount} tokens
          </span>
          {!isOptimal && (
            <span className="ml-2 text-red-600">⚠ Consider breaking this section</span>
          )}
        </div>
      )}
      
      <div className="prose prose-lg max-w-none">
        {children}
      </div>
      
      {/* Auto H2 break suggestion */}
      {autoH2Break && tokenCount > 200 && (
        <div className="h2-break-suggestion mt-8 mb-4">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default ContentChunk; 