import React from "react";

import AnimatedGradientBackground from "@/components/ui/animated-gradient-background";
import { Button } from "@/components/ui/button";
import { MagnetizeButton } from "@/components/ui/magnetize-button";

import {
  checkboxStates,
  inputStates,
  radioStates,
  selectStates,
} from "./data/forms";

const FieldLabel: React.FC<{ htmlFor?: string; children: React.ReactNode }> = ({
  htmlFor,
  children,
}) => (
  <label className="mb-1 block text-xs text-muted-foreground" htmlFor={htmlFor}>
    {children}
  </label>
);

const helperClasses = "mt-1 text-xs";

export const RadiusSection: React.FC = () => (
  <section className="mb-12">
    <h2 className="mb-4 text-2xl font-semibold">Border Radius</h2>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div className="card">
        <h3 className="mb-3 font-medium">Radius Tokens</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "sm", className: "size-10 rounded-sm border bg-card" },
            { label: "md", className: "size-10 rounded border bg-card" },
            { label: "lg", className: "size-10 rounded-lg border bg-card" },
            { label: "xl", className: "size-10 rounded-xl border bg-card" },
            { label: "2xl", className: "size-10 rounded-2xl border bg-card" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={item.className} />
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <h3 className="mb-3 font-medium">Buttons</h3>
        <div className="flex flex-wrap gap-3">
          <Button>Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <MagnetizeButton>Magnetize</MagnetizeButton>
        </div>
      </div>
      <div className="card relative overflow-hidden">
        <h3 className="mb-3 font-medium">Animated Gradient Background</h3>
        <div className="relative h-40 overflow-hidden rounded-md">
          <AnimatedGradientBackground Breathing startingGap={110} />
        </div>
      </div>
    </div>
  </section>
);

export const FormSection: React.FC = () => (
  <section className="mb-12">
    <h2 className="mb-4 text-2xl font-semibold">Form Inputs</h2>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div className="card">
        <h3 className="mb-3 font-medium">Input Field States</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {inputStates.map((state, index) => {
            const inputId = `ds-input-${index}`;
            const attributes = { placeholder: "Placeholder", ...(state.attributes ?? {}) };
            return (
              <div key={inputId} className="relative">
                <FieldLabel htmlFor={inputId}>{state.label}</FieldLabel>
                <input
                  id={inputId}
                  className={state.className}
                  {...attributes}
                />
                {state.renderChildren}
                {state.helper ? (
                  <div className={`${helperClasses} ${state.helperClass ?? "text-muted-foreground"}`}>
                    {state.helper}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <h3 className="mb-3 font-medium">Checkboxes & Radios</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {checkboxStates.map((checkbox) => (
            <div key={checkbox.id}>
              <div className={`flex items-center gap-2 ${checkbox.className ?? ""}`}>
                <input
                  id={checkbox.id}
                  type="checkbox"
                  className={`size-4 ${checkbox.helper ? "border-rose-400" : ""}`}
                  defaultChecked={checkbox.defaultChecked}
                  disabled={checkbox.disabled}
                />
                <label htmlFor={checkbox.id} className="text-sm">
                  {checkbox.label}
                </label>
              </div>
              {checkbox.helper ? (
                <div className={`${helperClasses} ${checkbox.helperClass ?? "text-muted-foreground"}`}>
                  {checkbox.helper}
                </div>
              ) : null}
            </div>
          ))}
          {radioStates.map((radio) => (
            <div key={radio.id}>
              <div className={`flex items-center gap-2 ${radio.className ?? ""}`}>
                <input
                  id={radio.id}
                  name={radio.name}
                  type="radio"
                  className={`size-4 ${radio.helper ? "border-rose-400" : ""}`}
                  defaultChecked={radio.defaultChecked}
                  disabled={radio.disabled}
                />
                <label htmlFor={radio.id} className="text-sm">
                  {radio.label}
                </label>
              </div>
              {radio.helper ? (
                <div className={`${helperClasses} ${radio.helperClass ?? "text-muted-foreground"}`}>
                  {radio.helper}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="mb-3 font-medium">Selects & Textarea</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {selectStates.map((select, index) => {
            const selectId = `ds-select-${index}`;
            return (
              <div key={selectId}>
                <FieldLabel htmlFor={selectId}>{select.label}</FieldLabel>
                <select id={selectId} className={select.className} {...select.attributes}>
                  {select.options.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
                {select.helper ? (
                  <div className={`${helperClasses} ${select.helperClass ?? "text-muted-foreground"}`}>
                    {select.helper}
                  </div>
                ) : null}
              </div>
            );
          })}
          <div className="sm:col-span-2">
            <FieldLabel htmlFor="ds-textarea">Textarea</FieldLabel>
            <textarea
              id="ds-textarea"
              className="ds-textarea h-24 w-full rounded-md border bg-background p-3"
              placeholder="Enter details..."
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);
