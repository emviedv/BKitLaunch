import React, { useEffect, useMemo, useState } from 'react';
import { usePublishedContent } from '@/hooks/usePublishedContent';
import { generateMetadata, updatePageMetadata } from '@/lib/seo';
import { debugService } from '@/lib/debugService';
import { ROUTE_PATHS } from '@/config/routes';
import { Button } from '@/components/ui/button';
import { Check, Search, Download, Shield } from '@/lib/iconUtils';
import FAQList from '@/components/FAQList';
import { componentQAFaqs } from '@/data/pageFaqs';
import FluidBackground from './FluidBackground';
import RelatedUseCases from '@/components/RelatedUseCases';
import { getImageDimensions } from '@/lib/imageDimensions';
import { trackCTAClick } from '@/lib/analytics';

const PRO_SEAT_PRICE_MONTHLY = 16;
const TEAM_LICENSE_SIZE = 5;
const TEAM_LICENSE_PRICE_MONTHLY = 60;
const QA_REDUCTION_RATE = 0.7;

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

function calculateMonthlyLicenseCost(teamSize: number): number {
  const seatOnlyCost = teamSize * PRO_SEAT_PRICE_MONTHLY;
  const maxBundles = Math.ceil(teamSize / TEAM_LICENSE_SIZE);
  let bestCost = seatOnlyCost;
  for (let bundles = 1; bundles <= maxBundles; bundles++) {
    const coveredSeats = bundles * TEAM_LICENSE_SIZE;
    const remainingSeats = Math.max(0, teamSize - coveredSeats);
    const bundledCost = bundles * TEAM_LICENSE_PRICE_MONTHLY + remainingSeats * PRO_SEAT_PRICE_MONTHLY;
    bestCost = Math.min(bestCost, bundledCost);
  }
  return bestCost;
}

interface PricingPlan {
  tier: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  recommended: boolean;
}

const PRICING_PLANS: PricingPlan[] = [
  {
    tier: 'Free',
    price: 'Free',
    description: 'Try every core feature free for 14 days.',
    features: [
      'Free 14-day trial',
      'Core component scan',
      'Detached instance checks',
      'Broken component checks',
      'Community support',
    ],
    recommended: false,
  },
  {
    tier: 'Pro',
    price: '$16',
    period: '/month',
    description: 'For continuous design file quality checks.',
    features: [
      '1 license included',
      'Unlimited audits',
      '24/7 monitoring for design files',
      'Full issue detection coverage',
      'Detached, broken, and override checks',
      'Token reset and missing-variable checks',
      'Exportable audit reports',
      'Priority support',
      'Team collaboration workspace',
    ],
    recommended: true,
  },
  {
    tier: 'Team',
    price: '$60',
    period: '/month',
    description: 'For growing teams with all Pro features included.',
    features: [
      'All Pro features included',
      '5 licenses included',
      '24/7 monitoring for design files',
      'Unlimited audits and reporting',
      'Priority support',
    ],
    recommended: false,
  },
];

interface Feature {
  title: string;
  pillar: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    title: 'Automated Audits',
    pillar: 'Audit Engine',
    description: 'Scan your entire Figma library for detached instances, duplicates, and inconsistent overrides automatically.',
  },
  {
    title: 'Design Token Violations',
    pillar: 'Token Integrity',
    description: "Catch hardcoded colors, incorrect spacing, and typography that doesn't match your design tokens.",
  },
  {
    title: 'Observability Dashboard',
    pillar: 'Health Analytics',
    description: 'Full observability into your design system health with trends, alerts, and severity-weighted scoring.',
  },
  {
    title: 'Figma Deep Links',
    pillar: 'Direct Navigation',
    description: 'Jump directly to problematic components in Figma with one click. Fix issues where they live.',
  },
  {
    title: 'Real-time Alerts',
    pillar: 'Proactive Monitoring',
    description: 'Get notified when health scores drop or new critical issues appear. Stay ahead of design debt.',
  },
  {
    title: 'Instant Results',
    pillar: 'Performance',
    description: 'Run audits quickly. Our optimized scanning handles files with thousands of components.',
  },
];

