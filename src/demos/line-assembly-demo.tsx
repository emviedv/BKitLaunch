import React from 'react';
import { createRoot } from 'react-dom/client';
import { LineAssemblyAnimation } from '@/components/ui/line-assembly-animation';
import { PanelsTopLeft, Sparkles, Grid3X3, DollarSign, MessageSquare, LayoutDashboard } from 'lucide-react';
import { LANDING_FEATURES_ID, LANDING_PRICING_ID, LANDING_WAITLIST_ID } from '@/config/sectionAnchors';

const Demo = () => {
  const items = [
    { id: 'header', label: 'Header', icon: <PanelsTopLeft className="h-3.5 w-3.5" aria-hidden="true" /> },
    { id: 'hero', label: 'Hero', icon: <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> },
    { id: LANDING_FEATURES_ID, label: 'Features', icon: <Grid3X3 className="h-3.5 w-3.5" aria-hidden="true" /> },
    { id: LANDING_PRICING_ID, label: 'Pricing', icon: <DollarSign className="h-3.5 w-3.5" aria-hidden="true" /> },
    { id: LANDING_WAITLIST_ID, label: 'Waitlist', icon: <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" /> },
    { id: 'footer', label: 'Footer', icon: <LayoutDashboard className="h-3.5 w-3.5" aria-hidden="true" /> },
  ];

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">Line Assembly Animation</h1>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">
          Animated lines connect small UI nodes as if assembling an interface. This demo renders a standalone overlay.
        </p>
      </div>

      {/* Demo stage */}
      <section className="relative mx-auto my-10 w-full max-w-5xl aspect-[16/9] rounded-2xl border border-slate-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50 shadow-sm">
        <LineAssemblyAnimation
          items={items}
          lineColor="stroke-slate-400/50"
          durationMs={1600}
          className=""
        />
      </section>
    </main>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Demo />);
}

