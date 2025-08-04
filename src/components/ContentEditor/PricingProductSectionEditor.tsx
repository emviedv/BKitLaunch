import React from 'react';
import { TextInput, Button, ButtonField } from './FormFields';

interface PricingProductSectionEditorProps {
  activeSection: string;
  pricing?: any[];
  product?: any;
  updateNestedField: (section: string, index: number | null, field: string, value: any) => void;
  setEditMode: (mode: 'json' | 'sections' | 'database') => void;
}

export const PricingProductSectionEditor: React.FC<PricingProductSectionEditorProps> = ({ 
  activeSection, 
  pricing,
  product,
  updateNestedField,
  setEditMode 
}) => {
  if (activeSection === 'pricing' && pricing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Pricing Plans</h3>
          <Button onClick={() => setEditMode('json')} variant="secondary" size="sm">
            Advanced Editor
          </Button>
        </div>
        
        {pricing.map((plan: any, index: number) => (
          <div key={index} className="border border-border rounded-lg p-4 space-y-4">
            <h4 className="font-medium text-base">{plan.name} Plan</h4>
            <ButtonField
              label="Plan Button"
              buttonText={plan.buttonText || ''}
              buttonLink={plan.buttonLink || ''}
              onTextChange={(value) => updateNestedField('pricing', index, 'buttonText', value)}
              onLinkChange={(value) => updateNestedField('pricing', index, 'buttonLink', value)}
            />
          </div>
        ))}
      </div>
    );
  }

  if (activeSection === 'product' && product) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Product Details</h3>
          <Button onClick={() => setEditMode('json')} variant="secondary" size="sm">
            Advanced Editor
          </Button>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-base">Buttons</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ButtonField
              label="Primary Button"
              buttonText={product.primaryButton || ''}
              buttonLink={product.primaryButtonLink || ''}
              onTextChange={(value) => updateNestedField('product', null, 'primaryButton', value)}
              onLinkChange={(value) => updateNestedField('product', null, 'primaryButtonLink', value)}
            />
            <ButtonField
              label="Secondary Button"
              buttonText={product.secondaryButton || ''}
              buttonLink={product.secondaryButtonLink || ''}
              onTextChange={(value) => updateNestedField('product', null, 'secondaryButton', value)}
              onLinkChange={(value) => updateNestedField('product', null, 'secondaryButtonLink', value)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">
        {activeSection === 'pricing' ? 'Pricing Plans' : 'Product Details'}
      </h3>
      <p className="text-sm text-muted-foreground">
        For detailed {activeSection} editing, use the Advanced JSON Editor below.
      </p>
      <Button onClick={() => setEditMode('json')}>
        Open Advanced Editor
      </Button>
    </div>
  );
};