import React from 'react';
import { debugService } from '@/lib/debugService';
import { TextInput, TextArea } from './FormFields';

interface FeatureBadge { label: string; type?: 'figma' | 'saas' | 'custom'; color?: string }

interface Feature {
  icon: string;
  title: string;
  badge: string;
  badgeColor?: string;
  badges?: FeatureBadge[];
  description: string;
  idea?: string; // short idea/tagline shown inside the card
  topItems?: string[]; // up to three bullet points shown inside the card
  isFeatured?: boolean;
  buttonText?: string;
  buttonLink?: string;
  buttonPreset?: 'beta' | 'custom';
  productSlug?: string;
  showBadge?: boolean;
}

interface FeaturesSectionEditorProps {
  features: Feature[];
  updateNestedField: (section: string, index: number | null, field: string, value: any) => void;
  visible: boolean;
  updateVisibility: (isVisible: boolean) => void;
  updateSection: (section: string, newData: any) => void;
  sectionData?: {
    title?: string;
    description?: string;
  };
}

const ColorPreview: React.FC<{ color: string }> = ({ color }) => {
  if (color.startsWith('#')) {
    return (
      <div 
        className="w-4 h-4 rounded border"
        style={{ backgroundColor: color }}
        title={`Color: ${color}`}
      />
    );
  }

  const colorClass = {
    green: 'bg-green-100 text-green-800 border border-green-200',
    blue: 'bg-blue-100 text-blue-800 border border-blue-200',
    orange: 'bg-orange-100 text-orange-800 border border-orange-200',
    purple: 'bg-purple-100 text-purple-800 border border-purple-200',
    red: 'bg-red-100 text-red-800 border border-red-200',
    yellow: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    pink: 'bg-pink-100 text-pink-800 border border-pink-200',
    gray: 'bg-gray-100 text-gray-800 border border-gray-200'
  }[color] || 'bg-primary text-primary-foreground';

  return (
    <span className={`text-xs px-1 py-0.5 rounded ${colorClass}`}>
      {color}
    </span>
  );
};

