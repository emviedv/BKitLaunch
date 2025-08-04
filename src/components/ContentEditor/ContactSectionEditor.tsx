import React from 'react';
import { ContactInfo } from '@/lib/database';
import { TextInput } from './FormFields';

interface ContactSectionEditorProps {
  contact: ContactInfo | null;
  updateNestedField: (section: string, index: number | null, field: string, value: any) => void;
}

export const ContactSectionEditor: React.FC<ContactSectionEditorProps> = ({ contact, updateNestedField }) => (
  <div className="space-y-4">
    <h3 className="font-semibold text-lg">Contact Information</h3>
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