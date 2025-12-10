import React from 'react';
import { Route, Switch } from 'wouter';

// UI Components
import { Button } from '@/components/ui/button';

// Page Components
import BiblioKitLanding from './components/BiblioKitLanding';

// Layout & Auth Components
import ComingSoon from './components/ComingSoon';
import Header from './components/Header';
import Footer from './components/Footer';
import AIRenameVariantsPage from './components/AIRenameVariantsPage';
import DynamicProductPage from './components/DynamicProductPage';
import RemovePrototypeLinkPage from './components/RemovePrototypeLinkPage';
import BlogPage from './components/BlogPage';
import BlogArticlePage from './components/BlogArticlePage';

// Context & Hooks
import { usePublishedContent } from './hooks/usePublishedContent';
import { useSEO } from './hooks/useSEO';
import { useHashScroll } from './hooks/useHashScroll';
import { useScrollTopOnHome } from './hooks/useScrollTopOnHome';

// Configuration
import { ROUTE_PATHS } from './config/routes';

/**
 * Content interface for published content structure
 */
interface PublishedContent {
  settings?: {
    visibility?: {
      cta?: boolean;
    };
  };
  cta?: {
    title: string;
    description: string;
    primaryButton: string;
    secondaryButton: string;
    primaryButtonLink?: string;
    secondaryButtonLink?: string;
  };
}

/**
 * HomePage - Main landing page component
 */
const HomePage: React.FC = () => {
  const { content, error } = usePublishedContent();

  // Note: Loading state removed to prevent flash during hydration
  // Content will smoothly transition from static fallback to dynamic content

  // Show error state
  if (error && !content) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Content Error</h1>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <BiblioKitLanding />
  );
};

/**
 * LandingLayout - Minimal shell for the public landing experience
 */
const LandingLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative min-h-screen flex flex-col">
    <Header />
    <main className="flex-1 pt-16">
      {children}
    </main>
    <Footer />
  </div>
);

/**
 * AppContent - Main application content wrapper
 * 
 * Handles routing logic for the landing-only experience while preserving
 * scroll behavior hooks.
 */
const AppContent: React.FC = () => {
  // Ensure #hash links scroll to sections correctly
  useScrollTopOnHome();
  useHashScroll();

  const { content } = usePublishedContent();
  const shouldSkipSEO = React.useCallback((path: string) => {
    const normalizedPath = (path || '/').split('?')[0].replace(/\/+$/, '') || '/';
    if (normalizedPath === ROUTE_PATHS.AI_RENAME_VARIANTS) return true;
    if (normalizedPath === ROUTE_PATHS.UXBIBLIO) return true;
    if (normalizedPath.startsWith('/blog/') && normalizedPath !== ROUTE_PATHS.BLOG) return true;
    return false;
  }, []);

  useSEO(content, { shouldSkip: shouldSkipSEO });

  const comingSoonEnabled = Boolean((content.settings as any)?.comingSoonEnabled);

  // Gate: show ComingSoon for all routes if enabled
  if (comingSoonEnabled) {
    return (
      <LandingLayout>
        <ComingSoon />
      </LandingLayout>
    );
  }

  return (
    <LandingLayout>
        <Switch>
          <Route path={ROUTE_PATHS.HOME} component={HomePage} />
          <Route path={ROUTE_PATHS.AI_RENAME_VARIANTS} component={AIRenameVariantsPage} />
          <Route path={ROUTE_PATHS.UXBIBLIO}>
            {() => <DynamicProductPage slug="uxbiblio" />}
          </Route>
          <Route path={ROUTE_PATHS.BLOG_ARTICLE}>
            {(params) => <BlogArticlePage slug={params?.slug ?? ''} />}
          </Route>
          <Route path={ROUTE_PATHS.BLOG} component={BlogPage} />
          <Route path={ROUTE_PATHS.REMOVE_PROTOTYPE_LINK} component={RemovePrototypeLinkPage} />
          <Route>
            <div className="container mx-auto px-4 py-16 text-center">
              <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
              <p className="text-muted-foreground mb-8">
                The page you're looking for doesn't exist.
              </p>
              <Button asChild size="lg">
                <a href="/">Go Home</a>
              </Button>
            </div>
          </Route>
        </Switch>
    </LandingLayout>
  );
};

/**
 * App - Root application component
 * 
 * Provides authentication context and routing setup.
 * Entry point for the entire application.
 */
const App: React.FC = () => {
  return <AppContent />;
}

export default App; 
