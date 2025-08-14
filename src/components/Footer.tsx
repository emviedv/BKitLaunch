import React from 'react';
import { usePublishedContent } from '@/hooks/usePublishedContent';
import { useAuth } from '@/contexts/AuthContext';

const Footer = () => {
  const { content } = usePublishedContent();
  const { contact, footer, header } = content;
  const { isAuthenticated, isAdmin } = useAuth();

  // Check if footer should be visible
  const shouldShowFooter = content.settings?.visibility?.footer !== false;
  
  if (!shouldShowFooter) {
    return null;
  }

  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <a
              href={isAuthenticated && isAdmin ? '/admin' : '/'}
              aria-label={isAuthenticated && isAdmin ? 'Go to Admin Dashboard' : 'Go to Home'}
              title={isAuthenticated && isAdmin ? 'Go to Admin Dashboard' : 'Go to Home'}
              className="inline-block font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500 mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-sm"
            >
              {header?.logoText || 'BiblioKit'}
            </a>
            <p className="text-sm text-muted-foreground">
              {footer?.description || 'Professional SaaS software and Figma plugins with secure API management.'}
            </p>
          </div>
          
          {footer?.sections?.map((section: any, index: number) => (
            <div key={index}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {section.links?.map((link: any, linkIndex: number) => (
                  <li key={linkIndex}>
                    {(() => {
                      const href: string = link.href || '#';
                      const normalizedHref = href.startsWith('#') ? `/${href}` : href;
                      return (
                        <a 
                      href={normalizedHref} 
                      className="hover:text-foreground transition-colors"
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {link.label}
                    </a>
                      );
                    })()}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {isAuthenticated && isAdmin && (
            <div>
              <h3 className="font-semibold mb-4">Admin</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="/editor" className="hover:text-foreground transition-colors">Content Editor</a>
                </li>
                <li>
                  <a href="/admin" className="hover:text-foreground transition-colors">Admin Dashboard</a>
                </li>
              </ul>
            </div>
          )}
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          {(() => {
            const currentYear = new Date().getFullYear();
            const brand = header?.logoText || 'BiblioKit';
            const raw = (footer as any)?.copyright_text as string | undefined;
            const computed = raw
              ? (raw.includes('{year}') || raw.includes('{brand}')
                  ? raw
                      .replaceAll('{year}', String(currentYear))
                      .replaceAll('{brand}', brand)
                  : raw.replace(/20\d{2}/, String(currentYear)))
              : `© ${currentYear} ${brand}. All rights reserved.`;
            return <p>{computed}</p>;
          })()}
        </div>
      </div>
    </footer>
  );
};

export default Footer; 