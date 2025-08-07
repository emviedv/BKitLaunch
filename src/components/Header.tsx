import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePublishedContent } from '@/hooks/usePublishedContent';

const Header = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { content } = usePublishedContent();
  const adminOffset = isAuthenticated && isAdmin ? 'top-10' : 'top-0';

  // Check if header should be visible
  const shouldShowHeader = content.settings?.visibility?.header !== false;
  
  if (!shouldShowHeader) {
    return null;
  }

  return (
    <header className={`bg-background border-b border-border fixed w-full ${adminOffset} z-50`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="font-bold text-xl text-primary">{content.header?.logoText || 'BiblioKit'}</div>
        <nav className="hidden md:flex items-center space-x-6">
          {content.header?.navigation?.map((item: any, index: number) => (
            <a 
              key={index}
              href={item.href} 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {item.label}
            </a>
          ))}
          <div className="relative group">
            <button className="text-sm font-medium hover:text-primary transition-colors flex items-center">
              Products
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-2">
                <a href="/ai-rename-variants" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                  🏷️ AI Rename Variants
                </a>
                <a href="/bibliokit-blocks" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                  📊 BiblioKit Blocks
                </a>
              </div>
            </div>
          </div>
        </nav>
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-md hover:bg-gray-100" onClick={() => {
            const mobileMenu = document.getElementById('mobile-menu');
            mobileMenu?.classList.toggle('hidden');
          }}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <button className="button-secondary">
            {content.header?.signInText || 'Sign In'}
          </button>
          <button className="button">
            {content.header?.getStartedText || 'Get Started'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div id="mobile-menu" className="hidden md:hidden bg-white border-t border-gray-200">
        <div className="px-4 py-2 space-y-2">
          {content.header?.navigation?.map((item: any, index: number) => (
            <a 
              key={index}
              href={item.href} 
              className="block py-2 text-sm font-medium hover:text-primary transition-colors"
            >
              {item.label}
            </a>
          ))}
          <div className="py-2">
            <div className="text-sm font-medium text-gray-600 mb-2">Products</div>
            <a href="/ai-rename-variants" className="block py-2 pl-4 text-sm text-gray-700 hover:text-primary transition-colors">
              🏷️ AI Rename Variants
            </a>
            <a href="/bibliokit-blocks" className="block py-2 pl-4 text-sm text-gray-700 hover:text-primary transition-colors">
              📊 BiblioKit Blocks
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 