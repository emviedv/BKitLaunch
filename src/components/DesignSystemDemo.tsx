import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DesignSystem from "@/components/DesignSystem";

const Swatch: React.FC<{ name: string; style?: React.CSSProperties; token?: string }> = ({
  name,
  style,
  token,
}) => (
  <div className="flex items-center gap-3">
    <div className="size-8 rounded-md border" style={style} />
    <div className="flex flex-col">
      <span className="text-sm text-foreground">{name}</span>
      {token ? <span className="font-mono text-xs text-muted-foreground">{token}</span> : null}
    </div>
  </div>
);

const DesignSystemDemo: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Design System Demo</h1>
        <p className="text-muted-foreground max-w-2xl">
          Foundations and components rendered with our real UI primitives and tokens.
        </p>
      </header>

      {/* Foundations */}
      <section aria-labelledby="tokens-heading" className="mb-12">
        <h2 id="tokens-heading" className="text-2xl font-semibold mb-4">
          Tokens
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="card">
            <h3 className="mb-3 font-medium">Surfaces</h3>
            <div className="flex flex-col gap-3">
              <Swatch name="background" token="--background" style={{ background: "hsl(var(--background))" }} />
              <Swatch name="card" token="--card" style={{ background: "hsl(var(--card))" }} />
              <Swatch name="muted" token="--muted" style={{ background: "hsl(var(--muted))" }} />
            </div>
          </div>
          <div className="card">
            <h3 className="mb-3 font-medium">Text</h3>
            <div className="flex flex-col gap-3">
              <Swatch name="foreground" token="--foreground" style={{ background: "hsl(var(--foreground))" }} />
              <Swatch name="muted-foreground" token="--muted-foreground" style={{ background: "hsl(var(--muted-foreground))" }} />
            </div>
          </div>
          <div className="card">
            <h3 className="mb-3 font-medium">Semantics</h3>
            <div className="flex flex-col gap-3">
              <Swatch name="primary" token="--primary" style={{ background: "hsl(var(--primary))" }} />
              <Swatch name="secondary" token="--secondary" style={{ background: "hsl(var(--secondary))" }} />
              <Swatch name="border" token="--border" style={{ background: "hsl(var(--border))" }} />
            </div>
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section aria-labelledby="buttons-heading" className="mb-12">
        <h2 id="buttons-heading" className="text-2xl font-semibold mb-4">
          Buttons
        </h2>
        <div className="card">
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button>Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon" aria-label="Icon button">
              <span aria-hidden>★</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Forms */}
      <section aria-labelledby="forms-heading" className="mb-12">
        <h2 id="forms-heading" className="text-2xl font-semibold mb-4">
          Form Fields
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="card space-y-4">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Email</label>
              <Input type="email" placeholder="you@company.com" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Password</label>
              <Input type="password" placeholder="••••••••" />
            </div>
          </div>
          <div className="card space-y-4">
            <fieldset>
              <legend className="mb-2 text-xs text-muted-foreground">Options</legend>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" defaultChecked readOnly className="h-4 w-4" />
                Remember me
              </label>
              <label className="mt-2 flex items-center gap-2 text-sm">
                <input type="radio" name="plan" defaultChecked readOnly className="h-4 w-4" />
                Free
              </label>
              <label className="mt-1 flex items-center gap-2 text-sm">
                <input type="radio" name="plan" readOnly className="h-4 w-4" />
                Pro
              </label>
            </fieldset>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section aria-labelledby="cards-heading" className="mb-12">
        <h2 id="cards-heading" className="text-2xl font-semibold mb-4">
          Card
        </h2>
        <article className="card max-w-lg">
          <h3 className="mb-2 text-lg font-semibold">Card title</h3>
          <p className="text-sm text-muted-foreground">
            Use cards to group related content on soft surfaces with clear borders.
          </p>
          <div className="mt-4 flex gap-2">
            <Button>Primary</Button>
            <Button variant="outline">Secondary</Button>
          </div>
        </article>
      </section>

      {/* Existing component gallery from our DesignSystem route */}
      <section aria-labelledby="showcase-heading" className="mb-12">
        <h2 id="showcase-heading" className="text-2xl font-semibold mb-4">
          In‑App Component Gallery
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          These previews reuse the same components we ship (e.g., buttons, inputs, dialog patterns) rendered below.
        </p>
        <DesignSystem />
      </section>
    </div>
  );
};

export default DesignSystemDemo;

