import React from "react";

import { ColorSection } from "@/components/design-system/ColorSection";
import { FormSection, RadiusSection } from "@/components/design-system/FormSection";
import { ModalSection } from "@/components/design-system/ModalSection";
import { SnapshotsSection } from "@/components/design-system/SnapshotsSection";
import { TypographySection } from "@/components/design-system/TypographySection";

export { modalGroups, modalShowcases, type ModalShowcase } from "@/components/design-system/data/modals";

export default function DesignSystem() {
  return (
    <div className="bk-ds container mx-auto py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Design System</h1>
        <p className="text-muted-foreground">
          BiblioKit UI tokens and components (blue-forward palette).
        </p>
      </div>

      <ColorSection />

      <RadiusSection />

      <FormSection />

      <SnapshotsSection />

      <ModalSection />

      <TypographySection />
    </div>
  );
}
