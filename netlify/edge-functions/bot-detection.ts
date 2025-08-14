export default async (request: Request, context: any) => {
  const userAgent = request.headers.get('user-agent') || '';
  const url = new URL(request.url);
  
  // List of AI crawler user agents
  const aiCrawlers = [
    'GPTBot',
    'PerplexityBot', 
    'ClaudeBot',
    'ChatGPT-User',
    'CCBot',
    'anthropic-ai',
    'Claude-Web',
    'Bingbot',
    'Googlebot',
    'Slurp',
    'DuckDuckBot',
    'facebookexternalhit'
  ];
  
  // Check if request is from an AI crawler
  const isBot = aiCrawlers.some(bot => userAgent.includes(bot));
  
  // If not a bot, serve the normal SPA
  if (!isBot) {
    return context.next();
  }
  
  // Generate static HTML for bots based on the path
  const staticHtml = generateStaticHtml(url.pathname, url.origin);
  
  return new Response(staticHtml, {
    headers: {
      'content-type': 'text/html',
      'cache-control': 'public, max-age=3600',
      'x-served-by': 'bot-detection-edge-function'
    }
  });
};

function generateStaticHtml(pathname: string, origin: string): string {
  const baseHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ctext y='50%25' x='50%25' dominant-baseline='middle' text-anchor='middle' font-size='52'%3E%F0%9F%92%AB%3C/text%3E%3C/svg%3E">
  ${getPageMetadata(pathname)}
  ${getPageSchema(pathname, origin)}
</head>
<body>
  ${getPageContent(pathname)}
  
  <!-- Footer for all pages -->
  <footer style="background: #1f2937; color: white; padding: 2rem; text-align: center; margin-top: 4rem;">
    <div style="max-width: 1200px; margin: 0 auto;">
      <h3 style="margin-bottom: 1rem;">BiblioKit</h3>
      <p style="color: #9ca3af; margin-bottom: 1rem;">Professional SaaS software and Figma plugins</p>
      <div style="display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap;">
        <a href="mailto:hello@bibliokit.com" style="color: #9ca3af;">hello@bibliokit.com</a>
        <a href="https://twitter.com/bibliokit" style="color: #9ca3af;">@bibliokit</a>
        <a href="https://github.com/bibliokit" style="color: #9ca3af;">GitHub</a>
      </div>
      <div style="margin-top: 1rem; color: #9ca3af; font-size: 0.875rem;">&copy; ${new Date().getFullYear()} BiblioKit. All rights reserved.</div>
    </div>
  </footer>
</body>
</html>`;
  
  return baseHtml;
}

function getPageMetadata(pathname: string): string {
  switch (pathname) {
    case '/':
      return `
        <title>BiblioKit - SaaS Software & Figma Plugins</title>
        <meta name="description" content="Professional SaaS software and Figma plugins with secure API management, comprehensive documentation, and world-class support for designers and developers.">
        <meta property="og:title" content="BiblioKit - SaaS Software & Figma Plugins">
        <meta property="og:description" content="Professional SaaS software and Figma plugins with secure API management, comprehensive documentation, and world-class support.">
        <meta property="og:type" content="website">
      `;
    case '/product':
      return `
        <title>AI Rename Layers - BiblioKit</title>
        <meta name="description" content="Automatically rename your Figma layers with AI intelligence. Transform messy, unnamed layers into perfectly organized, contextually named elements in one click.">
        <meta property="og:title" content="AI Rename Layers - BiblioKit">
        <meta property="og:description" content="Automatically rename your Figma layers with AI intelligence. Used by 48k+ designers.">
        <meta property="og:type" content="product">
      `;
    default:
      return `
        <title>BiblioKit</title>
        <meta name="description" content="BiblioKit - Professional SaaS software and Figma plugins">
      `;
  }
}

function getPageSchema(pathname: string, origin: string): string {
  const organizationSchema = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "BiblioKit",
      "description": "Professional SaaS software and Figma plugins with secure API management, comprehensive documentation, and world-class support for designers and developers.",
      "url": "${origin}",
      "logo": "${origin}/logo.svg",
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "hello@bibliokit.com",
        "contactType": "customer service"
      },
      "sameAs": [
        "https://twitter.com/bibliokit",
        "https://github.com/bibliokit"
      ],
      "dateModified": "${new Date().toISOString().split('T')[0]}",
      "keywords": "SaaS software, Figma plugins, API management, secure proxy, developer tools, design tools"
    }
    </script>
  `;

  if (pathname === '/product') {
    return organizationSchema + `
      <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "AI Rename Layers",
        "description": "Automatically rename your Figma layers with AI intelligence. Transform messy, unnamed layers into perfectly organized, contextually named elements in one click.",
        "applicationCategory": "DesignApplication",
        "operatingSystem": "Web Browser, Figma",
        "softwareVersion": "1.0",
        "dateModified": "${new Date().toISOString().split('T')[0]}",
        "author": {
          "@type": "Organization",
          "name": "BiblioKit"
        },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "description": "Free community plugin - completely free to use forever"
        },
        "featureList": [
          "One-Click Renaming",
          "Smart Context Analysis", 
          "Batch Processing",
          "Component Intelligence",
          "Cross-Frame Sync"
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "48000",
          "bestRating": "5"
        }
      }
      </script>
    `;
  }
  
  return organizationSchema;
}

