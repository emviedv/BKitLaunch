import React from 'react';
import { usePublishedContent } from '@/hooks/usePublishedContent';

const Footer = () => {
  const { content } = usePublishedContent();
  const { contact } = content;

  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="font-bold text-lg text-primary mb-4">BiblioKit</div>
            <p className="text-sm text-muted-foreground">
              Professional SaaS software and Figma plugins with secure API management.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#docs" className="hover:text-foreground transition-colors">Documentation</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#help" className="hover:text-foreground transition-colors">Help Center</a></li>
              <li><a href="#contact" className="hover:text-foreground transition-colors">Contact</a></li>
              <li><a href="#status" className="hover:text-foreground transition-colors">Status</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href={`mailto:${contact.email}`} className="hover:text-foreground transition-colors">Email</a></li>
              <li><a href={`https://twitter.com/${contact.twitter.replace('@', '')}`} className="hover:text-foreground transition-colors">Twitter</a></li>
              <li><a href={`https://github.com/${contact.github}`} className="hover:text-foreground transition-colors">GitHub</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 BiblioKit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 