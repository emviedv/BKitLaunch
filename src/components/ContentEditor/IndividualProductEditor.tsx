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

  useEffect(() => {
    if (productData) {
      setLocalJson(JSON.stringify(productData, null, 2));
    }
  }, [productData]);

  const updateProductField = (field: string, value: any) => {
    updateNestedField(`products.${productKey}`, null, field, value);
  };

  const updateProductNestedField = (field: string, index: number | null, subField: string, value: any) => {
    if (index !== null) {
      const currentArray = productData[field] || [];
      const updated = currentArray.map((item: any, i: number) => 
        i === index ? { ...item, [subField]: value } : item
      );
      updateProductField(field, updated);
    } else {
      const currentObj = productData[field] || {};
      updateProductField(field, { ...currentObj, [subField]: value });
    }
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
        />
        <div className="flex space-x-2">
          <Button
            onClick={() => {
              try {
                const parsed = JSON.parse(localJson);
                updateSection(`products.${productKey}`, parsed);
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
        <h3 className="font-semibold text-lg">{productData.title}</h3>
        <Button variant="secondary" onClick={() => setJsonEdit(true)}>
          Edit JSON
        </Button>
      </div>

      {/* Basic Information */}
      <div className="space-y-4">
        <h4 className="font-medium text-base">Basic Information</h4>
        <TextInput
          label="Emoji"
          value={productData.emoji || ''}
          onChange={(value) => updateProductField('emoji', value)}
          placeholder="e.g. ✨"
        />
        <TextInput
          label="Hero Badge Label"
          value={productData.badgeLabel || ''}
          onChange={(value) => updateProductField('badgeLabel', value)}
          placeholder="SaaS Analytics Platform"
        />
        <TextInput
          label="Title"
          value={productData.title || ''}
          onChange={(value) => updateProductField('title', value)}
        />
        <TextArea
          label="Description"
          value={productData.description || ''}
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
            buttonText={productData.primaryButton || ''}
            buttonLink={productData.primaryButtonLink || ''}
            onTextChange={(value) => updateProductField('primaryButton', value)}
            onLinkChange={(value) => updateProductField('primaryButtonLink', value)}
          />
          <ButtonField
            label="Secondary Button"
            buttonText={productData.secondaryButton || ''}
            buttonLink={productData.secondaryButtonLink || ''}
            onTextChange={(value) => updateProductField('secondaryButton', value)}
            onLinkChange={(value) => updateProductField('secondaryButtonLink', value)}
          />
        </div>
      </div>

      {/* Key Features */}
      <div className="space-y-4">
        <h4 className="font-medium text-base">Key Features</h4>
        {(productData.details || []).map((detail: any, index: number) => (
          <div key={index} className="border border-border rounded-lg p-4 space-y-2">
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
        ))}
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

      {/* Use Cases */}
      <div className="space-y-4">
        <h4 className="font-medium text-base">Use Cases</h4>
        {(productData.benefits || []).map((benefit: string, index: number) => (
          <div key={index} className="border border-border rounded-lg p-4 space-y-2">
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
        ))}
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

      {/* Technical Capabilities */}
      <div className="space-y-4">
        <h4 className="font-medium text-base">Technical Capabilities</h4>
        {(productData.specifications || []).map((spec: any, index: number) => (
          <div key={index} className="border border-border rounded-lg p-4 space-y-2">
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
        ))}
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
            value={productData.pricing?.price || ''}
            onChange={(value) => {
              const current = productData.pricing || {};
              updateProductNestedField('pricing', null, 'price', value);
            }}
            placeholder="$49"
          />
          <TextInput
            label="Period"
            value={productData.pricing?.period || ''}
            onChange={(value) => updateProductNestedField('pricing', null, 'period', value)}
            placeholder="/month"
          />
        </div>
        <TextArea
          label="Pricing Description"
          value={productData.pricing?.description || ''}
          onChange={(value) => updateProductNestedField('pricing', null, 'description', value)}
          rows={2}
        />
        <TextInput
          label="Pricing Button Text"
          value={productData.pricing?.buttonText || ''}
          onChange={(value) => updateProductNestedField('pricing', null, 'buttonText', value)}
          placeholder="Start Free Trial"
        />
      </div>

      {/* FAQs */}
      <div className="space-y-4">
        <h4 className="font-medium text-base">FAQs</h4>
        {(productData.faqs || []).map((faq: any, index: number) => (
          <div key={index} className="border border-border rounded-lg p-4 space-y-2">
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
        ))}
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
              value={productData.llm.answerBox || ''}
              onChange={(value) => updateProductNestedField('llm', null, 'answerBox', value)}
              rows={3}
            />
          </div>

          {/* Expert Quote */}
          <div className="border border-border rounded-lg p-4 space-y-3">
            <h5 className="font-medium">Expert Quote</h5>
            <TextArea
              label="Quote"
              value={productData.llm.expertQuote?.quote || ''}
              onChange={(value) => {
                const current = productData.llm.expertQuote || {};
                updateProductNestedField('llm', null, 'expertQuote', { ...current, quote: value });
              }}
              rows={2}
            />
            <div className="grid grid-cols-2 gap-3">
              <TextInput
                label="Expert Name"
                value={productData.llm.expertQuote?.expertName || ''}
                onChange={(value) => {
                  const current = productData.llm.expertQuote || {};
                  updateProductNestedField('llm', null, 'expertQuote', { ...current, expertName: value });
                }}
              />
              <TextInput
                label="Expert Title"
                value={productData.llm.expertQuote?.expertTitle || ''}
                onChange={(value) => {
                  const current = productData.llm.expertQuote || {};
                  updateProductNestedField('llm', null, 'expertQuote', { ...current, expertTitle: value });
                }}
              />
            </div>
            <TextInput
              label="Institution"
              value={productData.llm.expertQuote?.institution || ''}
              onChange={(value) => {
                const current = productData.llm.expertQuote || {};
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
                value={productData.llm.statistic?.statistic || ''}
                onChange={(value) => {
                  const current = productData.llm.statistic || {};
                  updateProductNestedField('llm', null, 'statistic', { ...current, statistic: value });
                }}
              />
              <TextInput
                label="Date"
                value={productData.llm.statistic?.date || ''}
                onChange={(value) => {
                  const current = productData.llm.statistic || {};
                  updateProductNestedField('llm', null, 'statistic', { ...current, date: value });
                }}
              />
            </div>
            <TextArea
              label="Description"
              value={productData.llm.statistic?.description || ''}
              onChange={(value) => {
                const current = productData.llm.statistic || {};
                updateProductNestedField('llm', null, 'statistic', { ...current, description: value });
              }}
              rows={2}
            />
            <TextInput
              label="Source"
              value={productData.llm.statistic?.source || ''}
              onChange={(value) => {
                const current = productData.llm.statistic || {};
                updateProductNestedField('llm', null, 'statistic', { ...current, source: value });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};