function getPageContent(pathname: string): string {
  switch (pathname) {
    case '/':
      return `
        <header style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1rem;">
          <nav style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
            <h1 style="font-size: 1.5rem; font-weight: bold;">BiblioKit</h1>
            <div style="display: flex; gap: 1rem;">
              <a href="/" style="color: white; text-decoration: none;">Home</a>
              <a href="/product" style="color: white; text-decoration: none;">Product</a>
            </div>
          </nav>
        </header>

        <main>
          <!-- Hero Section -->
          <section style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 6rem 2rem; text-align: center;">
            <div style="max-width: 800px; margin: 0 auto;">
              <div style="display: inline-block; background: rgba(255,255,255,0.2); padding: 0.5rem 1rem; border-radius: 25px; margin-bottom: 2rem;">
                SaaS Software & Figma Plugins
              </div>
              <h1 style="font-size: 3rem; font-weight: bold; margin-bottom: 1.5rem;">BiblioKit</h1>
              <p style="font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.9;">
                Professional SaaS software and Figma plugins with secure API management, comprehensive documentation, and world-class support for designers and developers.
              </p>
              <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                <a href="/product" style="background: white; color: #667eea; padding: 1rem 2rem; border-radius: 0.5rem; text-decoration: none; font-weight: bold;">Get Started Free</a>
                <a href="#features" style="border: 2px solid rgba(255,255,255,0.3); color: white; padding: 1rem 2rem; border-radius: 0.5rem; text-decoration: none;">View Features</a>
              </div>
            </div>
          </section>

          <!-- Features Section -->
          <section id="features" style="padding: 4rem 2rem; background: #f9fafb;">
            <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
              <h2 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 3rem;">Key Features</h2>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                
                <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <div style="font-size: 2rem; margin-bottom: 1rem;">🔒</div>
                  <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">Secure API Management</h3>
                  <p style="color: #6b7280;">Generate, manage, and secure your API keys with enterprise-grade security, rate limiting, and comprehensive usage tracking.</p>
                </div>

                <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <div style="font-size: 2rem; margin-bottom: 1rem;">⚡</div>
                  <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">Figma Plugin Proxy</h3>
                  <p style="color: #6b7280;">Secure OpenAI API proxy for Figma plugins with CORS protection, request validation, and automatic rate limiting.</p>
                </div>

                <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <div style="font-size: 2rem; margin-bottom: 1rem;">👥</div>
                  <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">Help Desk System</h3>
                  <p style="color: #6b7280;">Professional support ticket system with real-time messaging, priority management, and comprehensive admin dashboard.</p>
                </div>

                <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <div style="font-size: 2rem; margin-bottom: 1rem;">💻</div>
                  <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">Developer-First</h3>
                  <p style="color: #6b7280;">Comprehensive API documentation, code examples, and SDKs to get you up and running in minutes.</p>
                </div>

                <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <div style="font-size: 2rem; margin-bottom: 1rem;">⭐</div>
                  <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">Premium Support</h3>
                  <p style="color: #6b7280;">24/7 expert support with guaranteed response times and dedicated account management for enterprise customers.</p>
                </div>

                <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <div style="font-size: 2rem; margin-bottom: 1rem;">✅</div>
                  <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">Production Ready</h3>
                  <p style="color: #6b7280;">Built for scale with monitoring, logging, error tracking, and automatic failover for 99.9% uptime.</p>
                </div>

              </div>
            </div>
          </section>

          <!-- Updated timestamp -->
          <div style="text-align: center; padding: 1rem; background: #f3f4f6; color: #6b7280; font-size: 0.875rem;">
            Updated ${new Date().toISOString().split('T')[0]}
          </div>
        </main>
      `;
    
    case '/product':
      return `
        <header style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1rem;">
          <nav style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
            <h1 style="font-size: 1.5rem; font-weight: bold;">BiblioKit</h1>
            <div style="display: flex; gap: 1rem;">
              <a href="/" style="color: white; text-decoration: none;">Home</a>
              <a href="/product" style="color: white; text-decoration: none;">Product</a>
            </div>
          </nav>
        </header>

        <main>
          <!-- Product Hero -->
          <section style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 6rem 2rem; text-align: center;">
            <div style="max-width: 800px; margin: 0 auto;">
              <div style="display: inline-block; background: rgba(255,255,255,0.2); padding: 0.5rem 1rem; border-radius: 25px; margin-bottom: 2rem;">
                Figma Plugin
              </div>
              <h1 style="font-size: 3rem; font-weight: bold; margin-bottom: 1.5rem;">AI Rename Layers</h1>
              <p style="font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.9;">
                Automatically rename your Figma layers with AI intelligence. Transform messy, unnamed layers into perfectly organized, contextually named elements in one click.
              </p>
              <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                <a href="https://www.figma.com/community/plugin/1523817290746945616/ai-rename-variants" style="background: white; color: #667eea; padding: 1rem 2rem; border-radius: 0.5rem; text-decoration: none; font-weight: bold;" target="_blank">Get Plugin</a>
              </div>
            </div>
          </section>

          <!-- Updated timestamp -->
          <div style="text-align: center; padding: 1rem; background: #f3f4f6; color: #6b7280; font-size: 0.875rem;">
            Updated ${new Date().toISOString().split('T')[0]}
          </div>

          <!-- Features -->
          <section style="padding: 4rem 2rem; background: #f9fafb;">
            <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
              <h2 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 3rem;">⚡ Key Features</h2>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                
                <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <div style="font-size: 2rem; margin-bottom: 1rem;">⚡</div>
                  <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">One-Click Renaming</h3>
                  <p style="color: #6b7280;">Rename all your layers automatically in a single click - no manual work required</p>
                </div>

                <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <div style="font-size: 2rem; margin-bottom: 1rem;">🧠</div>
                  <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">Smart Context Analysis</h3>
                  <p style="color: #6b7280;">AI analyzes layer contents, location, and relationships to choose perfect contextual names</p>
                </div>

                <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <div style="font-size: 2rem; margin-bottom: 1rem;">🔄</div>
                  <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">Batch Processing</h3>
                  <p style="color: #6b7280;">Process multiple layers, frames, and components simultaneously for maximum efficiency</p>
                </div>

              </div>
            </div>
          </section>

          <!-- Benefits -->
          <section style="padding: 4rem 2rem;">
            <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
              <h2 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 3rem;">💡 Benefits</h2>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                
                <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <h3 style="font-size: 1.1rem; font-weight: bold; margin-bottom: 1rem;">Save hours of manual layer organization work</h3>
                </div>

                <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <h3 style="font-size: 1.1rem; font-weight: bold; margin-bottom: 1rem;">Clean up inherited design files with better structure</h3>
                </div>

                <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <h3 style="font-size: 1.1rem; font-weight: bold; margin-bottom: 1rem;">Improve team collaboration with consistent naming</h3>
                </div>

              </div>
            </div>
          </section>

          <!-- Pricing -->
          <section style="padding: 4rem 2rem; background: #f9fafb;">
            <div style="max-width: 600px; margin: 0 auto; text-align: center;">
              <h2 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 3rem;">Pricing</h2>
              <div style="background: white; padding: 3rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h3 style="font-size: 2rem; font-weight: bold; margin-bottom: 1rem;">Free</h3>
                <p style="color: #6b7280; margin-bottom: 2rem;">Community plugin - completely free to use forever</p>
                <a href="https://www.figma.com/community/plugin/1523817290746945616/ai-rename-variants" style="background: #667eea; color: white; padding: 1rem 2rem; border-radius: 0.5rem; text-decoration: none; font-weight: bold;" target="_blank">Install Plugin</a>
              </div>
            </div>
          </section>
        </main>
      `;
    
    default:
      return `
        <header style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1rem;">
          <nav style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
            <h1 style="font-size: 1.5rem; font-weight: bold;">BiblioKit</h1>
            <div style="display: flex; gap: 1rem;">
              <a href="/" style="color: white; text-decoration: none;">Home</a>
              <a href="/product" style="color: white; text-decoration: none;">Product</a>
            </div>
          </nav>
        </header>
        <main style="padding: 4rem 2rem; text-align: center;">
          <h1 style="font-size: 2rem; margin-bottom: 1rem;">Page Not Found</h1>
          <p style="color: #6b7280; margin-bottom: 2rem;">The page you're looking for doesn't exist.</p>
          <a href="/" style="background: #667eea; color: white; padding: 1rem 2rem; border-radius: 0.5rem; text-decoration: none;">Go Home</a>
        </main>
      `;
  }
} 