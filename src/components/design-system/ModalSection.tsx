import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { modalGroups, modalShowcases, type ModalShowcase } from "./data/modals";

const copyPath = (value: string) => {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    navigator.clipboard.writeText(value).catch(() => {
      // clipboard unavailable (ignored for static preview)
    });
  }
};

const ModalPreviewFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative">
    <div className="pointer-events-none">
      <div className="absolute inset-0 rounded-xl bg-background/70 backdrop-blur-sm" />
      <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-xl border bg-card shadow-xl">
        {children}
      </div>
    </div>
  </div>
);

const ModalShowcaseCard: React.FC<
  Pick<ModalShowcase, "title" | "description" | "path"> & {
    children: React.ReactNode;
  }
> = ({ title, description, path, children }) => (
  <div className="card space-y-3 p-4">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div className="space-y-1">
        <h3 className="font-medium leading-tight">{title}</h3>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      <div className="flex w-full flex-col gap-1 sm:w-48">
        <Input value={path} readOnly className="h-8 cursor-text select-text text-xs" />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="justify-center"
          onClick={() => copyPath(path)}
        >
          Copy path
        </Button>
      </div>
    </div>
    <ModalPreviewFrame>{children}</ModalPreviewFrame>
  </div>
);

export const ModalSection: React.FC = () => (
  <section className="mb-12">
    <h2 className="mb-4 text-2xl font-semibold">Modals</h2>
    <p className="mb-6 text-sm text-muted-foreground">
      Production dialogs grouped by workflow so admins can verify copy, spacing, and theming on
      demand.
    </p>
    <div className="space-y-8">
      {modalGroups.map((group) => {
        const items = modalShowcases.filter((modal) => modal.group === group);
        if (items.length === 0) return null;
        return (
          <div key={group} className="space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {group}
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {items.map((item) => (
                <ModalShowcaseCard
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  path={item.path}
                >
                  {item.render()}
                </ModalShowcaseCard>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  </section>
);

export { modalGroups, modalShowcases };

