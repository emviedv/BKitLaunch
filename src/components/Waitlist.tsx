import React, { useState } from 'react';
import { debugService } from '../lib/debugService';
import { contentApi } from '../lib/contentApi';
import { usePublishedContent } from '../hooks/usePublishedContent';

interface WaitlistState {
  email: string;
  isLoading: boolean;
  submitted: boolean;
  error: string | null;
}

const Waitlist = () => {
  const { content } = usePublishedContent();
  const [state, setState] = useState<WaitlistState>({
    email: '',
    isLoading: false,
    submitted: false,
    error: null
  });

  // Check if waitlist should be visible
  const shouldShowWaitlist = content.settings?.visibility?.waitlist !== false;
  
  if (!shouldShowWaitlist || !content.waitlist) {
    return null;
  }

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
    <section className="py-16 px-4 bg-purple-50">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold mb-4 text-purple-900">
          {content.waitlist.title}
        </h2>
        <p className="text-lg mb-8 text-purple-700">
          {content.waitlist.description}
        </p>
        
        {state.submitted ? (
          <div className="bg-green-100 text-green-700 p-4 rounded-lg" role="status" aria-live="polite">
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
              className="flex-1 max-w-md px-4 py-2 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-describedby={state.error ? "waitlist-error" : undefined}
            />
            <button
              type="submit"
              disabled={state.isLoading || !state.email.trim()}
              className="button bg-purple-600 text-white hover:bg-purple-700 px-8 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              {state.isLoading ? 'Joining...' : content.waitlist.buttonText}
            </button>
          </form>
        )}
        
        {state.error && (
          <div 
            id="waitlist-error" 
            className="mt-4 bg-red-100 text-red-700 p-3 rounded-lg" 
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