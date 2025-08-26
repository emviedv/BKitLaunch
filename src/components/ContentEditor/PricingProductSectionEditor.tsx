import React, { useState, useEffect } from 'react';
import { TextInput, TextArea, Button, ButtonField } from './FormFields';

interface PricingProductSectionEditorProps {
  activeSection: string;
  pricing?: any[];
  product?: any;
  updateNestedField: (section: string, index: number | null, field: string, value: any) => void;
  updateSection: (section: string, newData: any) => void;
  setEditMode: (mode: 'json' | 'sections' | 'database') => void;
  pricingVisible: boolean;
  productVisible: boolean;
  updateVisibility: (sectionKey: string, isVisible: boolean) => void;
}

export const PricingProductSectionEditor: React.FC<PricingProductSectionEditorProps> = ({ 
  activeSection, 
  pricing,
  product,
  updateNestedField,
  updateSection,
  setEditMode,
  pricingVisible,
  productVisible,
  updateVisibility 
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
          <Button onClick={() => setEditMode('json')} variant="secondary">
            Advanced Editor
          </Button>
        </div>
        
        {/* Visibility Toggle */}
        <div className="flex items-center gap-2 mb-4 p-3 bg-muted/20 rounded-lg">
          <input
            id="pricing-visible"
            type="checkbox"
            checked={pricingVisible}
            onChange={(e) => updateVisibility('pricing', e.target.checked)}
            className="rounded border-border"
          />
          <label htmlFor="pricing-visible" className="text-sm font-medium">
            Visible on site
          </label>
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
        {!isComingSoon && Array.isArray(pricing) && pricing.map((plan: any, index: number) => {
          const stableKey = `plan-${index}-${plan.name?.length || 0}-${plan.buttonText?.length || 0}`;
          return (
          <div key={stableKey} className="border border-border rounded-lg p-4 space-y-4">
            <h4 className="font-medium text-base">{plan.name} Plan</h4>
            <ButtonField
              label="Plan Button"
              buttonText={plan.buttonText || ''}
              buttonLink={plan.buttonLink || ''}
              onTextChange={(value) => updateNestedField('pricing', index, 'buttonText', value)}
              onLinkChange={(value) => updateNestedField('pricing', index, 'buttonLink', value)}
            />
          </div>
          )
        })}
        
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
            <Button variant="secondary" onClick={() => setJsonEdit(false)}>
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
                  
                  // Force a re-render to ensure all inputs reflect the new state
                  setTimeout(() => {
                    // Trigger a parent component re-render by updating the section again
                    updateSection('product', { ...parsed });
                  }, 50);
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
          <Button variant="secondary" onClick={() => setJsonEdit(true)}>
            Edit JSON
          </Button>
        </div>
        
        {/* Visibility Toggle */}
        <div className="flex items-center gap-2 mb-4 p-3 bg-muted/20 rounded-lg">
          <input
            id="product-visible"
            type="checkbox"
            checked={productVisible}
            onChange={(e) => updateVisibility('product', e.target.checked)}
            className="rounded border-border"
          />
          <label htmlFor="product-visible" className="text-sm font-medium">
            Visible on site
          </label>
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

          {/* Key Features editing UI */}
          <div className="space-y-4">
            <h4 className="font-medium text-base">Key Features</h4>
            {(product.details || []).map((detail: any, index: number) => {
              const stableKey = `detail-${index}-${detail.title?.length || 0}-${detail.description?.length || 0}`;
              return (
              <div key={stableKey} className="border border-border rounded-lg p-4 space-y-2">
                <TextInput
                  label="Title"
                  value={detail.title}
                  onChange={(value) => {
                    const updated = [...product.details];
                    updated[index].title = value;
                    updateNestedField('product', null, 'details', updated);
                  }}
                />
                <TextArea
                  label="Description"
                  value={detail.description}
                  onChange={(value) => {
                    const updated = [...product.details];
                    updated[index].description = value;
                    updateNestedField('product', null, 'details', updated);
                  }}
                  rows={3}
                />
                <button
                  onClick={() => {
                    const updated = product.details.filter((_: any, i: number) => i !== index);
                    updateNestedField('product', null, 'details', updated);
                  }}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove Feature
                </button>
              </div>
              )
            })}
            <button
              onClick={() => {
                const newFeature = { title: '', description: '' };
                const updated = [...(product.details || []), newFeature];
                updateNestedField('product', null, 'details', updated);
              }}
              className="w-full p-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-600 hover:border-gray-400 hover:text-gray-800"
            >
              + Add Feature
            </button>
          </div>

          {/* Use Cases editing UI */}
          <div className="space-y-4">
            <h4 className="font-medium text-base">Use Cases</h4>
            {(product.benefits || []).map((benefit: string, index: number) => {
              const stableKey = `benefit-${index}-${benefit?.length || 0}`;
              return (
              <div key={stableKey} className="border border-border rounded-lg p-4 space-y-2">
                <TextArea
                  label={`Use Case ${index + 1}`}
                  value={benefit}
                  onChange={(value) => {
                    const updated = [...product.benefits];
                    updated[index] = value;
                    updateNestedField('product', null, 'benefits', updated);
                  }}
                  rows={2}
                />
                <button
                  onClick={() => {
                    const updated = product.benefits.filter((_: any, i: number) => i !== index);
                    updateNestedField('product', null, 'benefits', updated);
                  }}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove Use Case
                </button>
              </div>
              )
            })}
            <button
              onClick={() => {
                const updated = [...(product.benefits || []), ''];
                updateNestedField('product', null, 'benefits', updated);
              }}
              className="w-full p-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-600 hover:border-gray-400 hover:text-gray-800"
            >
              + Add Use Case
            </button>
          </div>

          {/* Technical Capabilities editing UI */}
          <div className="space-y-4">
            <h4 className="font-medium text-base">Technical Capabilities</h4>
            {(product.specifications || []).map((spec: any, index: number) => {
              const stableKey = `spec-${index}-${spec.name?.length || 0}-${spec.icon?.length || 0}`;
              return (
              <div key={stableKey} className="border border-border rounded-lg p-4 space-y-2">
                <div className="grid grid-cols-3 gap-3">
                  <TextInput
                    label="Icon"
                    value={spec.icon}
                    onChange={(value) => {
                      const updated = [...product.specifications];
                      updated[index].icon = value;
                      updateNestedField('product', null, 'specifications', updated);
                    }}
                    placeholder="📊"
                  />
                  <TextInput
                    label="Name"
                    value={spec.name}
                    onChange={(value) => {
                      const updated = [...product.specifications];
                      updated[index].name = value;
                      updateNestedField('product', null, 'specifications', updated);
                    }}
                    placeholder="Analytics Engine"
                  />
                  <div></div>
                </div>
                <TextArea
                  label="Value/Description"
                  value={spec.value}
                  onChange={(value) => {
                    const updated = [...product.specifications];
                    updated[index].value = value;
                    updateNestedField('product', null, 'specifications', updated);
                  }}
                  rows={2}
                  placeholder="Real-time component tracking..."
                />
                <button
                  onClick={() => {
                    const updated = product.specifications.filter((_: any, i: number) => i !== index);
                    updateNestedField('product', null, 'specifications', updated);
                  }}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove Specification
                </button>
              </div>
              )
            })}
            <button
              onClick={() => {
                const newSpec = { icon: '', name: '', value: '' };
                const updated = [...(product.specifications || []), newSpec];
                updateNestedField('product', null, 'specifications', updated);
              }}
              className="w-full p-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-600 hover:border-gray-400 hover:text-gray-800"
            >
              + Add Specification
            </button>
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