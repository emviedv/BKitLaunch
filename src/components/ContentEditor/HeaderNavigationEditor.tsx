import React from 'react';
import { reorderArray } from '@/lib/utils';

export interface HeaderNavItem {
  label: string;
  href: string;
}

interface HeaderNavigationEditorProps {
  items: HeaderNavItem[];
  onChange: (nextItems: HeaderNavItem[]) => void;
}

export const HeaderNavigationEditor: React.FC<HeaderNavigationEditorProps> = ({ items, onChange }) => {
  const handleAdd = () => {
    const next = [...(items || []), { label: 'New Link', href: '#' }];
    onChange(next);
  };

  const handleUpdate = (index: number, field: keyof HeaderNavItem, value: string) => {
    const next = (items || []).map((item, i) => (i === index ? { ...item, [field]: value } : item));
    onChange(next);
  };

  const handleRemove = (index: number) => {
    const next = (items || []).filter((_, i) => i !== index);
    onChange(next);
  };

  const handleMove = (from: number, to: number) => {
    const next = reorderArray(items || [], from, to);
    onChange(next);
  };

  return (
    <div className="border-t border-border pt-4">
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium">Navigation Links</label>
        <button onClick={handleAdd} className="button-secondary text-xs">
          + Add Link
        </button>
      </div>

      <div className="space-y-3">
        {(items || []).map((navItem, index) => {
          const stableKey = `nav-${index}-${navItem?.label?.length || 0}-${navItem?.href?.length || 0}`;
          return (
          <div key={stableKey} className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
            <input
              type="text"
              value={navItem?.label || ''}
              onChange={(e) => handleUpdate(index, 'label', e.target.value)}
              className="p-2 border border-border rounded text-sm"
              placeholder="Link label (e.g., Features)"
              aria-label={`Header nav ${index + 1} label`}
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={navItem?.href || ''}
                onChange={(e) => handleUpdate(index, 'href', e.target.value)}
                className="flex-1 p-2 border border-border rounded text-sm"
                placeholder="/#contact or #pricing or /about"
                aria-label={`Header nav ${index + 1} href`}
              />
              <button
                onClick={() => {
                  if (index <= 0) return;
                  handleMove(index, index - 1);
                }}
                disabled={index === 0}
                className="text-gray-500 hover:text-gray-700 disabled:opacity-50 px-2 py-1"
                title="Move up"
                aria-label={`Move header nav link ${index + 1} up`}
              >
                ↑
              </button>
              <button
                onClick={() => {
                  if (index >= (items?.length || 0) - 1) return;
                  handleMove(index, index + 1);
                }}
                disabled={index === ((items?.length || 0) - 1)}
                className="text-gray-500 hover:text-gray-700 disabled:opacity-50 px-2 py-1"
                title="Move down"
                aria-label={`Move header nav link ${index + 1} down`}
              >
                ↓
              </button>
              <button
                onClick={() => handleRemove(index)}
                className="text-red-600 hover:bg-red-50 px-2 py-1 rounded text-sm"
                aria-label={`Remove header nav link ${index + 1}`}
              >
                Remove
              </button>
            </div>
          </div>
          )
        })}

        {(items?.length || 0) === 0 && (
          <div className="text-center py-6 text-muted-foreground text-sm">No navigation links yet.</div>
        )}
      </div>
    </div>
  );
};


