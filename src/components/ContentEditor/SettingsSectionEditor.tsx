import React from 'react';
import { ToggleSwitch } from './FormFields';

interface SettingsSectionEditorProps {
  settings: any;
  updateSettingsVisibility: (section: string, isVisible: boolean) => void;
}

export const SettingsSectionEditor: React.FC<SettingsSectionEditorProps> = ({ 
  settings, 
  updateSettingsVisibility 
}) => {
  const [jsonEdit, setJsonEdit] = React.useState(false);
  const [jsonValue, setJsonValue] = React.useState<string>(JSON.stringify(settings || {}, null, 2));

  React.useEffect(() => {
    setJsonValue(JSON.stringify(settings || {}, null, 2));
  }, [settings]);

  const applyJson = () => {
    try {
      const parsed = JSON.parse(jsonValue || '{}');
      if (parsed && typeof parsed === 'object') {
        // Support settings.visibility and settings.labels boolean maps
        if (parsed.visibility && typeof parsed.visibility === 'object') {
          Object.entries(parsed.visibility).forEach(([key, value]) => {
            updateSettingsVisibility(String(key), Boolean(value));
          });
        }
        if (parsed.labels && typeof parsed.labels === 'object') {
          Object.entries(parsed.labels).forEach(([key, value]) => {
            updateSettingsVisibility(`labels.${String(key)}`, Boolean(value));
          });
        }
      }
      setJsonEdit(false);
    } catch {
      alert('Invalid JSON. Please correct and try again.');
    }
  };

  return (
  <>
  <div className="flex items-center justify-between">
    <h3 className="font-semibold text-lg">Visibility Settings</h3>
    <button className="px-3 py-1 text-sm rounded border border-border hover:bg-muted" onClick={() => setJsonEdit(true)}>Edit JSON</button>
  </div>
  {jsonEdit && (
    <div className="space-y-3 mb-4">
      <textarea
        className="w-full p-2 border border-border rounded h-64 font-mono text-sm"
        value={jsonValue}
        onChange={(e) => setJsonValue(e.target.value)}
        placeholder='{"visibility":{"hero":true,"features":true},"labels":{"featuresBadges":true}}'
      />
      <div className="flex gap-2">
        <button className="button text-xs" onClick={applyJson}>Apply JSON</button>
        <button className="button-secondary text-xs" onClick={() => setJsonEdit(false)}>Cancel</button>
      </div>
    </div>
  )}
  <div className="space-y-4">
    <h3 className="font-semibold text-lg">Visibility Settings</h3>
    <p className="text-sm text-muted-foreground mb-4">
      Control which sections are displayed on your website.
    </p>
    <div className="space-y-3">
      {(
        [
          'hero',
          'features',
          'pricing',
          'cta',
          'waitlist',
          'header',
          'footer'
        ] as const
      ).map((section) => {
        const isVisible = settings?.visibility?.[section] !== false;
        return (
          <ToggleSwitch
            key={section}
            id={`${section}-visibility`}
            label={`${section} Section`}
            checked={isVisible}
            onChange={(checked) => updateSettingsVisibility(section, checked)}
          />
        );
      })}
    </div>
    <h3 className="font-semibold text-lg">Label/Badge Settings</h3>
    <p className="text-sm text-muted-foreground mb-2">Toggle badges and labels per section.</p>
    <div className="space-y-3">
      {([
        { key: 'featuresBadges', label: 'Features Badges' },
        { key: 'pricingBadges', label: 'Pricing Popular Badge' },
        { key: 'heroBadges', label: 'Hero Labels/Badges' },
        { key: 'productBadges', label: 'Product Page Badges' },
        { key: 'ctaBadges', label: 'CTA Labels/Badges' }
      ] as const).map(({ key, label }) => {
        const enabled = settings?.labels?.[key] ?? true;
        return (
          <ToggleSwitch
            key={key}
            id={`labels-${key}`}
            label={label}
            checked={enabled}
            onChange={(checked) => {
              updateSettingsVisibility(`labels.${key}`, checked as unknown as boolean);
            }}
          />
        );
      })}
    </div>
  </div>
  <div className="space-y-4">
    <h3 className="font-semibold text-lg">Label/Badge Settings</h3>
    <p className="text-sm text-muted-foreground mb-2">Toggle badges and labels per section.</p>
    <div className="space-y-3">
      {([
        { key: 'featuresBadges', label: 'Features Badges' },
        { key: 'pricingBadges', label: 'Pricing Popular Badge' }
      ] as const).map(({ key, label }) => {
        const enabled = settings?.labels?.[key] ?? true;
        return (
          <ToggleSwitch
            key={key}
            id={`labels-${key}`}
            label={label}
            checked={enabled}
            onChange={(checked) => {
              updateSettingsVisibility(`labels.${key}`, checked as unknown as boolean);
            }}
          />
        );
      })}
    </div>
  </div>
  </>
  );
};