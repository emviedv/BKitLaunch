import React from 'react';
import { Button } from '@/components/ui/button';
import { HERO_PRIMARY_BUTTON_CLASS } from '@/components/heroConstants';
import { ROUTE_PATHS } from '@/config/routes';
import { ArrowRight, Sparkles, BarChart3, Rocket, Zap, Layers, RefreshCw } from 'lucide-react';
import FluidBackground from './FluidBackground';

const Section = ({
  children,
  className = '',
  contentClassName = 'max-w-5xl',
}: {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}) => (
  <section
    className={`py-16 md:py-24 px-6 md:px-10 landing-sections-gradient text-white ${className} relative overflow-hidden`}
  >
    <div className={`mx-auto ${contentClassName} relative z-10`}>
      {children}
    </div>
  </section>
);

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Section 1: Hero / Vision Statement */}
      <section className="landing-hero-gradient landing-hero-expanded section-hero relative -mt-16 overflow-hidden flex items-center pt-32 pb-20 px-6 md:px-10 text-white">
        <div className="landing-hero-gradient__layer" aria-hidden="true" />
        <div className="landing-hero-noise" aria-hidden="true" />
        <div className="landing-hero-contrast" aria-hidden="true" />
        <FluidBackground />

        <div className="mx-auto max-w-5xl relative z-10 text-center">
          <p className="text-sm uppercase tracking-[0.18em] text-violet-400 mb-4">
            About BiblioKit
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white md:tracking-tight">
            The Story Behind BiblioKit: Reimagining the Design Workflow
          </h1>
          <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-4 max-w-3xl mx-auto">
            Empowering designers to spend more time creating and less time maintaining.
          </p>
          <p className="text-lg text-white/70 leading-relaxed max-w-3xl mx-auto">
            BiblioKit was born out of a simple observation: design systems are growing faster than our ability to manage them. We build the tools that bridge the gap between creative vision and technical execution.
          </p>
        </div>
      </section>

      {/* Section 2: The Problem / The "Why" */}
      <Section className="border-y border-slate-800/50">
        <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
            The Problem We Solve
          </h2>
          <div className="max-w-3xl mx-auto space-y-4 text-white/80 leading-relaxed">
            <p>
              Modern design teams are bogged down by <span className="text-amber-400 font-medium">&quot;design debt&quot;</span>, fragmented plugin stacks, manual refactoring, and inconsistent handoffs.
            </p>
            <p>
              We saw teams spending <span className="text-white font-semibold">40% of their time on maintenance</span> rather than innovation.
            </p>
            <p className="text-lg text-white/90">
              BiblioKit was created to solve the <span className="text-amber-400 font-medium">&quot;maintenance tax&quot;</span> on creativity.
            </p>
          </div>
        </div>
      </Section>

      {/* Section 3: What We Do / The "How" */}
      <Section>
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-[0_30px_90px_rgba(0,0,0,0.45)] p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
            What We Build
          </h2>
          <p className="text-center text-white/70 mb-10 max-w-2xl mx-auto">
            BiblioKit is a unified suite of Figma plugins designed for the modern DesignOps era. We focus on three core pillars:
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Pillar 1: AI Refactoring */}
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
              <div className="w-14 h-14 rounded-xl bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-violet-400" />
              </div>
              <h3 className="font-semibold text-lg text-white mb-2">AI Refactoring</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Intelligent tools that clean up layers and styles instantly.
              </p>
            </div>
            {/* Pillar 2: UX Intelligence */}
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
              <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-lg text-white mb-2">UX Intelligence</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Data-driven insights directly within your design canvas.
              </p>
            </div>
            {/* Pillar 3: Design-to-Dev Velocity */}
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
              <div className="w-14 h-14 rounded-xl bg-sky-500/20 flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-7 h-7 text-sky-400" />
              </div>
              <h3 className="font-semibold text-lg text-white mb-2">Design-to-Dev Velocity</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Eliminating handoff friction through automated documentation.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Section 4: Our Values */}
      <Section>
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">
          Our Values
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex gap-4 p-5 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Efficiency First</h3>
              <p className="text-sm text-white/60">If a machine can do it, a designer shouldn&apos;t have to.</p>
            </div>
          </div>
          <div className="flex gap-4 p-5 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
              <Layers className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Seamless Integration</h3>
              <p className="text-sm text-white/60">Our tools live where you work. No new platforms, just better workflows in Figma.</p>
            </div>
          </div>
          <div className="flex gap-4 p-5 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Continuous Evolution</h3>
              <p className="text-sm text-white/60">As design systems evolve, so does BiblioKit.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Section 5: CTA */}
      <Section className="pb-24" contentClassName="max-w-4xl">
        <div className="rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-transparent p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to accelerate your workflow?
          </h2>
          <p className="text-white/70 leading-relaxed max-w-xl mx-auto mb-8">
            Join the designers and teams already using BiblioKit to ship faster and maintain less.
          </p>
          <Button asChild size="lg" className={HERO_PRIMARY_BUTTON_CLASS}>
            <a href={ROUTE_PATHS.HOME}>
              Explore the Plugin Suite
              <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </Button>
        </div>
      </Section>

      {/* Contact */}
      <Section className="pt-0 pb-16" contentClassName="max-w-4xl">
        <div className="text-center">
          <p className="text-white/50 text-sm">
            Questions? Reach us at{' '}
            <a href="mailto:hello@bibliokit.com" className="text-violet-400 hover:text-violet-300 underline underline-offset-2">
              hello@bibliokit.com
            </a>
          </p>
        </div>
      </Section>
    </div>
  );
};

export default AboutPage;
