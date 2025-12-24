import React from 'react';
import { Button } from '@/components/ui/button';
import { ROUTE_PATHS } from '@/config/routes';
import { ArrowRight, Sparkles, BarChart3, Rocket, Zap, Layers, RefreshCw } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="about-page-shell relative min-h-screen bg-gradient-to-b from-[#0b0c0f] via-[#0e1014] to-[#0b0c0f] text-white">
      {/* Section 1: Hero / Vision Statement */}
      <section className="section-content pt-28 pb-16 max-w-4xl mx-auto px-4 md:px-6">
        <div className="text-center mb-8">
          <p className="text-sm uppercase tracking-[0.18em] text-violet-400 mb-4">
            About BiblioKit
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
            The Story Behind BiblioKit: Reimagining the Design Workflow
          </h1>
          <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto mb-4">
            Empowering designers to spend more time creating and less time maintaining.
          </p>
          <p className="text-lg text-white/70 leading-relaxed max-w-2xl mx-auto">
            BiblioKit was born out of a simple observation: design systems are growing faster than our ability to manage them. We build the tools that bridge the gap between creative vision and technical execution.
          </p>
        </div>
      </section>

      {/* Section 2: The Problem / The "Why" */}
      <section className="section-content pb-16 max-w-5xl mx-auto px-4 md:px-6">
        <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
            The Problem We Solve
          </h2>
          <div className="max-w-3xl mx-auto space-y-4 text-white/80 leading-relaxed">
            <p>
              Modern design teams are bogged down by <span className="text-amber-400 font-medium">"design debt"</span>—fragmented plugin stacks, manual refactoring, and inconsistent handoffs.
            </p>
            <p>
              We saw teams spending <span className="text-white font-semibold">40% of their time on maintenance</span> rather than innovation.
            </p>
            <p className="text-lg text-white/90">
              BiblioKit was created to solve the <span className="text-amber-400 font-medium">"maintenance tax"</span> on creativity.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: What We Do / The "How" */}
      <section className="section-content pb-16 max-w-5xl mx-auto px-4 md:px-6">
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
      </section>

      {/* Section 4: Our Values */}
      <section className="section-content pb-16 max-w-5xl mx-auto px-4 md:px-6">
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
              <p className="text-sm text-white/60">If a machine can do it, a designer shouldn't have to.</p>
            </div>
          </div>
          <div className="flex gap-4 p-5 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
              <Layers className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Seamless Integration</h3>
              <p className="text-sm text-white/60">Our tools live where you work—no new platforms, just better workflows in Figma.</p>
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
      </section>

      {/* Section 5: CTA */}
      <section className="section-content pb-24 max-w-4xl mx-auto px-4 md:px-6">
        <div className="rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-transparent p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to accelerate your workflow?
          </h2>
          <p className="text-white/70 leading-relaxed max-w-xl mx-auto mb-8">
            Join the designers and teams already using BiblioKit to ship faster and maintain less.
          </p>
          <Button asChild size="lg" className="bg-violet-600 hover:bg-violet-500">
            <a href={ROUTE_PATHS.HOME}>
              Explore the Plugin Suite
              <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </Button>
        </div>
      </section>

      {/* Contact */}
      <section className="section-content pb-16 max-w-4xl mx-auto px-4 md:px-6">
        <div className="text-center">
          <p className="text-white/50 text-sm">
            Questions? Reach us at{' '}
            <a href="mailto:hello@bibliokit.com" className="text-violet-400 hover:text-violet-300 underline underline-offset-2">
              hello@bibliokit.com
            </a>
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
