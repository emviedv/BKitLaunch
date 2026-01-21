import React, { useEffect } from 'react';
import { usePublishedContent } from '@/hooks/usePublishedContent';
import { generateMetadata, updatePageMetadata } from '@/lib/seo';
import { debugService } from '@/lib/debugService';
import { ROUTE_PATHS } from '@/config/routes';
import { Button } from '@/components/ui/button';
import { HERO_PRIMARY_BUTTON_CLASS } from '@/components/heroConstants';
import {
  Check,
  Bell,
  Scaling,
  Monitor,
  Square,
  Youtube,
  Smartphone,
  ShoppingCart,
  Package,
  Brain,
  AlertTriangle,
  Crosshair,
  Shield,
  Zap,
  Layers,
  Clock,
  ArrowRight,
} from '@/lib/iconUtils';
import FAQList from '@/components/FAQList';
import { scaleResizerFaqs } from '@/data/pageFaqs';
import FluidBackground from './FluidBackground';
import Waitlist from './Waitlist';

const ScaleResizerPage = () => {
  debugService.info('ScaleResizerPage mounted', {
    timestamp: new Date().toISOString()
  });

  const { content } = usePublishedContent();

  useEffect(() => {
    const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : 'https://www.bibliokit.com';
    const metadata = generateMetadata(ROUTE_PATHS.SCALE_RESIZER, content, baseUrl);
    metadata.title = 'AI-Powered Marketing Frame Resizer | ScaleResizer';
    metadata.description = 'Transform marketing frames into 6 format variants (YouTube, TikTok, social, web banners, Gumroad) with AI-powered layout optimization. 25+ min to <30 sec.';
    updatePageMetadata(metadata);
  }, [content]);

  const formats = [
    { name: 'Web Hero', dimensions: '1440 x 600', icon: Monitor, category: 'Web', aspectRatio: '12:5' },
    { name: 'Social Carousel', dimensions: '1080 x 1080', icon: Square, category: 'Social', aspectRatio: '1:1' },
    { name: 'YouTube Cover', dimensions: '2560 x 1440', icon: Youtube, category: 'Video', aspectRatio: '16:9' },
    { name: 'TikTok Vertical', dimensions: '1080 x 1920', icon: Smartphone, category: 'Video', aspectRatio: '9:16' },
    { name: 'Gumroad Cover', dimensions: '1280 x 720', icon: ShoppingCart, category: 'E-commerce', aspectRatio: '16:9' },
    { name: 'Gumroad Thumbnail', dimensions: '600 x 600', icon: Package, category: 'E-commerce', aspectRatio: '1:1' },
  ];

  const aiFeatures = [
    {
      title: 'Smart Layout Recommendations',
      description: 'AI analyzes frame structure and recommends optimal layout patterns per target format with confidence scores.',
      icon: Brain,
    },
    {
      title: 'QA Signal Detection',
      description: 'Automated warnings for contrast issues, logo sizing, text overlap, and safe-area boundary risks.',
      icon: AlertTriangle,
    },
    {
      title: 'Focal Point Detection',
      description: 'AI identifies primary focal points with confidence scores for optimal cropping and positioning.',
      icon: Crosshair,
    },
  ];


  const faqs = scaleResizerFaqs;

  // --- Reusable Components ---

  const Section = ({ children, className = '', dark = true, id }: { children: React.ReactNode; className?: string; dark?: boolean; id?: string }) => (
    <section id={id} className={`py-16 md:py-24 px-6 md:px-10 ${dark ? 'landing-sections-gradient text-white' : 'bg-white text-slate-900'} ${className} relative overflow-hidden`}>
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

  const FormatCard = ({ format }: { format: typeof formats[0] }) => {
    const Icon = format.icon;
    return (
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm hover:border-purple-500/50 transition-colors">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400">
            <Icon className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-slate-500 bg-slate-800/80 px-2 py-1 rounded">{format.category}</span>
        </div>
        <h3 className="font-bold text-lg mb-1">{format.name}</h3>
        <p className="text-sm text-slate-400 mb-2">{format.dimensions}</p>
        <p className="text-xs text-slate-500">Aspect: {format.aspectRatio}</p>
      </div>
    );
  };

  const AIFeatureCard = ({ feature }: { feature: typeof aiFeatures[0] }) => {
    const Icon = feature.icon;
    return (
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
        <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 mb-4">
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
        <p className="text-slate-400 text-sm">{feature.description}</p>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-background">

      {/* Block 1: Hero */}
      <section className="landing-hero-gradient landing-hero-expanded section-hero relative -mt-16 overflow-hidden flex items-center pt-32 pb-20 px-6 md:px-10 text-white">
         <div className="landing-hero-gradient__layer" aria-hidden="true" />
         <div className="landing-hero-noise" aria-hidden="true" />
         <div className="landing-hero-contrast" aria-hidden="true" />
         <FluidBackground />

        <div className="mx-auto max-w-5xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-purple-500/30">
            <Scaling className="w-4 h-4" />
            Figma Plugin
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Resize marketing frames<br className="hidden md:block" /> in seconds, not hours.
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-[65%] mx-auto">
            One click. 6 production-ready assets in seconds. Turn any Figma frame into YouTube, TikTok, social, and web-ready formats instantly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button asChild className={HERO_PRIMARY_BUTTON_CLASS} size="lg">
              <a href="#waitlist" className="inline-flex items-center gap-2">
                <Bell className="w-5 h-5" />
                <span>Join the Waitlist</span>
              </a>
            </Button>
            <span className="flex items-center gap-2 text-sm text-slate-400">
              <Clock className="w-4 h-4" /> 25+ min manual to &lt;30s automated
            </span>
          </div>
          <div className="mx-auto max-w-4xl shadow-2xl rounded-lg overflow-hidden border border-slate-700/50">
             <PlaceholderImage label="Demo: Select Frame, Choose Targets, Generate 6 Variants" height="h-[400px]" />
          </div>
        </div>
      </section>

      {/* Block 2: Problem Agitation */}
      <Section dark className="border-y border-slate-800/50">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <SectionTitle>Why manual resizing kills momentum.</SectionTitle>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-lg text-slate-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                Duplicate frame, resize, re-align content. Repeat 8 more times.
              </li>
              <li className="flex items-start gap-3 text-lg text-slate-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                Logo too small on YouTube? Text clipped on TikTok? Missed safe areas.
              </li>
              <li className="flex items-start gap-3 text-lg text-slate-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                Campaign delays from last-minute format requests.
              </li>
            </ul>
            <div className="bg-red-900/20 border border-red-900/50 p-6 rounded-lg mb-6">
              <p className="font-semibold text-red-200 mb-1">The Hidden Cost</p>
              <p className="text-red-300">1 designer x 25 min/frame x 4 campaigns/week = 100+ min/week on rote resizing.</p>
            </div>
            <p className="italic text-slate-400">
              &quot;We launched the TikTok ad with the CTA button under the comment overlay. Nobody caught it until it was live.&quot;
            </p>
          </div>
          <div className="relative">
             <PlaceholderImage label="Before: 6 manual resize iterations with QA issues" height="h-[350px]" />
          </div>
        </div>
      </Section>

      {/* Block 3: Format Showcase */}
      <Section dark>
        <div className="text-center mb-12">
          <div className="inline-block bg-purple-500/10 text-purple-400 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-purple-500/20">
            6 Production-Ready Formats
          </div>
          <SectionTitle className="mb-4">One source frame. Six optimized variants.</SectionTitle>
          <p className="text-slate-400 max-w-2xl mx-auto">Each format includes target-specific safe areas, aspect-aware layout adaptation, and AI-powered QA signals.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {formats.map((format) => (
            <FormatCard key={format.name} format={format} />
          ))}
        </div>
      </Section>

      {/* Block 4: AI Capabilities */}
      <Section dark className="border-y border-slate-800/50">
        <div className="text-center mb-12">
          <div className="inline-block bg-purple-500/10 text-purple-400 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-purple-500/20">
            AI-Powered Intelligence
          </div>
          <SectionTitle className="mb-4">Smarter than scale-and-crop.</SectionTitle>
          <p className="text-slate-400 max-w-2xl mx-auto">AI analyzes your frame composition and provides intelligent recommendations.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {aiFeatures.map((feature) => (
            <AIFeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </Section>

      {/* Block 6: How it works */}
      <Section dark className="border-y border-slate-800/50">
        <div className="text-center mb-16">
          <SectionTitle>Three steps to multi-channel assets.</SectionTitle>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center font-bold text-white z-10">1</div>
            <PlaceholderImage label="Step 1: Select your marketing frame" height="h-64" />
            <h3 className="text-xl font-bold mt-6 mb-2">Select Source Frame</h3>
            <p className="text-slate-400">Choose any marketing frame in your Figma file. Works with auto-layout, absolute positioning, and nested components.</p>
          </div>
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center font-bold text-white z-10">2</div>
            <PlaceholderImage label="Step 2: Configure targets and safe areas" height="h-64" />
            <h3 className="text-xl font-bold mt-6 mb-2">Configure Targets</h3>
            <p className="text-slate-400">Select which formats to generate. Customize safe-area presets (Tight, Balanced, Roomy) per target.</p>
          </div>
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center font-bold text-white z-10">3</div>
            <PlaceholderImage label="Step 3: Generate and review variants" height="h-64" />
            <h3 className="text-xl font-bold mt-6 mb-2">Generate Variants</h3>
            <p className="text-slate-400">Hit generate. Review AI-optimized variants on the staging page with QA overlays.</p>
          </div>
        </div>
      </Section>

      {/* Block 7: Features Deep Dive */}
      <Section dark>
        <div className="grid gap-16">
          {/* Feature 1 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Format-Specific Safe Areas</h3>
              <p className="text-slate-300 text-lg mb-6">Every platform has UI that overlaps your content. ScaleResizer enforces format-specific safe zones automatically.</p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> YouTube mobile safe zone enforcement</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> TikTok UI exclusion areas</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Configurable presets (4%, 8%, 12%)</li>
              </ul>
            </div>
            <PlaceholderImage label="Screenshot: Safe area overlay on YouTube cover" />
          </div>

          {/* Feature 2 */}
          <div className="grid md:grid-cols-2 gap-12 items-center md:grid-flow-dense">
             <div className="md:col-start-2">
              <h3 className="text-2xl font-bold mb-4">Brand Preservation</h3>
              <p className="text-slate-300 text-lg mb-6">Your original imagery, copy, and brand tokens stay intact. ScaleResizer adapts layout, not content.</p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Original assets preserved</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Typography and colors maintained</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Auto-layout settings restored</li>
              </ul>
            </div>
            <div className="md:col-start-1">
               <PlaceholderImage label="Screenshot: Before/after showing preserved branding" />
            </div>
          </div>

          {/* Feature 3 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
             <div>
              <h3 className="text-2xl font-bold mb-4">Organized Staging</h3>
              <p className="text-slate-300 text-lg mb-6">All variants are organized in timestamped containers on a dedicated staging page for easy review and export.</p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Dedicated &quot;ScaleResizer Variants&quot; page</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Per-run timestamped containers</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> QA overlays for review</li>
              </ul>
            </div>
            <PlaceholderImage label="Screenshot: Staging page with organized run containers" />
          </div>
        </div>
      </Section>

      {/* Block 8: Waitlist CTA */}
      <div id="waitlist">
        <Waitlist
          visibleOverride={true}
          titleOverride="Be first to automate your resizing workflow."
          descriptionOverride="Join the waitlist for early access. Transform 25+ minute manual workflows into <30 second automation. No spam — early access + plugin updates only."
          buttonTextOverride="Join Waitlist"
        />
      </div>

      {/* Block 9: Stats */}
      <Section dark className="border-y border-slate-800/50">
        <div className="grid grid-cols-2 gap-8 text-center max-w-md mx-auto">
           <div>
              <p className="text-3xl font-bold text-white mb-1">6</p>
              <p className="text-sm text-slate-400">Format Targets</p>
           </div>
            <div>
              <p className="text-3xl font-bold text-white mb-1">&lt;30s</p>
              <p className="text-sm text-slate-400">Per Variant Set</p>
           </div>
        </div>
      </Section>

      {/* Block 10: Safety */}
      <Section dark>
        <SectionTitle className="text-center mb-12">Enterprise-grade reliability.</SectionTitle>
        <div className="grid md:grid-cols-3 gap-8 text-center">
           <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 text-purple-400 border border-slate-700/50">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="font-bold mb-2">Non-Destructive</h4>
              <p className="text-slate-400 text-sm">Original frames never modified. All variants are new copies on staging page.</p>
           </div>
           <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 text-purple-400 border border-slate-700/50">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="font-bold mb-2">Privacy First</h4>
              <p className="text-slate-400 text-sm">All processing runs inside Figma. Your designs never leave your workspace.</p>
           </div>
           <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 text-purple-400 border border-slate-700/50">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="font-bold mb-2">Instant Results</h4>
              <p className="text-slate-400 text-sm">Generate all 6 variants in under 30 seconds. No waiting, no uploads, no exports.</p>
           </div>
        </div>
      </Section>

      {/* Block 11: FAQ */}
      <Section dark className="border-y border-slate-800/50">
        <SectionTitle className="text-center mb-12">Frequently Asked Questions</SectionTitle>
        <FAQList faqs={faqs} className="max-w-3xl mx-auto" />
      </Section>

      {/* Block 12: Final CTA */}
      <section className="py-24 px-6 md:px-10 text-center landing-sections-gradient text-white">
         <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Stop resizing frames by hand.</h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">Let AI handle format-specific layouts, safe areas, and QA while you focus on creative work.</p>
            <div className="flex flex-col items-center gap-4">
              <Button asChild className={HERO_PRIMARY_BUTTON_CLASS} size="lg">
                 <a href="#waitlist" className="inline-flex items-center gap-2">
                  <ArrowRight className="w-5 h-5" />
                  Join the Waitlist
                </a>
              </Button>
            </div>
            <p className="mt-6 text-slate-400">
              Looking to clean up variant naming? <a href="/figma-component-variant-renamer" className="text-purple-400 hover:underline">Check out RenameVariantsAI</a>
            </p>
            <div className="mt-12 pt-12 border-t border-slate-800/50">
               <p className="italic text-slate-400 text-lg mb-6">
                  &quot;Built by a designer who spent too many sprints resizing the same campaign for 6 different channels.&quot;
               </p>
            </div>
         </div>
      </section>

    </div>
  );
};

export default ScaleResizerPage;
