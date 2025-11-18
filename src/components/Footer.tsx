import React from 'react';
import { usePublishedContent } from '@/hooks/usePublishedContent';

const Footer = () => {
  const { content } = usePublishedContent();

  // Check if footer should be visible
  const shouldShowFooter = content.settings?.visibility?.footer !== false;
  
  if (!shouldShowFooter) {
    return null;
  }

  const footerNav = [
    { label: 'Resources', href: '/resources/remove-prototype-link' },
    { label: 'Blog', href: '/blog' }
  ];

  return (
    <footer className="bg-[#0f0a1c] border-t border-[#1b142a] text-white">
      <div className="section-content py-6 text-sm text-white/70">
        <div className="flex flex-col gap-4 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <span>© 2025 BiblioKit. All rights reserved.</span>
          <nav className="flex flex-wrap items-center justify-center gap-4 md:justify-end">
            {footerNav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-white transition-colors hover:text-[#ff2f87]"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
