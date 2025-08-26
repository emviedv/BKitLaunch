import React, { useState, useEffect } from 'react';
import { TextInput, TextArea, Button, ButtonField } from './FormFields';

interface IndividualProductEditorProps {
  productKey: string;
  productData: any;
  updateNestedField: (section: string, index: number | null, field: string, value: any) => void;
  updateSection: (section: string, newData: any) => void;
  setEditMode: (mode: 'json' | 'sections' | 'database') => void;
}

export const IndividualProductEditor: React.FC<IndividualProductEditorProps> = ({ 
  productKey, 
  productData,
  updateNestedField,
  updateSection,
  setEditMode 
}) => {
  const [jsonEdit, setJsonEdit] = useState(false);
  const [localJson, setLocalJson] = useState(JSON.stringify(productData || {}, null, 2));
  
  // Keep local copy of product data to ensure form inputs stay in sync
  const [localProductData, setLocalProductData] = useState(() => productData || {});
  
  // Track if user is actively editing to prevent prop sync resets
  const isActivelyEditing = React.useRef(false);
  const lastPropUpdate = React.useRef(Date.now());

  useEffect(() => {
    if (productData) {
      setLocalJson(JSON.stringify(productData, null, 2));
    }
  }, [productData]);
  
  // Update local product data only on initial mount or explicit prop changes (not re-renders)
  React.useEffect(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastPropUpdate.current;
    
    // Only sync from props if:
    // 1. Initial mount (no local data)
    // 2. Substantial time has passed (not a re-render)
    // 3. Not actively editing
    if (Object.keys(localProductData).length === 0 || (timeSinceLastUpdate > 1000 && !isActivelyEditing.current)) {
      setLocalProductData(productData || {});
      lastPropUpdate.current = now;
    }
  }, [productData, localProductData]);

  const updateProductField = (field: string, value: any) => {
    // Mark as actively editing
    isActivelyEditing.current = true;
    
    // Update local state immediately for responsive UI
    setLocalProductData(prev => ({ ...prev, [field]: value }));
    
    // Update parent state
    updateNestedField(`products.${productKey}`, null, field, value);
    
    // Clear editing flag after a delay
    setTimeout(() => {
      isActivelyEditing.current = false;
    }, 2000);
  };

  const updateProductNestedField = (field: string, index: number | null, subField: string, value: any) => {
    // Mark as actively editing
    isActivelyEditing.current = true;
    
    if (index !== null) {
      const currentArray = localProductData[field] || [];
      const updated = currentArray.map((item: any, i: number) => 
        i === index ? { ...item, [subField]: value } : item
      );
      
      // Update local state immediately
      setLocalProductData(prev => ({ ...prev, [field]: updated }));
      
      // Update parent state
      updateNestedField(`products.${productKey}`, null, field, updated);
    } else {
      const currentObj = localProductData[field] || {};
      const updatedObj = { ...currentObj, [subField]: value };
      
      // Update local state immediately
      setLocalProductData(prev => ({ ...prev, [field]: updatedObj }));
      
      // Update parent state
      updateNestedField(`products.${productKey}`, null, field, updatedObj);
    }
    
    // Clear editing flag after a delay
    setTimeout(() => {
      isActivelyEditing.current = false;
    }, 2000);
  };

  if (!productData) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">{productKey} Product</h3>
        <p className="text-sm text-muted-foreground">
          Product data not found. Please check the data structure.
        </p>
      </div>
    );
  }

  if (jsonEdit) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{productData.title} - JSON Editor</h3>
          <Button variant="secondary" onClick={() => setJsonEdit(false)}>
            Cancel
          </Button>
        </div>
        <textarea
          value={localJson}
          onChange={(e) => setLocalJson(e.target.value)}
          className="w-full h-64 p-2 border border-border rounded font-mono text-sm"
          placeholder='{"title":"My Product","description":"...","primaryButton":"Get Started","primaryButtonLink":"/start","secondaryButton":"Learn More","secondaryButtonLink":"/learn","details":[{"title":"","description":""}],"benefits":[],"specifications":[],"pricing":{"price":"","period":"/month","description":"","buttonText":""},"visibility":{"waitlist":true},"llm":{"answerBox":"","expertQuote":{},"statistic":{},"faqs":[]}}'
        />
        <div className="flex space-x-2">
          <Button
            onClick={() => {
              try {
                // Temporarily disable editing protection for JSON application
                const wasEditing = isActivelyEditing.current;
                isActivelyEditing.current = false;
                
                const parsed = JSON.parse(localJson);
                
                // Update parent state
                updateSection(`products.${productKey}`, parsed);
                
                // Force immediate local state update for JSON application
                setLocalProductData(parsed);
                
                setJsonEdit(false);
                
                // Force a re-render to ensure all inputs reflect the new state
                setTimeout(() => {
                  // Force local state update one more time to ensure form inputs sync
                  setLocalProductData({ ...parsed });
                  
                  // Restore previous editing state
                  isActivelyEditing.current = wasEditing;
                }, 50);
              } catch (error) {
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
        <h3 className="font-semibold text-lg">{localProductData.title || productData.title}</h3>
        <Button variant="secondary" onClick={() => setJsonEdit(true)}>
          Edit JSON
        </Button>
      </div>

      {/* Basic Information */}
      <div className="space-y-4">
        <h4 className="font-medium text-base">Basic Information</h4>
        <TextInput
          label="Emoji"
          value={localProductData.emoji || ''}
          onChange={(value) => updateProductField('emoji', value)}
          placeholder="e.g. ✨"
        />
        <TextInput
          label="Hero Badge Label"
          value={localProductData.badgeLabel || ''}
          onChange={(value) => updateProductField('badgeLabel', value)}
          placeholder="SaaS Analytics Platform"
        />
        <div className="space-y-2">
          <label className="block text-sm font-medium">Hero Gradient Colors (comma-separated hex)</label>
          <input
            type="text"
            value={((localProductData as any).gradientColors || []).join(', ')}
            onChange={(e) => updateProductField('gradientColors', e.target.value.split(',').map(v => v.trim()).filter(Boolean))}
            className="w-full p-2 border border-border rounded"
            placeholder="#ecfeff00, #ecfeff10, #c7d2fe40, #a7f3d040, #a5b4fc50, #93c5fd40, #ffffff00"
          />
          <p className="text-xs text-muted-foreground">Provide 5–8 RGBA/hex values with alpha for best effect.</p>
        </div>
        <TextInput
          label="Title"
          value={localProductData.title || ''}
          onChange={(value) => updateProductField('title', value)}
        />
        <TextArea
          label="Description"
          value={localProductData.description || ''}
          onChange={(value) => updateProductField('description', value)}
          rows={3}
        />
      </div>

      {/* Buttons */}
      <div className="space-y-4">
        <h4 className="font-medium text-base">Buttons</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ButtonField
            label="Primary Button"
            buttonText={localProductData.primaryButton || ''}
            buttonLink={localProductData.primaryButtonLink || ''}
            onTextChange={(value) => updateProductField('primaryButton', value)}
            onLinkChange={(value) => updateProductField('primaryButtonLink', value)}
          />
          <ButtonField
            label="Secondary Button"
            buttonText={localProductData.secondaryButton || ''}
            buttonLink={localProductData.secondaryButtonLink || ''}
            onTextChange={(value) => updateProductField('secondaryButton', value)}
            onLinkChange={(value) => updateProductField('secondaryButtonLink', value)}
          />
        </div>
      </div>

      {/* Section Headings: Key Features */}
      <div className="space-y-3">
        <h4 className="font-medium text-base">Key Features Section</h4>
        <TextInput
          label="Section Title"
          value={(productData as any)?.sections?.features?.title || ''}
          onChange={(value) => {
            const next = { ...((productData as any).sections || {}), features: { ...(((productData as any).sections || {}).features || {}), title: value } };
            updateProductField('sections', next);
          }}
        />
        <TextArea
          label="Section Description"
          value={(productData as any)?.sections?.features?.description || ''}
          onChange={(value) => {
            const next = { ...((productData as any).sections || {}), features: { ...(((productData as any).sections || {}).features || {}), description: value } };
            updateProductField('sections', next);
          }}
          rows={2}
        />
      </div>

      {/* Key Features */}
      <div className="space-y-4">
        <h4 className="font-medium text-base">Key Features</h4>
        {(localProductData.details || []).map((detail: any, index: number) => {
          const stableKey = `detail-${index}-${detail.title?.length || 0}-${detail.description?.length || 0}`;
          return (
          <div key={stableKey} className="border border-border rounded-lg p-4 space-y-2">
            <TextInput
              label="Title"
              value={detail.title}
              onChange={(value) => updateProductNestedField('details', index, 'title', value)}
            />
            <TextArea
              label="Description"
              value={detail.description}
              onChange={(value) => updateProductNestedField('details', index, 'description', value)}
              rows={3}
            />
            <button
              onClick={() => {
                const updated = productData.details.filter((_: any, i: number) => i !== index);
                updateProductField('details', updated);
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
            const updated = [...(productData.details || []), newFeature];
            updateProductField('details', updated);
          }}
          className="w-full p-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-600 hover:border-gray-400 hover:text-gray-800"
        >
          + Add Feature
        </button>
      </div>

      {/* Section Headings: Use Cases */}
      <div className="space-y-3">
        <h4 className="font-medium text-base">Use Cases Section</h4>
        <TextInput
          label="Section Title"
          value={(productData as any)?.sections?.useCases?.title || ''}
          onChange={(value) => {
            const next = { ...((productData as any).sections || {}), useCases: { ...(((productData as any).sections || {}).useCases || {}), title: value } };
            updateProductField('sections', next);
          }}
        />
        <TextArea
          label="Section Description"
          value={(productData as any)?.sections?.useCases?.description || ''}
          onChange={(value) => {
            const next = { ...((productData as any).sections || {}), useCases: { ...(((productData as any).sections || {}).useCases || {}), description: value } };
            updateProductField('sections', next);
          }}
          rows={2}
        />
      </div>

      {/* Use Cases */}
      <div className="space-y-4">
        <h4 className="font-medium text-base">Use Cases</h4>
        {(localProductData.benefits || []).map((benefit: string, index: number) => {
          const stableKey = `benefit-${index}-${benefit?.length || 0}`;
          return (
          <div key={stableKey} className="border border-border rounded-lg p-4 space-y-2">
            <TextArea
              label={`Use Case ${index + 1}`}
              value={benefit}
              onChange={(value) => {
                const updated = [...productData.benefits];
                updated[index] = value;
                updateProductField('benefits', updated);
              }}
              rows={2}
            />
            <button
              onClick={() => {
                const updated = productData.benefits.filter((_: any, i: number) => i !== index);
                updateProductField('benefits', updated);
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
            const updated = [...(productData.benefits || []), ''];
            updateProductField('benefits', updated);
          }}
          className="w-full p-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-600 hover:border-gray-400 hover:text-gray-800"
        >
          + Add Use Case
        </button>
      </div>

      {/* Section Headings: Technical Capabilities */}
      <div className="space-y-3">
        <h4 className="font-medium text-base">Technical Capabilities Section</h4>
        <TextInput
          label="Section Title"
          value={(productData as any)?.sections?.specifications?.title || ''}
          onChange={(value) => {
            const next = { ...((productData as any).sections || {}), specifications: { ...(((productData as any).sections || {}).specifications || {}), title: value } };
            updateProductField('sections', next);
          }}
        />
        <TextArea
          label="Section Description"
          value={(productData as any)?.sections?.specifications?.description || ''}
          onChange={(value) => {
            const next = { ...((productData as any).sections || {}), specifications: { ...(((productData as any).sections || {}).specifications || {}), description: value } };
            updateProductField('sections', next);
          }}
          rows={2}
        />
      </div>

      {/* Technical Capabilities */}
      <div className="space-y-4">
        <h4 className="font-medium text-base">Technical Capabilities</h4>
        {(localProductData.specifications || []).map((spec: any, index: number) => {
          const stableKey = `spec-${index}-${spec.name?.length || 0}-${spec.icon?.length || 0}`;
          return (
          <div key={stableKey} className="border border-border rounded-lg p-4 space-y-2">
            <div className="grid grid-cols-3 gap-3">
              <TextInput
                label="Icon"
                value={spec.icon}
                onChange={(value) => updateProductNestedField('specifications', index, 'icon', value)}
                placeholder="📊"
              />
              <TextInput
                label="Name"
                value={spec.name}
                onChange={(value) => updateProductNestedField('specifications', index, 'name', value)}
                placeholder="Analytics Engine"
              />
              <div></div>
            </div>
            <TextArea
              label="Value/Description"
              value={spec.value}
              onChange={(value) => updateProductNestedField('specifications', index, 'value', value)}
              rows={2}
              placeholder="Real-time component tracking..."
            />
            <button
              onClick={() => {
                const updated = productData.specifications.filter((_: any, i: number) => i !== index);
                updateProductField('specifications', updated);
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
            const updated = [...(productData.specifications || []), newSpec];
            updateProductField('specifications', updated);
          }}
          className="w-full p-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-600 hover:border-gray-400 hover:text-gray-800"
        >
          + Add Specification
        </button>
      </div>

      {/* Pricing */}
      <div className="space-y-4">
        <h4 className="font-medium text-base">Pricing</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="Price"
            value={localProductData.pricing?.price || ''}
            onChange={(value) => updateProductNestedField('pricing', null, 'price', value)}
            placeholder="$49"
          />
          <TextInput
            label="Period"
            value={localProductData.pricing?.period || ''}
            onChange={(value) => updateProductNestedField('pricing', null, 'period', value)}
            placeholder="/month"
          />
        </div>
        <TextArea
          label="Pricing Description"
          value={localProductData.pricing?.description || ''}
          onChange={(value) => updateProductNestedField('pricing', null, 'description', value)}
          rows={2}
        />
        <TextInput
          label="Pricing Button Text"
          value={localProductData.pricing?.buttonText || ''}
          onChange={(value) => updateProductNestedField('pricing', null, 'buttonText', value)}
          placeholder="Start Free Trial"
        />
      </div>

      {/* Visibility */}
      <div className="space-y-2">
        <h4 className="font-medium text-base">Visibility</h4>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={productData.visibility?.waitlist ?? true}
            onChange={(e) => updateProductNestedField('visibility', null, 'waitlist', e.target.checked)}
            className="rounded border-border"
          />
          <span>Show Waitlist section on this product page</span>
        </label>
      </div>

      {/* FAQs */}
      <div className="space-y-4">
        <h4 className="font-medium text-base">FAQs</h4>
        {(localProductData.faqs || []).map((faq: any, index: number) => {
          const stableKey = `faq-${index}-${faq.question?.length || 0}-${faq.answer?.length || 0}`;
          return (
          <div key={stableKey} className="border border-border rounded-lg p-4 space-y-2">
            <TextInput
              label={`Question ${index + 1}`}
              value={faq.question || ''}
              onChange={(value) => {
                const updated = [...(productData.faqs || [])];
                updated[index] = { ...updated[index], question: value };
                updateProductField('faqs', updated);
              }}
            />
            <TextArea
              label="Answer"
              value={faq.answer || ''}
              rows={3}
              onChange={(value) => {
                const updated = [...(productData.faqs || [])];
                updated[index] = { ...updated[index], answer: value };
                updateProductField('faqs', updated);
              }}
            />
            <button
              onClick={() => {
                const updated = (productData.faqs || []).filter((_: any, i: number) => i !== index);
                updateProductField('faqs', updated);
              }}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Remove FAQ
            </button>
          </div>
          )
        })}
        <button
          onClick={() => {
            const updated = [...(productData.faqs || []), { question: '', answer: '' }];
            updateProductField('faqs', updated);
          }}
          className="w-full p-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-600 hover:border-gray-400 hover:text-gray-800"
        >
          + Add FAQ
        </button>
      </div>

      {/* LLM Content */}
      {productData.llm && (
        <div className="space-y-4">
          <h4 className="font-medium text-base">LLM Content</h4>
          
          {/* Answer Box */}
          <div className="border border-border rounded-lg p-4">
            <TextArea
              label="Answer Box (40-70 words)"
              value={localProductData.llm?.answerBox || ''}
              onChange={(value) => updateProductNestedField('llm', null, 'answerBox', value)}
              rows={3}
            />
          </div>

          {/* Expert Quote */}
          <div className="border border-border rounded-lg p-4 space-y-3">
            <h5 className="font-medium">Expert Quote</h5>
            <TextArea
              label="Quote"
              value={localProductData.llm?.expertQuote?.quote || ''}
              onChange={(value) => {
                const current = localProductData.llm?.expertQuote || {};
                updateProductNestedField('llm', null, 'expertQuote', { ...current, quote: value });
              }}
              rows={2}
            />
            <div className="grid grid-cols-2 gap-3">
              <TextInput
                label="Expert Name"
                value={localProductData.llm?.expertQuote?.expertName || ''}
                onChange={(value) => {
                  const current = localProductData.llm?.expertQuote || {};
                  updateProductNestedField('llm', null, 'expertQuote', { ...current, expertName: value });
                }}
              />
              <TextInput
                label="Expert Title"
                value={localProductData.llm?.expertQuote?.expertTitle || ''}
                onChange={(value) => {
                  const current = localProductData.llm?.expertQuote || {};
                  updateProductNestedField('llm', null, 'expertQuote', { ...current, expertTitle: value });
                }}
              />
            </div>
            <TextInput
              label="Institution"
              value={localProductData.llm?.expertQuote?.institution || ''}
              onChange={(value) => {
                const current = localProductData.llm?.expertQuote || {};
                updateProductNestedField('llm', null, 'expertQuote', { ...current, institution: value });
              }}
            />
          </div>

          {/* Statistic */}
          <div className="border border-border rounded-lg p-4 space-y-3">
            <h5 className="font-medium">Statistic</h5>
            <div className="grid grid-cols-2 gap-3">
              <TextInput
                label="Statistic"
                value={localProductData.llm?.statistic?.statistic || ''}
                onChange={(value) => {
                  const current = localProductData.llm?.statistic || {};
                  updateProductNestedField('llm', null, 'statistic', { ...current, statistic: value });
                }}
              />
              <TextInput
                label="Date"
                value={localProductData.llm?.statistic?.date || ''}
                onChange={(value) => {
                  const current = localProductData.llm?.statistic || {};
                  updateProductNestedField('llm', null, 'statistic', { ...current, date: value });
                }}
              />
            </div>
            <TextArea
              label="Description"
              value={localProductData.llm?.statistic?.description || ''}
              onChange={(value) => {
                const current = localProductData.llm?.statistic || {};
                updateProductNestedField('llm', null, 'statistic', { ...current, description: value });
              }}
              rows={2}
            />
            <TextInput
              label="Source"
              value={localProductData.llm?.statistic?.source || ''}
              onChange={(value) => {
                const current = localProductData.llm?.statistic || {};
                updateProductNestedField('llm', null, 'statistic', { ...current, source: value });
              }}
            />
          </div>

          {/* FAQs (LLM) */}
          <div className="space-y-4">
            <h5 className="font-medium">FAQs</h5>
            {(localProductData.llm?.faqs || []).map((faq: any, index: number) => {
              const stableKey = `llm-faq-${index}-${faq.question?.length || 0}-${faq.answer?.length || 0}`;
              return (
              <div key={stableKey} className="border border-border rounded-lg p-4 space-y-2">
                <TextInput
                  label={`Question ${index + 1}`}
                  value={faq.question || ''}
                  onChange={(value) => {
                    const updated = [...(localProductData.llm?.faqs || [])];
                    updated[index] = { ...updated[index], question: value };
                    updateProductNestedField('llm', null, 'faqs', updated);
                  }}
                />
                <TextArea
                  label="Answer"
                  value={faq.answer || ''}
                  rows={3}
                  onChange={(value) => {
                    const updated = [...(localProductData.llm?.faqs || [])];
                    updated[index] = { ...updated[index], answer: value };
                    updateProductNestedField('llm', null, 'faqs', updated);
                  }}
                />
                <button
                  onClick={() => {
                    const updated = (localProductData.llm?.faqs || []).filter((_: any, i: number) => i !== index);
                    updateProductNestedField('llm', null, 'faqs', updated);
                  }}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove FAQ
                </button>
              </div>
              )
            })}
            <button
              onClick={() => {
                const updated = [...(localProductData.llm?.faqs || []), { question: '', answer: '' }];
                updateProductNestedField('llm', null, 'faqs', updated);
              }}
              className="w-full p-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-600 hover:border-gray-400 hover:text-gray-800"
            >
              + Add FAQ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};