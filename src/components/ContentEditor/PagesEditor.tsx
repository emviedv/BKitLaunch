import React from 'react';
import type { Page } from '@/lib/database';

interface PagesEditorProps {
  pages: Page[];
  onChange: (next: Page[]) => void;
}

export const PagesEditor: React.FC<PagesEditorProps> = ({ pages, onChange }) => {
  const [value, setValue] = React.useState<string>(JSON.stringify(pages || [], null, 2));

  React.useEffect(() => {
    setValue(JSON.stringify(pages || [], null, 2));
  }, [pages]);

  const handleChange = (text: string) => {
    setValue(text);
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        onChange(parsed as Page[]);
      }
    } catch {}
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Pages</h3>
      <p className="text-sm text-muted-foreground">Manage static pages. These are saved in JSON first; when you Save & Reload, they sync to the database.</p>
      <div className="space-y-3">
        <label className="block text-sm font-medium">Pages (JSON array)</label>
        <textarea
          className="w-full p-2 border border-border rounded h-64 font-mono text-sm"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder='[{"slug":"about","title":"About Us","content":{"blocks":[]},"isPublished":true}]'
        />
      </div>
      <div className="text-xs text-muted-foreground">Tip: Use unique slugs. Content can be any JSON shape you render on that page.</div>
    </div>
  );
};


