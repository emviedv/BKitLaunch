import React from 'react';

const Swatch: React.FC<{ name: string; className: string; textClass?: string }> = ({ name, className, textClass }) => (
  <div className="flex items-center gap-3">
    <div className={`h-8 w-8 rounded-md border ${className}`} />
    <span className={`text-sm ${textClass || 'text-foreground'}`}>{name}</span>
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
          <div className="card">
            <h3 className="font-medium mb-3">Primary (Pink)</h3>
            <div className="flex flex-col gap-3">
              <Swatch name="primary" className="bg-pink-500" />
              <Swatch name="primary-foreground" className="bg-pink-500" textClass="text-white" />
              <Swatch name="ring" className="bg-pink-400" />
            </div>
          </div>
          <div className="card">
            <h3 className="font-medium mb-3">Accent (Blue)</h3>
            <div className="flex flex-col gap-3">
              <Swatch name="accent" className="bg-blue-500" />
              <Swatch name="accent-foreground" className="bg-blue-500" textClass="text-white" />
            </div>
          </div>
          <div className="card">
            <h3 className="font-medium mb-3">Success (Green)</h3>
            <div className="flex flex-col gap-3">
              <Swatch name="success" className="bg-green-500" />
              <Swatch name="success soft" className="bg-green-100" />
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
        </div>
      </section>

      {/* Buttons */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <button className="button">Primary</button>
          <button className="button-outline">Outline</button>
          <button className="button-ghost">Ghost</button>
          <button className="button-secondary">Secondary</button>
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


