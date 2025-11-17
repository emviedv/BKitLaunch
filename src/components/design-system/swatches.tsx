import React from "react";

export type SwatchProps = {
  name: string;
  className: string;
  textClass?: string;
  hex?: string;
};

export const Swatch: React.FC<SwatchProps> = ({ name, className, textClass, hex }) => (
  <div className="flex items-center gap-3">
    <div className={`size-8 rounded-md border ${className}`} />
    <div className="flex flex-col">
      <span className={`text-sm font-medium ${textClass || "text-foreground"}`}>{name}</span>
      {hex ? <span className="font-mono text-xs text-muted-foreground">{hex}</span> : null}
    </div>
  </div>
);

export type TextSwatchProps = {
  name: string;
  textClass: string;
};

export const TextSwatch: React.FC<TextSwatchProps> = ({ name, textClass }) => (
  <div className="flex items-center gap-3">
    <div className="flex size-8 items-center justify-center rounded-md border bg-background">
      <span className={`text-base leading-none ${textClass}`}>Aa</span>
    </div>
    <span className="text-sm text-foreground">{name}</span>
  </div>
);

export type BorderSwatchProps = {
  name: string;
  borderClass: string;
};

export const BorderSwatch: React.FC<BorderSwatchProps> = ({ name, borderClass }) => (
  <div className="flex items-center gap-3">
    <div className={`size-8 rounded-md border bg-background ${borderClass}`} />
    <span className="text-sm text-foreground">{name}</span>
  </div>
);

