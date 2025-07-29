import React, { useState } from 'react';

const Waitlist = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="py-16 px-4 bg-purple-50">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold mb-4 text-purple-900">
          Join the Waitlist
        </h2>
        <p className="text-lg mb-8 text-purple-700">
          Be the first to know when BiblioKit launches. Get early access and exclusive updates.
        </p>
        
        {submitted ? (
          <div className="bg-green-100 text-green-700 p-4 rounded-lg">
            Thank you for joining our waitlist! We'll keep you updated.
          </div>
        ) : (
          <form
            name="waitlist"
            method="POST"
            data-netlify="true"
            className="flex flex-col sm:flex-row gap-4 justify-center"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
              // The form will be handled by Netlify
            }}
          >
            <input type="hidden" name="form-name" value="waitlist" />
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 max-w-md px-4 py-2 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="btn-primary bg-purple-600 text-white hover:bg-purple-700 px-8 py-2 rounded-lg"
            >
              Join Waitlist
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Waitlist; 