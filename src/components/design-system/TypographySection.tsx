import React from "react";

export const TypographySection: React.FC = () => (
  <section className="mb-12">
    <h2 className="mb-4 text-2xl font-semibold">Typography</h2>
    <div className="card">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Heading 1</h1>
        <h2 className="text-2xl font-semibold">Heading 2</h2>
        <h3 className="text-xl font-medium">Heading 3</h3>
        <p className="text-foreground">Body text – default. This mirrors BiblioKit’s tokens.</p>
        <p className="text-muted-foreground">Muted text – for secondary information.</p>
      </div>
    </div>
  </section>
);

