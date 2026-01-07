import React, { useEffect } from 'react';
import { usePublishedContent } from '@/hooks/usePublishedContent';
import { generateMetadata, updatePageMetadata } from '@/lib/seo';
import { debugService } from '@/lib/debugService';
import { ROUTE_PATHS } from '@/config/routes';
import { Button } from '@/components/ui/button';
import { HERO_PRIMARY_BUTTON_CLASS } from '@/components/heroConstants';
import { Check, Columns, Download } from '@/lib/iconUtils';
import FAQList from '@/components/FAQList';
import FluidBackground from './FluidBackground';
import { getImageDimensions } from '@/lib/imageDimensions';

const BiblioStatesPage = () => {
  debugService.info('BiblioStatesPage mounted', { 
    timestamp: new Date().toISOString() 
  });

  const { content } = usePublishedContent();

  useEffect(() => {
    const baseUrl = typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.host}`
      : 'https://www.bibliokit.com';
    const metadata = generateMetadata(ROUTE_PATHS.BIBLIO_STATES, content, baseUrl);
    updatePageMetadata(metadata);
  }, [content]);

  const PLUGIN_URL = 'https://www.figma.com/community/plugin/1576299538313439140/bibliostates-component-state-generator-specs';
  const biblioStatesHeroImageDimensions = getImageDimensions('/media/BiblioStates.png');
  const biblioStatesDashboardImageDimensions = getImageDimensions('/blog/ui-component-states/dashboard-dark.png');
  const faqs = [
    {
      question: "What states does BiblioStates generate?",
      answer: "Generate hover, focus, pressed, error, and disabled states, plus optional success or selected states based on your component."
    },
    {
      question: "Does it work with any design system?",
      answer: "Yes. BiblioStates works with any Figma components and is tuned for design system variants."
    },
    {
      question: "Can I choose which states to include?",
      answer: "Yes. Pick the states you need before generation, then review the matrix before handoff."
    },
    {
      question: "Is BiblioStates live?",
      answer: "Yes. Install it from Figma Community and generate your next state matrix."
    },
  ];

  const Section = ({
    children,
    className = '',
    dark = true,
  }: {
    children: React.ReactNode;
    className?: string;
    dark?: boolean;
  }) => (
    <section
      className={`py-16 md:py-24 px-6 md:px-10 ${
        dark ? 'landing-sections-gradient text-white' : 'bg-white text-slate-900'
      } ${className} relative overflow-hidden`}
    >
      <div className="mx-auto max-w-6xl relative z-10">{children}</div>
    </section>
  );

  const SectionTitle = ({
    children,
    className = '',
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${className}`}>{children}</h2>;

  const PlaceholderImage = ({
    label,
    height = 'h-64',
    className = '',
  }: {
    label: string;
    height?: string;
    className?: string;
  }) => (
    <div
      className={`w-full ${height} bg-slate-800/50 border border-slate-700 rounded-xl flex items-center justify-center relative overflow-hidden ${className}`}
    >
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
            Ship complete<br className="hidden md:block" /> component states.
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-[70%] mx-auto">
            Auto-generate hover, focus, error, and disabled states with spec cards so designers,
            developers, and marketers stay aligned on design systems, handoff, implementation,
            launch, and campaigns.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button asChild className={HERO_PRIMARY_BUTTON_CLASS} size="lg">
              <a href={PLUGIN_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                <Download className="w-5 h-5" />
                <span>Install BiblioStates</span>
              </a>
            </Button>
            <span className="flex items-center gap-2 text-sm text-slate-400">
              <Columns className="w-4 h-4" /> state matrix, spec cards
            </span>
          </div>
          <div className="mx-auto max-w-4xl shadow-2xl rounded-lg overflow-hidden border border-slate-700/50">
            <img
              src="/media/BiblioStates.png"
              alt="BiblioStates plugin panel showing component state generation and spec card preview in Figma."
              className="w-full h-auto"
              width={biblioStatesHeroImageDimensions?.width}
              height={biblioStatesHeroImageDimensions?.height}
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
            <SectionTitle>Missing states slow every launch.</SectionTitle>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-lg text-slate-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                Default-only components force developers to guess hover, focus, and disabled behavior during implementation.
              </li>
              <li className="flex items-start gap-3 text-lg text-slate-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                Spec cards drift after design system updates, so handoff and launch QA find mismatches.
              </li>
              <li className="flex items-start gap-3 text-lg text-slate-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                Manual state grids eat hours when campaigns need fresh UI fast.
              </li>
            </ul>
            <div className="bg-red-900/20 border border-red-900/50 p-6 rounded-lg mb-6">
              <p className="font-semibold text-red-200 mb-1">The Spec Gap</p>
              <p className="text-red-300">
                When states are undocumented, developers rebuild behavior and marketers ship launches without edge cases.
              </p>
            </div>
            <p className="italic text-slate-400">
              &quot;We caught missing focus states after launch because the docs never made it into the file.&quot;
            </p>
          </div>
          <div className="relative">
            <img
              src="/blog/ui-component-states/dashboard-dark.png"
              alt="Dashboard showing multiple UI component states laid out in Figma."
              className="w-full h-auto rounded-xl border border-slate-700 shadow-2xl"
              width={biblioStatesDashboardImageDimensions?.width}
              height={biblioStatesDashboardImageDimensions?.height}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </Section>

      {/* Block 3: Quick Proof */}
      <Section dark>
        <div className="text-center mb-12">
          <div className="inline-block bg-emerald-500/10 text-emerald-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-emerald-500/20">
            Typical Result: Full state coverage in minutes
          </div>
          <SectionTitle>Watch BiblioStates generate UI states and specs</SectionTitle>
        </div>

        <div className="grid md:grid-cols-12 gap-8 mb-12">
          <div className="md:col-span-8">
            <PlaceholderImage label="GIF: Select components -> Generate -> State matrix + spec card" height="h-96" />
          </div>
          <div className="md:col-span-4 flex flex-col gap-4">
            <PlaceholderImage label="Before/After: Missing states" height="h-28" className="bg-slate-800" />
            <p className="text-xs text-center text-slate-500 mb-2">Added 18 states instantly</p>
            <PlaceholderImage label="Spec card preview" height="h-28" className="bg-slate-800" />
            <p className="text-xs text-center text-slate-500 mb-2">Handoff-ready documentation</p>
            <PlaceholderImage label="Coverage summary" height="h-28" className="bg-slate-800" />
          </div>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 opacity-50 grayscale">
          <span className="text-sm font-semibold uppercase tracking-wider">Trusted by</span>
          <span className="font-bold text-lg">Design System Teams</span>
          <span className="font-bold text-lg">Product Designers</span>
          <span className="font-bold text-lg">Frontend Engineers</span>
          <span className="font-bold text-lg">Marketing Teams</span>
          <span className="font-bold text-lg">QA Reviewers</span>
          <span className="font-bold text-lg">Design Ops</span>
        </div>
      </Section>

      {/* Block 4: How it works */}
      <Section dark>
        <div className="text-center mb-16">
          <SectionTitle>Three steps to complete specs.</SectionTitle>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center font-bold text-white z-10">
              1
            </div>
            <PlaceholderImage label="Step 1: Select components" height="h-64" />
            <h3 className="text-xl font-bold mt-6 mb-2">Select Components</h3>
            <p className="text-slate-400">
              Choose the components or variants you want to document. BiblioStates reads their structure.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center font-bold text-white z-10">
              2
            </div>
            <PlaceholderImage label="Step 2: Pick state set" height="h-64" />
            <h3 className="text-xl font-bold mt-6 mb-2">Pick States</h3>
            <p className="text-slate-400">
              Toggle the states you need, from hover and focus to error, disabled, and selected.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center font-bold text-white z-10">
              3
            </div>
            <PlaceholderImage label="Step 3: Generate matrix + specs" height="h-64" />
            <h3 className="text-xl font-bold mt-6 mb-2">Generate Specs</h3>
            <p className="text-slate-400">
              Create a state matrix and spec card in seconds, ready for implementation and handoff.
            </p>
          </div>
        </div>
      </Section>

      {/* Block 5: Features */}
      <Section dark>
        <div className="grid gap-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Generate required states fast</h3>
              <p className="text-slate-300 text-lg mb-6">
                Fill hover, focus, pressed, error, and disabled states instantly so every component ships complete.
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-300" /> Supports variant sets and component properties
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-300" /> Keeps spacing and tokens aligned with design systems
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-300" /> Produces a matrix ready for launch QA
                </li>
              </ul>
            </div>
            <PlaceholderImage label="Screenshot: State generation panel" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center md:grid-flow-dense">
            <div className="md:col-start-2">
              <h3 className="text-2xl font-bold mb-4">Spec cards for developer handoff</h3>
              <p className="text-slate-300 text-lg mb-6">
                Generate a documentation frame with state notes so developers can implement the exact behavior.
              </p>
            </div>
            <div className="md:col-start-1">
              <PlaceholderImage label="Screenshot: Spec card layout" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Surface missing states before launch</h3>
              <p className="text-slate-300 text-lg mb-6">
                BiblioStates surfaces gaps in your state coverage so handoff stays clean and implementation stays accurate.
              </p>
            </div>
            <PlaceholderImage label="Screenshot: Missing state alerts" />
          </div>
        </div>
      </Section>

      {/* Block 6: Use Cases */}
      <Section dark className="border-y border-slate-800/50">
        <SectionTitle className="text-center mb-12">Built for design system and launch work.</SectionTitle>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-[#0f172a]/50 p-8 rounded-2xl border border-slate-700/50">
            <h4 className="text-xl font-bold mb-2">Design System Release</h4>
            <p className="text-slate-400 mb-6 text-sm">
              Problem: Variants drift after token updates. <br />Result: Complete state matrix ready for handoff.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <PlaceholderImage label="Before: Missing states" height="h-40" />
              <PlaceholderImage label="After: Full matrix" height="h-40" />
            </div>
          </div>
          <div className="bg-[#0f172a]/50 p-8 rounded-2xl border border-slate-700/50">
            <h4 className="text-xl font-bold mb-2">Campaign Launch QA</h4>
            <p className="text-slate-400 mb-6 text-sm">
              Problem: Marketing assets miss edge states. <br />Result: Launch-ready UI across channels.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <PlaceholderImage label="Before: Unverified states" height="h-40" />
              <PlaceholderImage label="After: QA ready" height="h-40" />
            </div>
          </div>
        </div>
      </Section>

      {/* Block 7: CTA */}
      <Section dark>
        <div className="bg-gradient-to-br from-emerald-900/40 to-slate-900/40 border border-emerald-500/20 rounded-3xl p-8 md:p-12 relative overflow-hidden backdrop-blur-sm">
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Generate states once, ship everywhere.</h2>
              <p className="text-xl text-emerald-200 mb-8">
                Install BiblioStates to create state matrices and spec cards so designers, developers, and marketers stay aligned through handoff, implementation, launch, and campaigns.
              </p>
              <Button asChild className={HERO_PRIMARY_BUTTON_CLASS} size="lg">
                <a href={PLUGIN_URL} target="_blank" rel="noopener noreferrer">
                  Install BiblioStates
                </a>
              </Button>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <PlaceholderImage label="BiblioStates Plugin Icon" height="h-64" className="w-48 shadow-2xl rotate-3 rounded-3xl" />
                <div className="absolute -bottom-4 -right-4 bg-[#0f172a] p-4 rounded-lg border border-slate-700 shadow-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-bold">Specs Ready</span>
                  </div>
                  <div className="h-2 w-32 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-emerald-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Block 8: FAQ */}
      <Section dark>
        <SectionTitle className="text-center mb-12">Watch BiblioStates generate UI states and specs</SectionTitle>
        <FAQList faqs={faqs} className="max-w-3xl mx-auto" />
      </Section>

      {/* Block 9: Final CTA */}
      <section className="py-24 px-6 md:px-10 text-center landing-sections-gradient text-white">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Launch-ready states, every time.</h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Keep implementation and handoff aligned with spec cards that support campaigns and product launches.
          </p>
          <div className="flex flex-col items-center gap-4">
            <Button asChild className={HERO_PRIMARY_BUTTON_CLASS} size="lg">
              <a href={PLUGIN_URL} target="_blank" rel="noopener noreferrer">
                Install BiblioStates
              </a>
            </Button>
          </div>
          <p className="mt-6 text-slate-400">
            Want to audit your design system for errors? <a href="/figma-design-system-audit-plugin" className="text-emerald-400 hover:underline">Check out BiblioAudit</a>
          </p>
        </div>
      </section>
    </div>
  );
};

export default BiblioStatesPage;
