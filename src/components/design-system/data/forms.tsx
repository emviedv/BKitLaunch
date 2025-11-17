import type { ReactNode } from "react";

export type InputState = {
  label: string;
  className: string;
  helper?: string;
  helperClass?: string;
  attributes?: Record<string, unknown>;
  renderChildren?: ReactNode;
};

export const inputStates: InputState[] = [
  {
    label: "Default",
    className: "ds-input h-9 w-full rounded-md border bg-background px-3",
    attributes: { placeholder: "Placeholder" },
  },
  {
    label: "Focused",
    className:
      "ds-input h-9 w-full rounded-md border border-[#6580E1] bg-background px-3 ring-2 ring-[#6580E1]/60",
    helper: "Ring + primary border",
    attributes: { placeholder: "Focused state" },
  },
  {
    label: "Success",
    className:
      "ds-input h-9 w-full rounded-md border border-green-400 bg-background px-3 focus:outline-none",
    helper: "Saved",
    helperClass: "text-green-600",
    attributes: { placeholder: "Looks good" },
  },
  {
    label: "Error",
    className:
      "ds-input h-9 w-full rounded-md border border-rose-400 bg-background px-3 focus:outline-none",
    helper: "Please enter a valid email",
    helperClass: "text-rose-600",
    attributes: { placeholder: "Email" },
  },
  {
    label: "Disabled",
    className: "ds-input h-9 w-full rounded-md border bg-background px-3",
    attributes: { placeholder: "Disabled", disabled: true },
  },
  {
    label: "With Icon",
    className: "ds-input h-9 w-full rounded-md border bg-background pl-3 pr-9",
    attributes: { type: "password", value: "hunter2", readOnly: true },
    renderChildren: (
      <button
        type="button"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
        aria-label="Toggle password"
      >
        👁️
      </button>
    ),
  },
] as const;

export type ChoiceInput = {
  label: string;
  id: string;
  name?: string;
  className?: string;
  helper?: string;
  helperClass?: string;
  disabled?: boolean;
  defaultChecked?: boolean;
};

export const checkboxStates: ChoiceInput[] = [
  { label: "Default", id: "chk-default" },
  {
    label: "Checked (Focus)",
    id: "chk-checked",
    className: "rounded px-1 ring-2 ring-[#6580E1]/60",
    defaultChecked: true,
  },
  {
    label: "Error",
    id: "chk-error",
    helper: "Selection required",
    helperClass: "text-rose-600",
  },
  { label: "Disabled", id: "chk-disabled", disabled: true, className: "opacity-60" },
] as const;

export const radioStates: ChoiceInput[] = [
  { label: "Default", id: "rad-default", name: "rad-demo" },
  {
    label: "Selected (Focus)",
    id: "rad-checked",
    name: "rad-demo",
    className: "rounded px-1 ring-2 ring-[#6580E1]/60",
    defaultChecked: true,
  },
  {
    label: "Error",
    id: "rad-error",
    name: "rad-error",
    helper: "Pick one",
    helperClass: "text-rose-600",
  },
  { label: "Disabled", id: "rad-disabled", name: "rad-disabled", disabled: true, className: "opacity-60" },
] as const;

export type SelectState = {
  label: string;
  className: string;
  attributes?: Record<string, unknown>;
  helper?: string;
  helperClass?: string;
  options: string[];
};

export const selectStates: SelectState[] = [
  {
    label: "Default",
    className: "ds-select h-9 w-full rounded-md border bg-background px-3",
    options: ["Choose an option", "One", "Two"],
  },
  {
    label: "Focused",
    className: "ds-select h-9 w-full rounded-md border border-[#6580E1] bg-background px-3 ring-2 ring-[#6580E1]/60",
    options: ["Focused state"],
    helper: "Ring + primary border",
  },
  {
    label: "Error",
    className: "ds-select h-9 w-full rounded-md border border-rose-400 bg-background px-3",
    options: ["Pick one"],
    helper: "Selection required",
    helperClass: "text-rose-600",
  },
  {
    label: "Disabled",
    className: "ds-select h-9 w-full rounded-md border bg-background px-3",
    options: ["Disabled"],
    attributes: { disabled: true },
  },
] as const;
