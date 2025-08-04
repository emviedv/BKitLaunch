import React from 'react';
import { TextInput, TextArea, ButtonField } from './FormFields';

interface HeroSectionEditorProps {
  hero: any;
  updateNestedField: (section: string, index: number | null, field: string, value: any) => void;
}

export const HeroSectionEditor: React.FC<HeroSectionEditorProps> = ({ hero, updateNestedField }) => (
  <div className="space-y-4">
    <h3 className="font-semibold text-lg">Hero Section</h3>
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