export const FeaturesSectionEditor: React.FC<FeaturesSectionEditorProps> = ({ 
  features, 
  updateNestedField,
  visible,
  updateVisibility,
  updateSection,
  sectionData
}) => {
  // Normalize incoming feature items to editor's canonical shape so all inputs reflect JSON
  const normalizeFeatureItem = React.useCallback((raw: any) => {
    const item = { ...(raw || {}) } as any;
    // Key remapping (snake_case → camelCase and known aliases)
    if (item.badge_color && !item.badgeColor) item.badgeColor = item.badge_color;
    if (item.is_featured !== undefined && item.isFeatured === undefined) item.isFeatured = !!item.is_featured;
    if (item.button_text && !item.buttonText) item.buttonText = item.button_text;
    if (item.button_link && !item.buttonLink) item.buttonLink = item.button_link;
    if (item.product_slug && !item.productSlug) item.productSlug = item.product_slug;
    if (item.top_items && !item.topItems) item.topItems = item.top_items;
    if (item.top3 && !item.topItems && Array.isArray(item.top3)) item.topItems = item.top3;
    if (item.ideaText && !item.idea) item.idea = item.ideaText;
    if (item.tagline && !item.idea) item.idea = item.tagline;
    if (item.show_badge !== undefined && item.showBadge === undefined) item.showBadge = !!item.show_badge;
    // Sanitize productSlug: editor expects slug without leading '/'
    if (typeof item.productSlug === 'string') {
      item.productSlug = item.productSlug.replace(/^\/+/, '');
    }
    // Ensure arrays
    if (!Array.isArray(item.topItems)) item.topItems = Array.isArray(item.top_items) ? item.top_items : (Array.isArray(item.top3) ? item.top3 : []);
    if (!Array.isArray(item.badges)) item.badges = Array.isArray(item.badges) ? item.badges : [];
    return item;
  }, []);
  const [jsonEdit, setJsonEdit] = React.useState(false);
  const [jsonValue, setJsonValue] = React.useState<string>(
    JSON.stringify({ section: sectionData || {}, items: features || [], visible }, null, 2)
  );

  // Reorder helpers
  const moveFeature = React.useCallback((fromIndex: number, toIndex: number) => {
    const list = features || [];
    if (fromIndex === toIndex) return;
    if (toIndex < 0 || toIndex >= list.length) return;
    const next = [...list];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    updateSection('features', next);
  }, [features, updateSection]);

  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>, index: number) => {
    e.dataTransfer.setData('text/plain', String(index));
    // For Firefox
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDropOnCard = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    const from = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (!Number.isNaN(from)) {
      moveFeature(from, dropIndex);
    }
  };

  React.useEffect(() => {
    const payload = { section: sectionData || {}, items: (features || []).map(normalizeFeatureItem), visible };
    setJsonValue(JSON.stringify(payload, null, 2));
    debugService.contentUpdate('Features.useEffect: sync jsonValue from props', payload);
    try {
      (window as any).__FEATURES_SYNC__ = payload;
      // Plain console for visibility
      // eslint-disable-next-line no-console
      console.log('[Features.useEffect] sync payload', payload);
    } catch {}
  }, [features, sectionData, visible]);

  const applyJson = () => {
    try {
      const parsed = JSON.parse(jsonValue);
      debugService.contentUpdate('Features.applyJson: parsed', parsed);
      try {
        (window as any).__FEATURES_PARSED__ = parsed;
        // eslint-disable-next-line no-console
        console.log('[Features.applyJson] parsed', parsed);
      } catch {}
      if (Array.isArray(parsed)) {
        // Array provided → treat as features list only
        updateSection('features', parsed);
        const nextPayload = { section: sectionData || {}, items: parsed, visible };
        setJsonValue(JSON.stringify(nextPayload, null, 2));
        debugService.contentUpdate('Features.applyJson: applied array', nextPayload);
        try { (window as any).__FEATURES_APPLY__ = nextPayload; console.log('[Features.applyJson] applied array', nextPayload); } catch {}
      } else if (parsed && typeof parsed === 'object') {
        // Accept robust shapes:
        // 1) { items: [...] }
        // 2) { features: [...] }
        // 3) { features: { title, description, items } }
        // 4) { section: { title, description }, items: [...] }
        let nextFeatures: any[] | undefined;
        let nextSectionObj: any | undefined;

        const parsedAny: any = parsed as any;
        const featuresValue = parsedAny.features;
        const itemsValue = parsedAny.items;

        if (Array.isArray(itemsValue)) {
          nextFeatures = itemsValue;
        } else if (Array.isArray(featuresValue)) {
          nextFeatures = featuresValue;
        } else if (featuresValue && typeof featuresValue === 'object' && Array.isArray(featuresValue.items)) {
          nextFeatures = featuresValue.items;
        } else if (Array.isArray(parsedAny)) {
          nextFeatures = parsedAny as any[];
        }

        nextSectionObj = parsedAny.section || parsedAny.featuresSection;
        if (!nextSectionObj && featuresValue && typeof featuresValue === 'object') {
          const maybeTitle = featuresValue.title;
          const maybeDesc = featuresValue.description;
          if (typeof maybeTitle === 'string' || typeof maybeDesc === 'string') {
            nextSectionObj = {
              ...(typeof maybeTitle === 'string' ? { title: maybeTitle } : {}),
              ...(typeof maybeDesc === 'string' ? { description: maybeDesc } : {})
            };
          }
        }

        if (nextFeatures) {
          const normalizedList = nextFeatures.map(normalizeFeatureItem);
          // Update both array shape and object-with-items shape for maximum compatibility
          updateSection('features', normalizedList);
          updateSection('features.items', normalizedList);
          debugService.contentUpdate('Features.applyJson: features updated', { count: normalizedList.length, first: normalizedList[0] });
          try { (window as any).__FEATURES_NORMALIZED__ = normalizedList; console.log('[Features.applyJson] normalized first', normalizedList[0]); } catch {}
        }
        if (nextSectionObj && typeof nextSectionObj === 'object') {
          updateSection('featuresSection', nextSectionObj);
          debugService.contentUpdate('Features.applyJson: featuresSection updated', nextSectionObj);
          try { (window as any).__FEATURES_SECTION__ = nextSectionObj; console.log('[Features.applyJson] section', nextSectionObj); } catch {}
        }

        const nextVisible = typeof parsedAny.visible === 'boolean' ? Boolean(parsedAny.visible) : visible;
        if (typeof parsedAny.visible === 'boolean') updateVisibility(nextVisible);

        const finalPayload = { section: nextSectionObj || sectionData || {}, items: (nextFeatures || features || []).map(normalizeFeatureItem), visible: nextVisible };
        setJsonValue(JSON.stringify(finalPayload, null, 2));
        debugService.contentUpdate('Features.applyJson: final payload', finalPayload);
        try { (window as any).__FEATURES_FINAL__ = finalPayload; console.log('[Features.applyJson] final payload', finalPayload); } catch {}
      }
      setJsonEdit(false);
      debugService.saveSuccess('Features.applyJson: done');
    } catch {
      debugService.saveError('Features.applyJson: invalid JSON', jsonValue);
      alert('Invalid JSON. Please correct and try again.');
    }
  };

  if (jsonEdit) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Features Section — JSON Editor</h3>
          <div className="flex items-center gap-2">
            <button className="button-secondary text-xs" onClick={() => setJsonEdit(false)}>Cancel</button>
            <button className="button text-xs" onClick={applyJson}>Apply JSON</button>
          </div>
        </div>
        <textarea
          className="w-full p-2 border border-border rounded h-64 font-mono text-sm"
          value={jsonValue}
          onChange={(e) => setJsonValue(e.target.value)}
          placeholder='{"section":{"title":"Features","description":"...","productPageLabel":"Visit product page","productPageLink":"/bibliokit-blocks"},"items":[{"icon":"🚀","title":"","description":"","idea":"","topItems":["","",""],"badge":"","badgeColor":"green","badges":[],"isFeatured":false,"showBadge":true,"buttonPreset":"custom","buttonText":"","buttonLink":""}],"visible":true}'
        />
      </div>
    );
  }

  return (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="font-semibold text-lg">Features Section</h3>
      <div className="flex items-center gap-2">
        <button
          className="px-3 py-1 text-sm rounded border border-border hover:bg-muted"
          onClick={() => setJsonEdit(true)}
          aria-label="Edit section JSON"
        >
          Edit JSON
        </button>
        <button
          className="px-3 py-1 text-sm rounded border border-border hover:bg-muted"
          onClick={() => {
            const newFeature: Feature = {
              icon: '🚀',
              title: 'New Feature',
              description: 'Description',
              idea: '',
              topItems: ['', '', ''],
              badge: '',
              badgeColor: 'green',
              badges: [],
              isFeatured: false,
              showBadge: true,
              buttonPreset: 'custom',
              buttonText: '',
              buttonLink: ''
            };
            const updated = [...(features || []), newFeature];
            updateSection('features', updated);
          }}
          aria-label="Add feature"
        >
          + Add Feature
        </button>
      </div>
    </div>
    
    {/* Section header fields */}
    <div className="grid grid-cols-1 gap-4">
      <div>
        <label className="block text-sm font-medium mb-2">Section Title</label>
        <input
          type="text"
          value={sectionData?.title || ''}
          onChange={(e) => updateNestedField('featuresSection', null, 'title', e.target.value)}
          className="w-full p-2 border border-border rounded"
          placeholder="Features"
          aria-label="Features section title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Section Description</label>
        <textarea
          value={sectionData?.description || ''}
          onChange={(e) => updateNestedField('featuresSection', null, 'description', e.target.value)}
          className="w-full p-2 border border-border rounded h-20"
          placeholder="Brief description of the features section"
          aria-label="Features section description"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Product Page CTA Label</label>
          <input
            type="text"
            value={(sectionData as any)?.productPageLabel || ''}
            onChange={(e) => updateNestedField('featuresSection', null, 'productPageLabel', e.target.value)}
            className="w-full p-2 border border-border rounded"
            placeholder="Visit product page"
            aria-label="Product page CTA label"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Product Page Link or Slug</label>
          <input
            type="text"
            value={(sectionData as any)?.productPageLink || ''}
            onChange={(e) => updateNestedField('featuresSection', null, 'productPageLink', e.target.value)}
            className="w-full p-2 border border-border rounded"
            placeholder="/bibliokit-blocks or https://example.com/product"
            aria-label="Product page link"
          />
        </div>
      </div>
    </div>

    {/* Visibility Toggle */}
    <div className="flex items-center gap-2 mb-4 p-3 bg-muted/20 rounded-lg">
      <input
        id="features-visible"
        type="checkbox"
        checked={visible}
        onChange={(e) => updateVisibility(e.target.checked)}
        className="rounded border-border"
      />
      <label htmlFor="features-visible" className="text-sm font-medium">
        Visible on site
      </label>
    </div>
    <div className="space-y-4">
      {features?.map((feature, index) => (
        <div
          key={index}
          className={`p-3 border rounded ${feature.isFeatured ? 'border-primary/30 bg-primary/5' : 'border-border'}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDropOnCard(e, index)}
        >
          {/* Featured Toggle */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {/* Reorder controls */}
              <div className="flex items-center gap-1" aria-label={`Reorder feature ${index + 1}`}>
                <button
                  type="button"
                  className="px-2 py-1 text-xs rounded border border-border hover:bg-muted disabled:opacity-50"
                  onClick={() => moveFeature(index, index - 1)}
                  disabled={index === 0}
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="px-2 py-1 text-xs rounded border border-border hover:bg-muted disabled:opacity-50"
                  onClick={() => moveFeature(index, index + 1)}
                  disabled={index === (features?.length || 0) - 1}
                  aria-label="Move down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="px-2 py-1 text-xs rounded border border-border hover:bg-muted cursor-move"
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  aria-label="Drag to reorder"
                  title="Drag to reorder"
                >
                  ⋮⋮
                </button>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!feature.isFeatured}
                  onChange={(e) => updateNestedField('features', index, 'isFeatured', e.target.checked)}
                  className="rounded border-border"
                />
                <span className="text-sm font-medium">Featured Card</span>
              </label>
              {feature.isFeatured && (
                <span className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded-full">
                  FEATURED
                </span>
              )}
            </div>
            <button
              className="text-red-600 hover:bg-red-50 px-2 py-1 rounded text-xs"
              onClick={() => {
                const updated = (features || []).filter((_, i) => i !== index);
                updateSection('features', updated);
              }}
              aria-label={`Remove feature ${index + 1}`}
            >
              Remove
            </button>
          </div>

          {/* Main Fields */}
            <div className="grid grid-cols-6 gap-2 text-sm mb-3">
            <div>
              <label className="block text-xs font-medium mb-1">Icon</label>
              <input
                type="text"
                value={feature.icon}
                onChange={(e) => updateNestedField('features', index, 'icon', e.target.value)}
                className="p-1 border border-border rounded w-full"
                placeholder="Icon"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1">Title</label>
              <input
                type="text"
                value={feature.title}
                onChange={(e) => updateNestedField('features', index, 'title', e.target.value)}
                className="p-1 border border-border rounded w-full"
                placeholder="Title"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Badge</label>
              <input
                type="text"
                value={feature.badge}
                onChange={(e) => updateNestedField('features', index, 'badge', e.target.value)}
                className="p-1 border border-border rounded w-full"
                placeholder="e.g. New, Coming Soon"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1">Badge Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={feature.badgeColor || ''}
                  onChange={(e) => updateNestedField('features', index, 'badgeColor', e.target.value)}
                  className="p-1 border border-border rounded flex-1"
                  placeholder="#10b981 or green"
                />
                {feature.badgeColor && (
                  <div className="flex items-center gap-1">
                    <ColorPreview color={feature.badgeColor} />
                  </div>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Use hex (#10b981) or predefined (green, blue, orange, etc.)
              </div>
            </div>
          </div>

          {/* Multiple badges */}
          <div className="mb-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium">Badges</label>
              <button
                className="text-xs px-2 py-1 rounded border border-border hover:bg-muted"
                onClick={() => {
                  const next = [...(feature.badges || []), { label: 'Badge', type: 'custom', color: 'green' } as FeatureBadge];
                  updateNestedField('features', index, 'badges', next);
                }}
                aria-label={`Add badge to feature ${index + 1}`}
              >
                + Add Badge
              </button>
            </div>
            {(feature.badges || []).length > 0 && (
              <div className="space-y-2 mt-2">
                {(feature.badges || []).map((b, bi) => (
                  <div key={bi} className="grid grid-cols-6 gap-2 text-sm items-end">
                    <div className="col-span-2">
                      <label className="block text-xs font-medium mb-1">Label</label>
                      <input
                        type="text"
                        value={b.label}
                        onChange={(e) => {
                          const next = [...(feature.badges || [])];
                          next[bi] = { ...next[bi], label: e.target.value };
                          updateNestedField('features', index, 'badges', next);
                        }}
                        className="p-1 border border-border rounded w-full"
                        placeholder="e.g. Figma, SaaS"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Type</label>
                      <select
                        value={b.type || 'custom'}
                        onChange={(e) => {
                          const next = [...(feature.badges || [])];
                          next[bi] = { ...next[bi], type: e.target.value as any };
                          updateNestedField('features', index, 'badges', next);
                        }}
                        className="p-1 border border-border rounded w-full"
                      >
                        <option value="custom">Custom</option>
                        <option value="figma">Figma</option>
                        <option value="saas">SaaS</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium mb-1">Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={b.color || ''}
                          onChange={(e) => {
                            const next = [...(feature.badges || [])];
                            next[bi] = { ...next[bi], color: e.target.value };
                            updateNestedField('features', index, 'badges', next);
                          }}
                          className="p-1 border border-border rounded w-full"
                          placeholder="#10b981 or green"
                        />
                        {b.color && (
                          <ColorPreview color={b.color} />
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        className="text-red-600 hover:bg-red-50 px-2 py-1 rounded text-xs"
                        onClick={() => {
                          const next = (feature.badges || []).filter((_, i) => i !== bi);
                          updateNestedField('features', index, 'badges', next);
                        }}
                        aria-label={`Remove badge ${bi + 1}`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Badge visibility toggle */}
          <div className="mb-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={feature.showBadge !== false}
                onChange={(e) => updateNestedField('features', index, 'showBadge', e.target.checked)}
                className="rounded border-border"
              />
              <span className="text-sm">Show Badge</span>
            </label>
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1">Description</label>
            <textarea
              value={feature.description}
              onChange={(e) => updateNestedField('features', index, 'description', e.target.value)}
              className="p-1 border border-border rounded h-16 text-xs w-full"
              placeholder="Description"
            />
          </div>

          {/* Idea / Tagline inside the card */}
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1">Idea / Tagline</label>
            <input
              type="text"
              value={(feature as any).idea || ''}
              onChange={(e) => updateNestedField('features', index, 'idea', e.target.value)}
              className="p-1 border border-border rounded w-full text-sm"
              placeholder="Short idea or tagline shown inside the card"
              aria-label="Feature idea or tagline"
            />
          </div>

          {/* Key features for this card */}
          <div className="mb-3">
            <label className="block text-xs font-medium mb-2">Key Features (bullets)</label>
            <div className="space-y-2">
              {[0,1,2].map((i) => (
                <input
                  key={i}
                  type="text"
                  value={((feature as any).topItems || [])[i] || ''}
                  onChange={(e) => {
                    const arr = Array.isArray((feature as any).topItems) ? ([...(feature as any).topItems] as string[]) : ['', '', ''];
                    arr[i] = e.target.value;
                    updateNestedField('features', index, 'topItems', arr);
                  }}
                  className="p-1 border border-border rounded w-full text-sm"
                  placeholder={`Bullet ${i+1}`}
                  aria-label={`Top feature bullet ${i+1}`}
                />
              ))}
            </div>
          </div>

          {/* Button fields (always available per card) */}
          {true && (
            <div className="border-t border-border/50 pt-3 space-y-2">
              <div className="text-xs font-medium text-primary">Card Button</div>

              {/* Preset selector */}
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <label className="block text-xs font-medium mb-1">Preset</label>
                  <select
                    value={feature.buttonPreset || 'custom'}
                    onChange={(e) => updateNestedField('features', index, 'buttonPreset', e.target.value)}
                    className="p-1 border border-border rounded w-full"
                    aria-label="Button preset"
                  >
                    <option value="custom">Custom</option>
                    <option value="beta">Sign Up for Beta</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium mb-1">Product Page Slug</label>
                  <input
                    type="text"
                    value={feature.productSlug || ''}
                    onChange={(e) => updateNestedField('features', index, 'productSlug', e.target.value)}
                    className="p-1 border border-border rounded w-full"
                    placeholder="e.g. bibliokit-blocks (renders as /bibliokit-blocks)"
                    aria-label="Product page slug"
                  />
                </div>
              </div>

              {/* Custom text/link fields */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <label className="block text-xs font-medium mb-1">Button Text</label>
                  <input
                    type="text"
                    value={feature.buttonText || ''}
                    onChange={(e) => updateNestedField('features', index, 'buttonText', e.target.value)}
                    className="p-1 border border-border rounded w-full"
                    placeholder="e.g. Learn More, Visit product page"
                    aria-label="Button text"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Button Link</label>
                  <input
                    type="text"
                    value={feature.buttonLink || ''}
                    onChange={(e) => updateNestedField('features', index, 'buttonLink', e.target.value)}
                    className="p-1 border border-border rounded w-full"
                    placeholder="/bibliokit-blocks or https://example.com"
                    aria-label="Button link"
                  />
                </div>
              </div>

              <div className="text-xs text-muted-foreground mt-1">Button appears when text and link are provided.</div>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
  );
};