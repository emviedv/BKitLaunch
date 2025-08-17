import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Router } from 'wouter';
import './index.css';

// Disable native scroll restoration so refresh starts at the top unless a hash is present
try {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
} catch {}

// Basic production/consent-gated Hotjar loader for public routes only
const loadHotjarIfAllowed = (): void => {
  try {
    const isProd = location.hostname !== 'localhost' && location.hostname !== '127.0.0.1';
    const isAdmin = location.pathname.startsWith('/admin');
    const consent = (window as any).__USER_CONSENT__?.analytics === true ||
      (typeof localStorage !== 'undefined' && localStorage.getItem('consent:analytics') === 'true');
    const alreadyLoaded = typeof (window as any).hj === 'function' ||
      !!document.querySelector('script[src*="hotjar-6484850.js"]');
    if (!isProd || isAdmin || !consent || alreadyLoaded) return;

    // Define hj and _hjSettings BEFORE injecting the loader script
    (window as any).hj = (window as any).hj || function () { ((window as any).hj.q = (window as any).hj.q || []).push(arguments); };
    (window as any)._hjSettings = { hjid: 6484850, hjsv: 6 };
    // Allowlist domains via CSP (Edge sends Report-Only policy allowing Hotjar domains)
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://static.hotjar.com/c/hotjar-6484850.js?sv=6';
    document.head.appendChild(s);
  } catch {
    // no-op
  }
};

// Check if we're doing SSR hydration or normal client rendering
const rootElement = document.getElementById('root')!;
const hasSSRContent = rootElement.innerHTML.trim().length > 0;
const isLocalDevHost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

// In local dev, prefer a clean client render to avoid noisy hydration warnings/mismatches
if (hasSSRContent && !isLocalDevHost) {
  ReactDOM.hydrateRoot(
    rootElement,
    <React.StrictMode>
      <Router>
        <App />
      </Router>
    </React.StrictMode>
  );
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Router>
        <App />
      </Router>
    </React.StrictMode>
  );
}

// Load analytics last, after render
queueMicrotask(loadHotjarIfAllowed);