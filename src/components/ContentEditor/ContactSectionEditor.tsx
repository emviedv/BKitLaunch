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

  // Keep local contact data to prevent resets when other sections are edited
  const [localContact, setLocalContact] = React.useState(() => contact || {});
  
  // Track if user is actively editing to prevent prop sync resets
  const isActivelyEditing = React.useRef(false);
  const lastPropUpdate = React.useRef(Date.now());

  // Update local contact only on initial mount or explicit prop changes (not re-renders)
  React.useEffect(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastPropUpdate.current;
    
    // Only sync from props if:
    // 1. Initial mount (no local data)
    // 2. Substantial time has passed (not a re-render)
    // 3. Not actively editing
    if (Object.keys(localContact).length === 0 || (timeSinceLastUpdate > 1000 && !isActivelyEditing.current)) {
      setLocalContact(contact || {});
      lastPropUpdate.current = now;
    }
  }, [contact, localContact]);

  React.useEffect(() => {
    setJsonValue(JSON.stringify(localContact || {}, null, 2));
  }, [localContact]);

  // Custom update handler that updates both local state and parent state
  const updateContactField = React.useCallback((field: string, value: any) => {
    // Mark as actively editing
    isActivelyEditing.current = true;
    
    // Update local state immediately for responsive UI
    const updatedContact = { ...localContact, [field]: value };
    setLocalContact(updatedContact);
    
    // Update parent state
    updateNestedField('contact', null, field, value);
    
    // Clear editing flag after a delay
    setTimeout(() => {
      isActivelyEditing.current = false;
    }, 2000);
  }, [localContact, updateNestedField]);

  const applyJson = () => {
    try {
      // Temporarily disable editing protection for JSON application
      const wasEditing = isActivelyEditing.current;
      isActivelyEditing.current = false;
      
      const parsed = JSON.parse(jsonValue || '{}');
      if (parsed && typeof parsed === 'object') {
        // Update both local state and parent state
        setLocalContact(parsed);
        Object.entries(parsed).forEach(([k, v]) => updateNestedField('contact', null, k, v));
      }
      setJsonEdit(false);
      
      // Force a re-render to ensure all inputs reflect the new state
      setTimeout(() => {
        setJsonValue(JSON.stringify(localContact, null, 2));
        isActivelyEditing.current = wasEditing;
      }, 50);
    } catch {
      isActivelyEditing.current = wasEditing;
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
      value={localContact?.email || ''}
      onChange={(value) => updateContactField('email', value)}
      placeholder="hello@example.com"
    />
    <TextInput
      label="Twitter"
      value={localContact?.twitter || ''}
      onChange={(value) => updateContactField('twitter', value)}
      placeholder="@username"
    />
    <TextInput
      label="GitHub"
      value={localContact?.github || ''}
      onChange={(value) => updateContactField('github', value)}
      placeholder="username"
    />
  </div>
  );
};