import React from 'react';

interface HeaderCtasEditorProps {
  visibility: boolean;
  logoText: string;
  signInText: string;
  getStartedText: string;
  signInHref: string;
  getStartedHref: string;
  showSignIn: boolean;
  showGetStarted: boolean;
  onChangeVisibility: (visible: boolean) => void;
  onChangeLogoText: (value: string) => void;
  onChangeSignInText: (value: string) => void;
  onChangeGetStartedText: (value: string) => void;
  onChangeSignInHref: (value: string) => void;
  onChangeGetStartedHref: (value: string) => void;
  onChangeShowSignIn: (checked: boolean) => void;
  onChangeShowGetStarted: (checked: boolean) => void;
}

export const HeaderCtasEditor: React.FC<HeaderCtasEditorProps> = ({
  visibility,
  logoText,
  signInText,
  getStartedText,
  signInHref,
  getStartedHref,
  showSignIn,
  showGetStarted,
  onChangeVisibility,
  onChangeLogoText,
  onChangeSignInText,
  onChangeGetStartedText,
  onChangeSignInHref,
  onChangeGetStartedHref,
  onChangeShowSignIn,
  onChangeShowGetStarted,
}) => {
  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          id="header-visible"
          checked={visibility}
          onChange={(e) => onChangeVisibility(e.target.checked)}
          className="rounded border-border"
        />
        <label htmlFor="header-visible" className="text-sm">Visible on website</label>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Logo Text</label>
        <input
          type="text"
          value={logoText || ''}
          onChange={(e) => onChangeLogoText(e.target.value)}
          className="w-full p-2 border border-border rounded"
          placeholder="BiblioKit"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Sign In Text</label>
          <input
            type="text"
            value={signInText || ''}
            onChange={(e) => onChangeSignInText(e.target.value)}
            className="w-full p-2 border border-border rounded"
            placeholder="Sign In"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Get Started Text</label>
          <input
            type="text"
            value={getStartedText || ''}
            onChange={(e) => onChangeGetStartedText(e.target.value)}
            className="w-full p-2 border border-border rounded"
            placeholder="Get Started"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Sign In Link</label>
          <input
            type="text"
            value={signInHref || ''}
            onChange={(e) => onChangeSignInHref(e.target.value)}
            className="w-full p-2 border border-border rounded"
            placeholder="/admin or /login"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Get Started Link</label>
          <input
            type="text"
            value={getStartedHref || ''}
            onChange={(e) => onChangeGetStartedHref(e.target.value)}
            className="w-full p-2 border border-border rounded"
            placeholder="/#contact or /signup"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="show-sign-in-sections"
            checked={showSignIn ?? true}
            onChange={(e) => onChangeShowSignIn(e.target.checked)}
            className="rounded border-border"
          />
          <label htmlFor="show-sign-in-sections" className="text-sm">Show Sign In Button</label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="show-get-started-sections"
            checked={showGetStarted ?? true}
            onChange={(e) => onChangeShowGetStarted(e.target.checked)}
            className="rounded border-border"
          />
          <label htmlFor="show-get-started-sections" className="text-sm">Show Get Started Button</label>
        </div>
      </div>
    </>
  );
};


