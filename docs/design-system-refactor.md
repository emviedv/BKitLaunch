# Design System Refactor – October 2025

## Overview
This refactor extracted the monolithic `DesignSystem.tsx` into modular sections backed by re-usable datasets. The UI render order, component props, and visual output remain unchanged.

## New Structure
- `src/components/design-system/ColorSection.tsx` – tokens for brand, neutral, and gradient swatches.
- `src/components/design-system/FormSection.tsx` – radius showcase and form-control states.
- `src/components/design-system/SnapshotsSection.tsx` – static snapshot cards.
- `src/components/design-system/ModalSection.tsx` – modal gallery rendering card previews.
- `src/components/design-system/TypographySection.tsx` – typographic scale sample.
- `src/components/design-system/data/` – `colors.ts`, `forms.tsx`, and `modals.tsx` provide typed datasets consumed by the sections.

## Tests
Characterization tests and modal contract tests ensure the previous behaviour remains stable:
```
node --test src/__tests__/ui/design-system.characterization.test.mjs
node --test tests/contract/design-system/modalShowcases.contract.test.mjs
```

## Notes
- `src/components/DesignSystem.tsx` now composes the page from section components and re-exports `modalShowcases`/`modalGroups` for existing dependents.
- `ModalSection` still exposes the copy-path behaviour; clipboard usage remains guarded against SSR.
- `src/__tests__/ui/helpers/load-design-system-harness.mjs` stubs non-React dependencies (framer-motion, lucide-react, etc.) so Node test runs don’t require browser APIs.
