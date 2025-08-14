import { useState } from 'react';
import productData from '@/data/products.json';

export const useContentEditorState = () => {
  const [savedContent, setSavedContent] = useState<any>(productData);
  const [jsonContent, setJsonContent] = useState<string>(
    JSON.stringify(productData, null, 2)
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const updateSection = (section: string, newData: any) => {
    const updatedContent = { ...savedContent } as any;

    if (section.includes('.')) {
      const path = section.split('.');
      let current = updatedContent as any;

      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) {
          current[path[i]] = {};
        }
        current = current[path[i]];
      }

      current[path[path.length - 1]] = newData;
    } else {
      (updatedContent as any)[section] = newData;
    }

    setSavedContent(updatedContent);
    setJsonContent(JSON.stringify(updatedContent, null, 2));
    setIsEditing(true);
  };

  const updateNestedField = (
    section: string,
    index: number | null,
    field: string,
    value: any
  ) => {
    let currentSection: any;

    if (section.includes('.')) {
      const path = section.split('.');
      currentSection = savedContent as any;
      for (const key of path) {
        currentSection = currentSection?.[key];
      }
    } else {
      currentSection = (savedContent as any)[section];
    }

    let updatedSection: any;

    if (Array.isArray(currentSection) && index !== null) {
      updatedSection = currentSection.map((item: any, i: number) =>
        i === index ? { ...item, [field]: value } : item
      );
    } else {
      updatedSection = { ...currentSection, [field]: value };
    }

    updateSection(section, updatedSection);
  };

  return {
    savedContent,
    setSavedContent,
    jsonContent,
    setJsonContent,
    isEditing,
    setIsEditing,
    updateSection,
    updateNestedField,
  };
};


