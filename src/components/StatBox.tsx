import React from 'react';

interface StatBoxProps {
  statistic: string;
  description: string;
  _source?: string;
  _date?: string;
  className?: string;
}

const StatBox: React.FC<StatBoxProps> = ({
  statistic,
  description,
  _source,
  _date,
  className,
}) => {
  return (
    <div
      className={`stat-box h-full rounded-3xl border border-white/10 bg-[#080213]/75 px-6 py-8 text-center text-white transition-transform duration-200 hover:-translate-y-1 flex flex-col items-center gap-4 shadow-[0_30px_80px_rgba(3,0,12,0.6)] ${className}`}
    >
      <div className="mb-3 text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#f871a0] via-[#b970ff] to-[#5bceff] md:text-5xl">
        {statistic}
      </div>

      <p className="mb-4 w-full text-base leading-relaxed text-white/70 min-h-[96px] flex items-start justify-center text-center">
        <span>{description}</span>
      </p>
    </div>
  );
};

export default StatBox;
