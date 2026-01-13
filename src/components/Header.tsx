import React from 'react';
import { usePublishedContent } from '@/hooks/usePublishedContent';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { resolveLucideIcon } from '@/lib/iconUtils';
import { ROUTE_PATHS } from '@/config/routes';
import { HEADER_MOBILE_MENU_ID } from '@/config/sectionAnchors';

const Header = () => {
  const { content } = usePublishedContent();
  const [location] = useLocation();
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

  const pluginIconSrcByHref: Record<string, string> = {
    '/figma-component-variant-renamer': '/media/icons/biblio-rename-icon.png',
    '/figma-plugin-remove-prototype-links': '/media/icons/biblio-clean-icon.png',
    '/figma-design-system-audit-plugin': '/media/icons/component-qa-icon.png',
    '/figma-component-states': '/media/icons/state-builder-icon.png',
    '/figma-table-builder': '/media/icons/biblio-table-icon.png',
    '/figma-organize-design-files-plugin': '/media/icons/organize-file-icon.png',
  };

  const resolvePluginIconSrc = (child: NavChild): string | null => {
    if (!child.href) return null;
    const normalizedHref = (child.href.startsWith('#') ? `/${child.href}` : child.href)
      .split('#')[0]
      .replace(/\/$/, '');
    return pluginIconSrcByHref[normalizedHref] ?? null;
  };

  navItems = navItems.map((item) => {
    if ((item as DropdownNavItem).type === 'dropdown') {
      const dd = item as DropdownNavItem;
      const normalizedDropdownLabel = dd.label?.trim().toLowerCase();
      const children = (dd.children || []).map((child) => {
        const normalizedLabel = child.label?.trim().toLowerCase();
        if (normalizedLabel === 'component auditor' || normalizedLabel?.startsWith('componentqa')) {
          const { badge: _badge, ...rest } = child;
          return {
            ...rest,
            href: '/figma-design-system-audit-plugin',
          };
        }
        return child;
      });
      if (normalizedDropdownLabel === 'resources') {
        return { ...dd, label: 'Free Figma Plugins', children };
      }
      return { ...dd, children };
    }
    const normalizedLabel = (item as LinkNavItem).label?.trim().toLowerCase();
    if (normalizedLabel === 'component auditor' || normalizedLabel?.startsWith('componentqa')) {
      const { badge: _badge, ...rest } = item as LinkNavItem & { badge?: string };
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
    label: 'Free Figma Plugins',
    children: [
      {
            label: 'BiblioClean — The Blue Line Wiper',
            href: '/figma-plugin-remove-prototype-links',
            description: 'Remove prototype links safely without breaking your main components.',
        icon: 'plug',
      }
    ],
  };

  const hasResourcesDropdown = navItems.some(
    (item) =>
      (item as DropdownNavItem).type === 'dropdown' &&
      typeof (item as DropdownNavItem).label === 'string' &&
      (item as DropdownNavItem).label.trim().toLowerCase() === 'free figma plugins'
  );

  if (!hasResourcesDropdown) {
    navItems = [...navItems, resourcesDropdown];
  }

  const learnDropdown: DropdownNavItem = {
    type: 'dropdown',
    label: 'Learn',
    children: [
      {
        label: 'Design Ops Fundamentals',
        href: ROUTE_PATHS.LEARN_DESIGN_OPS_FUNDAMENTALS,
      },
    ],
  };

  const hasLearnDropdown = navItems.some(
    (item) =>
      (item as DropdownNavItem).type === 'dropdown' &&
      typeof (item as DropdownNavItem).label === 'string' &&
      (item as DropdownNavItem).label.trim().toLowerCase() === 'learn'
  );

  navItems = navItems.map((item) => {
    if ((item as DropdownNavItem).type === 'dropdown') {
      return item;
    }
    const normalizedLabel = (item as LinkNavItem).label?.trim().toLowerCase();
    if (normalizedLabel === 'learn') {
      return learnDropdown;
    }
    return item;
  });

  const hasLearnItem = navItems.some((item) => {
    if ((item as DropdownNavItem).type === 'dropdown') {
      return (item as DropdownNavItem).label?.trim().toLowerCase() === 'learn';
    }
    return (item as LinkNavItem).label?.trim().toLowerCase() === 'learn';
  });

  if (!hasLearnDropdown && !hasLearnItem) {
    navItems = [...navItems, learnDropdown];
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

  const isBlogRoute = location?.startsWith('/blog');
  const headerBackgroundClass = isBlogRoute
    ? 'blog-header-surface backdrop-blur-xl border-b border-white/8'
    : 'bg-transparent';
  const headerClassName = `site-header absolute inset-x-0 top-0 z-50 w-full transition-all duration-300 ${headerBackgroundClass}`;

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
                  target="_blank"
                  rel="noopener noreferrer"
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
                const isPluginsDropdown = dd.label?.trim().toLowerCase() === 'plugins';
                const isFreePluginsDropdown = dd.label?.trim().toLowerCase() === 'free figma plugins';
                const isLearnDropdown = dd.label?.trim().toLowerCase() === 'learn';
                const isResourcesDropdown = isFreePluginsDropdown;
                const dropdownPanelClassName = isPluginsDropdown
                  ? 'absolute top-full left-0 mt-3 w-[560px] rounded-3xl border border-white/12 bg-[#0b0c0f]/95 backdrop-blur-xl shadow-[0_32px_90px_rgba(7,5,16,0.6)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50'
                  : 'absolute top-full left-0 mt-3 w-[380px] rounded-2xl border border-white/12 bg-[#0b0c0f] shadow-[0_26px_80px_rgba(7,5,16,0.55)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50';
                const dropdownContentClassName = isPluginsDropdown
                  ? 'p-5 grid gap-3 sm:grid-cols-2'
                  : 'p-4 space-y-2';
                const dropdownTriggerClassName = 'text-sm font-semibold text-white hover:text-[#ff2f87] transition-colors flex items-center';
                const dropdownTriggerHref = isLearnDropdown
                  ? ROUTE_PATHS.LEARN
                  : isResourcesDropdown
                    ? ROUTE_PATHS.RESOURCES
                    : null;
                return (
                  <div key={`dd-${index}`} className="relative group">
                    {dropdownTriggerHref ? (
                      <a href={dropdownTriggerHref} className={dropdownTriggerClassName}>
                        {dd.label}
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </a>
                    ) : (
                      <button className={dropdownTriggerClassName}>
                        {dd.label}
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}
                    <div className={dropdownPanelClassName}>
                      <div className={dropdownContentClassName}>
                        {(dd.children || []).map((child, ci) => {
                          const href = child.href || '#';
                          const normalizedHref = href.startsWith('#') ? `/${href}` : href;
                          const pluginIconSrc = (isPluginsDropdown || isFreePluginsDropdown)
                            ? resolvePluginIconSrc(child)
                            : null;
                          const usePluginIconStyle = isPluginsDropdown || Boolean(pluginIconSrc);
                          const ChildIcon = resolveLucideIcon(child.icon || child.label);
                          const itemClassName = isPluginsDropdown
                            ? 'group/item flex items-start gap-3 py-2 rounded-2xl transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff2f87]'
                            : 'flex items-center gap-3 py-2 rounded-xl transition-colors hover:bg-[#ff2f87]/12';
                          const iconWrapperClassName = usePluginIconStyle
                            ? 'flex h-[22px] w-[22px] items-center justify-center'
                            : 'flex h-8 w-8 items-center justify-center rounded-xl bg-[#ff2f87]/14 text-white border border-white/10';
                          const textWrapperClassName = isPluginsDropdown
                            ? 'flex-1 text-left'
                            : 'flex-1 text-left flex flex-col justify-center';
                          return (
                            <a
                              key={`dd-item-${index}-${ci}`}
                              href={normalizedHref}
                              target={child.isExternal ? '_blank' : undefined}
                              rel={child.isExternal ? 'noopener noreferrer' : undefined}
                              className={itemClassName}
                            >
                              <span className={iconWrapperClassName}>
                                {pluginIconSrc ? (
                                  <img
                                    src={pluginIconSrc}
                                    alt={`${child.label} icon`}
                                    className="h-[22px] w-[22px] rounded-2xl object-contain"
                                    width={22}
                                    height={22}
                                  />
                                ) : (
                                  <ChildIcon className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
                                )}
                              </span>
                              <span className={textWrapperClassName}>
                                <span className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-white">{child.label}</span>
                                  {child.badge && (
                                    <span className="text-[10px] font-semibold uppercase tracking-wide text-white bg-[#ff2f87]/20 px-2 py-[2px] rounded-full border border-[#ff2f87]/40">
                                      {child.badge}
                                    </span>
                                  )}
                                </span>
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
                      rel={isExternal ? (li.nofollow ? 'noopener noreferrer nofollow' : 'noopener noreferrer') : (li.nofollow ? 'nofollow' : undefined)}
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
                  rel={isExternal ? (li.nofollow ? 'noopener noreferrer nofollow' : 'noopener noreferrer') : (li.nofollow ? 'nofollow' : undefined)}
                  className="text-sm font-semibold text-white hover:text-[#ff2f87] transition-colors"
                >
                  {li.label}
                </a>
              );

            })}
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id={HEADER_MOBILE_MENU_ID}
        className="hidden md:hidden bg-gradient-to-br from-[#0c0d10] via-[#0b0c0f] to-[#0a0a0c] transition-colors duration-300 text-white"
      >
        <div className="section-content py-2 space-y-2">
          {navItems.map((item, index) => {
            if ((item as DropdownNavItem).type === 'dropdown') {
              const dd = item as DropdownNavItem;
              const isLearnDropdown = dd.label?.trim().toLowerCase() === 'learn';
              const isResourcesDropdown = dd.label?.trim().toLowerCase() === 'free figma plugins';
              const dropdownLabelHref = isLearnDropdown
                ? ROUTE_PATHS.LEARN
                : isResourcesDropdown
                  ? ROUTE_PATHS.RESOURCES
                  : null;
              return (
                <div key={`m-dd-${index}`} className="py-2">
                  {dropdownLabelHref ? (
                    <a href={dropdownLabelHref} className="inline-flex text-sm font-semibold text-white/70 mb-2 hover:text-white transition-colors">
                      {dd.label}
                    </a>
                  ) : (
                    <div className="text-sm font-semibold text-white/70 mb-2">{dd.label}</div>
                  )}
                  {(dd.children || []).map((child, ci) => {
                    const href = child.href || '#';
                    const normalizedHref = href.startsWith('#') ? `/${href}` : href;
                    const isPluginsDropdown = dd.label?.trim().toLowerCase() === 'plugins';
                    const isFreePluginsDropdown = dd.label?.trim().toLowerCase() === 'free figma plugins';
                    const pluginIconSrc = (isPluginsDropdown || isFreePluginsDropdown)
                      ? resolvePluginIconSrc(child)
                      : null;
                    const usePluginIconStyle = isPluginsDropdown || Boolean(pluginIconSrc);
                    const ChildIcon = resolveLucideIcon(child.icon || child.label);
                    const isEmojiIcon =
                      !pluginIconSrc &&
                      typeof child.icon === 'string' &&
                      /[\p{Extended_Pictographic}]/u.test(child.icon);
                    const iconWrapperClassName = usePluginIconStyle
                      ? 'flex h-[19px] w-[19px] items-center justify-center'
                      : 'flex h-8 w-8 items-center justify-center rounded-xl bg-[#ff2f87]/14 text-white border border-white/10';
                    const itemClassName = isPluginsDropdown
                      ? 'flex items-start gap-3 rounded-xl text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white'
                      : 'flex items-center gap-3 rounded-xl text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white';
                    const textWrapperClassName = isPluginsDropdown
                      ? 'flex-1 text-left'
                      : 'flex-1 text-left flex flex-col justify-center';
                    return (
                      <a
                        key={`m-dd-item-${index}-${ci}`}
                        href={normalizedHref}
                        target={child.isExternal ? '_blank' : undefined}
                        rel={child.isExternal ? 'noopener noreferrer' : undefined}
                        className={itemClassName}
                      >
                        <span className={iconWrapperClassName}>
                          {pluginIconSrc ? (
                            <img
                              src={pluginIconSrc}
                              alt={`${child.label} icon`}
                              className="h-[19px] w-[19px] rounded-xl object-contain"
                              width={19}
                              height={19}
                            />
                          ) : isEmojiIcon ? (
                            <span className="text-lg" aria-hidden="true">
                              {child.icon}
                            </span>
                          ) : (
                            <ChildIcon className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
                          )}
                        </span>
                        <span className={textWrapperClassName}>
                            <span className="flex items-center gap-2">
                              <span>{child.label}</span>
                              {child.badge && (
                                <span className="text-[10px] font-semibold uppercase tracking-wide text-white bg-[#ff2f87]/20 px-2 py-[2px] rounded-full border border-[#ff2f87]/40">
                                  {child.badge}
                                </span>
                              )}
                            </span>
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
                    rel={isExternal ? (li.nofollow ? 'noopener noreferrer nofollow' : 'noopener noreferrer') : (li.nofollow ? 'nofollow' : undefined)}
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
                rel={isExternal ? (li.nofollow ? 'noopener noreferrer nofollow' : 'noopener noreferrer') : (li.nofollow ? 'nofollow' : undefined)}
                className="block py-2 text-sm font-semibold text-white/80 hover:text-white transition-colors"
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
