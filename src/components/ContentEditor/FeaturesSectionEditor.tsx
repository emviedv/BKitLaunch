import React from 'react';
import { TextInput, TextArea } from './FormFields';

interface Feature {
  icon: string;
  title: string;
  badge: string;
  badgeColor?: string;
  description: string;
  isFeatured?: boolean;
  buttonText?: string;
  buttonLink?: string;
}

interface FeaturesSectionEditorProps {
  features: Feature[];
  updateNestedField: (section: string, index: number | null, field: string, value: any) => void;
}

const ColorPreview: React.FC<{ color: string }> = ({ color }) => {
  if (color.startsWith('#')) {
    return (
      <div 
        className="w-4 h-4 rounded border"
        style={{ backgroundColor: color }}
        title={`Color: ${color}`}
      />
    );
  }

  const colorClass = {
    green: 'bg-green-100 text-green-800 border border-green-200',
    blue: 'bg-blue-100 text-blue-800 border border-blue-200',
    orange: 'bg-orange-100 text-orange-800 border border-orange-200',
    purple: 'bg-purple-100 text-purple-800 border border-purple-200',
    red: 'bg-red-100 text-red-800 border border-red-200',
    yellow: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    pink: 'bg-pink-100 text-pink-800 border border-pink-200',
    gray: 'bg-gray-100 text-gray-800 border border-gray-200'
  }[color] || 'bg-primary text-primary-foreground';

  return (
    <span className={`text-xs px-1 py-0.5 rounded ${colorClass}`}>
      {color}
    </span>
  );
};

export const FeaturesSectionEditor: React.FC<FeaturesSectionEditorProps> = ({ 
  features, 
  updateNestedField 
}) => (
  <div className="space-y-4">
    <h3 className="font-semibold text-lg">Features Section</h3>
    <div className="space-y-4">
      {features?.map((feature, index) => (
        <div key={index} className={`p-3 border rounded ${feature.isFeatured ? 'border-primary/30 bg-primary/5' : 'border-border'}`}>
          {/* Featured Toggle */}
          <div className="flex items-center gap-2 mb-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!!feature.isFeatured}
                onChange={(e) => updateNestedField('features', index, 'isFeatured', e.target.checked)}
                className="rounded border-border"
              />
              <span className="text-sm font-medium">Featured Card</span>
            </label>
            {feature.isFeatured && (
              <span className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded-full">
                FEATURED
              </span>
            )}
          </div>

          {/* Main Fields */}
          <div className="grid grid-cols-6 gap-2 text-sm mb-3">
            <div>
              <label className="block text-xs font-medium mb-1">Icon</label>
              <input
                type="text"
                value={feature.icon}
                onChange={(e) => updateNestedField('features', index, 'icon', e.target.value)}
                className="p-1 border border-border rounded w-full"
                placeholder="Icon"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1">Title</label>
              <input
                type="text"
                value={feature.title}
                onChange={(e) => updateNestedField('features', index, 'title', e.target.value)}
                className="p-1 border border-border rounded w-full"
                placeholder="Title"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Badge</label>
              <input
                type="text"
                value={feature.badge}
                onChange={(e) => updateNestedField('features', index, 'badge', e.target.value)}
                className="p-1 border border-border rounded w-full"
                placeholder="e.g. New, Coming Soon"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1">Badge Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={feature.badgeColor || ''}
                  onChange={(e) => updateNestedField('features', index, 'badgeColor', e.target.value)}
                  className="p-1 border border-border rounded flex-1"
                  placeholder="#10b981 or green"
                />
                {feature.badgeColor && (
                  <div className="flex items-center gap-1">
                    <ColorPreview color={feature.badgeColor} />
                  </div>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Use hex (#10b981) or predefined (green, blue, orange, etc.)
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1">Description</label>
            <textarea
              value={feature.description}
              onChange={(e) => updateNestedField('features', index, 'description', e.target.value)}
              className="p-1 border border-border rounded h-16 text-xs w-full"
              placeholder="Description"
            />
          </div>

          {/* Featured Card Button Fields */}
          {feature.isFeatured && (
            <div className="border-t border-border/50 pt-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-primary">Featured Card Button</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <label className="block text-xs font-medium mb-1">Button Text</label>
                  <input
                    type="text"
                    value={feature.buttonText || ''}
                    onChange={(e) => updateNestedField('features', index, 'buttonText', e.target.value)}
                    className="p-1 border border-border rounded w-full"
                    placeholder="e.g. Learn More, Get Started"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Button Link</label>
                  <input
                    type="text"
                    value={feature.buttonLink || ''}
                    onChange={(e) => updateNestedField('features', index, 'buttonLink', e.target.value)}
                    className="p-1 border border-border rounded w-full"
                    placeholder="/pricing or https://example.com"
                  />
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Button only appears when both text and featured status are set
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);