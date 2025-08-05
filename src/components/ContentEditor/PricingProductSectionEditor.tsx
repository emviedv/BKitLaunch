import React, { useState, useEffect } from 'react';
import { TextInput, Button, ButtonField } from './FormFields';

interface PricingProductSectionEditorProps {
  activeSection: string;
  pricing?: any[];
  product?: any;
  updateNestedField: (section: string, index: number | null, field: string, value: any) => void;
  updateSection: (section: string, newData: any) => void;
  setEditMode: (mode: 'json' | 'sections' | 'database') => void;
}

export const PricingProductSectionEditor: React.FC<PricingProductSectionEditorProps> = ({ 
  activeSection, 
  pricing,
  product,
  updateNestedField,
  updateSection,
  setEditMode 
}) => {
  const [jsonEdit, setJsonEdit] = useState(false);
  const [localJson, setLocalJson] = useState(JSON.stringify(product || {}, null, 2));

  useEffect(() => {
    if (product) {
      setLocalJson(JSON.stringify(product, null, 2));
    }
  }, [product]);

  if (activeSection === 'pricing' && pricing) {
    // Get current Coming Soon state (default to true if not set)
    const isComingSoon = (pricing as any)?.isComingSoon !== false;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Pricing Plans</h3>
          <Button onClick={() => setEditMode('json')} variant="secondary" size="sm">
            Advanced Editor
          </Button>
        </div>
        
        {/* Coming Soon Toggle */}
        <div className="border border-border rounded-lg p-4 space-y-4 bg-muted/5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-base mb-1">Coming Soon Mode</h4>
              <p className="text-sm text-muted-foreground">
                Show "Coming Soon" message instead of pricing plans
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isComingSoon}
                onChange={(e) => updateSection('pricing', { 
                  ...pricing, 
                  isComingSoon: e.target.checked 
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
        
        {/* Show plan editors only when not in Coming Soon mode */}
        {!isComingSoon && Array.isArray(pricing) && pricing.map((plan: any, index: number) => (
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
        
        {/* Show message when in Coming Soon mode */}
        {isComingSoon && (
          <div className="border border-amber-200 bg-amber-50 rounded-lg p-4 text-center">
            <div className="text-amber-800">
              <h4 className="font-medium mb-2">Coming Soon Mode Active</h4>
              <p className="text-sm">
                Visitors will see a "Coming Soon" message instead of pricing plans. 
                Toggle off to edit individual plans.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (activeSection === 'product' && product) {
    if (jsonEdit) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Product Details JSON Editor</h3>
            <Button variant="secondary" size="sm" onClick={() => setJsonEdit(false)}>
              Cancel
            </Button>
          </div>
          <textarea
            value={localJson}
            onChange={(e) => setLocalJson(e.target.value)}
            className="w-full h-64 p-2 border border-border rounded font-mono text-sm"
          />
          <div className="flex space-x-2">
            <Button
              onClick={() => {
                try {
                  const parsed = JSON.parse(localJson);
                  updateSection('product', parsed);
                  setJsonEdit(false);
                } catch {
                  alert('Invalid JSON. Please correct and try again.');
                }
              }}
            >
              Save JSON
            </Button>
            <Button variant="secondary" onClick={() => setJsonEdit(false)}>
              Cancel
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Product Details</h3>
          <Button variant="secondary" size="sm" onClick={() => setJsonEdit(true)}>
            Edit JSON
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