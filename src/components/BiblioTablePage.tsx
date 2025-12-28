import React, { useEffect } from 'react';
import { usePublishedContent } from '@/hooks/usePublishedContent';
import { generateMetadata, updatePageMetadata } from '@/lib/seo';
import { debugService } from '@/lib/debugService';
import { ROUTE_PATHS } from '@/config/routes';
import { Button } from '@/components/ui/button';
import { HERO_PRIMARY_BUTTON_CLASS } from '@/components/heroConstants';
import { Check, Layout, Download } from '@/lib/iconUtils';
import FAQList from '@/components/FAQList';
import FluidBackground from './FluidBackground';
import { getImageDimensions } from '@/lib/imageDimensions';

const BiblioTablePage = () => {
  debugService.info('BiblioTablePage mounted', { 
    timestamp: new Date().toISOString() 
  });

  const { content } = usePublishedContent();

  useEffect(() => {
    // SEO Metadata
    const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : 'https://www.bibliokit.com';
    const metadata = generateMetadata(ROUTE_PATHS.BIBLIO_TABLE, content, baseUrl);
    updatePageMetadata(metadata);
  }, [content]);

  // Figma Community plugin link
  const CTA_LINK = 'https://www.figma.com/community/plugin/1580378065847525472/bibliotable-auto-layout-table-fixer-data-aligner';
  const biblioTableImageDimensions = getImageDimensions('/media/BiblioTable.png');
  const faqs = [
    { question: "Does this work with complex nested auto-layouts?", answer: "Yes. BiblioTable is designed to parse standard row/column auto-layout structures commonly used for tables." },
    { question: "Does it break responsive resizing?", answer: "No. It applies fixed widths where necessary to ensure alignment, but respects 'Fill container' where appropriate for the table wrapper." },
    { question: "Can I customize the zebra striping color?", answer: "Yes. You can select the fill color for alternating rows." },
    { question: "When will it be released?", answer: "BiblioTable is live. Install it from our Figma Community profile." },
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
            Stop fighting<br className="hidden md:block" /> auto-layout tables.
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-[60%] mx-auto">
            Normalize column widths, fix sub-pixel rotation bugs, and generate zebra striping in one click.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button asChild className={HERO_PRIMARY_BUTTON_CLASS} size="lg">
              <a href={CTA_LINK} className="inline-flex items-center gap-2">
                <Download className="w-5 h-5" />
                <span>FIX YOUR TABLES</span>
              </a>
            </Button>
            <span className="flex items-center gap-2 text-sm text-slate-400">
              <Layout className="w-4 h-4" /> auto-align · zebra stripe
            </span>
          </div>
          <div className="mx-auto max-w-4xl shadow-2xl rounded-lg overflow-hidden border border-slate-700/50">
             <PlaceholderImage label="Looping GIF: Messy Table -> Click Fix -> Perfectly Aligned Grid" height="h-[400px]" />
          </div>
        </div>
      </section>

      {/* Block 2: Problem Agitation */}
      <Section dark className="border-y border-slate-800/50">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <SectionTitle>Tables shouldn&apos;t be this hard.</SectionTitle>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-lg text-slate-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                Manually resizing 12 columns every time text changes.
              </li>
              <li className="flex items-start gap-3 text-lg text-slate-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                Sub-pixel bugs causing 1px misalignments on export.
              </li>
              <li className="flex items-start gap-3 text-lg text-slate-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                Tedious background layer management for zebra striping.
              </li>
            </ul>
            <div className="bg-red-900/20 border border-red-900/50 p-6 rounded-lg mb-6">
              <p className="font-semibold text-red-200 mb-1">The Layout Tax</p>
              <p className="text-red-300">Designers spend hours fiddling with &quot;Fill container&quot; vs &quot;Fixed width&quot; instead of designing the data view.</p>
            </div>
            <p className="italic text-slate-400">
              &quot;I dread designing data tables because keeping the columns aligned across 50 rows is a nightmare.&quot;
            </p>
          </div>
          <div className="relative">
             <img 
               src="/media/BiblioTable.png" 
               alt="Screenshot of BiblioTable fixing a Figma table" 
               className="w-full h-auto rounded-xl border border-slate-700 shadow-2xl"
               width={biblioTableImageDimensions?.width}
               height={biblioTableImageDimensions?.height}
               loading="lazy"
               decoding="async"
             />
          </div>
        </div>
      </Section>

      {/* Block 3: Quick Proof */}
      <Section dark>
        <div className="text-center mb-12">
          <div className="inline-block bg-purple-500/10 text-purple-400 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-purple-500/20">
            Typical Result: Perfect Alignment in 2s
          </div>
          <SectionTitle>Watch BiblioTable in Action: Normalize & Zebra-Stripe Figma Tables</SectionTitle>
        </div>
        
        <div className="grid md:grid-cols-12 gap-8 mb-12">
           <div className="md:col-span-8">
              <PlaceholderImage label="GIF: Select Table -> Click 'Normalize Widths' -> Columns Snap to Grid" height="h-96" />
           </div>
           <div className="md:col-span-4 flex flex-col gap-4">
              <PlaceholderImage label="Before/After: Jagged Columns" height="h-28" className="bg-slate-800" />
              <p className="text-xs text-center text-slate-500 mb-2">Fixed 12 columns</p>
              <PlaceholderImage label="Zebra Striping Control" height="h-28" className="bg-slate-800" />
              <p className="text-xs text-center text-slate-500 mb-2">Alternating rows applied</p>
              <PlaceholderImage label="Pixel Perfect Report" height="h-28" className="bg-slate-800" />
           </div>
        </div>
      </Section>

      {/* Block 4: How it works */}
      <Section dark>
        <div className="text-center mb-16">
          <SectionTitle>Three steps to order.</SectionTitle>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center font-bold text-white z-10">1</div>
            <PlaceholderImage label="Step 1: Select Auto-Layout Frame" height="h-64" />
            <h3 className="text-xl font-bold mt-6 mb-2">Select Table</h3>
            <p className="text-slate-400">Select any frame using auto-layout for rows and columns. BiblioTable analyzes the structure.</p>
          </div>
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center font-bold text-white z-10">2</div>
            <PlaceholderImage label="Step 2: Choose Normalization Strategy" height="h-64" />
            <h3 className="text-xl font-bold mt-6 mb-2">Set Rules</h3>
            <p className="text-slate-400">Choose to equalize column widths based on the widest cell or a specific fixed width.</p>
          </div>
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center font-bold text-white z-10">3</div>
            <PlaceholderImage label="Step 3: Apply & Stripe" height="h-64" />
            <h3 className="text-xl font-bold mt-6 mb-2">Instant Polish</h3>
            <p className="text-slate-400">Apply the fix. Optionally add zebra striping to rows for better readability.</p>
          </div>
        </div>
      </Section>

      {/* Block 5: Features */}
      <Section dark>
        <div className="grid gap-16">
          {/* Feature 1 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Normalize Column Widths</h3>
              <p className="text-slate-300 text-lg mb-6">Instantly force every cell in a column to match the width of the widest header or data cell. No more manual resizing of 50 individual rows.</p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Scans entire table stack</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Matches widest cell content</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Respects padding and gaps</li>
              </ul>
            </div>
            <PlaceholderImage label="Screenshot: Column Width Controls" />
          </div>
          
          {/* Feature 2 */}
          <div className="grid md:grid-cols-2 gap-12 items-center md:grid-flow-dense">
             <div className="md:col-start-2">
              <h3 className="text-2xl font-bold mb-4">Generate Zebra Striping</h3>
              <p className="text-slate-300 text-lg mb-6">Add alternating background colors to your auto-layout rows without creating messy background rectangles manually.</p>
            </div>
            <div className="md:col-start-1">
               <PlaceholderImage label="Screenshot: Zebra Stripe Toggle" />
            </div>
          </div>

          {/* Feature 3 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
             <div>
              <h3 className="text-2xl font-bold mb-4">Fix Sub-Pixel Bugs</h3>
              <p className="text-slate-300 text-lg mb-6">Detect and round off sub-pixel positioning (e.g., 100.34px) that causes blurry rendering or 1px misalignments in development.</p>
            </div>
            <PlaceholderImage label="Screenshot: Pixel Rounding Confirmation" />
          </div>
        </div>
      </Section>

      {/* Block 6: Use Cases */}
      <Section dark className="border-y border-slate-800/50">
        <SectionTitle className="text-center mb-12">Essential for data-heavy UI.</SectionTitle>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-[#0f172a]/50 p-8 rounded-2xl border border-slate-700/50">
            <h4 className="text-xl font-bold mb-2">Dashboard Design</h4>
            <p className="text-slate-400 mb-6 text-sm">Problem: 50-row tables that break when data changes. <br/>Result: Flexible, resilient layouts.</p>
            <div className="grid grid-cols-2 gap-4">
              <PlaceholderImage label="Before: Broken Grid" height="h-40" />
              <PlaceholderImage label="After: Responsive Table" height="h-40" />
            </div>
          </div>
          <div className="bg-[#0f172a]/50 p-8 rounded-2xl border border-slate-700/50">
            <h4 className="text-xl font-bold mb-2">Pricing Pages</h4>
            <p className="text-slate-400 mb-6 text-sm">Problem: Misaligned features vs checkmarks. <br/>Result: Perfectly aligned comparison.</p>
             <div className="grid grid-cols-2 gap-4">
              <PlaceholderImage label="Before: Wobbly Rows" height="h-40" />
              <PlaceholderImage label="After: Sharp Alignment" height="h-40" />
            </div>
          </div>
        </div>
      </Section>

      {/* Block 7: CTA */}
      <Section dark>
        <div className="bg-gradient-to-br from-purple-900/40 to-slate-900/40 border border-purple-500/20 rounded-3xl p-8 md:p-12 relative overflow-hidden backdrop-blur-sm">
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Fix your tables instantly.</h2>
              <p className="text-xl text-purple-200 mb-8">Install the BiblioTable plugin from Figma Community and normalize every table fast.</p>
              <Button asChild className={HERO_PRIMARY_BUTTON_CLASS} size="lg">
                 <a href={CTA_LINK} className="inline-flex items-center gap-2">
                  <span>FIX YOUR TABLES</span>
                </a>
              </Button>
            </div>
            <div className="flex justify-center">
               <div className="relative">
                   <PlaceholderImage label="BiblioTable Plugin Icon" height="h-64" className="w-48 shadow-2xl rotate-3 rounded-3xl" />
                   <div className="absolute -bottom-4 -right-4 bg-[#0f172a] p-4 rounded-lg border border-slate-700 shadow-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-bold">Table Normalized</span>
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
        <SectionTitle className="text-center mb-12">Watch BiblioTable in Action: Normalize &amp; Zebra-Stripe Figma Tables</SectionTitle>
        <FAQList faqs={faqs} className="max-w-3xl mx-auto" />
      </Section>

      {/* Block 9: Final CTA */}
      <section className="py-24 px-6 md:px-10 text-center landing-sections-gradient text-white">
         <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Data design, solved.</h2>
            <div className="flex flex-col items-center gap-4">
              <Button asChild className={HERO_PRIMARY_BUTTON_CLASS} size="lg">
                 <a href={CTA_LINK}>
                  FIX YOUR TABLES
                </a>
              </Button>
            </div>
         </div>
      </section>

    </div>
  );
};

export default BiblioTablePage;
