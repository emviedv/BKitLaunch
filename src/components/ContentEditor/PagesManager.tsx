import React from 'react';
import type { Page } from '@/lib/database';

interface PagesManagerProps {
  pages: Page[];
  activeSection: string;
  setActiveSection: (key: string) => void;
}

export const PagesManager: React.FC<PagesManagerProps> = ({ pages, activeSection, setActiveSection }) => {
  if (!Array.isArray(pages) || pages.length === 0) return null;

  return (
    <div className="mt-6">
      <h4 className="font-semibold mb-2 text-sm">Static Pages</h4>
      <div className="space-y-2">
        {pages.map((p) => {
          const key = p.slug || `${p.id}`;
          const isActive = activeSection === 'pages';
          return (
            <button
              key={key}
              type="button"
              className={`w-full text-left p-2 rounded text-sm transition-colors flex items-center justify-between ${
                isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/40'
              }`}
              onClick={() => setActiveSection('pages')}
            >
              <span className="font-medium">{p.title}</span>
              <span className="opacity-70 ml-2 text-xs">/{p.slug}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};


