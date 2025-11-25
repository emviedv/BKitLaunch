import React from 'react';
import { usePublishedContent } from '@/hooks/usePublishedContent';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { resolveLucideIcon } from '@/lib/iconUtils';
import { ROUTE_PATHS } from '@/config/routes';
import { HEADER_MOBILE_MENU_ID } from '@/config/sectionAnchors';

const XLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
    <path
      fill="currentColor"
      d="M17.21 3H21L13.5 11.57 21.5 21h-4.33l-5.18-6.69L6.53 21H3l7.62-8.83L2.5 3h4.33l4.7 6.07L17.21 3Z"
    />
  </svg>
);

const Header = () => {
  const { content } = usePublishedContent();
  const [location] = useLocation();
  const slug = (location || '/').replace(/^\/+/, '').split('/')[0] || '';
  const comingSoonEnabled = Boolean((content?.settings as any)?.comingSoonEnabled);

  // Check if header should be visible
  const shouldShowHeader = content.settings?.visibility?.header !== false;
  
  if (!shouldShowHeader) {
    return null;
  }

  // Support richer nav item types coming from content JSON
  type NavChild = {
    label: string;
    href: string;
    description?: string;
    icon?: string;
    badge?: string;
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

  const hideNavLinks = content.settings?.visibility?.headerNavLinks === false;

  let navItems: NavItem[] = Array.isArray(content.header?.navigation)
    ? (content.header?.navigation as NavItem[])
    : [];

  navItems = navItems.map((item) => {
    if ((item as DropdownNavItem).type === 'dropdown') {
      const dd = item as DropdownNavItem;
      const children = (dd.children || []).map((child) => {
        const normalizedLabel = child.label?.trim().toLowerCase();
        if (normalizedLabel === 'component auditor' || normalizedLabel?.startsWith('biblioaudit')) {
          const { badge, ...rest } = child;
          return {
            ...rest,
            href: 'https://www.figma.com/community/plugin/1564328602359376130/component-auditor-toolkit',
            isExternal: true,
          };
        }
        return child;
      });
      return { ...dd, children };
    }
    const normalizedLabel = (item as LinkNavItem).label?.trim().toLowerCase();
    if (normalizedLabel === 'component auditor' || normalizedLabel?.startsWith('biblioaudit')) {
      const { badge, ...rest } = item as LinkNavItem & { badge?: string };
      return rest;
    }
    return item;
  });

  const hasBlogLink = navItems.some(
    (item) => (item as LinkNavItem).label?.trim().toLowerCase() === 'blog'
  );

  if (!hasBlogLink) {
    navItems = [...navItems, { label: 'Blog', href: '/blog', type: 'link' }];
  }

  if (hideNavLinks) {
    navItems = [];
  }

  const resourcesDropdown: DropdownNavItem = {
    type: 'dropdown',
    label: 'Resources',
    children: [
      {
        label: 'BiblioClean — The Blue Line Wiper',
        href: 'https://www.figma.com/community/plugin/1573014835821113198/biblioclean-remove-prototype-links-blue-lines',
        description: 'Remove prototype links safely without breaking your main components.',
        icon: 'plug',
        isExternal: true,
      }
    ],
  };

  const hasResourcesDropdown = navItems.some(
    (item) =>
      (item as DropdownNavItem).type === 'dropdown' &&
      typeof (item as DropdownNavItem).label === 'string' &&
      (item as DropdownNavItem).label.trim().toLowerCase() === 'resources'
  );

  if (!hasResourcesDropdown) {
    navItems = [...navItems, resourcesDropdown];
  }

  // When Coming Soon is enabled, remove product/page links from header
  if (comingSoonEnabled) {
    const systemRoutes = new Set<string>(['', 'admin', 'editor', 'design-system', 'design-system-demo', 'test', 'database', 'docs']);
    const isProductOrPage = (href?: string): boolean => {
      if (!href) return false;
      const normalized = href.startsWith('#') ? `/${href}` : href;
      if (!normalized.startsWith('/')) return false;
      const first = normalized.replace(/^\/+/, '').split('/')[0] || '';
      return first.length > 0 && !systemRoutes.has(first) && !normalized.startsWith('/#');
    };
    navItems = navItems.filter((item) => {
      const asLink = item as LinkNavItem;
      if ((item as any).type === 'dropdown') {
        const dd = item as DropdownNavItem;
        const keptChildren = (dd.children || []).filter((c) => !isProductOrPage(c.href));
        return keptChildren.length > 0; // drop empty dropdowns
      }
      return !isProductOrPage(asLink.href);
    });
  }

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

  const headerClassName = 'site-header bg-transparent absolute inset-x-0 top-0 z-50 w-full transition-all duration-300';

  return (
    <header className={headerClassName}>
      <div className="section-content h-16 flex items-center">
        <a
          href="/"
          aria-label="Go to Home"
          title="Go to Home"
          className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-sm"
        >
          <span className="text-logo font-[Satoshi,Inter_Variable,Inter,ui-sans-serif] font-bold tracking-[-0.04em] text-xl leading-none">
            {content.header?.logoText || 'BiblioKit'}
          </span>
        </a>
        <div className="ml-auto flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-md hover:bg-gray-100" onClick={() => {
              const mobileMenu = document.getElementById(HEADER_MOBILE_MENU_ID);
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
          </div>
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
                    <div className="absolute top-full left-0 mt-2 w-[360px] bg-slate-950/90 border border-white/10 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_rgba(12,16,28,0.45)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="p-4 space-y-2">
                        {(dd.children || []).map((child, ci) => {
                          const href = child.href || '#';
                          const normalizedHref = href.startsWith('#') ? `/${href}` : href;
                          const ChildIcon = resolveLucideIcon(child.icon || child.label);
                          return (
                            <a
                              key={`dd-item-${index}-${ci}`}
                              href={normalizedHref}
                              target={child.isExternal ? '_blank' : undefined}
                              rel={linkRel(child.nofollow, !!child.isExternal)}
                              className="flex gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-white/10"
                            >
                              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white">
                                <ChildIcon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                              </span>
                              <span className="flex-1 text-left">
                                <span className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-white">{child.label}</span>
                                  {child.badge && (
                                    <span className="text-[10px] font-semibold uppercase tracking-wide text-white bg-white/15 px-2 py-[2px] rounded-full">
                                      {child.badge}
                                    </span>
                                  )}
                                </span>
                                {child.description && (
                                  <span className="mt-1 block text-xs leading-5 text-white/75">
                                    {child.description}
                                  </span>
                                )}
                              </span>
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
          </nav>
          <a
            href="https://twitter.com/bibliokit"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow BiblioKit on X"
            className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white shadow-[0_10px_30px_rgba(9,9,18,0.35)] backdrop-blur-md transition-colors hover:bg-white/20"
          >
            <XLogo className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id={HEADER_MOBILE_MENU_ID}
        className="hidden md:hidden bg-gradient-to-br from-rose-50 via-white to-blue-50 transition-colors duration-300"
      >
        <div className="section-content py-2 space-y-2">
          {navItems.map((item, index) => {
            if ((item as DropdownNavItem).type === 'dropdown') {
              const dd = item as DropdownNavItem;
              return (
                <div key={`m-dd-${index}`} className="py-2">
                  <div className="text-sm font-medium text-gray-600 mb-2">{dd.label}</div>
                  {(dd.children || []).map((child, ci) => {
                    const href = child.href || '#';
                    const normalizedHref = href.startsWith('#') ? `/${href}` : href;
                    const ChildIcon = resolveLucideIcon(child.icon || child.label);
                    const isEmojiIcon =
                      typeof child.icon === 'string' && /[\p{Extended_Pictographic}]/u.test(child.icon);
                    return (
                      <a
                        key={`m-dd-item-${index}-${ci}`}
                        href={normalizedHref}
                        target={child.isExternal ? '_blank' : undefined}
                        rel={linkRel(child.nofollow, !!child.isExternal)}
                        className="flex gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-white/60 hover:text-primary"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 text-slate-900">
                          {isEmojiIcon ? (
                            <span className="text-lg" aria-hidden="true">
                              {child.icon}
                            </span>
                          ) : (
                            <ChildIcon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                          )}
                        </span>
                        <span className="flex-1 text-left">
                          <span className="flex items-center gap-2">
                            <span>{child.label}</span>
                            {child.badge && (
                              <span className="text-[10px] font-semibold uppercase tracking-wide text-primary bg-primary/10 px-2 py-[2px] rounded-full">
                                {child.badge}
                              </span>
                            )}
                          </span>
                          {child.description && (
                            <p className="mt-1 text-xs font-normal text-slate-600">
                              {child.description}
                            </p>
                          )}
                        </span>
                      </a>
                    );
                  })}
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
          
          <a
            href="https://twitter.com/bibliokit"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow BiblioKit on X"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-white/60 hover:text-primary transition-colors"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/10 text-slate-900 shadow-[0_10px_30px_rgba(9,9,18,0.25)] backdrop-blur-md">
              <XLogo className="h-4 w-4" />
            </span>
            <span>Follow on X</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header; 
