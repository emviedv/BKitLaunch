import React from 'react';
import type { ComponentType } from 'react';

/**
 * Route path constants - single source of truth for all route paths
 */
export const ROUTE_PATHS = {
  HOME: '/',
  ADMIN: '/admin', 
  EDITOR: '/editor',
  EDITOR_SLASH: '/editor/',
  DOCS: '/docs',
  PRODUCT_SLUG: '/:productSlug',
  // Development only routes
  TEST: '/test',
  DESIGN_SYSTEM: '/design-system',
  DATABASE: '/database',
} as const;

/**
 * Route configuration interface
 */
export interface RouteConfig {
  path: string;
  component?: ComponentType<any>;
  render?: (params?: any) => React.ReactElement | null;
  devOnly?: boolean;
  requiresAuth?: boolean;
}

/**
 * All application routes configuration
 * Extracted from App.tsx to reduce complexity and improve maintainability
 */
export const routes: RouteConfig[] = [
  {
    path: ROUTE_PATHS.HOME,
    devOnly: false,
    requiresAuth: false,
  },
  {
    path: ROUTE_PATHS.DOCS, 
    devOnly: false,
    requiresAuth: false,
  },
  {
    path: ROUTE_PATHS.ADMIN,
    devOnly: false,
    requiresAuth: false, // Admin component handles its own auth
  },
  {
    path: ROUTE_PATHS.EDITOR,
    devOnly: false, 
    requiresAuth: true, // Requires admin auth
  },
  {
    path: ROUTE_PATHS.EDITOR_SLASH,
    devOnly: false,
    requiresAuth: true, // Requires admin auth  
  },
  {
    path: ROUTE_PATHS.PRODUCT_SLUG,
    devOnly: false,
    requiresAuth: false,
  },
  // Development only routes
  {
    path: ROUTE_PATHS.TEST,
    devOnly: true,
    requiresAuth: false,
  },
  {
    path: ROUTE_PATHS.DESIGN_SYSTEM,
    devOnly: true, 
    requiresAuth: false,
  },
  {
    path: ROUTE_PATHS.DATABASE,
    devOnly: true,
    requiresAuth: false,
  },
];

/**
 * Check if a route should be available based on environment
 */
export const shouldShowRoute = (route: RouteConfig): boolean => {
  if (route.devOnly && !import.meta.env.DEV) {
    return false;
  }
  return true;
};

/**
 * Check if current location matches admin routes
 */
export const isAdminRoute = (location: string): boolean => {
  return location === ROUTE_PATHS.ADMIN;
};

/**
 * Check if current location matches editor routes  
 */
export const isEditorRoute = (location: string): boolean => {
  return location === ROUTE_PATHS.EDITOR || location.startsWith('/editor/');
};

/**
 * Check if current location is home
 */
export const isHomeRoute = (location: string): boolean => {
  return location === ROUTE_PATHS.HOME;
};

/**
 * Check if route should hide main Header (admin/editor dedicated routes)
 */
export const shouldHideHeader = (location: string): boolean => {
  return isAdminRoute(location) || isEditorRoute(location);
};

/**
 * Check if route should hide Footer (admin/editor dedicated routes)
 */
export const shouldHideFooter = (location: string): boolean => {
  return isAdminRoute(location) || isEditorRoute(location);
};

/**
 * Check if route should hide ContentEditor overlay (admin/editor dedicated routes)
 */
export const shouldHideContentEditor = (location: string): boolean => {
  return isAdminRoute(location) || isEditorRoute(location);
};