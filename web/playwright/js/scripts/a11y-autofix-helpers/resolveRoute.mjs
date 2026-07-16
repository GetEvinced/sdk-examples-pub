import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

export function resolveRoute(url, { baseUrl, routeRoot, repoPath }) {
  let target, base;
  try {
    target = new URL(url);
    base = new URL(baseUrl);
  } catch {
    throw new Error(`resolveRoute: invalid URL "${url}" or baseUrl "${baseUrl}"`);
  }
  if (target.origin !== base.origin) {
    throw new Error(`resolveRoute: URL "${url}" does not match baseUrl "${baseUrl}"`);
  }
  const basePathTrimmed = base.pathname.replace(/\/$/, "");
  const targetPathTrimmed = target.pathname.replace(/\/$/, "");
  if (basePathTrimmed && !targetPathTrimmed.startsWith(basePathTrimmed + "/") && targetPathTrimmed !== basePathTrimmed) {
    throw new Error(`resolveRoute: URL "${url}" does not match baseUrl path "${base.pathname}"`);
  }
  const relPath = targetPathTrimmed.slice(basePathTrimmed.length).replace(/^\//, "");
  const segments = relPath === "" ? [] : relPath.split("/");

  const rootAbs = join(repoPath, routeRoot);
  if (!existsSync(rootAbs)) return null;

  const match = walk(rootAbs, segments);
  if (!match) return null;
  return [routeRoot, ...match, "page.tsx"].join("/");
}

function walk(currentDir, remaining) {
  if (remaining.length === 0) {
    return existsSync(join(currentDir, "page.tsx")) ? [] : null;
  }
  const [head, ...tail] = remaining;
  const entries = readdirSync(currentDir).filter(name =>
    statSync(join(currentDir, name)).isDirectory()
  );
  if (entries.includes(head)) {
    const result = walk(join(currentDir, head), tail);
    if (result) return [head, ...result];
  }
  for (const entry of entries) {
    if (entry.startsWith("(") && entry.endsWith(")")) {
      const result = walk(join(currentDir, entry), remaining);
      if (result) return [entry, ...result];
    }
  }
  for (const entry of entries) {
    if (entry.startsWith("[") && entry.endsWith("]")) {
      const result = walk(join(currentDir, entry), tail);
      if (result) return [entry, ...result];
    }
  }
  return null;
}
