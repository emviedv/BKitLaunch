import React, { useState, useEffect } from 'react';
import { Router, Route, Switch } from 'wouter';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Pricing from './components/Pricing';
import ProductPage from './components/ProductPage';
import DatabaseTest from './components/DatabaseTest';
import Footer from './components/Footer';
import ContentEditor from './components/ContentEditor';
import Waitlist from './components/Waitlist';
import AdminHeader from './components/AdminHeader';
import AdminDashboard from './components/AdminDashboard';
import { AuthProvider } from './contexts/AuthContext';
import productData from '@/data/products.json';

// Simple test component
const TestPage = () => (
  <div className="container mx-auto px-4 py-16">
    <h1 className="text-4xl font-bold">Test Page Works!</h1>
    <p>If you see this, routing is working.</p>
  </div>
);

// Home page component
const HomePage = () => {
  console.log('HomePage rendering...');
  const [content, setContent] = useState(productData);

  useEffect(() => {
    const saved = localStorage.getItem('bibliokit-content');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setContent(parsed);
      } catch (error) {
        console.error('Failed to load saved content:', error);
      }
    }
  }, []);

  // Check if CTA section should be visible
  const shouldShowCTA = content.settings?.visibility?.cta !== false;

  return (
    <>
      <Hero />
      <Features />
      <Pricing />
      
      {/* CTA Section - conditionally rendered based on visibility settings */}
      {shouldShowCTA && (
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to get started?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of developers and designers who trust BiblioKit 
                for their SaaS and plugin development needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="btn-primary">
                  Start Free Trial
                </button>
                <button className="btn-secondary">
                  Schedule Demo
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
      <Waitlist />
    </>
  );
};

function App() {
  console.log('App rendering...');
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <AdminHeader />
          <Header />
          <main className="flex-1">
            <Switch>
              <Route path="/" component={HomePage} />
              <Route path="/test" component={TestPage} />
              <Route path="/product" component={ProductPage} />
              <Route path="/admin" component={AdminDashboard} />
              <Route path="/database">
                <div className="container mx-auto px-4 py-16">
                  <DatabaseTest />
                </div>
              </Route>
              <Route>
                <div className="container mx-auto px-4 py-16 text-center">
                  <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
                  <p className="text-muted-foreground mb-8">
                    The page you're looking for doesn't exist.
                  </p>
                  <a 
                    href="/" 
                    className="btn-primary"
                  >
                    Go Home
                  </a>
                </div>
              </Route>
            </Switch>
          </main>
          <Footer />
          <ContentEditor />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 