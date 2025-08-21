import React from 'react';
import { TextInput, TextArea, ButtonField } from './FormFields';

interface HeroSectionEditorProps {
  hero: any;
  updateNestedField: (section: string, index: number | null, field: string, value: any) => void;
  visible: boolean;
  updateVisibility: (isVisible: boolean) => void;
}

export const HeroSectionEditor: React.FC<HeroSectionEditorProps> = ({ 
  hero, 
  updateNestedField, 
  visible, 
  updateVisibility 
}) => {
  const [jsonEdit, setJsonEdit] = React.useState(false);
  const [jsonValue, setJsonValue] = React.useState<string>(
    JSON.stringify({ visible, hero }, null, 2)
  );

  // Keep local hero data to prevent resets when other sections are edited
  const [localHero, setLocalHero] = React.useState(() => hero || {});
  
  // Track if user is actively editing to prevent prop sync resets
  const isActivelyEditing = React.useRef(false);
  const lastPropUpdate = React.useRef(Date.now());

  // Update local hero only on initial mount or explicit prop changes (not re-renders)
  React.useEffect(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastPropUpdate.current;
    
    // Only sync from props if:
    // 1. Initial mount (no local data)
    // 2. Substantial time has passed (not a re-render)
    // 3. Not actively editing
    if (Object.keys(localHero).length === 0 || (timeSinceLastUpdate > 1000 && !isActivelyEditing.current)) {
      setLocalHero(hero || {});
      lastPropUpdate.current = now;
    }
  }, [hero, localHero]);

  React.useEffect(() => {
    setJsonValue(JSON.stringify({ visible, hero: localHero }, null, 2));
  }, [localHero, visible]);

  // Custom update handler that updates both local state and parent state
  const updateHeroField = React.useCallback((field: string, value: any) => {
    // Mark as actively editing
    isActivelyEditing.current = true;
    
    // Update local state immediately for responsive UI
    const updatedHero = { ...localHero, [field]: value };
    setLocalHero(updatedHero);
    
    // Update parent state
    updateNestedField('hero', null, field, value);
    
    // Clear editing flag after a delay
    setTimeout(() => {
      isActivelyEditing.current = false;
    }, 2000);
  }, [localHero, updateNestedField]);

  const applyJson = () => {
    try {
      // Temporarily disable editing protection for JSON application
      const wasEditing = isActivelyEditing.current;
      isActivelyEditing.current = false;
      
      const parsed = JSON.parse(jsonValue);
      if (parsed && typeof parsed === 'object') {
        const nextHero = (parsed as any).hero || parsed;
        if (nextHero && typeof nextHero === 'object') {
          // Update both local state and parent state
          setLocalHero(nextHero);
          Object.entries(nextHero).forEach(([k, v]) => updateNestedField('hero', null, k, v));
        }
        if (typeof (parsed as any).visible === 'boolean') {
          updateVisibility((parsed as any).visible);
        }
      }
      setJsonEdit(false);
      
      // Force a re-render to ensure all inputs reflect the new state
      setTimeout(() => {
        const refreshPayload = { visible, hero: localHero };
        setJsonValue(JSON.stringify(refreshPayload, null, 2));
        isActivelyEditing.current = wasEditing;
      }, 50);
    } catch {
      isActivelyEditing.current = wasEditing;
      alert('Invalid JSON. Please correct and try again.');
    }
  };

  if (jsonEdit) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Hero Section — JSON Editor</h3>
          <div className="flex items-center gap-2">
            <button className="button-secondary text-xs" onClick={() => setJsonEdit(false)}>Cancel</button>
            <button className="button text-xs" onClick={applyJson}>Apply JSON</button>
          </div>
        </div>
        <textarea
          className="w-full p-2 border border-border rounded h-64 font-mono text-sm"
          value={jsonValue}
          onChange={(e) => setJsonValue(e.target.value)}
          placeholder='{"visible":true,"hero":{"badgeLabel":"","gradientColors":["#ecfeff00"],"emoji":"✨","title":"","subtitle":"","description":"","primaryButton":"","primaryButtonLink":"","secondaryButton":"","secondaryButtonLink":""}}'
        />
      </div>
    );
  }

  return (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="font-semibold text-lg">Hero Section</h3>
      <button className="px-3 py-1 text-sm rounded border border-border hover:bg-muted" onClick={() => setJsonEdit(true)}>Edit JSON</button>
    </div>
    
    {/* Visibility Toggle */}
    <div className="flex items-center gap-2 mb-4 p-3 bg-muted/20 rounded-lg">
      <input
        id="hero-visible"
        type="checkbox"
        checked={visible}
        onChange={(e) => updateVisibility(e.target.checked)}
        className="rounded border-border"
      />
      <label htmlFor="hero-visible" className="text-sm font-medium">
        Visible on site
      </label>
    </div>
    <TextInput
      label="Badge Label"
      value={localHero?.badgeLabel || ''}
      onChange={(value) => updateHeroField('badgeLabel', value)}
      placeholder="SaaS Analytics Platform"
    />
    <div className="space-y-2">
      <label className="block text-sm font-medium">Gradient Colors (comma-separated hex)</label>
      <input
        type="text"
        value={(localHero?.gradientColors || []).join(', ')}
        onChange={(e) => updateHeroField('gradientColors', e.target.value.split(',').map(v => v.trim()).filter(Boolean))}
        className="w-full p-2 border border-border rounded"
        placeholder="#ecfeff00, #ecfeff10, #c7d2fe40, #a7f3d040, #a5b4fc50, #93c5fd40, #ffffff00"
      />
      <p className="text-xs text-muted-foreground">Provide 5–8 RGBA/hex values with alpha for best effect.</p>
    </div>
    <TextInput
      label="Emoji"
      value={localHero?.emoji || ''}
      onChange={(value) => updateHeroField('emoji', value)}
      placeholder="e.g. ✨"
    />
    <TextInput
      label="Title"
      value={localHero?.title || ''}
      onChange={(value) => updateHeroField('title', value)}
    />
    <TextInput
      label="Subtitle"
      value={localHero?.subtitle || ''}
      onChange={(value) => updateHeroField('subtitle', value)}
    />
    <TextArea
      label="Description"
      value={localHero?.description || ''}
      onChange={(value) => updateHeroField('description', value)}
      rows={3}
    />
    <div className="space-y-4">
      <h4 className="font-medium text-base">Buttons</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ButtonField
          label="Primary Button"
          buttonText={localHero?.primaryButton || ''}
          buttonLink={localHero?.primaryButtonLink || ''}
          onTextChange={(value) => updateHeroField('primaryButton', value)}
          onLinkChange={(value) => updateHeroField('primaryButtonLink', value)}
        />
        <ButtonField
          label="Secondary Button"
          buttonText={localHero?.secondaryButton || ''}
          buttonLink={localHero?.secondaryButtonLink || ''}
          onTextChange={(value) => updateHeroField('secondaryButton', value)}
          onLinkChange={(value) => updateHeroField('secondaryButtonLink', value)}
        />
      </div>
    </div>
  </div>
  );
};