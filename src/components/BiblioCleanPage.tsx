import React, { useEffect } from 'react';
import { usePublishedContent } from '@/hooks/usePublishedContent';
import { generateMetadata, updatePageMetadata } from '@/lib/seo';
import { debugService } from '@/lib/debugService';
import { ROUTE_PATHS } from '@/config/routes';
import { Button } from '@/components/ui/button';
import { HERO_PRIMARY_BUTTON_CLASS } from '@/components/heroConstants';
import { Check, RefreshCw, Shield, Lock, Download } from '@/lib/iconUtils';
import FAQList from '@/components/FAQList';
import FluidBackground from './FluidBackground';

const BiblioCleanPage = () => {
  debugService.info('BiblioCleanPage mounted', { 
    timestamp: new Date().toISOString() 
  });

  const { content } = usePublishedContent();

  useEffect(() => {
    // SEO Metadata
    const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : 'https://www.bibliokit.com';
    const metadata = {
        title: 'BiblioClean | Remove Prototype Links Safely',
        description: 'BiblioKit: Remove Figma prototype links safely with BiblioClean. Clean your files and ensure smooth design handoff. Try it free!',
        ogTitle: 'BiblioClean | Remove Prototype Links Safely',
        ogDescription: 'BiblioKit: Remove Figma prototype links safely with BiblioClean. Clean your files and ensure smooth design handoff. Try it free!',
        url: `${baseUrl}${ROUTE_PATHS.BIBLIO_CLEAN || '/biblio-clean'}`,
    };
    updatePageMetadata(metadata);
  }, [content]);

  const PLUGIN_URL = 'https://www.figma.com/community/plugin/1573014835821113198/biblioclean-remove-prototype-links-blue-lines';
  const faqs = [
    { question: "Will this break my main components?", answer: "BiblioClean includes safety warnings when you attempt to clean main components or instances that shouldn't be touched." },
    { question: "Can I undo the cleanup?", answer: "Yes. You can use Figma's native undo (Cmd+Z) to revert any changes made by the plugin instantly." },
    { question: "Does it remove links from the whole file?", answer: "You can choose your scope: clean only the selected items or the entire current page." },
    { question: "Is BiblioClean free?", answer: "Yes, BiblioClean is currently free to use for all features." },
  ];

  // --- Reusable Components ---

  const Section = ({ children, className = '', dark = true }: { children: React.ReactNode; className?: string; dark?: boolean }) => (
    <section className={`py-16 md:py-24 px-6 md:px-10 ${dark ? 'landing-sections-gradient text-white' : 'bg-white text-slate-900'} ${className} relative overflow-hidden`}>
      <div className="mx-auto max-w-6xl relative z-10">
        {children}
      </div>
    </section>
  );

  const SectionTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${className}`}>{children}</h2>
  );

  const PlaceholderImage = ({ label, height = 'h-64', className = '' }: { label: string; height?: string; className?: string }) => (
    <div className={`w-full ${height} bg-slate-800/50 border border-slate-700 rounded-xl flex items-center justify-center relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/20 to-slate-900/20" />
      <span className="text-slate-500 font-medium z-10 text-center px-4">{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      
      {/* Block 1: Hero */}
      <section className="landing-hero-gradient landing-hero-expanded section-hero relative -mt-16 overflow-hidden flex items-center pt-32 pb-20 px-6 md:px-10 text-white">
         <div className="landing-hero-gradient__layer" aria-hidden="true" />
         <div className="landing-hero-noise" aria-hidden="true" />
         <div className="landing-hero-contrast" aria-hidden="true" />
         <FluidBackground />
         
        <div className="mx-auto max-w-5xl relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Wipe prototype links<br className="hidden md:block" /> before you ship.
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto">
            The Blue Line Wiper. Safely strip prototype connections and external URLs without breaking your main components.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button asChild className={HERO_PRIMARY_BUTTON_CLASS} size="lg">
              <a href={PLUGIN_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                <Download className="w-5 h-5" />
                <span>Try BiblioClean — Free</span>
              </a>
            </Button>
            <span className="flex items-center gap-2 text-sm text-slate-400">
              <Shield className="w-4 h-4" /> audit logs · undo ready
            </span>
          </div>
          <div className="mx-auto max-w-4xl shadow-2xl rounded-lg overflow-hidden border border-slate-700/50">
             <PlaceholderImage label="Looping GIF: Blue Spaghetti Lines -> Click -> Clean Canvas" height="h-[400px]" />
          </div>
        </div>
      </section>

      {/* Block 2: Problem Agitation */}
      <Section dark className="border-y border-slate-800/50">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <SectionTitle>Stop shipping "blue spaghetti."</SectionTitle>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-lg text-slate-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                Stale prototype wires confuse developers during handoff.
              </li>
              <li className="flex items-start gap-3 text-lg text-slate-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                Old external links leak context to contractors or the public.
              </li>
              <li className="flex items-start gap-3 text-lg text-slate-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                Manually clicking "minus" on interactions takes forever.
              </li>
            </ul>
            <div className="bg-red-900/20 border border-red-900/50 p-6 rounded-lg mb-6">
              <p className="font-semibold text-red-200 mb-1">The Handoff Risk</p>
              <p className="text-red-300">One wrong flow connection sends your dev team down a rabbit hole of outdated screens.</p>
            </div>
            <p className="italic text-slate-400">
              "We spent a sprint building a flow that was supposed to be cut, just because the prototype line was still there."
            </p>
          </div>
          <div className="relative">
             <img 
               src="/media/BiblioClean.png" 
               alt="Screenshot of messy prototype lines in Figma" 
               className="w-full h-auto rounded-xl border border-slate-700 shadow-2xl"
             />
          </div>
        </div>
      </Section>

      {/* Block 3: Quick Proof */}
      <Section dark>
        <div className="text-center mb-12">
          <div className="inline-block bg-green-500/10 text-green-400 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-green-500/20">
            Typical Result: Zero Visual Clutter
          </div>
          <SectionTitle>Watch BiblioClean Instantly Remove Prototype Links</SectionTitle>
        </div>
        
        <div className="grid md:grid-cols-12 gap-8 mb-12">
           <div className="md:col-span-8">
              <PlaceholderImage label="GIF: Select Frame -> Click Clean -> All Blue Lines Vanish" height="h-96" />
           </div>
           <div className="md:col-span-4 flex flex-col gap-4">
              <PlaceholderImage label="Before/After: Canvas Clutter" height="h-28" className="bg-slate-800" />
              <p className="text-xs text-center text-slate-500 mb-2">Removed 42 connections in 5s</p>
              <PlaceholderImage label="Safety Check Warning" height="h-28" className="bg-slate-800" />
              <p className="text-xs text-center text-slate-500 mb-2">Master component protected</p>
              <PlaceholderImage label="Clean Report" height="h-28" className="bg-slate-800" />
           </div>
        </div>
        
        <div className="flex justify-center items-center gap-8 opacity-50 grayscale">
            <span className="text-sm font-semibold uppercase tracking-wider">Trusted by</span>
            {/* Using text for logos as placeholders */}
            <span className="font-bold text-lg">Secure Design Ops</span>
            <span className="font-bold text-lg">Enterprise Teams</span>
        </div>
      </Section>

      {/* Block 4: How it works */}
      <Section dark>
        <div className="text-center mb-16">
          <SectionTitle>Three steps to a clean file.</SectionTitle>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white z-10">1</div>
            <PlaceholderImage label="Step 1: Select Scope (Page/Selection)" height="h-64" />
            <h3 className="text-xl font-bold mt-6 mb-2">Smart Scope</h3>
            <p className="text-slate-400">Choose to clean your current selection or wipe the entire page. BiblioClean scans for all prototype connections.</p>
          </div>
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white z-10">2</div>
            <PlaceholderImage label="Step 2: Review & Safety Check" height="h-64" />
            <h3 className="text-xl font-bold mt-6 mb-2">Safety Guardrails</h3>
            <p className="text-slate-400">We warn you if you're about to remove links from a shared component or design system master.</p>
          </div>
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white z-10">3</div>
            <PlaceholderImage label="Step 3: One-Click Clean" height="h-64" />
            <h3 className="text-xl font-bold mt-6 mb-2">Instant Cleanup</h3>
            <p className="text-slate-400">Remove navigation links, external URLs, and hotspot interactions instantly. Undo if needed.</p>
          </div>
        </div>
      </Section>

      {/* Block 5: Features */}
      <Section dark>
        <div className="grid gap-16">
          {/* Feature 1 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Deep Cleaning & Blue Line Removal</h3>
              <p className="text-slate-300 text-lg mb-6">Remove prototype navigation links (the blue lines), external URLs, and hotspot interactions. Clear visual clutter without affecting your design geometry.</p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-400" /> Navigation links (blue lines)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-400" /> External URLs</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-400" /> Hotspot interactions</li>
              </ul>
            </div>
            <PlaceholderImage label="Screenshot: Cleaning Options Panel" />
          </div>
          
          {/* Feature 2 */}
          <div className="grid md:grid-cols-2 gap-12 items-center md:grid-flow-dense">
             <div className="md:col-start-2">
              <h3 className="text-2xl font-bold mb-4">Safety Guardrails</h3>
              <p className="text-slate-300 text-lg mb-6">Don't break the system. BiblioClean warns you before you strip interactions from main components or shared library assets.</p>
            </div>
            <div className="md:col-start-1">
               <PlaceholderImage label="Screenshot: Warning Modal for Master Component" />
            </div>
          </div>

          {/* Feature 3 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
             <div>
              <h3 className="text-2xl font-bold mb-4">History & Undo Support</h3>
              <p className="text-slate-300 text-lg mb-6">Every action is logged. Review what was removed and roll back instantly with Figma's native undo or our history log.</p>
            </div>
            <PlaceholderImage label="Screenshot: History Log & Undo" />
          </div>
        </div>
      </Section>

      {/* Block 6: Use Cases */}
      <Section dark className="border-y border-slate-800/50">
        <SectionTitle className="text-center mb-12">Essential for every handoff.</SectionTitle>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-[#0f172a]/50 p-8 rounded-2xl border border-slate-700/50">
            <h4 className="text-xl font-bold mb-2">Pre-Handoff Cleanup</h4>
            <p className="text-slate-400 mb-6 text-sm">Problem: Developers confused by old prototype flows. <br/>Result: Clean canvas, clear specs.</p>
            <div className="grid grid-cols-2 gap-4">
              <PlaceholderImage label="Before: Spaghetti Lines" height="h-40" />
              <PlaceholderImage label="After: Clean Assets" height="h-40" />
            </div>
          </div>
          <div className="bg-[#0f172a]/50 p-8 rounded-2xl border border-slate-700/50">
            <h4 className="text-xl font-bold mb-2">Design System Maintenance</h4>
            <p className="text-slate-400 mb-6 text-sm">Problem: Accidental links in component library. <br/>Result: Pure components, no side effects.</p>
             <div className="grid grid-cols-2 gap-4">
              <PlaceholderImage label="Before: Linked Components" height="h-40" />
              <PlaceholderImage label="After: Pure Components" height="h-40" />
            </div>
          </div>
        </div>
      </Section>

      {/* Block 7: CTA */}
      <Section dark>
        <div className="bg-gradient-to-br from-blue-900/40 to-slate-900/40 border border-blue-500/20 rounded-3xl p-8 md:p-12 relative overflow-hidden backdrop-blur-sm">
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Start cleaning in seconds.</h2>
              <p className="text-xl text-blue-200 mb-8">Install BiblioClean for free and wipe those blue lines away.</p>
              <Button asChild className={HERO_PRIMARY_BUTTON_CLASS} size="lg">
                 <a href={PLUGIN_URL} target="_blank" rel="noopener noreferrer">
                  Get BiblioClean — Free
                </a>
              </Button>
              <p className="mt-4 text-sm text-blue-100">
                Keep designers, developers, and marketers aligned with{' '}
                <a
                  href="/resources/remove-prototype-link"
                  className="text-blue-200 underline underline-offset-4 hover:text-white"
                >
                  Manage Figma Prototype Links
                </a>{' '}
                and{' '}
                <a
                  href="/blog/remove-prototype-links-in-figma"
                  className="text-blue-200 underline underline-offset-4 hover:text-white"
                >
                  Remove Prototype Links in Figma
                </a>
                .
              </p>
            </div>
            <div className="flex justify-center">
               <div className="relative">
                   <PlaceholderImage label="BiblioClean Plugin Icon" height="h-64" className="w-48 shadow-2xl rotate-3 rounded-3xl" />
                   <div className="absolute -bottom-4 -right-4 bg-[#0f172a] p-4 rounded-lg border border-slate-700 shadow-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-bold">Canvas Cleaned</span>
                      </div>
                      <div className="h-2 w-32 bg-slate-700 rounded-full overflow-hidden">
                         <div className="h-full w-full bg-green-400" />
                      </div>
                   </div>
               </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Block 8: FAQ */}
      <Section dark>
        <SectionTitle className="text-center mb-12">Watch BiblioClean Instantly Remove Prototype Links</SectionTitle>
        <FAQList faqs={faqs} className="max-w-3xl mx-auto" />
      </Section>

      {/* Block 9: Final CTA */}
      <section className="py-24 px-6 md:px-10 text-center landing-sections-gradient text-white">
         <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">No more blue spaghetti.</h2>
            <div className="flex flex-col items-center gap-4">
              <Button asChild className={HERO_PRIMARY_BUTTON_CLASS} size="lg">
                 <a href={PLUGIN_URL} target="_blank" rel="noopener noreferrer">
                  Install BiblioClean
                </a>
              </Button>
            </div>
         </div>
      </section>

    </div>
  );
};

export default BiblioCleanPage;
