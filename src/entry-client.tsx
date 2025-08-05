import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

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