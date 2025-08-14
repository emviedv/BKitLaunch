import React, { useMemo, useState } from 'react';
import { debugService } from '../lib/debugService';
import { contentApi } from '../lib/contentApi';
import { usePublishedContent } from '../hooks/usePublishedContent';

const WAITLIST_BACKGROUND_CLASSES = [
  'gradient-brand-soft',
  'gradient-ocean-soft-radial',
  'gradient-violet-soft-radial',
  'gradient-mint-soft-radial',
  'gradient-sunset-soft-radial',
  'gradient-sand-soft-radial',
] as const;

interface WaitlistProps {
  visibleOverride?: boolean;
}

interface WaitlistState {
  email: string;
  isLoading: boolean;
  submitted: boolean;
  error: string | null;
}

const Waitlist: React.FC<WaitlistProps> = ({ visibleOverride }) => {
  const { content } = usePublishedContent();
  const [state, setState] = useState<WaitlistState>({
    email: '',
    isLoading: false,
    submitted: false,
    error: null
  });

  // Check if waitlist should be visible
  const globalVisible = content.settings?.visibility?.waitlist !== false;
  const shouldShowWaitlist =
    typeof visibleOverride === 'boolean' ? visibleOverride : globalVisible;
  
  if (!shouldShowWaitlist || !content.waitlist) {
    return null;
  }

  const backgroundClassName = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * WAITLIST_BACKGROUND_CLASSES.length);
    return WAITLIST_BACKGROUND_CLASSES[randomIndex];
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setState(prev => ({ ...prev, email: newEmail, error: null }));
    debugService.debug('Waitlist email input changed', { email: newEmail });
  };

  const joinWaitingList = async (email: string): Promise<void> => {
    debugService.info('Waitlist component calling API', { email });
    
    const result = await contentApi.joinWaitingList(email);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to join waitlist');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!state.email.trim()) {
      setState(prev => ({ ...prev, error: 'Please enter your email address.' }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    debugService.info('Waitlist form submitted', { email: state.email });

    try {
      await joinWaitingList(state.email);
      setState(prev => ({ ...prev, submitted: true, isLoading: false }));
      debugService.info('Waitlist signup completed successfully', { email: state.email });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to join waitlist. Please try again.';
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      debugService.error('Waitlist signup failed', { email: state.email, error: errorMessage });
    }
  };

  return (
    <section id="waitlist" className={`py-20 px-4 scroll-mt-28 ${backgroundClassName}`}>
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-blue-500 to-green-500">
          {content.waitlist.title}
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          {content.waitlist.description}
        </p>
        {state.submitted ? (
          <div className="card bg-green-50 border-green-200 text-green-800" role="status" aria-live="polite">
            {content.waitlist.successMessage}
          </div>
        ) : (
          <form
            className="flex flex-col sm:flex-row gap-4 justify-center"
            onSubmit={handleSubmit}
          >
            <label htmlFor="waitlist-email" className="sr-only">
              Email address
            </label>
            <input
              id="waitlist-email"
              type="email"
              value={state.email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              required
              disabled={state.isLoading}
              className="input flex-1 max-w-md disabled:opacity-50 disabled:cursor-not-allowed"
              aria-describedby={state.error ? 'waitlist-error' : undefined}
            />
            <button
              type="submit"
              disabled={state.isLoading || !state.email.trim()}
              className="button px-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state.isLoading ? 'Joining...' : content.waitlist.buttonText}
            </button>
          </form>
        )}
        {state.error && (
          <div
            id="waitlist-error"
            className="card mt-4 bg-red-50 border-red-200 text-red-800"
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