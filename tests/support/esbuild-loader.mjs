import { existsSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { transform } from 'esbuild';

const projectRoot = fileURLToPath(new URL('../..', import.meta.url));

const tsExtensions = new Set(['.ts', '.tsx']);
const jsonExtension = '.json';

const aliases = [
  {
    prefix: '@/',
    resolve: (specifier) => path.join(projectRoot, 'src', specifier.slice(2)),
  },
];

const extensionPriority = ['.ts', '.tsx', '.js', '.jsx', '.json'];

const resolveWithExtensions = (targetPath) => {
  if (existsSync(targetPath) && statSync(targetPath).isFile()) {
    return targetPath;
  }

  for (const ext of extensionPriority) {
    const candidate = `${targetPath}${ext}`;
    if (existsSync(candidate) && statSync(candidate).isFile()) {
      return candidate;
    }
  }

  for (const ext of extensionPriority) {
    const candidate = path.join(targetPath, `index${ext}`);
    if (existsSync(candidate) && statSync(candidate).isFile()) {
      return candidate;
    }
  }

  return targetPath;
};

export async function resolve(specifier, context, defaultResolve) {
  for (const alias of aliases) {
    if (specifier.startsWith(alias.prefix)) {
      const targetPath = resolveWithExtensions(alias.resolve(specifier));
      return {
        url: pathToFileURL(targetPath).href,
        shortCircuit: true,
      };
    }
  }

  if (specifier.startsWith('./') || specifier.startsWith('../')) {
    if (context.parentURL) {
      const parentPath = fileURLToPath(context.parentURL);
      const resolvedPath = path.resolve(path.dirname(parentPath), specifier);
      const targetPath = resolveWithExtensions(resolvedPath);
      if (targetPath !== resolvedPath) {
        return {
          url: pathToFileURL(targetPath).href,
          shortCircuit: true,
        };
      }
    }
  }

  return defaultResolve(specifier, context, defaultResolve);
}

export async function load(url, context, defaultLoad) {
  const parsed = new URL(url);
  if (parsed.protocol !== 'file:') {
    return defaultLoad(url, context, defaultLoad);
  }

  const filename = fileURLToPath(url);
  const ext = path.extname(filename);

  if (ext === jsonExtension) {
    const source = await readFile(filename, 'utf8');
    return {
      format: 'module',
      source: `export default ${source};`,
      shortCircuit: true,
    };
  }

  if (!tsExtensions.has(ext)) {
    return defaultLoad(url, context, defaultLoad);
  }

  const source = await readFile(filename, 'utf8');
  const { code } = await transform(source, {
    loader: ext === '.tsx' ? 'tsx' : 'ts',
    format: 'esm',
    sourcemap: 'inline',
    target: 'es2020',
  });

  return {
    format: 'module',
    source: code,
    shortCircuit: true,
  };
}
