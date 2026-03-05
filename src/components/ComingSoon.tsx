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
  const fallbackTitle = 'Join Designers shipping faster with BiblioKit';
  const fallbackDescription = 'Drop your email to jump the line for our next Figma plugins in beta.';
  const fallbackButtonText = 'Get Beta Access';
  const fallbackSuccessMessage = "You're on the list! We'll email you soon.";

  return (
    <div className="min-h-screen flex flex-col">
      <Hero />
      <Waitlist
        visibleOverride={true}
        titleOverride={(defaultWaitlist.title as string) || fallbackTitle}
        descriptionOverride={(defaultWaitlist.description as string) || fallbackDescription}
        buttonTextOverride={(defaultWaitlist.buttonText as string) || (defaultWaitlist.button_text as string) || fallbackButtonText}
        successMessageOverride={(defaultWaitlist.successMessage as string) || (defaultWaitlist.success_message as string) || fallbackSuccessMessage}
      />
    </div>
  );
};

export default ComingSoon;
