import React from 'react';

const XLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
    <path
      fill="currentColor"
      d="M17.21 3H21L13.5 11.57 21.5 21h-4.33l-5.18-6.69L6.53 21H3l7.62-8.83L2.5 3h4.33l4.7 6.07L17.21 3Z"
    />
  </svg>
);

const products = [
  { name: 'All Products', href: '/products' },
  { name: 'BiblioRename', href: '/figma-component-variant-renamer' },
  { name: 'BiblioAudit', href: '/figma-design-system-audit-plugin' },
  { name: 'BiblioStates', href: '/figma-component-states' },
  { name: 'BiblioTable', href: '/figma-table-builder' },
  { name: 'BiblioClean', href: '/figma-plugin-remove-prototype-links' },
  { name: 'BiblioOrganize', href: '/figma-organize-design-files-plugin' },
];

const company = [
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/blog' },
  { name: 'Resources', href: '/resources' },
];

const learn = [
  { name: 'Learn', href: '/learn' },
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
              <ul className="mt-4 space-y-3">
                {social.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 rounded-full border border-[#ff2f87]/30 bg-[#ff2f87]/10 px-4 py-2 text-sm font-semibold text-white hover:bg-[#ff2f87]/16 transition-colors"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff2f87]/30 text-white">
                        <XLogo className="h-4 w-4" />
                      </span>
                      <span>{item.name}</span>
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
