# BiblioKit Design System

This document defines the shared language for UI across BiblioKit: design tokens, component rules, accessibility guidance, and markup patterns. It complements the in‑app previews at `/design-system` (component gallery) and `/design-system-demo` (foundations + gallery) in development.

## Scope and Principles
- System-first: components are composed from tokens, not ad-hoc values.
- Accessible by default: keyboard, contrast, semantics, and motion preferences.
- Theming via CSS variables: light and dark share semantic tokens.
- Progressive enhancement: graceful HTML fallbacks, minimal JS.

## Design Tokens
Tokens are exposed as CSS variables and mapped in Tailwind (see `src/index.css` and `tailwind.config.js`). All color tokens use HSL for easy theming.

- Surface
  - `--background`, `--foreground`
  - `--card`, `--card-foreground`
  - `--popover`, `--popover-foreground`
  - `--muted`, `--muted-foreground`
  - `--border`, `--input`
- Brand + Semantics
  - `--primary`, `--primary-foreground`
  - `--secondary`, `--secondary-foreground`
  - `--accent`, `--accent-foreground`
  - `--destructive`, `--destructive-foreground`
  - `--success`, `--success-foreground`
- System
  - `--ring` focus color
  - `--radius` corner radius (component corners derive from this)
  - Charts: `--chart-1` … `--chart-5` (for data viz palettes)

Light theme values (excerpt):
```
:root {
  --background: 0 0% 99%;
  --foreground: 215 22% 35%;
  --muted: 0 0% 96%;
  --muted-foreground: 215 19% 47%;
  --card: 0 0% 98%;
  --card-foreground: 215 22% 35%;
  --border: 214 32% 89%;
  --input: 214 32% 89%;
  --primary: 330 81% 60%;
  --primary-foreground: 0 0% 100%;
  --ring: 330 81% 60%;
  --radius: 0.5rem;
}
```

Dark theme values (excerpt):
```
[data-theme="dark"] {
  --background: 262 20% 11%;
  --foreground: 0 0% 98%;
  --muted: 262 15% 17%;
  --muted-foreground: 268 9% 65%;
  --card: 262 20% 13%;
  --card-foreground: 0 0% 98%;
  --border: 268 14% 24%;
  --input: 268 14% 24%;
  --primary: 330 70% 70%;
  --primary-foreground: 0 0% 100%;
  --ring: 330 70% 70%;
  --radius: 0.5rem;
}
```

### Typography
- Font family: system UI stack for performance and neutrality
- Scale: 12, 14, 16, 18, 20, 24, 30, 36
- Line-height: 1.4–1.6 for paragraphs, 1.1–1.3 for headings
- Code: `font-mono` for inline and code blocks

### Spacing and Layout
- Base unit: 4px
- Common sizes: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64`
- Container widths: `640, 768, 1024, 1280, 1440`
- Grid: 12‑column flexible grid; cards use consistent gutters

### Radius and Shadows
- Radius: `--radius` (defaults to 8px/0.5rem); small/medium/large derive by subtraction
- Shadows: subtle elevation only where interaction needs it; prefer borders for separation

### Motion
- Durations: fast 120ms, standard 200ms, gentle 300ms
- Easing: `cubic-bezier(0.2, 0.0, 0, 1)` for UI transitions
- Respect `prefers-reduced-motion`

### Accessibility
- Color contrast: AA or better for text; test primary buttons in both themes
- Focus: visible focus using `--ring` and offset; use `:focus-visible`
- States: hover, focus, active, disabled are distinct and perceivable
- Semantics: native elements first; ARIA only to enhance
- Hit areas: minimum 40x40px interactive targets

## Components
Each component is defined by: purpose, anatomy, states, and markup. Below are HTML patterns that align with our tokens. The demo page showcases these with live examples.

### Buttons
- Variants: primary, secondary, ghost, destructive, link
- Sizes: sm (32), md (40), lg (48)
- Markup:
```
<button class="btn">Primary</button>
<button class="btn btn--secondary">Secondary</button>
<button class="btn btn--ghost">Ghost</button>
<button class="btn btn--destructive">Delete</button>
<a class="btn btn--link" href="#">Text Link</a>
```

Rules:
- Minimum touch size 40px height; horizontal padding scales with size
- Disabled uses `aria-disabled="true"` or `disabled` and reduced opacity
- Focus ring uses `--ring` with 2px outline + 2px offset

### Form Fields
- Inputs, textareas, selects use the same border, radius, and focus tokens
- Helpers and errors use `aria-describedby` with `id` targets
- Markup:
```
<label class="field">
  <span class="field__label">Email</span>
  <input class="input" type="email" placeholder="you@company.com" />
 </label>
```

### Selection Controls
- Checkbox: input+label with 24px minimum target
- Radio: grouped by `name` and wrapped in `fieldset/legend`
- Switch: button with `role="switch"` and `aria-checked`

### Card
- Light border + soft surface; use for groupings of related content
- Markup:
```
<article class="card">
  <h3 class="card__title">Card title</h3>
  <p class="card__body">Supporting copy.</p>
  <div class="card__actions">
    <button class="btn btn--secondary">Action</button>
  </div>
</article>
```

### Navigation
- Top nav uses a container with primary/secondary actions; responsive collapse is optional

### Tabs
- `role="tablist"` and `aria-controls` for panels; keyboard arrow navigation supported if JS is added

### Accordion
- Use `<details>/<summary>` for built‑in semantics and keyboard support

### Alerts and Badges
- Non‑blocking messages with clear affordances; colors derived from semantic tokens

### Modal / Dialog
- Prefer native `<dialog>` when available; otherwise, role="dialog" with labeled title and close button; trap focus when JS is used

### Tables and Data
- Use `thead/tbody` with scope on headers; zebra rows optional in large tables

## Theming
- Apply `[data-theme="dark"]` on `html` or a wrapper to switch semantic tokens
- Components inherit colors from tokens with no per‑component overrides

## Naming and Structure
- CSS classes are BEM‑ish utility hybrids: `btn`, `btn--secondary`, `card__title`
- Utilities: `.visually-hidden`, layout helpers, and spacing primitives

## Linting and Testing
- Visual tests: verify components in both themes
- Accessibility: run axe checks on key screens

## References
- Tokens live in `src/index.css`
- Tailwind mapping in `tailwind.config.js`
- Demo: in‑app at `/design-system-demo` (development only by default)
