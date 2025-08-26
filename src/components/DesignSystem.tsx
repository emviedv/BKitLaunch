import React from 'react';
import { Button } from '@/components/ui/button';
import { MagnetizeButton } from '@/components/ui/magnetize-button';
import AnimatedGradientBackground from '@/components/ui/animated-gradient-background';

const Swatch: React.FC<{ name: string; className: string; textClass?: string; hex?: string }> = ({ name, className, textClass, hex }) => (
  <div className="flex items-center gap-3">
    <div className={`h-8 w-8 rounded-md border ${className}`} />
    <div className="flex flex-col">
      <span className={`text-sm font-medium ${textClass || 'text-foreground'}`}>{name}</span>
      {hex && <span className="text-xs text-muted-foreground font-mono">{hex}</span>}
    </div>
  </div>
);

const TextSwatch: React.FC<{ name: string; textClass: string }> = ({ name, textClass }) => (
  <div className="flex items-center gap-3">
    <div className="h-8 w-8 rounded-md border bg-background flex items-center justify-center">
      <span className={`text-base leading-none ${textClass}`}>Aa</span>
    </div>
    <span className="text-sm text-foreground">{name}</span>
  </div>
);

const BorderSwatch: React.FC<{ name: string; borderClass: string }> = ({ name, borderClass }) => (
  <div className="flex items-center gap-3">
    <div className={`h-8 w-8 rounded-md bg-background border ${borderClass}`} />
    <span className="text-sm text-foreground">{name}</span>
  </div>
);

