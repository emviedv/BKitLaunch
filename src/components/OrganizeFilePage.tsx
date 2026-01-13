import React, { useEffect } from 'react';
import { usePublishedContent } from '@/hooks/usePublishedContent';
import { generateMetadata, updatePageMetadata } from '@/lib/seo';
import { debugService } from '@/lib/debugService';
import { ROUTE_PATHS } from '@/config/routes';
import { Button } from '@/components/ui/button';
import { HERO_PRIMARY_BUTTON_CLASS } from '@/components/heroConstants';
import { Check } from '@/lib/iconUtils';
import FAQList from '@/components/FAQList';
import FluidBackground from './FluidBackground';
import { getImageDimensions } from '@/lib/imageDimensions';

const OrganizeFilePage = () => {
  debugService.info('OrganizeFilePage mounted', {
    timestamp: new Date().toISOString()
  });

  const { content } = usePublishedContent();

  useEffect(() => {
    // SEO Metadata
    const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : 'https://www.bibliokit.com';
    const metadata = generateMetadata(ROUTE_PATHS.BIBLIO_ORGANIZE, content, baseUrl);
    updatePageMetadata(metadata);
  }, [content]);

  const PLUGIN_URL = 'https://www.figma.com/community/plugin/com.biblio.biblioorganize';
  const biblioOrganizeHeroImageDimensions = getImageDimensions('/media/OrganizeFile.png');
  const faqs = [
    { question: "When will OrganizeFile be available?", answer: "OrganizeFile is coming soon. We're putting the finishing touches on the plugin and will announce the launch date shortly." },
    { question: "Does it work with existing files?", answer: "Yes. OrganizeFile detects existing scaffold elements and skips duplicates to avoid conflicts." },
    { question: "Can I customize the presets?", answer: "V1 includes Product Handoff and Journey/Flow Maps presets. Custom preset builder is planned for future releases." },
    { question: "Will it break my existing pages?", answer: "No. OrganizeFile adds new pages and scaffolding without modifying existing content. Rollback cleans up partial failures." },
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
            The Figma Plugin to Organize Your Design Files (Before You Start).
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-[60%] mx-auto">
            Stop wasting time setting up dividers, covers, and empty pages. Scaffold a professional workspace in under 30 seconds.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 mb-12">
            <div className="inline-block bg-violet-500/20 text-violet-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-2 border border-violet-500/30">
              Coming Soon
            </div>
            <Button className={`${HERO_PRIMARY_BUTTON_CLASS} opacity-60 cursor-not-allowed`} size="lg" disabled>
              Generate My File Structure
            </Button>
            <span className="text-sm text-slate-400">Includes Handoff &amp; Journey Map Presets</span>
          </div>
          <div className="mx-auto max-w-4xl shadow-2xl rounded-lg overflow-hidden border border-slate-700/50">
            <img
              src="/media/OrganizeFile.png"
              alt="OrganizeFile preset panel showing product handoff and journey map scaffolding options in Figma."
              className="w-full h-auto"
              width={biblioOrganizeHeroImageDimensions?.width}
              height={biblioOrganizeHeroImageDimensions?.height}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>
      </section>

      {/* Block 2: Problem Agitation */}
      <Section dark className="border-y border-slate-800/50">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <SectionTitle>Your team wastes hours on setup.</SectionTitle>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-lg text-slate-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                Every new file starts with the duplication of another file or an empty canvas and no structure.
              </li>
              <li className="flex items-start gap-3 text-lg text-slate-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                Inconsistent page hierarchies across projects confuse handoffs.
              </li>
              <li className="flex items-start gap-3 text-lg text-slate-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                No standardized covers, status cards, or documentation anchors.
              </li>
            </ul>
            <div className="bg-red-900/20 border border-red-900/50 p-6 rounded-lg mb-6">
              <p className="font-semibold text-red-200 mb-1">The Setup Tax</p>
              <p className="text-red-300">Every designer reinvents the wheel on every project. That&apos;s hours lost that could go toward actual design work.</p>
            </div>
            <p className="italic text-slate-400">
              &quot;We spent the first two days of every sprint just organizing files instead of designing.&quot;
            </p>
          </div>
          <div className="relative">
             <PlaceholderImage label="Screenshot: Empty Canvas vs Organized File" height="h-80" />
          </div>
        </div>
      </Section>

      {/* Block 3: Quick Proof */}
      <Section dark>
        <div className="text-center mb-12">
          <div className="inline-block bg-green-500/10 text-green-400 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-green-500/20">
            Typical Result: Ready in Under 30 Seconds
          </div>
          <SectionTitle>See OrganizeFile in Action: Scaffold Files Instantly</SectionTitle>
        </div>

        <div className="grid md:grid-cols-12 gap-8 mb-12">
           <div className="md:col-span-8">
              <PlaceholderImage label="GIF: Select Preset -> Click Create -> File Scaffolded" height="h-96" />
           </div>
           <div className="md:col-span-4 flex flex-col gap-4">
              <PlaceholderImage label="Before: Empty File" height="h-28" className="bg-slate-800" />
              <p className="text-xs text-center text-slate-500 mb-2">Blank canvas, no structure</p>
              <PlaceholderImage label="After: Organized Pages" height="h-28" className="bg-slate-800" />
              <p className="text-xs text-center text-slate-500 mb-2">Covers, dividers, README cards</p>
              <PlaceholderImage label="Preset Options" height="h-28" className="bg-slate-800" />
           </div>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 opacity-50 grayscale">
            <span className="text-sm font-semibold uppercase tracking-wider">Trusted by</span>
            <span className="font-bold text-lg">Design Ops Teams</span>
            <span className="font-bold text-lg">Product Designers</span>
            <span className="font-bold text-lg">Journey Mappers</span>
            <span className="font-bold text-lg">PMs</span>
            <span className="font-bold text-lg">Design System Teams</span>
        </div>
      </Section>

      {/* Block 4: How it works */}
      <Section dark>
        <div className="text-center mb-16">
          <SectionTitle>Three steps to a production-ready file.</SectionTitle>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-violet-500 rounded-full flex items-center justify-center font-bold text-white z-10">1</div>
            <PlaceholderImage label="Step 1: Open Plugin" height="h-64" />
            <h3 className="text-xl font-bold mt-6 mb-2">Open OrganizeFile</h3>
            <p className="text-slate-400">Launch the plugin from your Figma menu. Your last preset and toggles are remembered.</p>
          </div>
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-violet-500 rounded-full flex items-center justify-center font-bold text-white z-10">2</div>
            <PlaceholderImage label="Step 2: Select Preset" height="h-64" />
            <h3 className="text-xl font-bold mt-6 mb-2">Pick Your Preset</h3>
            <p className="text-slate-400">Choose Product Handoff or Journey/Flow Maps. Toggle archive dividers and pro tips on or off.</p>
          </div>
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-violet-500 rounded-full flex items-center justify-center font-bold text-white z-10">3</div>
            <PlaceholderImage label="Step 3: Click Create" height="h-64" />
            <h3 className="text-xl font-bold mt-6 mb-2">Create Blueprint</h3>
            <p className="text-slate-400">One click scaffolds your entire file with pages, covers, README cards, and documentation anchors.</p>
          </div>
        </div>
      </Section>

      {/* Block 5: Features */}
      <Section dark>
        <div className="grid gap-16">
          {/* Feature 1 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">One-Click File Scaffolding</h3>
              <p className="text-slate-300 text-lg mb-6">Create divider pages, covers, and README/status frames instantly. No more blank canvas paralysis.</p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-400" /> Opinionated hierarchies in under 30 seconds</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-400" /> Cover pages with project metadata</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-400" /> README/status cards with owner and checklist fields</li>
              </ul>
            </div>
            <PlaceholderImage label="Screenshot: Scaffolded File Structure" />
          </div>

          {/* Feature 2 */}
          <div className="grid md:grid-cols-2 gap-12 items-center md:grid-flow-dense">
             <div className="md:col-start-2">
              <h3 className="text-2xl font-bold mb-4">Reusable Presets</h3>
              <p className="text-slate-300 text-lg mb-6">Product Handoff and Journey/Flow Maps presets cover the most common project types.</p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-400" /> Product Handoff: status, review, ownership scaffolding</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-400" /> Journey Maps: flow-mapping with states and entry/exit points</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-400" /> Archive dividers and documentation anchors included</li>
              </ul>
            </div>
            <div className="md:col-start-1">
               <PlaceholderImage label="Screenshot: Preset Selection" />
            </div>
          </div>

          {/* Feature 3 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
             <div>
              <h3 className="text-2xl font-bold mb-4">Idempotent Runs &amp; Rollback</h3>
              <p className="text-slate-300 text-lg mb-6">Rerun the plugin safely. OrganizeFile detects existing scaffolds and skips duplicates. Partial failures roll back automatically.</p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-400" /> Detects existing elements to avoid duplicates</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-400" /> Warns when runs exceed 30s target</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-400" /> Rollback cleans up partial scaffolds on failure</li>
              </ul>
            </div>
            <PlaceholderImage label="Screenshot: Idempotent Detection" />
          </div>

          {/* Feature 4 */}
          <div className="grid md:grid-cols-2 gap-12 items-center md:grid-flow-dense">
             <div className="md:col-start-2">
              <h3 className="text-2xl font-bold mb-4">Contextual Pro Tips</h3>
              <p className="text-slate-300 text-lg mb-6">Trojan Horse tips nudge teams toward proven Biblio workflows. Toggleable and non-intrusive.</p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-400" /> Context-aware sticky notes on relevant pages</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-400" /> Links to RenameVariantsAI, ComponentQA, and more</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-400" /> Toggle tips off in the preset panel</li>
              </ul>
            </div>
            <div className="md:col-start-1">
               <PlaceholderImage label="Screenshot: Pro Tips" />
            </div>
          </div>
        </div>
      </Section>

      {/* Block 6: Use Cases */}
      <Section dark className="border-y border-slate-800/50">
        <SectionTitle className="text-center mb-12">Professional File Organization on Autopilot.</SectionTitle>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-[#0f172a]/50 p-8 rounded-2xl border border-slate-700/50">
            <h4 className="text-xl font-bold mb-2">Product Handoff</h4>
            <p className="text-slate-400 mb-6 text-sm">Problem: Every handoff has different structure. <br/>Result: Consistent templates with ownership fields.</p>
            <div className="grid grid-cols-2 gap-4">
              <PlaceholderImage label="Before: Random Pages" height="h-40" />
              <PlaceholderImage label="After: Organized Handoff" height="h-40" />
            </div>
          </div>
          <div className="bg-[#0f172a]/50 p-8 rounded-2xl border border-slate-700/50">
            <h4 className="text-xl font-bold mb-2">Journey Mapping</h4>
            <p className="text-slate-400 mb-6 text-sm">Problem: Flow maps start from scratch. <br/>Result: Pre-built structure for cross-functional mapping.</p>
             <div className="grid grid-cols-2 gap-4">
              <PlaceholderImage label="Before: Empty Canvas" height="h-40" />
              <PlaceholderImage label="After: Journey Template" height="h-40" />
            </div>
          </div>
        </div>
      </Section>

      {/* Block 7: CTA */}
      <Section dark>
        <div className="bg-gradient-to-br from-violet-900/40 to-slate-900/40 border border-violet-500/20 rounded-3xl p-8 md:p-12 relative overflow-hidden backdrop-blur-sm">
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Scaffold your file in seconds.</h2>
              <p className="text-xl text-violet-200 mb-8">OrganizeFile is coming soon. Start every project with professional structure.</p>
              <div className="flex items-center gap-3">
                <Button className={`${HERO_PRIMARY_BUTTON_CLASS} opacity-60 cursor-not-allowed`} size="lg" disabled>
                  Coming Soon
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
               <div className="relative">
                   <img
                     src="/media/icons/organize-file-icon.png"
                     alt="OrganizeFile plugin icon"
                     className="h-64 w-48 rounded-3xl object-contain shadow-2xl rotate-3"
                     width={128}
                     height={128}
                   />
                   <div className="absolute -bottom-4 -right-4 bg-[#0f172a] p-4 rounded-lg border border-slate-700 shadow-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Check className="w-4 h-4 text-violet-400" />
                        <span className="text-sm font-bold">File Organized</span>
                      </div>
                      <div className="h-2 w-32 bg-slate-700 rounded-full overflow-hidden">
                         <div className="h-full w-full bg-violet-400" />
                      </div>
                   </div>
               </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Block 8: FAQ */}
      <Section dark>
        <SectionTitle className="text-center mb-12">Frequently Asked Questions</SectionTitle>
        <FAQList faqs={faqs} className="max-w-3xl mx-auto" />
      </Section>

      {/* Block 9: Final CTA */}
      <section className="py-24 px-6 md:px-10 text-center landing-sections-gradient text-white">
         <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Start every project right.</h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">Set up your file with professional structure—pages, sections, and naming conventions from the start.</p>
            <div className="flex flex-col items-center gap-4">
              <div className="inline-block bg-violet-500/20 text-violet-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-2 border border-violet-500/30">
                Coming Soon
              </div>
              <Button className={`${HERO_PRIMARY_BUTTON_CLASS} opacity-60 cursor-not-allowed`} size="lg" disabled>
                Install OrganizeFile
              </Button>
            </div>
            <p className="mt-6 text-slate-400">
              Need to batch-rename your variants? <a href="/figma-component-variant-renamer" className="text-violet-400 hover:underline">Check out RenameVariantsAI</a>
            </p>
         </div>
      </section>

    </div>
  );
};

export default OrganizeFilePage;
