import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { resolveRoute } from "./resolveRoute.mjs";

function makeTree(layout) {
  const root = mkdtempSync(join(tmpdir(), "next-"));
  for (const file of layout) {
    const full = join(root, file);
    mkdirSync(join(full, ".."), { recursive: true });
    writeFileSync(full, "// stub");
  }
  return root;
}

const cfg = { baseUrl: "https://example.com", routeRoot: "src/app" };

test("resolves the root URL to src/app/page.tsx", () => {
  const root = makeTree(["src/app/page.tsx"]);
  try {
    assert.equal(
      resolveRoute("https://example.com/", { ...cfg, repoPath: root }),
      "src/app/page.tsx"
    );
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("resolves a nested static route", () => {
  const root = makeTree(["src/app/about/team/page.tsx"]);
  try {
    assert.equal(
      resolveRoute("https://example.com/about/team", { ...cfg, repoPath: root }),
      "src/app/about/team/page.tsx"
    );
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("resolves a dynamic segment route", () => {
  const root = makeTree(["src/app/products/[id]/page.tsx"]);
  try {
    assert.equal(
      resolveRoute("https://example.com/products/widget-42", { ...cfg, repoPath: root }),
      "src/app/products/[id]/page.tsx"
    );
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("resolves through a route group (parens directory)", () => {
  const root = makeTree(["src/app/(marketing)/pricing/page.tsx"]);
  try {
    assert.equal(
      resolveRoute("https://example.com/pricing", { ...cfg, repoPath: root }),
      "src/app/(marketing)/pricing/page.tsx"
    );
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("strips query and hash before resolution", () => {
  const root = makeTree(["src/app/page.tsx"]);
  try {
    assert.equal(
      resolveRoute("https://example.com/?utm=x#frag", { ...cfg, repoPath: root }),
      "src/app/page.tsx"
    );
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("returns null when no page.tsx matches", () => {
  const root = makeTree(["src/app/page.tsx"]);
  try {
    assert.equal(
      resolveRoute("https://example.com/nonexistent", { ...cfg, repoPath: root }),
      null
    );
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("throws when URL does not match baseUrl", () => {
  const root = makeTree(["src/app/page.tsx"]);
  try {
    assert.throws(
      () => resolveRoute("https://other.com/", { ...cfg, repoPath: root }),
      /baseUrl/
    );
  } finally { rmSync(root, { recursive: true, force: true }); }
});
