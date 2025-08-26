import React from 'react';
import { Route, Switch } from 'wouter';

// UI Components
import { Button } from '@/components/ui/button';

// Page Components  
import Hero from './components/Hero';
import Features from './components/Features';
import Pricing from './components/Pricing';
import Waitlist from './components/Waitlist';
import { Docs } from './components/Docs';
import DynamicProductPage from './components/DynamicProductPage';
import AdminDashboard from './components/AdminDashboard';
import DesignSystem from './components/DesignSystem';
import DatabaseTest from './components/DatabaseTest';

// Layout & Auth Components
import AppLayout from './components/AppLayout';
import { AdminGuard, ContentEditorPage } from './components/AdminGuard';
import { ContentBasedCTASection } from './components/CTASection';

// Context & Hooks
import { AuthProvider } from './contexts/AuthContext';
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
 * TestPage - Simple test component for development routes only
 */
const TestPage: React.FC = () => (
  <div className="container mx-auto px-4 py-16">
    <h1 className="text-4xl font-bold">Welcome</h1>
    <p>Routing is configured.</p>
  </div>
);

/**
 * HomePage - Main landing page component
 * 
 * Renders the home page with Hero, Features, Pricing, CTA, and Waitlist sections.
 * Handles content loading, error states, and SEO metadata updates.
 */
const HomePage: React.FC = () => {
  const { content, loading, error, source } = usePublishedContent();
  
  // Update SEO metadata for client-side navigation
  useSEO(content);

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
    <>
      <Hero />
      <Features />
      <Pricing />
      <ContentBasedCTASection content={content} />
      <Waitlist />
    </>
  );
};

/**
 * AppContent - Main application content wrapper
 * 
 * Handles routing logic and provides layout wrapper with scroll behavior hooks.
 * Must be inside Router context to access useLocation.
 */
const AppContent: React.FC = () => {
  // Ensure #hash links scroll to sections correctly
  useScrollTopOnHome();
  useHashScroll();

  return (
    <AppLayout>
        <Switch>
          <Route path={ROUTE_PATHS.HOME} component={HomePage} />
          {import.meta.env.DEV && <Route path={ROUTE_PATHS.TEST} component={TestPage} />}
          {import.meta.env.DEV && <Route path={ROUTE_PATHS.DESIGN_SYSTEM} component={DesignSystem} />}
          {/* Docs page */}
          <Route path={ROUTE_PATHS.DOCS} component={Docs} />
          {/* All product pages are handled by the dynamic slug route below */}
          <Route path={ROUTE_PATHS.ADMIN} component={AdminDashboard} />
          <Route path={ROUTE_PATHS.EDITOR}>
            <AdminGuard>
              <ContentEditorPage />
            </AdminGuard>
          </Route>
          <Route path={ROUTE_PATHS.EDITOR_SLASH}>
            <AdminGuard>
              <ContentEditorPage />
            </AdminGuard>
          </Route>
          {import.meta.env.DEV && (
            <Route path={ROUTE_PATHS.DATABASE}>
              <div className="container mx-auto px-4 py-16">
                <DatabaseTest />
              </div>
            </Route>
          )}
          <Route path={ROUTE_PATHS.PRODUCT_SLUG}>
            {(params: { productSlug?: string }) => (
              params?.productSlug ? (
                <DynamicProductPage slug={params.productSlug} />
              ) : null
            )}
          </Route>
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
    </AppLayout>
  );
};

/**
 * App - Root application component
 * 
 * Provides authentication context and routing setup.
 * Entry point for the entire application.
 */
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App; 