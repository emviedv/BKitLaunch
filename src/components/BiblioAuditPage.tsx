import React, { useEffect } from 'react';
import { usePublishedContent } from '@/hooks/usePublishedContent';
import { generateMetadata, updatePageMetadata } from '@/lib/seo';
import { debugService } from '@/lib/debugService';
import { ROUTE_PATHS } from '@/config/routes';
import { Button } from '@/components/ui/button';
import { HERO_PRIMARY_BUTTON_CLASS } from '@/components/heroConstants';
import { Check, Shield, Search, Lock, Download } from '@/lib/iconUtils';
import FAQList from '@/components/FAQList';
import FluidBackground from './FluidBackground';

const BiblioAuditPage = () => {
  debugService.info('BiblioAuditPage mounted', { 
    timestamp: new Date().toISOString() 
  });

  const { content } = usePublishedContent();

  useEffect(() => {
    // SEO Metadata
    const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : 'https://www.bibliokit.com';
    const metadata = {
        title: 'BiblioAudit | Find Detached Instances & Design System Check',
        description: 'BiblioKit: Automate Figma QA. Find detached instances, validate tokens, and ensure design system compliance instantly. Try a free check!',
        ogTitle: 'BiblioAudit | Find Detached Instances & Design System Check',
        ogDescription: 'BiblioKit: Automate Figma QA. Find detached instances, validate tokens, and ensure design system compliance instantly. Try a free check!',
        url: `${baseUrl}${ROUTE_PATHS.BIBLIO_AUDIT || '/biblio-audit'}`,
    };
    updatePageMetadata(metadata);
  }, [content]);

  const PLUGIN_URL = 'https://www.figma.com/community/plugin/1564328602359376130/biblioaudit-find-detached-instances-design-system-check';
  const faqs = [
    { question: "Does it work with any design system?", answer: "Yes. BiblioAudit checks against your local styles and enabled libraries." },
    { question: "Can I fix errors automatically?", answer: "Many errors, like simple style mismatches or reset overrides, can be fixed with one click." },
    { question: "Is it safe to run on large files?", answer: "Yes. BiblioAudit is optimized for performance and handles large files by scanning on demand." },
    { question: "Is BiblioAudit free?", answer: "Yes, BiblioAudit is currently free to use for all features." },
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
            Stop shipping<br className="hidden md:block" /> broken files.
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto">
            Find detached instances, validate tokens, and fix design system drift instantly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button asChild className={HERO_PRIMARY_BUTTON_CLASS} size="lg">
              <a href={PLUGIN_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                <Download className="w-5 h-5" />
                <span>Run Health Check — Free</span>
              </a>
            </Button>
            <span className="flex items-center gap-2 text-sm text-slate-400">
              <Search className="w-4 h-4" /> deep scan · auto-fix
            </span>
          </div>
          <div className="mx-auto max-w-4xl shadow-2xl rounded-lg overflow-hidden border border-slate-700/50">
             <PlaceholderImage label="Looping GIF: Scan File -> List Errors -> Click to Fix" height="h-[400px]" />
          </div>
        </div>
      </section>

      {/* Block 2: Problem Agitation */}
      <Section dark className="border-y border-slate-800/50">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <SectionTitle>Your design system is leaking.</SectionTitle>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-lg text-slate-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                Detached instances hiding in production files.
              </li>
              <li className="flex items-start gap-3 text-lg text-slate-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                Hardcoded hex values instead of semantic tokens.
              </li>
              <li className="flex items-start gap-3 text-lg text-slate-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                "Dirty" overrides breaking developer handoff.
              </li>
            </ul>
            <div className="bg-red-900/20 border border-red-900/50 p-6 rounded-lg mb-6">
              <p className="font-semibold text-red-200 mb-1">The Debt Compound</p>
              <p className="text-red-300">Every detached component doubles the maintenance cost when you update your library.</p>
            </div>
            <p className="italic text-slate-400">
              "We pushed a rebranding update and realized half our screens didn't change because designers had detached the buttons."
            </p>
          </div>
          <div className="relative">
             <img 
               src="/media/BiblioAudit.png" 
               alt="Screenshot of BiblioAudit finding errors in Figma" 
               className="w-full h-auto rounded-xl border border-slate-700 shadow-2xl"
             />
          </div>
        </div>
      </Section>

      {/* Block 3: Quick Proof */}
      <Section dark>
        <div className="text-center mb-12">
          <div className="inline-block bg-green-500/10 text-green-400 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-green-500/20">
            Typical Result: 100% System Compliance
          </div>
          <SectionTitle>See BiblioAudit in Action: Audit & Bulk-Fix Figma Design Errors</SectionTitle>
        </div>
        
        <div className="grid md:grid-cols-12 gap-8 mb-12">
           <div className="md:col-span-8">
              <PlaceholderImage label="GIF: Run Audit -> See 50 Errors -> Bulk Fix" height="h-96" />
           </div>
           <div className="md:col-span-4 flex flex-col gap-4">
              <PlaceholderImage label="Before/After: Error List" height="h-28" className="bg-slate-800" />
              <p className="text-xs text-center text-slate-500 mb-2">Found 12 detached instances</p>
              <PlaceholderImage label="Token Validation" height="h-28" className="bg-slate-800" />
              <p className="text-xs text-center text-slate-500 mb-2">Flagged 5 hardcoded colors</p>
              <PlaceholderImage label="Audit Report" height="h-28" className="bg-slate-800" />
           </div>
        </div>
        
        <div className="flex justify-center items-center gap-8 opacity-50 grayscale">
            <span className="text-sm font-semibold uppercase tracking-wider">Trusted by</span>
            {/* Using text for logos as placeholders */}
            <span className="font-bold text-lg">Design System Teams</span>
            <span className="font-bold text-lg">QA Leads</span>
        </div>
      </Section>

      {/* Block 4: How it works */}
      <Section dark>
        <div className="text-center mb-16">
          <SectionTitle>Three steps to compliance.</SectionTitle>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center font-bold text-white z-10">1</div>
            <PlaceholderImage label="Step 1: Select Scope" height="h-64" />
            <h3 className="text-xl font-bold mt-6 mb-2">Scan Anything</h3>
            <p className="text-slate-400">Audit a single selection, a whole page, or the entire file. BiblioAudit crawls every layer.</p>
          </div>
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center font-bold text-white z-10">2</div>
            <PlaceholderImage label="Step 2: Review Issues" height="h-64" />
            <h3 className="text-xl font-bold mt-6 mb-2">Identify Drift</h3>
            <p className="text-slate-400">See a prioritized list of errors: detached instances, missing styles, and rogue overrides.</p>
          </div>
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center font-bold text-white z-10">3</div>
            <PlaceholderImage label="Step 3: Fix Instantly" height="h-64" />
            <h3 className="text-xl font-bold mt-6 mb-2">Automated Remediation</h3>
            <p className="text-slate-400">Click to locate the error or use auto-fix to reset overrides and reattach instances.</p>
          </div>
        </div>
      </Section>

      {/* Block 5: Features */}
      <Section dark>
        <div className="grid gap-16">
          {/* Feature 1 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Find Detached Instances</h3>
              <p className="text-slate-300 text-lg mb-6">Locate every component that has been detached from the library. Reattach them to keep your design system connected.</p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> Scans deeply nested layers</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> Flags "rogue" UI elements</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> One-click navigation to error</li>
              </ul>
            </div>
            <PlaceholderImage label="Screenshot: Detached Instance List" />
          </div>
          
          {/* Feature 2 */}
          <div className="grid md:grid-cols-2 gap-12 items-center md:grid-flow-dense">
             <div className="md:col-start-2">
              <h3 className="text-2xl font-bold mb-4">Validate Design Tokens</h3>
              <p className="text-slate-300 text-lg mb-6">Ensure every color, font, and effect is linked to a style. Catch hardcoded values before they reach developers.</p>
            </div>
            <div className="md:col-start-1">
               <PlaceholderImage label="Screenshot: Missing Style Warning" />
            </div>
          </div>

          {/* Feature 3 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
             <div>
              <h3 className="text-2xl font-bold mb-4">Flag "Dirty" Overrides</h3>
              <p className="text-slate-300 text-lg mb-6">Identify instances with heavy manual overrides that should be variants. Keep your components clean and predictable.</p>
            </div>
            <PlaceholderImage label="Screenshot: Override Analysis" />
          </div>
        </div>
      </Section>

      {/* Block 6: Use Cases */}
      <Section dark className="border-y border-slate-800/50">
        <SectionTitle className="text-center mb-12">Quality Assurance on Autopilot.</SectionTitle>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-[#0f172a]/50 p-8 rounded-2xl border border-slate-700/50">
            <h4 className="text-xl font-bold mb-2">Design Handoff QA</h4>
            <p className="text-slate-400 mb-6 text-sm">Problem: Devs find inconsistent hex codes. <br/>Result: 100% token usage.</p>
            <div className="grid grid-cols-2 gap-4">
              <PlaceholderImage label="Before: Random Hexes" height="h-40" />
              <PlaceholderImage label="After: Token Names" height="h-40" />
            </div>
          </div>
          <div className="bg-[#0f172a]/50 p-8 rounded-2xl border border-slate-700/50">
            <h4 className="text-xl font-bold mb-2">Library Migration</h4>
            <p className="text-slate-400 mb-6 text-sm">Problem: Legacy buttons left behind. <br/>Result: All instances updated.</p>
             <div className="grid grid-cols-2 gap-4">
              <PlaceholderImage label="Before: Mixed Versions" height="h-40" />
              <PlaceholderImage label="After: Unified Library" height="h-40" />
            </div>
          </div>
        </div>
      </Section>

      {/* Block 7: CTA */}
      <Section dark>
        <div className="bg-gradient-to-br from-cyan-900/40 to-slate-900/40 border border-cyan-500/20 rounded-3xl p-8 md:p-12 relative overflow-hidden backdrop-blur-sm">
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Audit your file in seconds.</h2>
              <p className="text-xl text-cyan-200 mb-8">Install BiblioAudit for free and catch errors before your developers do.</p>
              <Button asChild className={HERO_PRIMARY_BUTTON_CLASS} size="lg">
                 <a href={PLUGIN_URL} target="_blank" rel="noopener noreferrer">
                  Get BiblioAudit — Free
                </a>
              </Button>
              <p className="mt-4 text-sm text-cyan-100">
                Fix detached instances fast with{' '}
                <a
                  href="/blog/fix-detached-instances-figma"
                  className="text-cyan-200 underline underline-offset-4 hover:text-white"
                >
                  Fix Detached Instances in Figma
                </a>{' '}
                for designers, developers, and marketers.
              </p>
            </div>
            <div className="flex justify-center">
               <div className="relative">
                   <PlaceholderImage label="BiblioAudit Plugin Icon" height="h-64" className="w-48 shadow-2xl rotate-3 rounded-3xl" />
                   <div className="absolute -bottom-4 -right-4 bg-[#0f172a] p-4 rounded-lg border border-slate-700 shadow-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-bold">Audit Passed</span>
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
        <SectionTitle className="text-center mb-12">See BiblioAudit in Action: Audit &amp; Bulk-Fix Figma Design Errors</SectionTitle>
        <FAQList faqs={faqs} className="max-w-3xl mx-auto" />
      </Section>

      {/* Block 9: Final CTA */}
      <section className="py-24 px-6 md:px-10 text-center landing-sections-gradient text-white">
         <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Ship perfect files.</h2>
            <div className="flex flex-col items-center gap-4">
              <Button asChild className={HERO_PRIMARY_BUTTON_CLASS} size="lg">
                 <a href={PLUGIN_URL} target="_blank" rel="noopener noreferrer">
                  Install BiblioAudit
                </a>
              </Button>
            </div>
         </div>
      </section>

    </div>
  );
};

export default BiblioAuditPage;
