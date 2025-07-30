import React from 'react';

interface StatBoxProps {
  statistic: string;
  description: string;
  source: string;
  date: string;
  className?: string;
}

const StatBox: React.FC<StatBoxProps> = ({ 
  statistic, 
  description, 
  source, 
  date, 
  className = '' 
}) => {
  return (
    <div className={`stat-box bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 text-center shadow-sm mb-6 ${className}`}>
      <div className="flex items-center justify-center mb-3">
        <svg className="w-6 h-6 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="text-sm font-medium text-green-700 uppercase tracking-wide">Key Statistic</span>
      </div>
      
      <div className="text-4xl font-bold text-green-800 mb-2">
        {statistic}
      </div>
      
      <p className="text-gray-700 mb-4 leading-relaxed">
        {description}
      </p>
      
      <div className="text-xs text-gray-500 border-t border-green-200 pt-3">
        <div className="font-medium text-gray-600">{source}</div>
        <div className="text-gray-500 mt-1">{date}</div>
      </div>
    </div>
  );
};

export default StatBox; 