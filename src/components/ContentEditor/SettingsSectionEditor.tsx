import React from 'react';
import { ToggleSwitch } from './FormFields';

interface SettingsSectionEditorProps {
  settings: any;
  updateSettingsVisibility: (section: 'hero' | 'features' | 'pricing' | 'cta', isVisible: boolean) => void;
}

export const SettingsSectionEditor: React.FC<SettingsSectionEditorProps> = ({ 
  settings, 
  updateSettingsVisibility 
}) => (
  <div className="space-y-4">
    <h3 className="font-semibold text-lg">Visibility Settings</h3>
    <p className="text-sm text-muted-foreground mb-4">
      Control which sections are displayed on your website.
    </p>
    <div className="space-y-3">
      {(['hero', 'features', 'pricing', 'cta'] as const).map((section) => {
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
  </div>
);