const HERO_BENEFITS = [
  'Automated component audits',
  'Real-time observability dashboard',
  'Figma deep link to issues',
] as const;

const ComponentQAPage = () => {
  debugService.info('ComponentQAPage mounted', {
    timestamp: new Date().toISOString()
  });

  const { content } = usePublishedContent();

  useEffect(() => {
    // SEO Metadata
    const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : 'https://www.bibliokit.com';
    const metadata = generateMetadata(ROUTE_PATHS.BIBLIO_AUDIT, content, baseUrl);
    updatePageMetadata(metadata);
  }, [content]);

  const PLUGIN_URL = 'https://www.figma.com/community/plugin/1564328602359376130/componentqa-find-detached-instances-design-system-check';
  const componentQAHeroImageDimensions = getImageDimensions('/media/component-qa-hero.png');
  const componentQALeakImageDimensions = getImageDimensions('/media/component-qa-leak.png');
  const faqs = componentQAFaqs;

  // --- ROI Calculator State ---
  const [teamSize, setTeamSize] = useState(10);
  const [hourlyRate, setHourlyRate] = useState(75);
  const [hoursPerWeek, setHoursPerWeek] = useState(2);

  const roiMetrics = useMemo(() => {
    const currentManualQaCost = teamSize * hourlyRate * hoursPerWeek * 52;
    const componentQaMonthlyCost = calculateMonthlyLicenseCost(teamSize);
    const componentQaAnnualCost = componentQaMonthlyCost * 12;
    const timeSavedValue = currentManualQaCost * QA_REDUCTION_RATE;
    const netAnnualSavings = timeSavedValue - componentQaAnnualCost;
    const roiMultiple = componentQaAnnualCost > 0 ? netAnnualSavings / componentQaAnnualCost : 0;
    return { currentManualQaCost, componentQaAnnualCost, timeSavedValue, netAnnualSavings, roiMultiple };
  }, [teamSize, hourlyRate, hoursPerWeek]);

  // --- Reusable Components ---

  const Section = ({ children, className = '', dark = true }: { children: React.ReactNode; className?: string; dark?: boolean }) => (
    <section className={`py-[var(--space-xl)] md:py-[var(--space-2xl)] px-6 md:px-10 ${dark ? 'landing-sections-gradient text-white' : 'bg-white text-slate-900'} ${className} relative overflow-hidden`}>
      <div className="mx-auto max-w-6xl relative z-10">
        {children}
      </div>
    </section>
  );

  const SectionTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <h2 className={`text-3xl md:text-4xl font-bold mb-[var(--space-lg)] ${className}`}>{children}</h2>
  );

  const PlaceholderImage = ({ label, height = 'h-64', className = '' }: { label: string; height?: string; className?: string }) => (
    <div className={`w-full ${height} bg-slate-800/50 border border-slate-700 rounded-xl flex items-center justify-center relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/20 to-slate-900/20" />
      <span className="text-slate-500 font-medium z-10 text-center px-4">{label}</span>
    </div>
  );

  return (
    <main className="min-h-screen bg-background" role="main">

      {/* Block 1: Hero */}
      <section className="landing-hero-gradient landing-hero-expanded section-hero relative -mt-16 overflow-hidden flex items-center pt-20 pb-12 sm:pt-24 sm:pb-16 lg:pt-28 lg:pb-20 px-6 md:px-10 text-white">
         <div className="landing-hero-gradient__layer" aria-hidden="true" />
         <div className="landing-hero-column-lines" aria-hidden="true" />
         <div className="landing-hero-noise" aria-hidden="true" />
         <div className="landing-hero-contrast" aria-hidden="true" />
         <FluidBackground />

        <div className="mx-auto max-w-5xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Design System Observability for Figma
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Keep your design system<br className="hidden md:block" /> <span className="text-[hsl(var(--interactive-accent))]">healthy</span>
          </h1>
          <p className="hero-description-copy text-xl md:text-2xl text-slate-300 mb-8 max-w-[85%] sm:max-w-[70%] lg:max-w-[60%] mx-auto">
            ComponentQA automatically audits your Figma files for component inconsistencies, design token violations, and detached instances. Fix issues before they ship.
          </p>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-8">
            {HERO_BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-center gap-2 text-sm text-slate-300">
                <Check className="w-4 h-4 text-success flex-shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <Button asChild variant="hero-primary" size="lg">
              <a href={PLUGIN_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2"
                data-ph-capture-attribute-product="component-qa"
                data-ph-capture-attribute-cta-position="hero"
                onClick={() => trackCTAClick({ product_slug: 'component-qa', cta_position: 'hero', destination_url: PLUGIN_URL })}
              >
                <Download className="w-5 h-5" />
                <span>Try for Free</span>
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#demo" className="inline-flex items-center gap-2 border-slate-600 text-slate-300 hover:bg-slate-800">
                Watch Demo
              </a>
            </Button>
          </div>
          <p className="text-sm text-slate-400 mb-12">Trusted by 500+ design teams worldwide</p>
          <div className="mx-auto max-w-4xl shadow-2xl rounded-lg overflow-hidden border border-slate-700/50">
            <img
              src="/media/component-qa-hero.png"
              alt="ComponentQA audit results dashboard in Figma showing components and issue counts."
              className="w-full h-auto"
              width={componentQAHeroImageDimensions?.width}
              height={componentQAHeroImageDimensions?.height}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-8 mt-8 text-base text-slate-300">
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-500" />
              Runs inside Figma
            </span>
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-500" />
              No files leave your environment
            </span>
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-500" />
              No canvas content stored or transmitted
            </span>
          </div>
        </div>
      </section>

      {/* Block 2: Problem Agitation */}
      <Section dark className="border-y border-slate-800/50">
        <div className="grid md:grid-cols-2 gap-[var(--space-xl)] items-center">
          <div>
            <SectionTitle>Your design system is leaking.</SectionTitle>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-lg text-slate-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-destructive flex-shrink-0" />
                Detached instances hiding in production files.
              </li>
              <li className="flex items-start gap-3 text-lg text-slate-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-destructive flex-shrink-0" />
                Hardcoded hex values instead of semantic tokens.
              </li>
              <li className="flex items-start gap-3 text-lg text-slate-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-destructive flex-shrink-0" />
                &quot;Dirty&quot; overrides breaking developer handoff.
              </li>
            </ul>
            <div className="bg-destructive/10 border border-destructive/20 p-6 rounded-lg mb-6">
              <p className="font-semibold text-destructive-foreground mb-1">The Debt Compound</p>
              <p className="text-destructive-foreground">Every detached component doubles the maintenance cost when you update your library.</p>
            </div>
            <p className="italic text-slate-400">
              &quot;We pushed a rebranding update and realized half our screens didn&apos;t change because designers had detached the buttons.&quot;
            </p>
          </div>
          <div className="relative">
             <img
               src="/media/component-qa-leak.png"
               alt="ComponentQA Figma plugin detecting detached components and design system drift in a real design file"
               className="w-4/5 h-auto rounded-xl border border-slate-700 shadow-2xl"
               width={componentQALeakImageDimensions?.width}
               height={componentQALeakImageDimensions?.height}
               loading="lazy"
               decoding="async"
             />
          </div>
        </div>
      </Section>

      {/* Block 3: Quick Proof */}
      <Section dark>
        <div className="text-center mb-12" id="demo">
          <div className="inline-block bg-success/10 text-success px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-success/20">
            Typical Result: 100% System Compliance
          </div>
          <SectionTitle>See ComponentQA in Action: Audit & Flag Figma Design Errors</SectionTitle>
        </div>

        <div className="grid md:grid-cols-12 gap-8 items-center mb-12">
           <div className="md:col-span-8">
              <video
                className="w-full h-full object-cover rounded-xl"
                src="/media/ComponentQA-demo.mp4"
                loop
                autoPlay
                muted
                playsInline
                aria-label="ComponentQA demo: running audit, finding 50 errors, and bulk flagging issues in Figma"
              />
           </div>
           <div className="md:col-span-4 flex flex-col gap-4">
              <PlaceholderImage label="Before/After: Error List" height="h-28" className="bg-slate-800" />
              <p className="text-xs text-center text-slate-500 mb-2">Found 12 detached instances</p>
              <PlaceholderImage label="Token Validation" height="h-28" className="bg-slate-800" />
              <p className="text-xs text-center text-slate-500 mb-2">Flagged 5 hardcoded colors</p>
              <PlaceholderImage label="Audit Report" height="h-28" className="bg-slate-800" />
           </div>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 opacity-50 grayscale">
            <span className="text-sm font-semibold uppercase tracking-wider">Trusted by</span>
            <span className="font-bold text-lg">Design System Teams</span>
            <span className="font-bold text-lg">QA Leads</span>
            <span className="font-bold text-lg">Design Ops</span>
            <span className="font-bold text-lg">Product Designers</span>
            <span className="font-bold text-lg">Frontend Engineers</span>
            <span className="font-bold text-lg">Brand Teams</span>
        </div>
      </Section>

      {/* Block 4: How it works */}
      <Section dark>
        <div className="text-center mb-16">
          <SectionTitle>Three steps to compliance.</SectionTitle>
        </div>
        <div className="grid md:grid-cols-3 gap-[var(--space-xl)] items-center">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-[hsl(var(--interactive-accent))] rounded-full flex items-center justify-center font-bold text-white z-10">1</div>
            <PlaceholderImage label="Step 1: Select Scope" height="h-64" />
            <h3 className="text-xl font-bold mt-6 mb-2">Scan Anything</h3>
            <p className="text-slate-400">Audit a single selection, a whole page, or the entire file. ComponentQA crawls every layer.</p>
          </div>
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-[hsl(var(--interactive-accent))] rounded-full flex items-center justify-center font-bold text-white z-10">2</div>
            <PlaceholderImage label="Step 2: Review Issues" height="h-64" />
            <h3 className="text-xl font-bold mt-6 mb-2">Identify Drift</h3>
            <p className="text-slate-400">See a prioritized list of errors: detached instances, missing styles, and rogue overrides.</p>
          </div>
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-[hsl(var(--interactive-accent))] rounded-full flex items-center justify-center font-bold text-white z-10">3</div>
            <PlaceholderImage label="Step 3: Review Issues" height="h-64" />
            <h3 className="text-xl font-bold mt-6 mb-2">Guided Review</h3>
            <p className="text-slate-400">Click to locate each issue and jump to the exact layer for review.</p>
          </div>
        </div>
      </Section>

      {/* Block 5: Features */}
      <Section dark>
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-[hsl(var(--interactive-accent))] mb-4">Design System Operations</p>
          <SectionTitle>Everything you need to maintain design quality</SectionTitle>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            ComponentQA combines powerful automation with actionable insights to keep your design system consistent and healthy.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => (
            <div key={feature.title} className="product-page-feature-card p-6 rounded-2xl border relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-slate-500">{String(index + 1).padStart(2, '0')}</span>
                <span className="text-xs font-medium text-[hsl(var(--interactive-accent))] bg-[hsl(var(--interactive-accent))]/10 px-2 py-0.5 rounded-full">
                  {feature.pillar}
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Block 6: Use Cases */}
      <Section dark className="border-y border-slate-800/50">
        <SectionTitle className="text-center mb-12">Quality Assurance on Autopilot.</SectionTitle>
        <div className="grid md:grid-cols-2 gap-[var(--space-xl)] items-center">
          <div className="product-page-feature-card p-8 rounded-2xl border">
            <h4 className="text-xl font-bold mb-2">Design Handoff QA</h4>
            <p className="text-slate-400 mb-6 text-sm">Problem: Devs find inconsistent hex codes. <br/>Result: 100% token usage.</p>
            <div className="grid grid-cols-2 gap-4">
              <PlaceholderImage label="Before: Random Hexes" height="h-40" />
              <PlaceholderImage label="After: Token Names" height="h-40" />
            </div>
          </div>
          <div className="product-page-feature-card p-8 rounded-2xl border">
            <h4 className="text-xl font-bold mb-2">Library Migration</h4>
            <p className="text-slate-400 mb-6 text-sm">Problem: Legacy buttons left behind. <br/>Result: All instances updated.</p>
             <div className="grid grid-cols-2 gap-4">
              <PlaceholderImage label="Before: Mixed Versions" height="h-40" />
              <PlaceholderImage label="After: Unified Library" height="h-40" />
            </div>
          </div>
        </div>
      </Section>

      {/* Block 7: Pricing */}
      <Section dark>
        <div className="text-center mb-12">
          <SectionTitle>Pricing that scales with your system</SectionTitle>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Start free, move to team workflows, and validate value with a transparent ROI model.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {PRICING_PLANS.map((plan) => (
            <div key={plan.tier} className={`product-page-feature-card p-6 rounded-2xl border relative ${plan.recommended ? 'border-[hsl(var(--interactive-accent))]/50 ring-1 ring-[hsl(var(--interactive-accent))]/30' : ''}`}>
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[hsl(var(--interactive-accent))] text-white text-xs font-bold px-3 py-1 rounded-full">
                  RECOMMENDED
                </div>
              )}
              <h3 className="text-lg font-bold mb-1">{plan.tier}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-slate-400 text-sm">{plan.period}</span>}
              </div>
              <p className="text-sm text-slate-400 mb-6">{plan.description}</p>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Custom plan CTA */}
        <div className="product-page-feature-card p-6 rounded-2xl border mb-12">
          <div className="md:flex items-start justify-between gap-8">
            <p className="text-lg font-bold mb-2 md:mb-0 md:w-1/3">Scaling beyond 5 seats?</p>
            <div className="md:w-2/3">
              <p className="text-sm text-slate-400 mb-2">
                Get volume pricing, centralized billing, and rollout support tailored to your team.
              </p>
              <p className="text-sm text-slate-400 mb-3">
                Share your seat count and launch timeline, and we will send a recommended plan with a quote within 1 business day.
              </p>
              <a href="mailto:hello@componentqa.com?subject=ComponentQA%20Custom%20Plan" className="text-sm font-medium text-[hsl(var(--interactive-accent))] hover:underline">
                Talk to us
              </a>
            </div>
          </div>
        </div>

        {/* ROI Calculator */}
        <div className="product-page-feature-card p-6 md:p-8 rounded-2xl border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[hsl(var(--interactive-accent))]/10 rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-[hsl(var(--interactive-accent))]" />
            </div>
            <div>
              <h3 className="text-lg font-bold">ROI Estimator</h3>
              <p className="text-sm text-slate-400">Model annual savings from reducing manual QA and rework.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="text-sm text-slate-300 mb-2 block">Team Size: {teamSize} designers</label>
                <input type="range" min={1} max={200} step={1} value={teamSize} onChange={(e) => setTeamSize(Number(e.target.value))} className="w-full accent-[hsl(var(--interactive-accent))]" />
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-2 block">Average Hourly Rate: {formatCurrency(hourlyRate)}</label>
                <input type="range" min={20} max={250} step={5} value={hourlyRate} onChange={(e) => setHourlyRate(Number(e.target.value))} className="w-full accent-[hsl(var(--interactive-accent))]" />
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-2 block">Hours Spent on QA per Week: {hoursPerWeek} hours</label>
                <input type="range" min={1} max={40} step={1} value={hoursPerWeek} onChange={(e) => setHoursPerWeek(Number(e.target.value))} className="w-full accent-[hsl(var(--interactive-accent))]" />
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-6">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Estimated Annual Impact</h4>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Current manual QA cost</span>
                  <span className="text-slate-200">{formatCurrency(roiMetrics.currentManualQaCost)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">ComponentQA annual subscription</span>
                  <span className="text-slate-200">{formatCurrency(roiMetrics.componentQaAnnualCost)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Time-value recaptured (70% reduction)</span>
                  <span className="text-success">{formatCurrency(roiMetrics.timeSavedValue)}</span>
                </div>
              </div>
              <div className="border-t border-slate-700 pt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Estimated net annual savings</p>
                  <p className="text-2xl font-bold">{formatCurrency(roiMetrics.netAnnualSavings)}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[hsl(var(--interactive-accent))]">{roiMetrics.roiMultiple.toFixed(1)}x</p>
                  <p className="text-xs text-slate-400">Estimated ROI</p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            <strong>Assumption model:</strong> A {teamSize}-designer team spending {hoursPerWeek} hours weekly on QA at {formatCurrency(hourlyRate)}/hour, with a 70% QA reduction, and a best-fit mix of Pro seats ($16) plus Team licenses ($60 for 5), yields <strong>{roiMetrics.roiMultiple.toFixed(1)}x ROI</strong> in year one.
          </p>
        </div>
      </Section>

      {/* Block 8: CTA */}
      <Section dark>
        <div className="bg-gradient-to-br from-[hsl(var(--interactive-accent-muted))] to-slate-900/40 border border-[hsl(var(--interactive-accent))]/20 rounded-3xl p-8 md:p-12 relative overflow-hidden backdrop-blur-sm">
          <div className="grid md:grid-cols-2 gap-[var(--space-xl)] items-center relative z-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Audit your file in seconds.</h2>
              <p className="text-xl text-[hsl(var(--interactive-accent-foreground))] mb-8">Install ComponentQA and catch errors before your developers do.</p>
              <Button asChild variant="hero-primary" size="lg">
                 <a href={PLUGIN_URL} target="_blank" rel="noopener noreferrer"
                    data-ph-capture-attribute-product="component-qa"
                    data-ph-capture-attribute-cta-position="mid_page"
                 >
                  Try ComponentQA Free
                </a>
              </Button>
            </div>
            <div className="flex justify-center">
               <div className="relative">
                   <PlaceholderImage label="ComponentQA Plugin Icon" height="h-64" className="w-48 shadow-2xl rotate-3 rounded-3xl" />
                   <div className="absolute -bottom-4 -right-4 product-page-metric-callout p-4 rounded-lg border shadow-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Check className="w-4 h-4 text-success" />
                        <span className="text-sm font-bold">Audit Passed</span>
                      </div>
                      <div className="h-2 w-32 bg-slate-700 rounded-full overflow-hidden">
                         <div className="h-full w-full bg-[hsl(var(--interactive-accent))]" />
                      </div>
                   </div>
               </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Block 9: FAQ */}
      <Section dark>
        <SectionTitle className="text-center mb-12">Frequently Asked Questions</SectionTitle>
        <FAQList faqs={faqs} className="max-w-3xl mx-auto" />
      </Section>

      {/* Related Use Cases - internal linking for SEO */}
      <RelatedUseCases plugin="componentqa" />

      {/* Block 10: Final CTA */}
      <section className="py-24 px-6 md:px-10 text-center landing-sections-gradient text-white">
         <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Ship perfect files.</h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">Catch broken tokens, inconsistent spacing, and detached styles before they reach developers.</p>
            <div className="flex flex-col items-center gap-4">
              <Button asChild variant="hero-primary" size="lg">
                 <a href={PLUGIN_URL} target="_blank" rel="noopener noreferrer"
                    data-ph-capture-attribute-product="component-qa"
                    data-ph-capture-attribute-cta-position="bottom"
                 >
                  Try ComponentQA Free
                </a>
              </Button>
            </div>
            <p className="mt-6 text-slate-400">
              Need to clean up prototype links too? <a href="/figma-plugin-remove-prototype-links" className="text-success hover:underline">Check out BiblioClean</a>
            </p>
         </div>
      </section>

    </main>
  );
};

export default ComponentQAPage;
