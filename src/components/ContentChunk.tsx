import React, { useEffect, useState } from 'react';

interface ContentChunkProps {
  children: React.ReactNode;
  autoH2Break?: boolean;
  className?: string;
}

const ContentChunk: React.FC<ContentChunkProps> = ({ 
  children, 
  autoH2Break = true,
  className = '' 
}) => {
  const [tokenCount, setTokenCount] = useState(0);

  useEffect(() => {
    // Rough token estimation (1 token ≈ 4 characters)
    const content = React.Children.toArray(children).join('').toString();
    const estimatedTokens = Math.ceil(content.length / 4);
    setTokenCount(estimatedTokens);
  }, [children]);

  return (
    <div className={`content-chunk ${className}`}>
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