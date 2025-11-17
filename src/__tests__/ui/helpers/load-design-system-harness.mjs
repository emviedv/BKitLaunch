import { build } from "esbuild";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const baseRequire = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../../../..");

export const REACT_ELEMENT_TYPE = Symbol.for("react.element");

const resolveWithExtensions = (relativePath) => {
  const candidates = ["", ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"];
  for (const ext of candidates) {
    const candidate = path.resolve(projectRoot, "src", relativePath + ext);
    if (fs.existsSync(candidate)) return candidate;
  }
  return path.resolve(projectRoot, "src", relativePath);
};

const aliasPlugin = {
  name: "alias-at-prefix",
  setup(buildInstance) {
    buildInstance.onResolve({ filter: /^@\// }, (args) => ({
      path: resolveWithExtensions(args.path.slice(2)),
    }));
  },
};

const createMockRequire = () => {
  const createElement = (type, props, ...children) => {
    const normalizedProps = { ...(props ?? {}) };
    if (children.length === 1) {
      normalizedProps.children = children[0];
    } else if (children.length > 1) {
      normalizedProps.children = children;
    }

    return {
      $$typeof: REACT_ELEMENT_TYPE,
      type,
      props: normalizedProps,
    };
  };

  const Fragment = Symbol.for("react.fragment");

  const forwardRef = (render) => {
    const component = (props) => render(props, null);
    component.displayName = render.name || "ForwardRef";
    return component;
  };

  const motionProxy = new Proxy(
    {},
    {
      get: (_target, key) => (props = {}) => ({
        $$typeof: REACT_ELEMENT_TYPE,
        type: typeof key === "string" ? key : "div",
        props,
      }),
    },
  );

  const iconComponent = (props = {}) => ({
    $$typeof: REACT_ELEMENT_TYPE,
    type: "svg",
    props,
  });

  const slotComponent = ({ children, ...rest } = {}) => {
    if (children && typeof children === "object" && children.$$typeof === REACT_ELEMENT_TYPE) {
      return {
        ...children,
        props: { ...children.props, ...rest },
      };
    }
    return children ?? null;
  };

  const cva = (...baseClasses) => {
    const base = baseClasses.filter(Boolean).join(" ");
    return (options = {}) => {
      const extra = options.className ? String(options.className) : "";
      return [base, extra].filter(Boolean).join(" ");
    };
  };

  const clsx = (...values) => values.filter(Boolean).join(" ");
  const twMerge = (...values) => values.filter(Boolean).join(" ");

  const stubMap = new Map([
    [
      "react",
      {
        createElement,
        Fragment,
        forwardRef,
        useRef: (initial = null) => ({ current: initial }),
        useEffect: () => {},
        useMemo: (factory) => factory(),
        useCallback: (fn) => fn,
      },
    ],
    [
      "react/jsx-runtime",
      {
        Fragment,
        jsx: (type, props, key) => {
          const { children, ...rest } = props ?? {};
          const element = createElement(type, rest, ...(children !== undefined ? [children] : []));
          if (key !== undefined) {
            element.key = key;
          }
          return element;
        },
        jsxs: (type, props, key) => {
          const { children, ...rest } = props ?? {};
          const childArgs = [];
          if (children !== undefined) {
            if (Array.isArray(children)) {
              childArgs.push(...children);
            } else {
              childArgs.push(children);
            }
          }
          const element = createElement(type, rest, ...childArgs);
          if (key !== undefined) {
            element.key = key;
          }
          return element;
        },
      },
    ],
    ["framer-motion", { motion: motionProxy, useAnimation: () => ({ start: () => Promise.resolve() }) }],
    [
      "lucide-react",
      new Proxy(
        { default: iconComponent },
        {
          get: (target, key) => target[key] ?? iconComponent,
        },
      ),
    ],
    ["@radix-ui/react-slot", { Slot: slotComponent }],
    ["class-variance-authority", { cva }],
    ["clsx", { clsx, default: clsx }],
    ["tailwind-merge", { twMerge, default: twMerge }],
    ["react-dom", {}],
    ["react-dom/server", {}],
  ]);

  return (specifier) => {
    if (stubMap.has(specifier)) {
      return stubMap.get(specifier);
    }
    return baseRequire(specifier);
  };
};

const loadHarnessInternal = async () => {
  const result = await build({
    absWorkingDir: projectRoot,
    bundle: true,
    format: "cjs",
    platform: "node",
    target: "es2020",
    entryPoints: [path.resolve(projectRoot, "src/__tests__/ui/helpers/design-system-harness.tsx")],
    sourcemap: false,
    write: false,
    loader: {
      ".ts": "ts",
      ".tsx": "tsx",
    },
    plugins: [aliasPlugin],
    external: [
      "react",
      "react-dom",
      "react-dom/server",
      "react/jsx-runtime",
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
      "framer-motion",
      "lucide-react",
    ],
  });

  const { text } = result.outputFiles[0];
  const module = { exports: {} };
  const mockRequire = createMockRequire();
  const fn = new Function("require", "module", "exports", text);
  fn(mockRequire, module, module.exports);
  return module.exports;
};

let cachedHarnessPromise;

export const loadDesignSystemHarness = async () => {
  if (!cachedHarnessPromise) {
    cachedHarnessPromise = loadHarnessInternal();
  }
  return cachedHarnessPromise;
};
