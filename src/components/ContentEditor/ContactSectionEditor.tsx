import React from 'react';
import { ContactInfo } from '@/lib/database';
import { TextInput } from './FormFields';

interface ContactSectionEditorProps {
  contact: ContactInfo | null;
  updateNestedField: (section: string, index: number | null, field: string, value: any) => void;
}

export const ContactSectionEditor: React.FC<ContactSectionEditorProps> = ({ contact, updateNestedField }) => {
  const [jsonEdit, setJsonEdit] = React.useState(false);
  const [jsonValue, setJsonValue] = React.useState<string>(JSON.stringify(contact || {}, null, 2));

  React.useEffect(() => {
    setJsonValue(JSON.stringify(contact || {}, null, 2));
  }, [contact]);

  const applyJson = () => {
    try {
      const parsed = JSON.parse(jsonValue || '{}');
      if (parsed && typeof parsed === 'object') {
        Object.entries(parsed).forEach(([k, v]) => updateNestedField('contact', null, k, v));
      }
      setJsonEdit(false);
    } catch {
      alert('Invalid JSON. Please correct and try again.');
    }
  };

  if (jsonEdit) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Contact Information — JSON Editor</h3>
          <div className="flex items-center gap-2">
            <button className="button-secondary text-xs" onClick={() => setJsonEdit(false)}>Cancel</button>
            <button className="button text-xs" onClick={applyJson}>Apply JSON</button>
          </div>
        </div>
        <textarea
          className="w-full p-2 border border-border rounded h-64 font-mono text-sm"
          value={jsonValue}
          onChange={(e) => setJsonValue(e.target.value)}
          placeholder='{"email":"hello@example.com","twitter":"@username","github":"username"}'
        />
      </div>
    );
  }

  return (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="font-semibold text-lg">Contact Information</h3>
      <button className="px-3 py-1 text-sm rounded border border-border hover:bg-muted" onClick={() => setJsonEdit(true)}>Edit JSON</button>
    </div>
    <TextInput
      label="Email"
      type="email"
      value={contact?.email || ''}
      onChange={(value) => updateNestedField('contact', null, 'email', value)}
      placeholder="hello@example.com"
    />
    <TextInput
      label="Twitter"
      value={contact?.twitter || ''}
      onChange={(value) => updateNestedField('contact', null, 'twitter', value)}
      placeholder="@username"
    />
    <TextInput
      label="GitHub"
      value={contact?.github || ''}
      onChange={(value) => updateNestedField('contact', null, 'github', value)}
      placeholder="username"
    />
  </div>
  );
};