/**
 * Contract + characterization tests for ProductContentSections.
 * Location/ownership: client/src/__tests__/unit/ProductContentSections.spec.tsx (web experience).
 * Single-file run: NODE_OPTIONS=--experimental-vm-modules npx jest --runInBand client/src/__tests__/unit/ProductContentSections.spec.tsx
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ProductContentSections from "@/components/ProductContentSections";

type ProductOverrides = Record<string, unknown>;

const baseProduct = {
  title: "AI Rename Variants",
  llm: {
    expertQuote: {
      quote: "Ship faster without duplicating work.",
      expertName: "Casey Jordan",
      expertTitle: "Design Lead",
      institution: "Atelio",
    },
  },
  details: [
    {
      title: "Smart Layers (AI Rename Variants)",
      description: "Instantly normalize variant names and hierarchy.",
      items: ["Auto-rename per token", "Normalize variants instantly"],
      buttonText: "Preview workflow",
      buttonLink: "/ai-rename",
      mediaComponent: "video",
      mediaUrl: "/preview.mp4",
      mediaAlt: "Workflow preview",
      pill: { label: "New", classes: "bg-white/5", dotClass: "bg-pink-500" },
    },
    {
      title: "Missing Media",
      items: ["Shows placeholder when media is absent"],
    },
  ],
  benefits: ["Collaborate faster", "Ship consistent UI"],
  testimonials: [
    { quote: "Dramatically reduced time to ship updates.", author: "Riley M.", role: "PM", company: "Lumen" },
  ],
  sections: {
    useCases: { columns: 3 },
    testimonials: { columns: 2 },
  },
  visibility: {
    expertQuote: true,
    features: true,
    benefits: true,
    specifications: false,
    faqs: true,
    testimonials: true,
  },
};

const defaultFaqs = [{ question: "How do I install?", answer: "Use the BiblioKit Figma plugin." }];

const createProduct = (overrides: ProductOverrides = {}) => ({
  ...baseProduct,
  ...overrides,
  llm: { ...baseProduct.llm, ...(overrides as any).llm },
  visibility: { ...baseProduct.visibility, ...(overrides as any).visibility },
  sections: { ...baseProduct.sections, ...(overrides as any).sections },
});

const renderSections = (productOverrides: ProductOverrides = {}, props: Record<string, unknown> = {}) =>
  render(
    <ProductContentSections
      product={createProduct(productOverrides) as any}
      faqs={defaultFaqs}
      {...props}
    />
  );

test("features expose stable anchors and maintain keyboard focus to the CTA", async () => {
  const user = userEvent.setup();
  renderSections({
    details: [
      {
        title: "Smart Layers (AI Rename Variants)",
        description: "Instantly normalize variant names and hierarchy.",
        items: ["Auto-rename per token", "Normalize variants instantly"],
        buttonText: "Preview workflow",
        buttonLink: "/ai-rename",
        mediaComponent: "image",
        mediaUrl: "/feature.png",
      },
    ],
  });

  const heading = screen.getByRole("heading", { name: "Smart Layers" });
  const article = heading.closest("article");
  expect(article?.id).toBe("feature-card-smart-layers-ai-rename-variants-0");

  const cta = screen.getByRole("link", { name: "Preview workflow" });
  await user.tab();
  expect(cta).toHaveFocus();
});

test.each([
  { columns: "6", expectedClass: "md:grid-cols-4" },
  { columns: "not-a-number", expectedClass: "md:grid-cols-2" },
])("sanitizes use case columns (%s) into bounded grid classes", ({ columns, expectedClass }) => {
  renderSections({ sections: { useCases: { columns } } });

  const heading = screen.getByRole("heading", { name: /Use Cases/i });
  const benefitsSection = heading.closest("section");
  const grid = benefitsSection?.querySelector(".grid");

  expect(grid?.className).toContain(expectedClass);
});

test("renders media according to config while preserving fallback placeholders", () => {
  renderSections();

  const video = screen.getByLabelText("Workflow preview");
  expect(video.tagName).toBe("VIDEO");

  const fallbackArticle = screen.getByRole("heading", { name: "Missing Media" }).closest("article");
  const placeholder = fallbackArticle?.querySelector("[aria-hidden=\"true\"]");

  expect(placeholder).toBeTruthy();
});

test("respects sectionsOrder contract and visibility guards across blocks", () => {
  const { container } = renderSections({
    sectionsOrder: ["faqs", "expertQuote", "features", "testimonials"],
    visibility: { benefits: false },
  });

  const sections = Array.from(container.querySelectorAll("section.landing-sections-gradient"));
  const labels = sections.map((section) => {
    const headingText = (section.querySelector("h2")?.textContent || "").trim();
    if (headingText.startsWith("Frequently Asked Questions")) return "faqs";
    if (headingText.includes("Trusted by designers")) return "features";
    if (headingText.includes("What customers say")) return "testimonials";
    return "expertQuote";
  });

  expect(labels).toEqual(["expertQuote", "features", "testimonials", "faqs"]);
  expect(labels).not.toContain("benefits");
});
