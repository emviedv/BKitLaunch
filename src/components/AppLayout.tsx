import React from 'react';
import { useLocation } from 'wouter';
import Header from './Header';
import AdminHeader from './AdminHeader';
import Footer from './Footer';
import ContentEditor from './ContentEditor';
import { 
  shouldHideHeader,
  shouldHideFooter,
  shouldHideContentEditor,
  isAdminRoute,
  isEditorRoute,
  isHomeRoute
} from '@/config/routes';

/**
 * AppLayout Props
 */
interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * AppLayout - Handles application layout logic
 * 
 * Manages:
 * - AdminHeader visibility (always shown)
 * - Header visibility (hidden on admin/editor routes)
 * - Main content padding (transparent on home/product pages)
 * - Footer visibility (hidden on admin/editor routes)
 * - ContentEditor overlay (hidden on admin/editor routes)
 */
export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [location] = useLocation();

  // Calculate layout properties based on current route
  const showHeader = !shouldHideHeader(location);
  const showFooter = !shouldHideFooter(location);
  const showContentEditor = !shouldHideContentEditor(location);

  // Determine if this should use transparent routing (no top padding)
  const isTransparentRoute = calculateTransparentRoute(location);

  return (
    <div className="min-h-screen flex flex-col">
      {/* AdminHeader - Always visible for admin users */}
      <AdminHeader />
      
      {/* Main site Header - Hidden on admin/editor routes */}
      {showHeader && <Header />}
      
      {/* Main content area with dynamic padding */}
      <main className={`flex-1 ${isTransparentRoute ? 'pt-0' : 'pt-16'}`}>
        {children}
      </main>
      
      {/* Footer - Hidden on admin/editor routes */}
      {showFooter && <Footer />}
      
      {/* ContentEditor overlay - Hidden on admin/editor routes */}
      {showContentEditor && <ContentEditor />}
    </div>
  );
};

/**
 * Calculate if route should use transparent styling (no top padding)
 * 
 * Transparent routes:
 * - Home page
 * - Product pages (dynamic slugs that aren't admin/system routes)
 */
const calculateTransparentRoute = (location: string): boolean => {
  const isAdmin = isAdminRoute(location);
  const isEditor = isEditorRoute(location);
  const isHome = isHomeRoute(location);

  // System routes that should never be transparent
  const systemRoutes = ['admin', 'editor', 'design-system', 'test', 'database', 'docs'];
  
  // Extract first path segment to check if it's a system route
  const slug = (location || '/').replace(/^\/+/, '').split('/')[0] || '';
  const isAdminEditor = location.startsWith('/admin') || location.startsWith('/editor');
  
  // Consider it a product page if it has a slug and isn't a system route
  const isProductPage = !!(slug && !systemRoutes.includes(slug));
  
  // Transparent if it's home or a product page, but not admin/editor
  return (!isAdmin && !isEditor) && (isHome || (isProductPage && !isAdminEditor));
};

export default AppLayout;