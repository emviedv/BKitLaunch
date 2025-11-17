import React from 'react';
import Hero from './Hero';
import Waitlist from './Waitlist';
import productData from '@/data/products.json' with { type: 'json' };

/**
 * ComingSoon page: shows Hero and a waitlist email capture.
 * Used when the site-wide coming soon flag is enabled.
 */
export const ComingSoon: React.FC = () => {
  const defaultWaitlist = (productData as any)?.waitlist || {};
  return (
    <div className="min-h-screen flex flex-col">
      <Hero />
      <Waitlist
        visibleOverride={true}
        titleOverride={(defaultWaitlist.title as string) || ''}
        descriptionOverride={(defaultWaitlist.description as string) || ''}
        buttonTextOverride={(defaultWaitlist.buttonText as string) || (defaultWaitlist.button_text as string) || 'Get early access'}
        successMessageOverride={(defaultWaitlist.successMessage as string) || (defaultWaitlist.success_message as string) || "You're on the list! We'll email you soon."}
      />
    </div>
  );
};

export default ComingSoon;
