import React from 'react';
import { usePublishedContent } from '@/hooks/usePublishedContent';

const Footer = () => {
  const { content } = usePublishedContent();
  const { contact, footer, header } = content;

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
            <div className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500 mb-4">
              {header?.logoText || 'BiblioKit'}
            </div>
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
                    <a 
                      href={link.href} 
                      className="hover:text-foreground transition-colors"
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 {header?.logoText || 'BiblioKit'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 