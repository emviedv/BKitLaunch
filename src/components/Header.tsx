import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePublishedContent } from '@/hooks/usePublishedContent';
import { useLocation } from 'wouter';
import { MagnetizeButton } from '@/components/ui/magnetize-button';
import { Button } from '@/components/ui/button';

const Header = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { content } = usePublishedContent();
  const [location] = useLocation();
  const [hasMounted, setHasMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    setHasMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 4);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const topClass = hasMounted && isAuthenticated && isAdmin
    ? (isScrolled ? 'top-10' : 'top-14')
    : (isScrolled ? 'top-0' : 'top-4');
  const isHomeRoute = location === '/';
  const isTopTransparent = isHomeRoute && !isScrolled;
  const positionClass = isTopTransparent ? 'absolute' : 'fixed';

  // Check if header should be visible
  const shouldShowHeader = content.settings?.visibility?.header !== false;
  
  if (!shouldShowHeader) {
    return null;
  }

  // Support richer nav item types coming from content JSON
  type NavChild = {
    label: string;
    href: string;
    isExternal?: boolean;
    nofollow?: boolean;
  };

  type DropdownNavItem = {
    type: 'dropdown';
    label: string;
    children: NavChild[];
  };

  type LinkNavItem = {
    label: string;
    href?: string;
    type?: 'link' | 'scroll' | 'external' | 'button';
    isButton?: boolean;
    isExternal?: boolean;
    nofollow?: boolean;
  };

  type NavItem = DropdownNavItem | LinkNavItem;

  const navItems: NavItem[] = Array.isArray(content.header?.navigation)
    ? (content.header?.navigation as NavItem[])
    : [];

  const resolveExternal = (item: { type?: string; isExternal?: boolean }): boolean => {
    if (typeof item.isExternal === 'boolean') return item.isExternal;
    return item.type === 'external';
  };

  const linkRel = (nofollow?: boolean, external?: boolean): string | undefined => {
    const parts: string[] = [];
    if (external) parts.push('noopener', 'noreferrer');
    if (nofollow) parts.push('nofollow');
    return parts.length ? parts.join(' ') : undefined;
  };

  return (
    <header className={`${isScrolled ? 'bg-background/80 backdrop-blur border-b border-border' : 'bg-transparent'} ${positionClass} w-full ${topClass} z-50 transition-all duration-300`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <a
          href={hasMounted && isAuthenticated && isAdmin ? '/admin' : '/'}
          aria-label={hasMounted && isAuthenticated && isAdmin ? 'Go to Admin Dashboard' : 'Go to Home'}
          title={hasMounted && isAuthenticated && isAdmin ? 'Go to Admin Dashboard' : 'Go to Home'}
          className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-sm"
        >
          {content.header?.logoText || 'BiblioKit'}
        </a>
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item, index) => {
            if ((item as DropdownNavItem).type === 'dropdown') {
              const dd = item as DropdownNavItem;
              return (
                <div key={`dd-${index}`} className="relative group">
                  <button className="text-sm font-medium hover:text-primary transition-colors flex items-center">
                    {dd.label}
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      {(dd.children || []).map((child, ci) => {
                        const href = child.href || '#';
                        const normalizedHref = href.startsWith('#') ? `/${href}` : href;
                        return (
                          <a
                            key={`dd-item-${index}-${ci}`}
                            href={normalizedHref}
                            target={child.isExternal ? '_blank' : undefined}
                            rel={linkRel(child.nofollow, !!child.isExternal)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                          >
                            {child.label}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            const li = item as LinkNavItem;
            const isExternal = resolveExternal(li);
            const isButton = li.isButton || li.type === 'button';
            // Normalize hash-only links to root anchored navigation (e.g., "#pricing" -> "/#pricing")
            const href = (li.href || '#');
            const normalizedHref = href.startsWith('#') ? `/${href}` : href;
            if (isButton) {
              return (
                <Button asChild key={`nav-${index}`} size="sm">
                  <a
                    href={normalizedHref}
                    target={isExternal ? '_blank' : undefined}
                    rel={linkRel(li.nofollow, isExternal)}
                    aria-label={li.label}
                  >
                    {li.label}
                  </a>
                </Button>
              );
            }
            return (
              <a
                key={`nav-${index}`}
                href={normalizedHref}
                target={isExternal ? '_blank' : undefined}
                rel={linkRel(li.nofollow, isExternal)}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {li.label}
              </a>
            );
          })}
          
          {hasMounted && isAuthenticated && isAdmin && (
            <a
              href="/editor"
              className="text-sm font-medium text-primary hover:underline"
              aria-label="Open Content Editor"
            >
              Content Editor
            </a>
          )}
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
          
          {content.header?.showSignIn !== false && (
            <Button
              asChild
              size="sm"
              variant="outline"
            >
              <a
                href={(content.header?.signInHref || content.header?.signInLink || '#').startsWith('#') ? `/${content.header?.signInHref || content.header?.signInLink || '#'}` : (content.header?.signInHref || content.header?.signInLink || '#')}
                aria-label={content.header?.signInText || 'Sign In'}
              >
                {content.header?.signInText || 'Sign In'}
              </a>
            </Button>
          )}
          {content.header?.showGetStarted !== false && (
            <MagnetizeButton
              size="sm"
              href={(content.header?.getStartedHref || content.header?.getStartedLink || '#').startsWith('#') ? `/${content.header?.getStartedHref || content.header?.getStartedLink || '#'}` : (content.header?.getStartedHref || content.header?.getStartedLink || '#')}
              aria-label={content.header?.getStartedText || 'Get Started'}
              title={content.header?.getStartedText || 'Get Started'}
            >
              {content.header?.getStartedText || 'Get Started'}
            </MagnetizeButton>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`hidden md:hidden ${isScrolled ? 'bg-background/80 backdrop-blur border-t border-border' : 'bg-transparent'} transition-colors duration-300`}
      >
        <div className="px-4 py-2 space-y-2">
          {navItems.map((item, index) => {
            if ((item as DropdownNavItem).type === 'dropdown') {
              const dd = item as DropdownNavItem;
              return (
                <div key={`m-dd-${index}`} className="py-2">
                  <div className="text-sm font-medium text-gray-600 mb-2">{dd.label}</div>
                  {(dd.children || []).map((child, ci) => (
                    <a
                      key={`m-dd-item-${index}-${ci}`}
                      href={child.href}
                      target={child.isExternal ? '_blank' : undefined}
                      rel={linkRel(child.nofollow, !!child.isExternal)}
                      className="block py-2 pl-4 text-sm text-gray-700 hover:text-primary transition-colors"
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              );
            }

            const li = item as LinkNavItem;
            const isExternal = resolveExternal(li);
            const isButton = li.isButton || li.type === 'button';
            const href = (li.href || '#');
            const normalizedHref = href.startsWith('#') ? `/${href}` : href;
            if (isButton) {
              return (
                <Button asChild key={`m-nav-${index}`} size="sm" className="w-full text-sm">
                  <a
                    href={normalizedHref}
                    target={isExternal ? '_blank' : undefined}
                    rel={linkRel(li.nofollow, isExternal)}
                    aria-label={li.label}
                  >
                    {li.label}
                  </a>
                </Button>
              );
            }
            return (
              <a
                key={`m-nav-${index}`}
                href={normalizedHref}
                target={isExternal ? '_blank' : undefined}
                rel={linkRel(li.nofollow, isExternal)}
                className="block py-2 text-sm font-medium hover:text-primary transition-colors"
              >
                {li.label}
              </a>
            );
          })}
          
        </div>
      </div>
    </header>
  );
};

export default Header; 