import React from 'react';
import { reorderArray } from '@/lib/utils';

interface FooterSectionItem {
  title: string;
  links: Array<{ label: string; href: string }>;
}

interface FooterEditorProps {
  description: string;
  sections: FooterSectionItem[];
  visibility: boolean;
  onChangeDescription: (value: string) => void;
  onChangeSections: (next: FooterSectionItem[]) => void;
  onChangeVisibility: (isVisible: boolean) => void;
}

export const FooterEditor: React.FC<FooterEditorProps> = ({
  description,
  sections,
  visibility,
  onChangeDescription,
  onChangeSections,
  onChangeVisibility,
}) => {
  const addSection = () => {
    const next = [...(sections || []), { title: 'New Section', links: [] }];
    onChangeSections(next);
  };

  const updateSectionTitle = (index: number, value: string) => {
    const next = (sections || []).map((s, i) => (i === index ? { ...s, title: value } : s));
    onChangeSections(next);
  };

  const moveSection = (from: number, to: number) => {
    const next = reorderArray(sections || [], from, to);
    onChangeSections(next);
  };

  const removeSection = (index: number) => {
    const next = (sections || []).filter((_, i) => i !== index);
    onChangeSections(next);
  };

  const addLink = (sectionIndex: number) => {
    const group = (sections || [])[sectionIndex] || { title: '', links: [] };
    const nextLinks = [...(group.links || []), { label: 'New Link', href: '#' }];
    const next = (sections || []).map((s, i) => (i === sectionIndex ? { ...s, links: nextLinks } : s));
    onChangeSections(next);
  };

  const updateLink = (sectionIndex: number, linkIndex: number, field: 'label' | 'href', value: string) => {
    const group = (sections || [])[sectionIndex] || { title: '', links: [] };
    const links = [...(group.links || [])];
    links[linkIndex] = { ...(links[linkIndex] || {}), [field]: value } as any;
    const next = (sections || []).map((s, i) => (i === sectionIndex ? { ...s, links } : s));
    onChangeSections(next);
  };

  const moveLink = (sectionIndex: number, from: number, to: number) => {
    const group = (sections || [])[sectionIndex] || { title: '', links: [] };
    const nextLinks = reorderArray(group.links || [], from, to);
    const next = (sections || []).map((s, i) => (i === sectionIndex ? { ...s, links: nextLinks } : s));
    onChangeSections(next);
  };

  const removeLink = (sectionIndex: number, linkIndex: number) => {
    const group = (sections || [])[sectionIndex] || { title: '', links: [] };
    const nextLinks = (group.links || []).filter((_, i) => i !== linkIndex);
    const next = (sections || []).map((s, i) => (i === sectionIndex ? { ...s, links: nextLinks } : s));
    onChangeSections(next);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Footer Section</h3>
      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          id="footer-visible"
          checked={visibility}
          onChange={(e) => onChangeVisibility(e.target.checked)}
          className="rounded border-border"
        />
        <label htmlFor="footer-visible" className="text-sm">Visible on website</label>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={description || ''}
          onChange={(e) => onChangeDescription(e.target.value)}
          className="w-full p-2 border border-border rounded h-24"
          placeholder="Footer description"
        />
      </div>

      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium">Footer Sections</label>
          <button onClick={addSection} className="button-secondary text-xs">
            + Add Section
          </button>
        </div>

        <div className="space-y-4">
          {(sections || []).map((sectionItem, si) => (
            <div key={si} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 w-full">
                  <span className="text-sm text-muted-foreground">Section #{si + 1}</span>
                  <input
                    type="text"
                    value={sectionItem?.title || ''}
                    onChange={(e) => updateSectionTitle(si, e.target.value)}
                    className="flex-1 p-2 border border-border rounded text-sm"
                    placeholder="Section title (e.g., Product)"
                    aria-label={`Footer section ${si + 1} title`}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { if (si <= 0) return; moveSection(si, si - 1); }}
                    disabled={si === 0}
                    className="text-gray-500 hover:text-gray-700 disabled:opacity-50 px-2 py-1"
                    title="Move up"
                    aria-label={`Move footer section ${si + 1} up`}
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => { if (si >= (sections?.length || 0) - 1) return; moveSection(si, si + 1); }}
                    disabled={si === ((sections?.length || 0) - 1)}
                    className="text-gray-500 hover:text-gray-700 disabled:opacity-50 px-2 py-1"
                    title="Move down"
                    aria-label={`Move footer section ${si + 1} down`}
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => removeSection(si)}
                    className="text-red-600 hover:bg-red-50 px-2 py-1 rounded text-sm"
                    aria-label={`Remove footer section ${si + 1}`}
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="mt-2 pt-3 border-t border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">Links</div>
                  <button onClick={() => addLink(si)} className="text-primary hover:bg-primary/10 px-2 py-1 rounded text-xs">
                    + Add Link
                  </button>
                </div>

                <div className="space-y-2">
                  {(sectionItem?.links || []).map((link, li) => (
                    <div key={li} className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                      <input
                        type="text"
                        value={link?.label || ''}
                        onChange={(e) => updateLink(si, li, 'label', e.target.value)}
                        className="p-2 border border-border rounded text-sm"
                        placeholder="Link label (e.g., Pricing)"
                        aria-label={`Footer link ${li + 1} label in section ${si + 1}`}
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={link?.href || ''}
                          onChange={(e) => updateLink(si, li, 'href', e.target.value)}
                          className="flex-1 p-2 border border-border rounded text-sm"
                          placeholder="#pricing or https://example.com"
                          aria-label={`Footer link ${li + 1} href in section ${si + 1}`}
                        />
                        <button
                          onClick={() => { if (li <= 0) return; moveLink(si, li, li - 1); }}
                          disabled={li === 0}
                          className="text-gray-500 hover:text-gray-700 disabled:opacity-50 px-2 py-1"
                          title="Move up"
                          aria-label={`Move link ${li + 1} up in section ${si + 1}`}
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => { if (li >= (sectionItem.links?.length || 0) - 1) return; moveLink(si, li, li + 1); }}
                          disabled={li === ((sectionItem.links?.length || 0) - 1)}
                          className="text-gray-500 hover:text-gray-700 disabled:opacity-50 px-2 py-1"
                          title="Move down"
                          aria-label={`Move link ${li + 1} down in section ${si + 1}`}
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => removeLink(si, li)}
                          className="text-red-600 hover:bg-red-50 px-2 py-1 rounded text-sm"
                          aria-label={`Remove footer link ${li + 1} in section ${si + 1}`}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


