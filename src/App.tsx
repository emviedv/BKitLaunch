import React, { useState, useEffect } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import Header from './components/Header';
import AdminHeader from './components/AdminHeader';
import Hero from './components/Hero';
import Features from './components/Features';
import Pricing from './components/Pricing';
import DynamicProductPage from './components/DynamicProductPage';
import { Docs } from './components/Docs';
import DatabaseTest from './components/DatabaseTest';
import Footer from './components/Footer';
import ContentEditor from './components/ContentEditor';
import Waitlist from './components/Waitlist';
import AdminDashboard from './components/AdminDashboard';
import DesignSystem from './components/DesignSystem';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { usePublishedContent } from './hooks/usePublishedContent';
import { useSEO } from './hooks/useSEO';
import { useHashScroll } from './hooks/useHashScroll';
import { useScrollTopOnHome } from './hooks/useScrollTopOnHome';
import productData from '@/data/products.json';
import { Button } from '@/components/ui/button';

// Simple test component (dev-only route)
const TestPage = () => (
  <div className="container mx-auto px-4 py-16">
    <h1 className="text-4xl font-bold">Welcome</h1>
    <p>Routing is configured.</p>
  </div>
);

// Home page component
const HomePage = () => {
  console.log('HomePage rendering...');
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

  console.log(`Content loaded from: ${source}`);

  // Check if CTA section should be visible
  const shouldShowCTA = content.settings?.visibility?.cta !== false;

  return (
    <>
      <Hero />
      <Features />
      <Pricing />
      
      {/* CTA Section - conditionally rendered based on visibility settings */}
      {shouldShowCTA && content.cta && (
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {content.cta.title}
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                {content.cta.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">{content.cta.primaryButton}</Button>
                <Button size="lg" variant="outline">{content.cta.secondaryButton}</Button>
              </div>
            </div>
          </div>
        </section>
      )}
      <Waitlist />
    </>
  );
};

// AppContent component to access useLocation hook inside Router
const AppContent = () => {
  const [location] = useLocation();
  const isAdminRoute = location === '/admin';
  const isEditorRoute = location === '/editor' || location.startsWith('/editor/');
  const isHomeRoute = location === '/';
  const { isAuthenticated, isAdmin } = useAuth();
  const slug = (location || '/').replace(/^\/+/, '').split('/')[0] || '';
  const isAdminEditor = location.startsWith('/admin') || location.startsWith('/editor');
  const isProductPathFallback = !!(slug && !['', 'admin', 'editor', 'design-system', 'test', 'database'].includes(slug));
  const isTransparentRoute = (!isAdminRoute && !isEditorRoute) && (isHomeRoute || (isProductPathFallback && !isAdminEditor));

  // Ensure #hash links scroll to sections correctly
  useScrollTopOnHome();
  useHashScroll();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Show AdminHeader banner for admins on all routes */}
      <AdminHeader />
      {/* Hide main site Header on admin and editor dedicated routes to avoid overlap */}
      {!isAdminRoute && !isEditorRoute && <Header />}
      <main className={`flex-1 ${isTransparentRoute ? 'pt-0' : 'pt-16'}`}>
        <Switch>
          <Route path="/" component={HomePage} />
          {import.meta.env.DEV && <Route path="/test" component={TestPage} />}
          {import.meta.env.DEV && <Route path="/design-system" component={DesignSystem} />}
          {/* Docs page */}
          <Route path="/docs" component={Docs} />
          {/* All product pages are handled by the dynamic slug route below */}
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/editor">
            {isAuthenticated && isAdmin ? (
              <>
                <div className="container mx-auto px-4 py-6">
                  <h1 className="text-2xl font-bold mb-4">Content Editor</h1>
                  <p className="text-muted-foreground mb-6">Make live edits to content sections and products.</p>
                </div>
                <ContentEditor initialOpen />
              </>
            ) : (
              <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-3xl font-bold mb-4">Admins Only</h1>
                <p className="text-muted-foreground mb-6">You must be an authenticated admin to access the editor.</p>
                <Button asChild size="lg">
                  <a href="/admin">Go to Admin Login</a>
                </Button>
              </div>
            )}
          </Route>
          <Route path="/editor/">
            {isAuthenticated && isAdmin ? (
              <>
                <div className="container mx-auto px-4 py-6">
                  <h1 className="text-2xl font-bold mb-4">Content Editor</h1>
                  <p className="text-muted-foreground mb-6">Make live edits to content sections and products.</p>
                </div>
                <ContentEditor initialOpen />
              </>
            ) : (
              <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-3xl font-bold mb-4">Admins Only</h1>
                <p className="text-muted-foreground mb-6">You must be an authenticated admin to access the editor.</p>
                <Button asChild size="lg">
                  <a href="/admin">Go to Admin Login</a>
                </Button>
              </div>
            )}
          </Route>
          {import.meta.env.DEV && (
            <Route path="/database">
              <div className="container mx-auto px-4 py-16">
                <DatabaseTest />
              </div>
            </Route>
          )}
          <Route path="/:productSlug">
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
      </main>
      {/* Don't render Footer on admin or editor routes for cleaner editing experience */}
      {!isAdminRoute && !isEditorRoute && <Footer />}
      {/* Only render ContentEditor overlay on non-admin, non-editor routes */}
      {!isAdminRoute && !isEditorRoute && <ContentEditor />}
    </div>
  );
};

function App() {
  console.log('App rendering...');
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App; 