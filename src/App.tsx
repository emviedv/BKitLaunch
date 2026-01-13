import React from 'react';
import { Route, Switch, useLocation } from 'wouter';

// UI Components
import { Button } from '@/components/ui/button';

// Page Components
import BiblioKitLanding from './components/BiblioKitLanding';

// Layout & Auth Components
import ComingSoon from './components/ComingSoon';
import Header from './components/Header';
import Footer from './components/Footer';
import AIRenameVariantsPage from './components/AIRenameVariantsPage';
import ComponentQAPage from './components/ComponentQAPage';
import BiblioCleanPage from './components/BiblioCleanPage';
import OrganizeFilePage from './components/OrganizeFilePage';
import StateBuilderPage from './components/StateBuilderPage';
import BiblioTablePage from './components/BiblioTablePage';
import DynamicProductPage from './components/DynamicProductPage';
import RemovePrototypeLinkPage from './components/RemovePrototypeLinkPage';
import ResourcesPage from './components/ResourcesPage';
import BlogPage from './components/BlogPage';
import BlogArticlePage from './components/BlogArticlePage';
import Docs from './components/Docs';
import AdminPage from './components/AdminPage';
import AboutPage from './components/AboutPage';
import ProductsPage from './components/ProductsPage';
import LearnPage from './components/LearnPage';
import DesignOpsFundamentalsPage from './components/DesignOpsFundamentalsPage';
import ScaleResizerPage from './components/ScaleResizerPage';

// Context & Hooks
import { usePublishedContent } from './hooks/usePublishedContent';
import { useSEO } from './hooks/useSEO';
import { useHashScroll } from './hooks/useHashScroll';
import { useScrollTopOnHome } from './hooks/useScrollTopOnHome';

// Configuration
import { ROUTE_PATHS } from './config/routes';

const SIMILAR_PATHS = [
  ROUTE_PATHS.BLOG,
  ROUTE_PATHS.RESOURCES,
  ROUTE_PATHS.DOCS,
  ROUTE_PATHS.ABOUT,
  ROUTE_PATHS.BIBLIO_RENAME,
  ROUTE_PATHS.BIBLIO_CLEAN,
  ROUTE_PATHS.BIBLIO_AUDIT,
  ROUTE_PATHS.BIBLIO_TABLE,
  ROUTE_PATHS.BIBLIO_STATES,
  ROUTE_PATHS.BIBLIO_ORGANIZE,
  ROUTE_PATHS.UXBIBLIO,
  ROUTE_PATHS.LEARN,
  ROUTE_PATHS.SCALE_RESIZER,
];

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

const LegacyAIRenameRedirect: React.FC = () => {
  const [, navigate] = useLocation();

  React.useEffect(() => {
    navigate(ROUTE_PATHS.BIBLIO_RENAME, { replace: true });
  }, [navigate]);

  return <AIRenameVariantsPage />;
};

const NotFoundPage: React.FC = () => {
  const [location] = useLocation();
  const normalizedPath = (location || '/').split('?')[0].replace(/\/+$/, '') || '/';
  let suggestedPath: string = ROUTE_PATHS.HOME;
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.bibliokit.com';

  if (normalizedPath.startsWith('/blog/')) {
    suggestedPath = ROUTE_PATHS.BLOG;
  } else if (normalizedPath.startsWith('/resources/')) {
    suggestedPath = ROUTE_PATHS.RESOURCES;
  } else {
    const segments = normalizedPath.split('/').filter(Boolean);
    if (segments.length > 0) {
      const firstSegment = `/${segments[0]}`;
      if (SIMILAR_PATHS.includes(firstSegment as any)) {
        suggestedPath = firstSegment;
      }
    }
  }

  const suggestedUrl = `${origin}${suggestedPath}`;

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">
        Oops! We lost this page, but here&apos;s how to get back on track.
      </h1>
      <p className="text-muted-foreground mb-3">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <p className="text-sm text-muted-foreground mb-8">
        Try <a className="underline underline-offset-4" href={suggestedPath}>{suggestedUrl}</a>{' '}
        to get back to the tools fast.
      </p>
      <Button asChild size="lg">
        <a href="/">Go Home</a>
      </Button>
    </div>
  );
};

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
    if (normalizedPath === ROUTE_PATHS.BIBLIO_RENAME) return true;
    if (normalizedPath === ROUTE_PATHS.BIBLIO_CLEAN) return true;
    if (normalizedPath === ROUTE_PATHS.BIBLIO_AUDIT) return true;
    if (normalizedPath === ROUTE_PATHS.BIBLIO_TABLE) return true;
    if (normalizedPath === ROUTE_PATHS.BIBLIO_STATES) return true;
    if (normalizedPath === ROUTE_PATHS.BIBLIO_ORGANIZE) return true;
    if (normalizedPath === ROUTE_PATHS.AI_RENAME_VARIANTS) return true;
    if (normalizedPath === ROUTE_PATHS.UXBIBLIO) return true;
    if (normalizedPath === ROUTE_PATHS.SCALE_RESIZER) return true;
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
          <Route path={ROUTE_PATHS.ABOUT} component={AboutPage} />
          <Route path={ROUTE_PATHS.PRODUCTS} component={ProductsPage} />
          <Route path={ROUTE_PATHS.DOCS} component={Docs} />
          <Route path={ROUTE_PATHS.BIBLIO_RENAME} component={AIRenameVariantsPage} />
          <Route path={ROUTE_PATHS.BIBLIO_AUDIT} component={ComponentQAPage} />
          <Route path={ROUTE_PATHS.BIBLIO_CLEAN} component={BiblioCleanPage} />
          <Route path={ROUTE_PATHS.BIBLIO_TABLE} component={BiblioTablePage} />
          <Route path={ROUTE_PATHS.BIBLIO_STATES} component={StateBuilderPage} />
          <Route path={ROUTE_PATHS.BIBLIO_ORGANIZE} component={OrganizeFilePage} />
          <Route path={ROUTE_PATHS.AI_RENAME_VARIANTS} component={LegacyAIRenameRedirect} />
          <Route path={ROUTE_PATHS.SCALE_RESIZER} component={ScaleResizerPage} />
          <Route path={ROUTE_PATHS.ADMIN} component={AdminPage} />
          <Route path={ROUTE_PATHS.UXBIBLIO}>
            {() => <DynamicProductPage slug="uxbiblio" />}
          </Route>
          <Route path={ROUTE_PATHS.BLOG_ARTICLE}>
            {(params) => <BlogArticlePage slug={params?.slug ?? ''} />}
          </Route>
          <Route path={ROUTE_PATHS.BLOG} component={BlogPage} />
          <Route path={ROUTE_PATHS.LEARN_DESIGN_OPS_FUNDAMENTALS} component={DesignOpsFundamentalsPage} />
          <Route path={ROUTE_PATHS.LEARN} component={LearnPage} />
          <Route path={ROUTE_PATHS.RESOURCES} component={ResourcesPage} />
          <Route path={ROUTE_PATHS.REMOVE_PROTOTYPE_LINK} component={RemovePrototypeLinkPage} />
          <Route>
            <NotFoundPage />
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
