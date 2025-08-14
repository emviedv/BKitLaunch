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
}) => (
  <div className="space-y-4">
    <h3 className="font-semibold text-lg">Hero Section</h3>
    
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