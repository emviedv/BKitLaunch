import React, { useState } from 'react';
import { debugService } from '../lib/debugService';
import { usePublishedContent } from '../hooks/usePublishedContent';
import { Button } from '@/components/ui/button';
import { joinWaitlist } from '@/lib/waitlist';
import {
  LANDING_WAITLIST_EMAIL_ID,
  LANDING_WAITLIST_ERROR_ID,
  LANDING_WAITLIST_FORM_ID,
  LANDING_WAITLIST_ID
} from '@/config/sectionAnchors';

interface WaitlistProps {
  visibleOverride?: boolean;
  titleOverride?: string;
  descriptionOverride?: string;
  buttonTextOverride?: string;
  successMessageOverride?: string;
}

interface WaitlistState {
  email: string;
  isLoading: boolean;
  submitted: boolean;
  error: string | null;
}

const Waitlist: React.FC<WaitlistProps> = ({ visibleOverride, titleOverride, descriptionOverride, buttonTextOverride, successMessageOverride }) => {
  const { content } = usePublishedContent();
  const [state, setState] = useState<WaitlistState>({
    email: '',
    isLoading: false,
    submitted: false,
    error: null
  });

  // Check if waitlist should be visible
  const visibilityFromSettings = content.settings?.visibility?.waitlist !== false;
  const shouldShowWaitlist =
    typeof visibleOverride === 'boolean' ? visibleOverride : visibilityFromSettings;

  if (!shouldShowWaitlist || !content.waitlist) {
    return null;
  }

  // Normalize field names from DB (snake_case) and JSON (camelCase)
  const waitlistData: any = content.waitlist || {};
  const waitlistTitle: string = (titleOverride as string) || (waitlistData.title as string) || '';
  const waitlistDescription: string = (descriptionOverride as string) || (waitlistData.description as string) || '';

  // If there's no meaningful waitlist content, do not render
  if (!waitlistTitle && !waitlistDescription) {
    return null;
  }
  const buttonLabel: string = (buttonTextOverride as string) || (waitlistData.buttonText as string) || (waitlistData.button_text as string) || 'Join Waitlist';
  const successMessageText: string = (successMessageOverride as string) || (waitlistData.successMessage as string) || (waitlistData.success_message as string) || "Thank you for joining our waitlist! We'll keep you updated.";

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setState(prev => ({ ...prev, email: newEmail, error: null }));
    debugService.debug('Waitlist email input changed', { email: newEmail });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = state.email.trim();
    if (!email) {
      setState(prev => ({ ...prev, error: 'Please enter your email address.' }));
      return;
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setState(prev => ({ ...prev, error: 'Please enter a valid email address.' }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    debugService.info('Waitlist form submitted', { email: state.email });

    try {
      await joinWaitlist(state.email);
      setState(prev => ({ ...prev, submitted: true, isLoading: false }));
      debugService.info('Waitlist signup completed successfully', { email: state.email });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to join waitlist. Please try again.';
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      debugService.error('Waitlist signup failed', { email: state.email, error: errorMessage });
    }
  };

  return (
    <section id={LANDING_WAITLIST_ID} className="landing-waitlist-section landing-waitlist-surface relative overflow-hidden py-20 scroll-mt-28">
      <div className="landing-waitlist-content section-content relative z-10 max-w-3xl text-center">
        <h2 className="landing-waitlist-heading section-title mb-4 text-foreground">
          {waitlistTitle}
        </h2>
        <p className="landing-waitlist-description section-description mb-8 text-center">
          {waitlistDescription}
        </p>
        {state.submitted ? (
          <div className="landing-waitlist-success card bg-green-50 border-green-200 text-green-800 p-5 min-h-0" role="status" aria-live="polite">
            {successMessageText}
          </div>
        ) : (
          <form
            id={LANDING_WAITLIST_FORM_ID}
            className="landing-waitlist-form flex flex-col sm:flex-row gap-4 justify-center"
            onSubmit={handleSubmit}
          >
            <label htmlFor={LANDING_WAITLIST_EMAIL_ID} className="sr-only">
              Email address
            </label>
            <input
              id={LANDING_WAITLIST_EMAIL_ID}
              type="email"
              value={state.email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              required
              disabled={state.isLoading}
              className="landing-waitlist-input input flex-1 max-w-[320px] disabled:opacity-50 disabled:cursor-not-allowed"
              aria-describedby={state.error ? LANDING_WAITLIST_ERROR_ID : undefined}
            />
            <Button
              type="submit"
              size="lg"
              disabled={state.isLoading || !state.email.trim()}
              className="landing-waitlist-submit bg-[#ff2f87] hover:bg-[#e02074] text-white disabled:cursor-not-allowed"
            >
              {state.isLoading ? 'Joining...' : buttonLabel}
            </Button>
          </form>
        )}
        {state.error && (
          <div
            id={LANDING_WAITLIST_ERROR_ID}
            className="landing-waitlist-error card mt-4 bg-red-50 border-red-200 text-red-800"
            role="alert"
            aria-live="assertive"
          >
            {state.error}
          </div>
        )}
      </div>
    </section>
  );
};

export default Waitlist; 
