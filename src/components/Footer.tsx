import React from 'react';

const products = [
  { name: 'All Products', href: '/products' },
  { name: 'RenameVariantsAI', href: '/figma-component-variant-renamer' },
  { name: 'ComponentQA', href: '/figma-design-system-audit-plugin' },
  { name: 'StateBuilder', href: '/figma-component-states' },
  { name: 'FixTable', href: '/figma-table-builder' },
  { name: 'BiblioClean', href: '/figma-plugin-remove-prototype-links' },
  { name: 'OrganizeFile', href: '/figma-organize-design-files-plugin' },
];

const company = [
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/blog' },
  { name: 'Resources', href: '/resources' },
  { name: 'For Teams', href: '/for' },
];

const learn = [
  { name: 'Learn', href: '/learn' },
  { name: 'Tutorials', href: '/tutorials' },
  { name: 'Use Cases', href: '/use-cases' },
  { name: 'Glossary', href: '/glossary' },
  { name: 'Design Ops Fundamentals', href: '/learn/design-ops-fundamentals' },
];

const social = [
  { name: 'Follow on X', href: 'https://twitter.com/bibliokit' },
];

const Footer = () => {
  return (
    <footer className="landing-footer text-white/80 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between gap-10 md:items-stretch">
          {/* Left Side: Logo and Copyright */}
          <div className="mb-8 md:mb-0 md:w-1/2 md:flex md:flex-col md:justify-between">
            <a href="/" className="flex items-center mb-2 text-xl font-semibold text-white">
              BiblioKit
            </a>
            <p className="text-sm text-white/70">
              BiblioKit is a suite of Figma plugins that cuts the grind for designers, developers, and marketers, so teams ship faster with clean, consistent files.
            </p>
            <p className="text-sm text-white/60">
              &copy; 2026 BiblioKit. All rights reserved.
            </p>
          </div>

          {/* Right Side: Links */}
          <div className="md:w-1/2 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Products</h3>
              <ul className="mt-4 space-y-2">
                {products.map((product) => (
                  <li key={product.name}>
                    <a
                      href={product.href}
                      className="text-sm text-white/80 hover:text-white transition-colors"
                      target={product.href.startsWith('http') ? '_blank' : '_self'}
                      rel={product.href.startsWith('http') ? 'noopener noreferrer' : ''}
                    >
                      {product.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Company</h3>
              <ul className="mt-4 space-y-2">
                {company.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="text-sm text-white/80 hover:text-white transition-colors">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Learn</h3>
              <ul className="mt-4 space-y-2">
                {learn.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="text-sm text-white/80 hover:text-white transition-colors">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Social</h3>
              <ul className="mt-4 space-y-2">
                {social.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white/80 hover:text-white transition-colors"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
