import React from 'react';

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email';
  className?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  className = ''
}) => (
  <div>
    <label className="block text-sm font-medium mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full p-2 border border-border rounded ${className}`}
      placeholder={placeholder}
    />
  </div>
);

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  className = ''
}) => (
  <div>
    <label className="block text-sm font-medium mb-2">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full p-2 border border-border rounded ${className}`}
      placeholder={placeholder}
      rows={rows}
    />
  </div>
);

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  checked,
  onChange,
  id
}) => (
  <div className="flex items-center gap-3">
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        id={id}
      />
      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
    </label>
    <span className="capitalize">{label}</span>
  </div>
);

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  id
}) => (
  <div className="flex items-center gap-2">
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="rounded border-border"
    />
    <label htmlFor={id} className="text-sm">{label}</label>
  </div>
);

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = ''
}) => {
  const baseClasses = 'px-3 py-2 rounded transition-colors text-sm';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

interface ButtonFieldProps {
  label: string;
  buttonText: string;
  buttonLink: string;
  onTextChange: (value: string) => void;
  onLinkChange: (value: string) => void;
  textPlaceholder?: string;
  linkPlaceholder?: string;
}

export const ButtonField: React.FC<ButtonFieldProps> = ({
  label,
  buttonText,
  buttonLink,
  onTextChange,
  onLinkChange,
  textPlaceholder = 'Button text',
  linkPlaceholder = 'https://example.com or /path'
}) => (
  <div className="space-y-2">
    <h5 className="font-medium text-sm text-muted-foreground">{label}</h5>
    <TextInput
      label="Button Text"
      value={buttonText}
      onChange={onTextChange}
      placeholder={textPlaceholder}
    />
    <TextInput
      label="Button Link"
      value={buttonLink}
      onChange={onLinkChange}
      placeholder={linkPlaceholder}
    />
  </div>
);