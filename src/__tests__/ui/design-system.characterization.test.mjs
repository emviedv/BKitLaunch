import assert from "node:assert/strict";
import { test } from "node:test";

import {
  loadDesignSystemHarness as loadHarness,
  REACT_ELEMENT_TYPE,
} from "./helpers/load-design-system-harness.mjs";
const SAFE_COMPONENT_NAMES = new Set([
  "ColorSection",
  "RadiusSection",
  "FormSection",
  "SnapshotsSection",
  "ModalSection",
  "TypographySection",
  "ModalShowcaseCard",
  "ModalPreviewFrame",
  "Swatch",
  "TextSwatch",
  "BorderSwatch",
  "GradientCard",
]);

const isReactElement = (value) =>
  typeof value === "object" && value !== null && value.$$typeof === REACT_ELEMENT_TYPE;

const getDisplayName = (element) => {
  if (typeof element.type === "string") {
    return element.type;
  }
  if (typeof element.type === "function") {
    return element.type.displayName || element.type.name || "";
  }
  return "";
};

const walkTree = (node, handlers) => {
  if (node == null || typeof node === "boolean") {
    return;
  }

  if (Array.isArray(node)) {
    node.forEach((child) => walkTree(child, handlers));
    return;
  }

  if (typeof node === "string" || typeof node === "number") {
    handlers.onText?.(String(node));
    return;
  }

  if (isReactElement(node)) {
    const displayName = getDisplayName(node);
    if (typeof node.type === "function" && SAFE_COMPONENT_NAMES.has(displayName)) {
      walkTree(node.type(node.props), handlers);
      return;
    }

    handlers.onElement?.(node, displayName);
    if (node.props && "children" in node.props) {
      walkTree(node.props.children, handlers);
    }
    return;
  }
};

const collectText = (node) => {
  const textValues = [];
  walkTree(node, {
    onText: (text) => {
      const value = text.trim();
      if (value) {
        textValues.push(value);
      }
    },
  });
  return textValues;
};

const isButtonLike = (element, displayName) => {
  if (typeof element.type === "string") {
    return element.type === "button";
  }
  return displayName === "Button";
};

const BUTTON_LABEL_FALLBACKS = new Set([
  "Cancel",
  "Close",
  "Not now",
  "Done",
  "Keep open",
  "Send reminder",
  "Hide",
  "Publish",
  "Apply decisions",
  "Remind me later",
  "Cancel upload",
  "Discard changes",
]);

const OPTIONAL_EXIT_IDS = new Set(["command-search-dialog"]);

test("modal showcases expose copyable paths", async () => {
  const { createDesignSystemTree, getModalShowcases } = await loadHarness();
  const tree = createDesignSystemTree();
  const modals = getModalShowcases();

  const readOnlyPaths = new Set();
  let copyPathButtonCount = 0;

  walkTree(tree, {
    onElement: (element, displayName) => {
      if (displayName === "Input") {
        const { readOnly, value } = element.props ?? {};
        if (readOnly && typeof value === "string" && value.startsWith("src/components/modals/")) {
          readOnlyPaths.add(value);
        }
      }

      if (isButtonLike(element, displayName)) {
        const label = collectText(element.props?.children).join(" ");
        if (label === "Copy path") {
          copyPathButtonCount += 1;
        }
      }
    },
  });

  assert.equal(modals.length, 19, "modal dataset should list 19 showcases");
  assert.equal(readOnlyPaths.size, modals.length, "expected one read-only path per modal card");
  assert.equal(copyPathButtonCount, modals.length, "expected copy button for every modal card");
});

test("a11y affordances stay visible for modal controls", async () => {
  const { getModalShowcases } = await loadHarness();
  const modals = getModalShowcases();

  let ariaCloseCount = 0;

  modals.forEach((modal) => {
    const buttonLabels = new Set();
    let focusableCount = 0;

    walkTree(modal.render(), {
      onElement: (element, displayName) => {
        if (typeof element.type === "string" && element.type === "button" && element.props?.["aria-label"] === "Close") {
          ariaCloseCount += 1;
        }

        if (isButtonLike(element, displayName)) {
          const ariaLabel = typeof element.props?.["aria-label"] === "string" ? element.props["aria-label"] : undefined;
          const label = ariaLabel || collectText(element.props?.children).join(" ");
          if (label) {
            buttonLabels.add(label);
          }
          focusableCount += 1;
        }

        if (
          displayName === "Input" ||
          typeof element.type === "string" && ["input", "textarea", "select"].includes(element.type)
        ) {
          focusableCount += 1;
        }
      },
    });

    assert.ok(focusableCount > 0, `modal ${modal.id} should expose focusable controls`);
    const hasExitLabel = [...buttonLabels].some((value) => BUTTON_LABEL_FALLBACKS.has(value));
    if (!OPTIONAL_EXIT_IDS.has(modal.id)) {
      assert.ok(hasExitLabel, `modal ${modal.id} should keep an explicit exit button`);
    }
  });

  assert.ok(ariaCloseCount >= 1, "expected at least one close icon with aria-label");
});

test("core palette tokens remain available", async () => {
  const { createDesignSystemTree } = await loadHarness();
  const tree = createDesignSystemTree();
  const tokens = new Set();

  walkTree(tree, {
    onText: (text) => {
      const trimmed = text.trim();
      if (trimmed) {
        tokens.add(trimmed);
      }
    },
  });

  [
    "pink-500",
    "blue-500",
    "green-500",
    "gradient-rosewater-soft-radial",
    "gradient-aurora-soft-radial",
    "gradient-meadow-soft-radial",
  ].forEach((token) => {
    assert.ok(tokens.has(token), `expected palette token ${token} to render`);
  });
});

test("upload progress indicators preserve inline width styling", async () => {
  const { getModalShowcases } = await loadHarness();
  const uploadModal = getModalShowcases().find((modal) => modal.id === "upload-progress-centered-modal");
  assert.ok(uploadModal, "upload progress modal must remain registered");

  const widths = new Set();
  walkTree(uploadModal.render(), {
    onElement: (element) => {
      const width = element.props?.style?.width;
      if (typeof width === "string") {
        widths.add(width);
      }
    },
  });

  ["72%", "41%", "18%"].forEach((width) => {
    assert.ok(widths.has(width), `expected static progress width ${width}`);
  });
});
