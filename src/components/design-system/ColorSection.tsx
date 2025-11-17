import React from "react";

import {
  accentSwatches,
  brandSwatches,
  gradientPresets,
  neutralSwatches,
  primarySwatches,
  successSwatches,
  surfaceBorderSwatches,
  surfaceSwatches,
  surfaceTextSwatches,
} from "./data/colors";
import { BorderSwatch, Swatch, TextSwatch } from "./swatches";

const GradientCard: React.FC<{ id: string; description: string; className: string }> = ({
  id,
  description,
  className,
}) => (
  <div className={`card ${className}`}>
    <h3 className="font-semibold">{id}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

export const ColorSection: React.FC = () => (
  <section className="mb-12">
    <h2 className="mb-4 text-2xl font-semibold">Colors</h2>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div className="card">
        <h3 className="mb-3 font-medium">Brand Colors</h3>
        <div className="flex flex-col gap-3">
          {brandSwatches.map((swatch) => (
            <Swatch key={swatch.name} {...swatch} />
          ))}
        </div>
      </div>
      <div className="card">
        <h3 className="mb-3 font-medium">Primary (Pink)</h3>
        <div className="flex flex-col gap-3">
          {primarySwatches.map((swatch) => (
            <Swatch key={swatch.name} {...swatch} />
          ))}
        </div>
      </div>
      <div className="card">
        <h3 className="mb-3 font-medium">Accent (Blue)</h3>
        <div className="flex flex-col gap-3">
          {accentSwatches.map((swatch) => (
            <Swatch key={swatch.name} {...swatch} />
          ))}
        </div>
      </div>
      <div className="card">
        <h3 className="mb-3 font-medium">Success (Green)</h3>
        <div className="flex flex-col gap-3">
          {successSwatches.map((swatch) => (
            <Swatch key={swatch.name} {...swatch} />
          ))}
        </div>
      </div>
      <div className="card">
        <h3 className="mb-3 font-medium">Neutrals (Gray)</h3>
        <div className="flex flex-col gap-3">
          {neutralSwatches.map((swatch) => (
            <Swatch key={swatch.name} {...swatch} />
          ))}
        </div>
      </div>
      <div className="card">
        <h3 className="mb-3 font-medium">Surfaces & Borders</h3>
        <div className="flex flex-col gap-3">
          {surfaceSwatches.map((swatch) => (
            <Swatch key={swatch.name} {...swatch} />
          ))}
          {surfaceBorderSwatches.map((swatch) => (
            <BorderSwatch key={swatch.name} {...swatch} />
          ))}
          {surfaceTextSwatches.map((swatch) => (
            <TextSwatch key={swatch.name} {...swatch} />
          ))}
        </div>
      </div>
    </div>

    <div className="mt-8">
      <h3 className="mb-4 text-lg font-semibold">Soft Gradient Presets</h3>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {gradientPresets.map((preset) => (
          <GradientCard key={preset.id} {...preset} />
        ))}
      </div>
    </div>
  </section>
);

