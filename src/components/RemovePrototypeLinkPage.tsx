import React from 'react';
import { LANDING_WAITLIST_PATH } from '@/config/sectionAnchors';
import LandingHero, { type LandingHeroContent } from './LandingHero';
import { Button } from '@/components/ui/button';

type Highlight = {
  title: string;
  description: string;
};

const highlights: Highlight[] = [
  {
    title: 'Find every public link fast',
    description: 'Scan Figma share histories, mirror IDs, and exported URLs so designers can revoke stale prototypes before they leak context.'
  },
  {
    title: 'Deactivate safely without drift',
    description: 'Preview who last copied the link, which file it references, and whether a replacement already exists before you remove access.'
  },
  {
    title: 'Prove compliance instantly',
    description: 'Log each removal with timestamps and editors so procurement, security, and legal teams stay confident in your design ops hygiene.'
  },
  {
    title: 'Coach teams with templates',
    description: 'Drop ready-to-send Slack, email, or ticket language so product designers can educate partners while they clean up prototypes.'
  }
];

const workflowSteps: Highlight[] = [
  {
    title: 'Paste or import a prototype URL',
    description: 'Drop a single link or bulk upload a CSV of share URLs exported from Figma analytics.'
  },
  {
    title: 'Confirm the source file + viewers',
    description: 'We surface the file owner, last editor, and workspace to make sure you are removing the right asset.'
  },
  {
    title: 'Revoke & replace with one click',
    description: 'Remove the share token, generate a clean handoff link, and notify teammates automatically.'
  }
];

const RemovePrototypeLinkPage: React.FC = () => {
  const updatedDate = '2025-12-11';
  const hero: LandingHeroContent = {
    badgeLabel: 'Resource',
    title: 'Remove Prototype Link',
    subtitle: 'Shut down risky share URLs before they leak context.',
    description:
      'Purge stale prototypes and replace them with the right build in minutes using the cleanup ritual designers repeat after every sprint.',
    primaryButton: 'Join Designers shipping faster with BiblioKit',
    primaryButtonLink: LANDING_WAITLIST_PATH,
    secondaryButton: 'See the cleanup steps',
    secondaryButtonLink: '#prototype-cleanup',
  };

  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-slate-100/60 text-foreground">
      <LandingHero hero={hero} />
      <div className="section-content pb-4 pt-2">
        <span className="inline-flex items-center rounded-full border border-slate-200/80 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm">
          Updated {updatedDate}
        </span>
      </div>

      <section id="prototype-cleanup" className="section-content pb-16 pt-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
          <div className="space-y-6 rounded-[28px] border border-slate-200/70 bg-white/80 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">Clean up prototypes without pausing delivery</h2>
              <p className="text-lg text-muted-foreground">
                Run the same checklist after every sprint to find leaked links, revoke access safely, and swap in the right build before teams drift.
              </p>
            </div>
            <ul className="space-y-3 text-base text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="mt-[6px] inline-flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#6580E1]" aria-hidden="true" />
                <span>Work 10x faster by auditing every share URL without clicking through file after file.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-[6px] inline-flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#6580E1]" aria-hidden="true" />
                <span>Protect launches by revoking prototypes the moment specs change and redirecting partners instantly.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-[6px] inline-flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#6580E1]" aria-hidden="true" />
                <span>Hand designers a repeatable cleanup ritual so creative time stays focused on new work.</span>
              </li>
            </ul>
            <div className="space-y-3">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <a href={LANDING_WAITLIST_PATH}>
                  Join Designers shipping faster with BiblioKit
                </a>
              </Button>
              <p className="text-sm text-muted-foreground">
                Set up a shared workspace, consolidate libraries, and handoff 10x faster.
              </p>
            </div>
          </div>

          <div className="relative rounded-[32px] border border-white/15 bg-gradient-to-br from-[#0F172A] via-[#0C1222] to-[#0A0D1A] p-6 text-white shadow-[0_35px_80px_rgba(15,23,42,0.45)]">
            <div className="space-y-6">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-white/60">Live Preview</p>
                <h2 className="mt-2 text-2xl font-semibold">Prototype link status</h2>
              </div>
              <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                {workflowSteps.map((step, index) => (
                  <div key={step.title} className="flex gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-base font-semibold">{step.title}</p>
                      <p className="text-sm text-white/75">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-sm text-white/80">
                <p><strong>Status:</strong> Prototype link revoked</p>
                <p className="mt-1">Next step: Share updated build with research + engineering.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-background-blend-top bg-gradient-to-b from-white/80 via-slate-50/90 to-slate-100/70 pb-20">
        <div className="section-content">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-semibold text-foreground">Give every cleanup step a fast lane</h2>
            <p className="text-lg text-muted-foreground">
              Each checklist keeps designers moving—remove the broken link, drop in the right file, and move to the next build without losing speed.
            </p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-4">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 text-left shadow-[0_25px_60px_rgba(15,23,42,0.08)] backdrop-blur"
              >
                <p className="text-lg font-semibold text-foreground">{item.title}</p>
                <p className="mt-3 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-content pb-20">
        <div className="rounded-[28px] border border-slate-200/70 bg-white/80 p-8 text-left shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Next steps</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">Keep the cleanup aligned</h2>
          <p className="mt-2 text-base text-muted-foreground">
            Keep designers, developers, and marketers aligned on the right build with these follow-ups.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <a
              href="/biblio-clean"
              className="rounded-2xl border border-slate-200/70 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="text-lg font-semibold text-foreground">BiblioClean plugin</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Wipe prototype links safely without breaking components.
              </p>
            </a>
            <a
              href="/blog/remove-prototype-links-in-figma"
              className="rounded-2xl border border-slate-200/70 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="text-lg font-semibold text-foreground">Remove Figma Prototype Links guide</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Follow the step-by-step cleanup to keep handoffs crisp.
              </p>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RemovePrototypeLinkPage;
