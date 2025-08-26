import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ROUTE_PATHS } from '@/config/routes';
import ContentEditor from './ContentEditor';

/**
 * AdminGuard component props
 */
interface AdminGuardProps {
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  redirectUrl?: string;
}

/**
 * AdminOnlyMessage - Reusable unauthorized access message
 */
const AdminOnlyMessage: React.FC<{
  title: string;
  message: string;
  redirectUrl: string;
}> = ({ title, message, redirectUrl }) => (
  <div className="container mx-auto px-4 py-16 text-center">
    <h1 className="text-3xl font-bold mb-4">{title}</h1>
    <p className="text-muted-foreground mb-6">{message}</p>
    <Button asChild size="lg">
      <a href={redirectUrl}>Go to Admin Login</a>
    </Button>
  </div>
);

/**
 * AdminGuard - Protects routes that require admin authentication
 * 
 * Shows children only when user is authenticated AND has admin privileges.
 * Shows fallback message for unauthorized users.
 * 
 * @example
 * ```tsx
 * <AdminGuard>
 *   <AdminOnlyContent />
 * </AdminGuard>
 * ```
 */
export const AdminGuard: React.FC<AdminGuardProps> = ({
  children,
  fallbackTitle = "Admins Only",
  fallbackMessage = "You must be an authenticated admin to access the editor.",
  redirectUrl = ROUTE_PATHS.ADMIN
}) => {
  const { isAuthenticated, isAdmin } = useAuth();

  // Show protected content for authenticated admins
  if (isAuthenticated && isAdmin) {
    return <>{children}</>;
  }

  // Show fallback message for unauthorized users
  return (
    <AdminOnlyMessage 
      title={fallbackTitle}
      message={fallbackMessage}
      redirectUrl={redirectUrl}
    />
  );
};

/**
 * ContentEditorPage - The authenticated editor page content
 */
export const ContentEditorPage: React.FC = () => (
  <>
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Content Editor</h1>
      <p className="text-muted-foreground mb-6">Make live edits to content sections and products.</p>
    </div>
    <ContentEditor initialOpen />
  </>
);

export default AdminGuard;