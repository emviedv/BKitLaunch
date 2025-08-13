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