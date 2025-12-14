import React from 'react';

const FluidBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40" aria-hidden="true">
    </div>
  );
};

export default FluidBackground;
