import React from 'react';

const AIRenameVariantsHeroAnimation: React.FC = () => {
  return (
    <div className="relative aspect-square w-full max-w-[28rem] overflow-hidden rounded-[36px] border border-white/12 bg-gradient-to-br from-[#0b1024] via-[#141d3e] to-[#090d1f] shadow-[0_32px_80px_rgba(15,31,68,0.55)]">
      <div className="ai-rename-hero__glow absolute inset-0 opacity-80" aria-hidden="true" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="ai-rename-hero__diamond ai-rename-hero__diamond--outline" aria-hidden="true" />
        <div className="ai-rename-hero__diamond ai-rename-hero__diamond--primary" aria-hidden="true" />
        <div className="ai-rename-hero__diamond ai-rename-hero__diamond--secondary" aria-hidden="true" />

        <div className="ai-rename-hero__orbit ai-rename-hero__orbit--one" aria-hidden="true" />
        <div className="ai-rename-hero__orbit ai-rename-hero__orbit--two" aria-hidden="true" />

        <span className="ai-rename-hero__spark ai-rename-hero__spark--one" />
        <span className="ai-rename-hero__spark ai-rename-hero__spark--two" />
        <span className="ai-rename-hero__spark ai-rename-hero__spark--three" />

        <div className="ai-rename-hero__glyph">
          <svg
            width="100"
            height="100"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M53.5339 1.46393C52.5963 0.526577 51.3248 0 49.9989 0C48.6731 0 47.4016 0.526577 46.4639 1.46393L31.4639 16.4639C30.5266 17.4016 30 18.6731 30 19.9989C30 21.3248 30.5266 22.5963 31.4639 23.5339L46.4639 38.5339C47.4016 39.4713 48.6731 39.9979 49.9989 39.9979C51.3248 39.9979 52.5963 39.4713 53.5339 38.5339L68.5339 23.5339C69.4713 22.5963 69.9979 21.3248 69.9979 19.9989C69.9979 18.6731 69.4713 17.4016 68.5339 16.4639L53.5339 1.46393ZM46.4639 61.4639C47.4016 60.5266 48.6731 60 49.9989 60C51.3248 60 52.5963 60.5266 53.5339 61.4639L68.5339 76.4639C69.4713 77.4016 69.9979 78.6731 69.9979 79.9989C69.9979 81.3248 69.4713 82.5963 68.5339 83.5339L53.5339 98.5339C52.5963 99.4713 51.3248 99.9979 49.9989 99.9979C48.6731 99.9979 47.4016 99.4713 46.4639 98.5339L31.4639 83.5339C30.5266 82.5963 30 81.3248 30 79.9989C30 78.6731 30.5266 77.4016 31.4639 76.4639L46.4639 61.4639ZM76.4639 31.4639C77.4016 30.5266 78.6731 30 79.9989 30C81.3248 30 82.5963 30.5266 83.5339 31.4639L98.5339 46.4639C99.4713 47.4016 99.9979 48.6731 99.9979 49.9989C99.9979 51.3248 99.4713 52.5963 98.5339 53.5339L83.5339 68.5339C82.5963 69.4713 81.3248 69.9979 79.9989 69.9979C78.6731 69.9979 77.4016 69.4713 76.4639 68.5339L61.4639 53.5339C60.5266 52.5963 60 51.3248 60 49.9989C60 48.6731 60.5266 47.4016 61.4639 46.4639L76.4639 31.4639ZM16.4639 31.4639C17.4016 30.5266 18.6731 30 19.9989 30C21.3248 30 22.5963 30.5266 23.5339 31.4639L38.5339 46.4639C39.4713 47.4016 39.9979 48.6731 39.9979 49.9989C39.9979 51.3248 39.4713 52.5963 38.5339 53.5339L23.5339 68.5339C22.5963 69.4713 21.3248 69.9979 19.9989 69.9979C18.6731 69.9979 17.4016 69.4713 16.4639 68.5339L1.46393 53.5339C0.526577 52.5963 0 51.3248 0 49.9989C0 48.6731 0.526577 47.4016 1.46393 46.4639L16.4639 31.4639Z"
              fill="#145090"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AIRenameVariantsHeroAnimation;
