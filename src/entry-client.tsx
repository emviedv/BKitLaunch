import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Basic production/consent-gated Hotjar loader for public routes only
const loadHotjarIfAllowed = () => {
  try {
    const isProd = location.hostname !== 'localhost' && location.hostname !== '127.0.0.1';
    const isAdmin = location.pathname.startsWith('/admin');
    const consent = (window as any).__USER_CONSENT__?.analytics === true ||
      (typeof localStorage !== 'undefined' && localStorage.getItem('consent:analytics') === 'true');
    if (!isProd || isAdmin || !consent) return;

    // Allowlist domains via CSP (updated in netlify.toml): static.hotjar.com, script.hotjar.com
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://static.hotjar.com/c/hotjar-6484850.js?sv=6';
    document.head.appendChild(s);
    (window as any).hj = (window as any).hj || function () { ((window as any).hj.q = (window as any).hj.q || []).push(arguments); };
    (window as any)._hjSettings = { hjid: 6484850, hjsv: 6 };
  } catch {}
};

// Check if we're doing SSR hydration or normal client rendering
const rootElement = document.getElementById('root')!;
const hasSSRContent = rootElement.innerHTML.trim().length > 0;

if (hasSSRContent) {
  // SSR hydration
  ReactDOM.hydrateRoot(
    rootElement,
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  // Normal client-side rendering (fallback)
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// Load analytics last, after render
queueMicrotask(loadHotjarIfAllowed);