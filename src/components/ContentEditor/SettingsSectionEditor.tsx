import React from 'react';
import { ToggleSwitch } from './FormFields';

interface SettingsSectionEditorProps {
  settings: any;
  updateSettingsVisibility: (section: string, isVisible: boolean) => void;
}

export const SettingsSectionEditor: React.FC<SettingsSectionEditorProps> = ({ 
  settings, 
  updateSettingsVisibility 
}) => (
  <>
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