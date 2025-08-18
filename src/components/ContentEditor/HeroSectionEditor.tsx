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

  React.useEffect(() => {
    setJsonValue(JSON.stringify({ visible, hero }, null, 2));
  }, [hero, visible]);

  const applyJson = () => {
    try {
      const parsed = JSON.parse(jsonValue);
      if (parsed && typeof parsed === 'object') {
        const nextHero = (parsed as any).hero || parsed;
        if (nextHero && typeof nextHero === 'object') {
          Object.entries(nextHero).forEach(([k, v]) => updateNestedField('hero', null, k, v));
        }
        if (typeof (parsed as any).visible === 'boolean') {
          updateVisibility((parsed as any).visible);
        }
      }
      setJsonEdit(false);
    } catch {
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
      value={hero?.badgeLabel || ''}
      onChange={(value) => updateNestedField('hero', null, 'badgeLabel', value)}
      placeholder="SaaS Analytics Platform"
    />
    <div className="space-y-2">
      <label className="block text-sm font-medium">Gradient Colors (comma-separated hex)</label>
      <input
        type="text"
        value={(hero?.gradientColors || []).join(', ')}
        onChange={(e) => updateNestedField('hero', null, 'gradientColors', e.target.value.split(',').map(v => v.trim()).filter(Boolean))}
        className="w-full p-2 border border-border rounded"
        placeholder="#ecfeff00, #ecfeff10, #c7d2fe40, #a7f3d040, #a5b4fc50, #93c5fd40, #ffffff00"
      />
      <p className="text-xs text-muted-foreground">Provide 5–8 RGBA/hex values with alpha for best effect.</p>
    </div>
    <TextInput
      label="Emoji"
      value={hero?.emoji || ''}
      onChange={(value) => updateNestedField('hero', null, 'emoji', value)}
      placeholder="e.g. ✨"
    />
    <TextInput
      label="Title"
      value={hero?.title || ''}
      onChange={(value) => updateNestedField('hero', null, 'title', value)}
    />
    <TextInput
      label="Subtitle"
      value={hero?.subtitle || ''}
      onChange={(value) => updateNestedField('hero', null, 'subtitle', value)}
    />
    <TextArea
      label="Description"
      value={hero?.description || ''}
      onChange={(value) => updateNestedField('hero', null, 'description', value)}
      rows={3}
    />
    <div className="space-y-4">
      <h4 className="font-medium text-base">Buttons</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ButtonField
          label="Primary Button"
          buttonText={hero?.primaryButton || ''}
          buttonLink={hero?.primaryButtonLink || ''}
          onTextChange={(value) => updateNestedField('hero', null, 'primaryButton', value)}
          onLinkChange={(value) => updateNestedField('hero', null, 'primaryButtonLink', value)}
        />
        <ButtonField
          label="Secondary Button"
          buttonText={hero?.secondaryButton || ''}
          buttonLink={hero?.secondaryButtonLink || ''}
          onTextChange={(value) => updateNestedField('hero', null, 'secondaryButton', value)}
          onLinkChange={(value) => updateNestedField('hero', null, 'secondaryButtonLink', value)}
        />
      </div>
    </div>
  </div>
  );
};