const DesignSystem: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Design System</h1>
        <p className="text-muted-foreground">BiblioKit UI tokens and components (pink, blue, green).</p>
      </div>

      {/* Colors */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Colors</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Brand Colors */}
          <div className="card">
            <h3 className="font-medium mb-3">Brand Colors</h3>
            <div className="flex flex-col gap-3">
              <Swatch name="pink-500" className="bg-pink-500" hex="#ec4899" />
              <Swatch name="blue-500" className="bg-blue-500" hex="#3b82f6" />
              <Swatch name="green-500" className="bg-green-500" hex="#22c55e" />
              <Swatch name="pink-50" className="bg-pink-50" hex="#fdf2f8" />
              <Swatch name="blue-50" className="bg-blue-50" hex="#eff6ff" />
              <Swatch name="green-50" className="bg-green-50" hex="#f0fdf4" />
            </div>
          </div>
          <div className="card">
            <h3 className="font-medium mb-3">Primary (Pink)</h3>
            <div className="flex flex-col gap-3">
              <Swatch name="primary" className="bg-pink-500" hex="#ec4899" />
              <Swatch name="primary-foreground" className="bg-pink-500" textClass="text-white" hex="#fdf2f8" />
              <Swatch name="ring" className="bg-pink-400" hex="#f472b6" />
            </div>
          </div>
          <div className="card">
            <h3 className="font-medium mb-3">Accent (Blue)</h3>
            <div className="flex flex-col gap-3">
              <Swatch name="accent" className="bg-blue-500" hex="#3b82f6" />
              <Swatch name="accent-foreground" className="bg-blue-500" textClass="text-white" hex="#eff6ff" />
            </div>
          </div>
          <div className="card">
            <h3 className="font-medium mb-3">Success (Green)</h3>
            <div className="flex flex-col gap-3">
              <Swatch name="success" className="bg-green-500" hex="#22c55e" />
              <Swatch name="success soft" className="bg-green-100" hex="#dcfce7" />
            </div>
          </div>

          {/* Neutrals (Gray Scale) */}
          <div className="card">
            <h3 className="font-medium mb-3">Neutrals (Gray)</h3>
            <div className="flex flex-col gap-3">
              <Swatch name="gray-50" className="bg-gray-50" hex="#f9fafb" />
              <Swatch name="gray-100" className="bg-gray-100" hex="#f3f4f6" />
              <Swatch name="gray-200" className="bg-gray-200" hex="#e5e7eb" />
              <Swatch name="gray-300" className="bg-gray-300" hex="#d1d5db" />
              <Swatch name="gray-400" className="bg-gray-400" hex="#9ca3af" />
              <Swatch name="gray-500" className="bg-gray-500" textClass="text-white" hex="#6b7280" />
              <Swatch name="gray-600" className="bg-gray-600" textClass="text-white" hex="#4b5563" />
              <Swatch name="gray-700" className="bg-gray-700" textClass="text-white" hex="#374151" />
              <Swatch name="gray-800" className="bg-gray-800" textClass="text-white" hex="#1f2937" />
              <Swatch name="gray-900" className="bg-gray-900" textClass="text-white" hex="#111827" />
            </div>
          </div>

          {/* Surface & Border Tokens */}
          <div className="card">
            <h3 className="font-medium mb-3">Surfaces & Borders</h3>
            <div className="flex flex-col gap-3">
              <Swatch name="background" className="bg-background" hex="#ffffff" />
              <Swatch name="foreground" className="bg-foreground" textClass="text-white" hex="#0f172a" />
              <Swatch name="muted" className="bg-muted" hex="#f1f5f9" />
              <Swatch name="muted-foreground" className="bg-muted-foreground" textClass="text-white" hex="#64748b" />
              <Swatch name="border" className="bg-border" hex="#e2e8f0" />
              <Swatch name="input" className="bg-input" hex="#e2e8f0" />
            </div>
          </div>

          {/* Text (Gray) */}
          <div className="card">
            <h3 className="font-medium mb-3">Text (Gray)</h3>
            <div className="flex flex-col gap-3">
              <TextSwatch name="foreground" textClass="text-foreground" />
              <TextSwatch name="muted-foreground" textClass="text-muted-foreground" />
              <TextSwatch name="gray-500" textClass="text-gray-500" />
              <TextSwatch name="gray-600" textClass="text-gray-600" />
              <TextSwatch name="gray-700" textClass="text-gray-700" />
              <TextSwatch name="gray-800" textClass="text-gray-800" />
              <TextSwatch name="gray-900" textClass="text-gray-900" />
            </div>
          </div>

          {/* Borders (Gray) */}
          <div className="card">
            <h3 className="font-medium mb-3">Borders (Gray)</h3>
            <div className="flex flex-col gap-3">
              <BorderSwatch name="border" borderClass="border-border" />
              <BorderSwatch name="gray-100" borderClass="border-gray-100" />
              <BorderSwatch name="gray-200" borderClass="border-gray-200" />
              <BorderSwatch name="gray-300" borderClass="border-gray-300" />
              <BorderSwatch name="gray-400" borderClass="border-gray-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Gradients */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Gradients</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card gradient-brand text-white">
            <h3 className="font-semibold">gradient-brand</h3>
            <p className="text-sm opacity-90">from-pink-500 → via-blue-500 → to-green-500</p>
          </div>
          <div className="card gradient-brand-soft">
            <h3 className="font-semibold">gradient-brand-soft</h3>
            <p className="text-sm text-muted-foreground">from-pink-50 → via-blue-50 → to-green-50</p>
          </div>
          <div className="card relative overflow-hidden h-32 flex items-center justify-center">
            <AnimatedGradientBackground Breathing startingGap={125} containerClassName="opacity-90" />
            <div className="relative z-10 text-center">
              <h3 className="font-semibold">Animated Gradient</h3>
              <p className="text-sm text-muted-foreground">Configurable radial breathing</p>
            </div>
          </div>
          <div className="card gradient-ocean-soft-radial">
            <h3 className="font-semibold">gradient-ocean-soft-radial</h3>
            <p className="text-sm text-muted-foreground">blue/cyan/teal soft with radial accents</p>
          </div>
          <div className="card gradient-violet-soft-radial">
            <h3 className="font-semibold">gradient-violet-soft-radial</h3>
            <p className="text-sm text-muted-foreground">violet/indigo/blue soft with radial accents</p>
          </div>
          <div className="card gradient-mint-soft-radial">
            <h3 className="font-semibold">gradient-mint-soft-radial</h3>
            <p className="text-sm text-muted-foreground">green/emerald/teal soft with radial accents</p>
          </div>
          <div className="card gradient-sunset-soft-radial">
            <h3 className="font-semibold">gradient-sunset-soft-radial</h3>
            <p className="text-sm text-muted-foreground">rose/pink/orange soft with radial accents</p>
          </div>
          <div className="card gradient-sand-soft-radial">
            <h3 className="font-semibold">gradient-sand-soft-radial</h3>
            <p className="text-sm text-muted-foreground">amber/warm sand soft with radial accents</p>
          </div>
          <div className="card gradient-ice-soft-radial">
            <h3 className="font-semibold">gradient-ice-soft-radial</h3>
            <p className="text-sm text-muted-foreground">icy blue/indigo soft with radial accents</p>
          </div>
          <div className="card gradient-rosewater-soft-radial">
            <h3 className="font-semibold">gradient-rosewater-soft-radial</h3>
            <p className="text-sm text-muted-foreground">rose/pink/violet soft with radial accents</p>
          </div>
          <div className="card gradient-aurora-soft-radial">
            <h3 className="font-semibold">gradient-aurora-soft-radial</h3>
            <p className="text-sm text-muted-foreground">green/cyan/violet aurora-inspired soft blend</p>
          </div>
          <div className="card gradient-meadow-soft-radial">
            <h3 className="font-semibold">gradient-meadow-soft-radial</h3>
            <p className="text-sm text-muted-foreground">lime/green/mint meadow soft blend</p>
          </div>
          <div className="card gradient-moonlight-soft-radial">
            <h3 className="font-semibold">gradient-moonlight-soft-radial</h3>
            <p className="text-sm text-muted-foreground">slate/indigo/violet moonlight soft blend</p>
          </div>
        </div>
        
        {/* HSL Gradients Examples */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">HSL Gradients Examples</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card h-32 flex items-center justify-center" style={{background: 'linear-gradient(135deg, hsl(240, 100%, 95%), hsl(280, 100%, 95%), hsl(320, 100%, 95%))'}}>
              <div className="text-center">
                <h4 className="font-semibold">Purple HSL Soft</h4>
                <p className="text-xs text-muted-foreground">hsl(240,100%,95%) → hsl(280,100%,95%) → hsl(320,100%,95%)</p>
              </div>
            </div>
            
            <div className="card h-32 flex items-center justify-center" style={{background: 'radial-gradient(ellipse at center, hsl(200, 80%, 90%), hsl(220, 70%, 85%), hsl(240, 60%, 80%))'}}>
              <div className="text-center">
                <h4 className="font-semibold">Blue HSL Radial</h4>
                <p className="text-xs text-muted-foreground">radial hsl(200,80%,90%) → hsl(220,70%,85%) → hsl(240,60%,80%)</p>
              </div>
            </div>
            
            <div className="card h-32 flex items-center justify-center" style={{background: 'linear-gradient(45deg, hsl(120, 60%, 95%), hsl(150, 70%, 92%), hsl(180, 80%, 90%))'}}>
              <div className="text-center">
                <h4 className="font-semibold">Green HSL Diagonal</h4>
                <p className="text-xs text-muted-foreground">45deg hsl(120,60%,95%) → hsl(150,70%,92%) → hsl(180,80%,90%)</p>
              </div>
            </div>
            
            <div className="card h-32 flex items-center justify-center" style={{background: 'conic-gradient(from 0deg, hsl(0, 70%, 90%), hsl(60, 80%, 85%), hsl(120, 70%, 90%), hsl(180, 80%, 85%), hsl(240, 70%, 90%), hsl(300, 80%, 85%), hsl(0, 70%, 90%))'}}>
              <div className="text-center">
                <h4 className="font-semibold">Rainbow HSL Conic</h4>
                <p className="text-xs text-muted-foreground">conic-gradient with 360° HSL color wheel</p>
              </div>
            </div>
            
            <div className="card h-32 flex items-center justify-center" style={{background: 'linear-gradient(to bottom right, hsl(40, 100%, 95%), hsl(50, 90%, 88%), hsl(60, 80%, 85%))'}}>
              <div className="text-center">
                <h4 className="font-semibold">Warm HSL Gradient</h4>
                <p className="text-xs text-muted-foreground">diagonal hsl(40,100%,95%) → hsl(50,90%,88%) → hsl(60,80%,85%)</p>
              </div>
            </div>
            
            <div className="card h-32 flex items-center justify-center" style={{background: 'linear-gradient(90deg, hsla(200, 100%, 95%, 0.8), hsla(220, 80%, 90%, 0.6), hsla(240, 60%, 85%, 0.8))'}}>
              <div className="text-center">
                <h4 className="font-semibold">HSL with Alpha</h4>
                <p className="text-xs text-muted-foreground">hsla() with varying alpha transparency</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">HSL Benefits</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Intuitive:</strong> Hue (0-360°), Saturation (0-100%), Lightness (0-100%)</li>
              <li>• <strong>Consistent brightness:</strong> Easy to create harmonious color schemes</li>
              <li>• <strong>Better gradients:</strong> Smooth transitions through color wheel</li>
              <li>• <strong>Alpha support:</strong> Use hsla() for transparency effects</li>
              <li>• <strong>Design-friendly:</strong> Matches how designers think about color</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Border Radius */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Border Radius</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="font-medium mb-3">rounded-sm</h3>
            <div className="h-16 w-full bg-muted rounded-sm border" />
          </div>
          <div className="card">
            <h3 className="font-medium mb-3">rounded-md</h3>
            <div className="h-16 w-full bg-muted rounded-md border" />
          </div>
          <div className="card">
            <h3 className="font-medium mb-3">rounded-lg</h3>
            <div className="h-16 w-full bg-muted rounded-lg border" />
          </div>
          <div className="card">
            <h3 className="font-medium mb-3">rounded-xl</h3>
            <div className="h-16 w-full bg-muted rounded-xl border" />
          </div>
          <div className="card">
            <h3 className="font-medium mb-3">rounded-2xl</h3>
            <div className="h-16 w-full bg-muted rounded-2xl border" />
          </div>
          <div className="card">
            <h3 className="font-medium mb-3">rounded-full</h3>
            <div className="h-16 w-16 bg-muted rounded-full border" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">Note: `rounded-*` values are aligned to the theme radius token `--radius`.</p>
      </section>

      {/* Shadows */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Shadows</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card shadow-sm">
            <h3 className="font-medium">shadow-sm</h3>
            <p className="text-sm text-muted-foreground">Subtle elevation</p>
          </div>
          <div className="card shadow">
            <h3 className="font-medium">shadow</h3>
            <p className="text-sm text-muted-foreground">Default elevation</p>
          </div>
          <div className="card shadow-md">
            <h3 className="font-medium">shadow-md</h3>
            <p className="text-sm text-muted-foreground">Medium elevation</p>
          </div>
          <div className="card shadow-lg">
            <h3 className="font-medium">shadow-lg</h3>
            <p className="text-sm text-muted-foreground">Large elevation</p>
          </div>
          <div className="card shadow-xl">
            <h3 className="font-medium">shadow-xl</h3>
            <p className="text-sm text-muted-foreground">Extra large elevation</p>
          </div>
          <div className="card shadow-2xl">
            <h3 className="font-medium">shadow-2xl</h3>
            <p className="text-sm text-muted-foreground">Max elevation</p>
          </div>
        </div>
      </section>

      {/* Spacing Scale */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Spacing Scale</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-medium mb-3">Padding Examples</h3>
            <div className="space-y-2 text-sm">
              <div className="bg-muted rounded border p-1"><span className="inline-block bg-background px-2 py-1 rounded border">p-1</span></div>
              <div className="bg-muted rounded border p-2"><span className="inline-block bg-background px-2 py-1 rounded border">p-2</span></div>
              <div className="bg-muted rounded border p-4"><span className="inline-block bg-background px-2 py-1 rounded border">p-4</span></div>
              <div className="bg-muted rounded border p-6"><span className="inline-block bg-background px-2 py-1 rounded border">p-6</span></div>
              <div className="bg-muted rounded border p-8"><span className="inline-block bg-background px-2 py-1 rounded border">p-8</span></div>
            </div>
          </div>
          <div className="card">
            <h3 className="font-medium mb-3">Gap/Space Examples</h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="flex items-center gap-1"><span className="badge">gap-1</span></div>
                <div className="flex gap-1"><div className="h-3 w-8 bg-muted rounded" /><div className="h-3 w-8 bg-muted rounded" /><div className="h-3 w-8 bg-muted rounded" /></div>
              </div>
              <div>
                <div className="flex items-center gap-2"><span className="badge">gap-2</span></div>
                <div className="flex gap-2"><div className="h-3 w-8 bg-muted rounded" /><div className="h-3 w-8 bg-muted rounded" /><div className="h-3 w-8 bg-muted rounded" /></div>
              </div>
              <div>
                <div className="flex items-center gap-4"><span className="badge">gap-4</span></div>
                <div className="flex gap-4"><div className="h-3 w-8 bg-muted rounded" /><div className="h-3 w-8 bg-muted rounded" /><div className="h-3 w-8 bg-muted rounded" /></div>
              </div>
              <div>
                <div className="flex items-center gap-6"><span className="badge">gap-6</span></div>
                <div className="flex gap-6"><div className="h-3 w-8 bg-muted rounded" /><div className="h-3 w-8 bg-muted rounded" /><div className="h-3 w-8 bg-muted rounded" /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="mt-4">
          <MagnetizeButton aria-label="Magnetize button demo">Magnetize</MagnetizeButton>
        </div>
      </section>

      {/* Inputs */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Forms</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" className="input" placeholder="you@domain.com" />
            <p className="helper-text">We’ll never share your email.</p>
          </div>
          <div className="card">
            <label className="label" htmlFor="name">Name</label>
            <input id="name" type="text" className="input" placeholder="Jane Doe" />
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Cards</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-semibold mb-2">Standard Card</h3>
            <p className="text-muted-foreground">Use for general content containers.</p>
          </div>
          <div className="card card-featured">
            <h3 className="font-semibold mb-2">Featured Card</h3>
            <p className="text-muted-foreground">Highlighted with a soft brand gradient.</p>
            <button className="card-button">Call to Action</button>
          </div>
        </div>
      </section>

      {/* Badges */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Badges</h2>
        <div className="flex flex-wrap gap-2">
          <span className="badge">Default</span>
          <span className="badge badge-primary">Primary</span>
          <span className="badge badge-accent">Accent</span>
          <span className="badge badge-success">Success</span>
        </div>
      </section>

      {/* Typography */}
      <section className="mb-4">
        <h2 className="text-2xl font-semibold mb-4">Typography</h2>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Heading 1</h1>
          <h2 className="text-3xl font-bold">Heading 2</h2>
          <h3 className="text-2xl font-semibold">Heading 3</h3>
          <p className="text-base">Body text – default.</p>
          <p className="text-sm text-muted-foreground">Muted text – for secondary information.</p>
        </div>
      </section>
    </div>
  );
};

export default DesignSystem;


