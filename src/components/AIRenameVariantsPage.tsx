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
import { getImageDimensions } from '@/lib/imageDimensions';

const AIRenameVariantsPage = () => {
  debugService.info('AIRenameVariantsPage mounted', { 
    timestamp: new Date().toISOString() 
  });

  const { content } = usePublishedContent();

  useEffect(() => {
    // SEO Metadata
    const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : 'https://www.bibliokit.com';
    const metadata = generateMetadata(ROUTE_PATHS.BIBLIO_RENAME, content, baseUrl);
    updatePageMetadata(metadata);
  }, [content]);

  const PLUGIN_URL = 'https://www.figma.com/community/plugin/1523817290746945616/batch-rename-variants-properties-ai-assisted';
  const variantChaosDimensions = getImageDimensions('/media/biblio-rename/variant-chaos-example.png');
  const faqs = [
    { question: "Will it change files without my approval?", answer: "No. All changes show as suggestions; you approve edits." },
    { question: "Can I undo changes?", answer: "Yes. Single-click revert and full audit log export." },
    { question: "Does it access files outside my selection?", answer: "No. You choose selection or file scope before any action." },
    { question: "How many free credits do I get?", answer: "8 free credits. Each covers an audit of up to 50 components." },
    { question: "Will it conflict with our naming conventions?", answer: "No. You set the rules (CamelCase, etc.) and token hints." },
    { question: "Is it safe for prototypes?", answer: "Yes. We preserve prototype links and master components." }
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
            Fix variant naming debt<br className="hidden md:block" /> in seconds, not hours.
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto">
            AI-powered architectural analysis and renaming for component sets and variants. Keep designers, developers, and marketers aligned with clean, predictable naming.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button asChild className={HERO_PRIMARY_BUTTON_CLASS} size="lg">
              <a href={PLUGIN_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                <Download className="w-5 h-5" />
                <span>Try the plugin — 8 free credits</span>
              </a>
            </Button>
            <span className="flex items-center gap-2 text-sm text-slate-400">
              <RefreshCw className="w-4 h-4" /> audit logs · undo
            </span>
          </div>
          <div className="mx-auto max-w-4xl shadow-2xl rounded-lg overflow-hidden border border-slate-700/50">
             <PlaceholderImage label="Looping GIF: Messy Component -> Rename -> Clean (Frame 422 -> Primary_Button)" height="h-[400px]" />
          </div>
        </div>
      </section>

      {/* Block 2: Problem Agitation */}
      <Section dark className="border-y border-slate-800/50">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <SectionTitle>Why your design system feels broken.</SectionTitle>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-lg text-slate-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                Manual cleanup sprints that kill creativity.
              </li>
              <li className="flex items-start gap-3 text-lg text-slate-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                Recurring handoff bugs from mismatched tokens.
              </li>
              <li className="flex items-start gap-3 text-lg text-slate-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                Wasted designer hours on "final_final_v2" cleanup.
              </li>
            </ul>
            <div className="bg-red-900/20 border border-red-900/50 p-6 rounded-lg mb-6">
              <p className="font-semibold text-red-200 mb-1">The Hidden Cost</p>
              <p className="text-red-300">3 designers × 1.5 hours/week = 6+ hours lost to rote work.</p>
            </div>
            <p className="italic text-slate-400">
              "We spent the entire post-launch retro discussing a wrong button variant that broke the checkout flow."
            </p>
          </div>
          <div className="relative">
             <img 
               src="/media/biblio-rename/variant-chaos-example.png" 
               alt="Screenshot of a chaotic variant list in Figma showing inconsistent naming" 
               className="w-full h-auto rounded-xl border border-slate-700 shadow-2xl"
               width={variantChaosDimensions?.width}
               height={variantChaosDimensions?.height}
               loading="lazy"
               decoding="async"
             />
          </div>
        </div>
      </Section>

      {/* Block 3: Quick Proof */}
      <Section dark>
        <div className="text-center mb-12">
          <div className="inline-block bg-green-500/10 text-green-400 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-green-500/20">
            Typical Result: 12 Hours Reclaimed / Week
          </div>
          <SectionTitle>BiblioRename Demo: Batch-Rename Figma Variants in Seconds</SectionTitle>
        </div>
        
        <div className="grid md:grid-cols-12 gap-8 mb-12">
           <div className="md:col-span-8">
              <PlaceholderImage label="GIF: Run Audit -> List Issues -> One-Click Rename" height="h-96" />
           </div>
           <div className="md:col-span-4 flex flex-col gap-4">
              <PlaceholderImage label="Before/After: Variant List" height="h-28" className="bg-slate-800" />
              <p className="text-xs text-center text-slate-500 mb-2">Renamed 84 variants in 22s</p>
              <PlaceholderImage label="Before/After: Layer Names" height="h-28" className="bg-slate-800" />
              <p className="text-xs text-center text-slate-500 mb-2">CamelCase enforced</p>
              <PlaceholderImage label="Health Score Export" height="h-28" className="bg-slate-800" />
           </div>
        </div>
        
        <div className="flex justify-center items-center gap-8 opacity-50 grayscale">
            <span className="text-sm font-semibold uppercase tracking-wider">Seen on</span>
            {/* Using text for logos as placeholders */}
            <span className="font-bold text-lg">DesignOps Assembly</span>
            <span className="font-bold text-lg">Figma Community</span>
        </div>
      </Section>

      {/* Block 4: How it works */}
      <Section dark>
        <div className="text-center mb-16">
          <SectionTitle>Three steps to order.</SectionTitle>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center font-bold text-white z-10">1</div>
            <PlaceholderImage label="Step 1: Select Component & Click Audit" height="h-64" />
            <h3 className="text-xl font-bold mt-6 mb-2">Intelligent Analysis</h3>
            <p className="text-slate-400">Select a component set. The plugin analyzes structure, Figma limits, and property optimization opportunities.</p>
          </div>
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center font-bold text-white z-10">2</div>
            <PlaceholderImage label="Step 2: Review Suggestions (Before/After)" height="h-64" />
            <h3 className="text-xl font-bold mt-6 mb-2">AI Recommendations</h3>
            <p className="text-slate-400">Receive context-aware renaming suggestions and structural improvements based on architectural best practices.</p>
          </div>
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center font-bold text-white z-10">3</div>
            <PlaceholderImage label="Step 3: Apply & Log" height="h-64" />
            <h3 className="text-xl font-bold mt-6 mb-2">Coordinated Application</h3>
            <p className="text-slate-400">Apply changes with atomic validation. Export audit logs and undo instantly if needed.</p>
          </div>
        </div>
      </Section>

      {/* Block 5: Features */}
      <Section dark>
        <div className="grid gap-16">
          {/* Feature 1 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">AI-Powered Renaming & Optimization</h3>
              <p className="text-slate-300 text-lg mb-6">Batch rename variants with GPT-4 architectural awareness. Automatically optimizes properties (Boolean, Instance Swap) to reduce complexity.</p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Smart batching</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Preservation of overrides</li>
              </ul>
            </div>
            <PlaceholderImage label="Screenshot: Batch Rename Modal & Time Estimate" />
          </div>
          
          {/* Feature 2 */}
          <div className="grid md:grid-cols-2 gap-12 items-center md:grid-flow-dense">
             <div className="md:col-start-2">
              <h3 className="text-2xl font-bold mb-4">Figma Architecture Intelligence</h3>
              <p className="text-slate-300 text-lg mb-6">Deep understanding of Figma 2025 constraints. Validates limits (4 properties, 28 values) and structural health in real-time.</p>
            </div>
            <div className="md:col-start-1">
               <PlaceholderImage label="Screenshot: Hint Input Field & AI Analysis" />
            </div>
          </div>

          {/* Feature 3 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
             <div>
              <h3 className="text-2xl font-bold mb-4">Canonical Naming & Structural Validation</h3>
              <p className="text-slate-300 text-lg mb-6">Enforce semantic naming standards (CamelCase, Kebab-case) and validate component health against design system best practices.</p>
            </div>
            <PlaceholderImage label="Screenshot: Naming Convention Dropdown" />
          </div>

           {/* Feature 4 */}
           <div className="grid md:grid-cols-2 gap-12 items-center md:grid-flow-dense">
             <div className="md:col-start-2">
              <h3 className="text-2xl font-bold mb-4">Advanced Change Management</h3>
              <p className="text-slate-300 text-lg mb-6">Atomic transactions with override protection. Preview every change impact and revert instantly with a full audit log.</p>
            </div>
            <div className="md:col-start-1">
               <PlaceholderImage label="Screenshot: Diff List & Undo Button" />
            </div>
          </div>

           {/* Feature 5 */}
           <div className="grid md:grid-cols-2 gap-12 items-center">
             <div>
              <h3 className="text-2xl font-bold mb-4">Deep Layer Cleaning</h3>
              <p className="text-slate-300 text-lg mb-6">Clean up internal layer names (Frame 422 → IconContainer) to ensure code-ready exports.</p>
            </div>
            <PlaceholderImage label="Screenshot: Layer Cleaning Example" />
          </div>
        </div>
      </Section>

      {/* Block 6: Before / After Showcase */}
      <Section dark className="border-y border-slate-800/50">
        <SectionTitle className="text-center mb-12">Trusted by teams cleaning up debt.</SectionTitle>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-[#0f172a]/50 p-8 rounded-2xl border border-slate-700/50">
            <h4 className="text-xl font-bold mb-2">Startup Component Library</h4>
            <p className="text-slate-400 mb-6 text-sm">Problem: Prototype token leaks. <br/>Result: Renamed 120 variants in 5 mins.</p>
            <div className="grid grid-cols-2 gap-4">
              <PlaceholderImage label="Before: Messy List" height="h-40" />
              <PlaceholderImage label="After: Clean List" height="h-40" />
            </div>
          </div>
          <div className="bg-[#0f172a]/50 p-8 rounded-2xl border border-slate-700/50">
            <h4 className="text-xl font-bold mb-2">Mid-Stage Design System</h4>
            <p className="text-slate-400 mb-6 text-sm">Problem: Inconsistent layer names. <br/>Result: Health score +28 points.</p>
             <div className="grid grid-cols-2 gap-4">
              <PlaceholderImage label="Before: Low Score" height="h-40" />
              <PlaceholderImage label="After: High Score" height="h-40" />
            </div>
          </div>
        </div>
      </Section>

      {/* Block 7: Pilot Offer & Pricing */}
      <Section dark>
        <div className="bg-gradient-to-br from-purple-900/40 to-slate-900/40 border border-purple-500/20 rounded-3xl p-8 md:p-12 relative overflow-hidden backdrop-blur-sm">
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Level up your design system.</h2>
              <p className="text-xl text-purple-200 mb-8">Start with 8 free credits and erase variant naming debt in minutes.</p>
              <Button asChild className={HERO_PRIMARY_BUTTON_CLASS} size="lg">
                 <a href={PLUGIN_URL} target="_blank" rel="noopener noreferrer">
                  Start fixing — 8 free credits
                </a>
              </Button>
            </div>
            <div className="flex justify-center">
               <div className="relative">
                   <PlaceholderImage label="Audit Snapshot Preview" height="h-64" className="w-48 shadow-2xl rotate-3" />
                   <div className="absolute -bottom-4 -right-4 bg-[#0f172a] p-4 rounded-lg border border-slate-700 shadow-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-bold">Audit Complete</span>
                      </div>
                      <div className="h-2 w-32 bg-slate-700 rounded-full overflow-hidden">
                         <div className="h-full w-3/4 bg-green-400" />
                      </div>
                   </div>
               </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Block 8: Social Proof */}
      <Section dark>
        <div className="grid md:grid-cols-3 gap-8 mb-12">
           {/* Testimonial 1 */}
           <div className="p-6 bg-slate-800/40 rounded-xl border border-slate-700/50 backdrop-blur-sm">
              <p className="text-slate-300 mb-4">"Reduced handoff bugs by 40%. Exported the health score to show progress to our PM."</p>
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center font-bold text-white">LM</div>
                 <div>
                    <p className="font-bold text-sm">Lead Product Designer</p>
                    <p className="text-xs text-slate-400">Fintech Scaleup</p>
                 </div>
              </div>
           </div>
            {/* Testimonial 2 */}
           <div className="p-6 bg-slate-800/40 rounded-xl border border-slate-700/50 backdrop-blur-sm">
              <p className="text-slate-300 mb-4">"The audit log saved us. We could revert a bad batch rename instantly."</p>
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center font-bold text-white">JS</div>
                 <div>
                    <p className="font-bold text-sm">Design Systems Lead</p>
                    <p className="text-xs text-slate-400">Enterprise SaaS</p>
                 </div>
              </div>
           </div>
            {/* Testimonial 3 */}
           <div className="p-6 bg-slate-800/40 rounded-xl border border-slate-700/50 backdrop-blur-sm">
              <p className="text-slate-300 mb-4">"Finally, a way to enforce CamelCase on variants without nagging the team."</p>
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center font-bold text-white">AK</div>
                 <div>
                    <p className="font-bold text-sm">Senior Designer</p>
                    <p className="text-xs text-slate-400">Agency</p>
                 </div>
              </div>
           </div>
        </div>
        
        {/* Quant Stats */}
        <div className="grid grid-cols-3 gap-8 text-center border-t border-slate-800/50 pt-8">
           <div>
              <p className="text-3xl font-bold text-white mb-1">150+</p>
              <p className="text-sm text-slate-400">Issues/Audit</p>
           </div>
           <div>
              <p className="text-3xl font-bold text-white mb-1">22s</p>
              <p className="text-sm text-slate-400">Avg Rename Time</p>
           </div>
            <div>
              <p className="text-3xl font-bold text-white mb-1">+25</p>
              <p className="text-sm text-slate-400">Health Score Delta</p>
           </div>
        </div>
      </Section>

      {/* Block 9: Security & Reversibility */}
      <Section dark>
        <SectionTitle className="text-center mb-12">Enterprise-grade safety.</SectionTitle>
        <div className="grid md:grid-cols-3 gap-8 text-center">
           <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 text-purple-400 border border-slate-700/50">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="font-bold mb-2">Local Execution</h4>
              <p className="text-slate-400 text-sm">Runs inside Figma. No file exports. Reads selection, writes only on approval.</p>
           </div>
           <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 text-purple-400 border border-slate-700/50">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h4 className="font-bold mb-2">Instant Revert</h4>
              <p className="text-slate-400 text-sm">Native Figma undo support plus a detailed changelog for every run.</p>
           </div>
           <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 text-purple-400 border border-slate-700/50">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="font-bold mb-2">Admin Ready</h4>
              <p className="text-slate-400 text-sm">Privacy-first: SSO-ready, least-privilege scopes, no exports—reads selection, writes only when you approve.</p>
           </div>
        </div>
      </Section>

      {/* Block 10: Workflow Integrations */}
      <Section dark className="border-y border-slate-800/50">
         <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
               <SectionTitle>Fits your handoff ritual.</SectionTitle>
               <ol className="space-y-8 relative border-l border-slate-700 ml-4 pl-8">
                  <li className="relative">
                     <span className="absolute -left-[37px] w-4 h-4 rounded-full bg-purple-500 ring-4 ring-[#0f172a]" />
                     <h4 className="font-bold text-lg mb-1">Install & Audit</h4>
                     <p className="text-slate-400 text-sm">Run on your messiest file. Get a baseline health score.</p>
                  </li>
                  <li className="relative">
                     <span className="absolute -left-[37px] w-4 h-4 rounded-full bg-slate-700 ring-4 ring-[#0f172a]" />
                     <h4 className="font-bold text-lg mb-1">Share in Slack</h4>
                     <p className="text-slate-400 text-sm">Post a 30s Loom of the cleanup to #design-ops.</p>
                  </li>
                   <li className="relative">
                     <span className="absolute -left-[37px] w-4 h-4 rounded-full bg-slate-700 ring-4 ring-[#0f172a]" />
                     <h4 className="font-bold text-lg mb-1">Health Report</h4>
                     <p className="text-slate-400 text-sm">Export the PDF before/after report for stakeholders.</p>
                  </li>
               </ol>
            </div>
            <div>
               <PlaceholderImage label="Mock Slack Message: 'Audit Complete' + PDF Attachment" />
            </div>
         </div>
      </Section>

      {/* Block 11: FAQ */}
      <Section dark>
        <SectionTitle className="text-center mb-12">BiblioRename Demo - Batch-Rename Figma Variants in Seconds</SectionTitle>
        <FAQList faqs={faqs} className="max-w-3xl mx-auto" />
      </Section>

      {/* Block 12: Final CTA */}
      <section className="py-24 px-6 md:px-10 text-center landing-sections-gradient text-white">
         <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Stop fixing names by hand.</h2>
            <div className="flex flex-col items-center gap-4">
              <Button asChild className={HERO_PRIMARY_BUTTON_CLASS} size="lg">
                 <a href={PLUGIN_URL} target="_blank" rel="noopener noreferrer">
                  Try the plugin — 8 free credits
                </a>
              </Button>
            </div>
            <div className="mt-12 pt-12 border-t border-slate-800/50">
               <p className="italic text-slate-400 text-lg mb-6">
                  "Built by a designer who fixed variant chaos after a broken launch."
               </p>
               <div className="flex justify-center items-center gap-2">
                  <span className="font-semibold">5.0</span>
                  <div className="flex text-yellow-500">
                     {[1,2,3,4,5].map(i => <span key={i}>★</span>)}
                  </div>
               </div>
            </div>
         </div>
      </section>

    </div>
  );
};

export default AIRenameVariantsPage;
