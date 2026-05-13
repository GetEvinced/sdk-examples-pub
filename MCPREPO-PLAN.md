# Cross-Repo A11y Auto-Fix Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a CI pipeline in `support-golden-examples` that scans `https://demo-fe-orpin.vercel.app/` with the Evinced Playwright SDK, then uses Claude (via `claude-code-action` + Evinced MCP) to open one PR per finding against `EvincedShane/demo-fe`.

**Architecture:** Separate `web-a11y-autofix.yml` workflow in this repo, triggered by `workflow_run` of `web-js.yml`. After the test artifact lands, the workflow downloads it, clones the target FE repo, writes a runtime `.mcp.json`, and invokes `anthropics/claude-code-action` with a structured prompt that loops over issues. Each issue → one branch named `a11y/fix-<issueSignature>` → one rolling PR. Verification fence is a tracking file at `a11y-findings/<sig>.md` in the target repo, gated by CODEOWNERS.

**Tech Stack:** GitHub Actions, Node.js 20 (`node --test` for helper unit tests), `anthropics/claude-code-action@beta`, Evinced JS Playwright SDK, Evinced web MCP (`@evinced/web-mcp`), `gh` CLI, Next.js 14+ (target repo, file-based App Router).

**Spec:** `MCPREPO.md` at repo root.

**Branch:** Plan executes on `design/mcp-repo-autofix-pipeline` (already created and contains the spec commit).

---

## File Structure

Files this plan creates or modifies:

**This repo (`support-golden-examples`):**
- Create: `a11y-autofix.config.json` — pipeline config (root)
- Create: `prompts/a11y-autofix.md` — agent prompt
- Create: `.github/workflows/web-a11y-autofix.yml` — new workflow
- Create: `web/playwright/js/scripts/a11y-autofix-helpers/aggregateIssues.mjs` — aggregator (per-issue files → single JSON)
- Create: `web/playwright/js/scripts/a11y-autofix-helpers/loadIssues.mjs` — schema-validated loader
- Create: `web/playwright/js/scripts/a11y-autofix-helpers/signatureToBranch.mjs` — pure mapping
- Create: `web/playwright/js/scripts/a11y-autofix-helpers/resolveRoute.mjs` — URL → Next.js route file
- Create: `web/playwright/js/scripts/a11y-autofix-helpers/aggregateIssues.test.mjs`
- Create: `web/playwright/js/scripts/a11y-autofix-helpers/loadIssues.test.mjs`
- Create: `web/playwright/js/scripts/a11y-autofix-helpers/signatureToBranch.test.mjs`
- Create: `web/playwright/js/scripts/a11y-autofix-helpers/resolveRoute.test.mjs`
- Create: `web/playwright/js/fixtures/a11y/sample-issues.json` — fixture used by tests and by dry-run mode
- Modify: `.github/workflows/web-js.yml` — add per-issue → single-file aggregation + new artifact upload
- Modify: `README.md` — add "MCP cross-repo auto-fix demo" section

**Target repo (`EvincedShane/demo-fe`) — coordinated, not authored by this plan:**
- Add: `.github/CODEOWNERS` line for `/a11y-findings/`
- Verify branch protection requires CODEOWNERS review on `main`

---

## Pre-flight: Tooling assumptions

Each task assumes:
- Repo root is `/Users/shane/Documents/support-golden-examples` unless otherwise noted.
- `node` ≥ 20 is available (matches `.github/workflows/web-js.yml:57`).
- `gh` CLI is installed and authenticated for any manual smoke testing tasks.
- Working branch is `design/mcp-repo-autofix-pipeline` (the spec commit branch).

---

### Task 1: Capture a real Evinced issues report to derive the fixture

**Why first:** The schema in `loadIssues.mjs` (Task 4) and the fixture file (every subsequent test) both depend on knowing the *actual* shape of an Evinced per-issue JSON. We've never read one inside this repo. This task is one-shot data collection so every later task has a real example to validate against.

**Files:**
- Generate: `web/playwright/js/evinced-reports/tmp/0_evincedIssues/*.json` (transient)
- Create: `web/playwright/js/fixtures/a11y/sample-issues.json`

- [ ] **Step 1: Install dependencies**

```bash
cd web/playwright/js
npm install
npx playwright install --with-deps chromium
```

- [ ] **Step 2: Run the spec to generate a real report**

The `evStartStop.spec.js` test targets `https://demo.evinced.com/`. We want a fresh local report under `evinced-reports/tmp/0_evincedIssues/`.

```bash
cd web/playwright/js
EVINCED_SERVICE_ID="<your-service-id>" EVINCED_API_KEY="<your-api-key>" \
  npx playwright test tests/evStartStop.spec.js
```

Expected: Test passes. Directory `evinced-reports/tmp/0_evincedIssues/` contains one or more `*.json` files.

- [ ] **Step 3: Aggregate per-issue files into one fixture array**

```bash
mkdir -p web/playwright/js/fixtures/a11y
node -e "
  const fs = require('fs');
  const path = require('path');
  const dir = 'web/playwright/js/evinced-reports/tmp/0_evincedIssues';
  const issues = fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
  fs.writeFileSync('web/playwright/js/fixtures/a11y/sample-issues.json', JSON.stringify(issues, null, 2));
  console.log('Wrote', issues.length, 'issues');
"
```

Expected: prints `Wrote N issues` (N ≥ 1). Inspect the file to confirm each entry has at minimum: `url`, `selector` (or `target`), `ruleId` (or `rule`), `severity`, `signature` (or equivalent stable identifier — record the exact field name; later tasks reference it as `issueSignature`).

- [ ] **Step 4: Record the actual schema field names**

If the field name for the stable identifier is NOT `issueSignature`, edit this plan's later tasks to replace `issueSignature` with the actual field name found in the JSON. Same for `url`, `selector`, `ruleId`. The spec's `MCPREPO.md` §5 "signature stability" paragraph will need the same update.

- [ ] **Step 5: Commit the fixture**

```bash
git add web/playwright/js/fixtures/a11y/sample-issues.json
git commit -m "Add sample Evinced issues fixture for autofix tests"
```

---

### Task 2: Create `signatureToBranch` helper (TDD)

**Files:**
- Create: `web/playwright/js/scripts/a11y-autofix-helpers/signatureToBranch.mjs`
- Test: `web/playwright/js/scripts/a11y-autofix-helpers/signatureToBranch.test.mjs`

- [ ] **Step 1: Create the helpers directory**

```bash
mkdir -p web/playwright/js/scripts/a11y-autofix-helpers
```

- [ ] **Step 2: Write the failing test**

Create `web/playwright/js/scripts/a11y-autofix-helpers/signatureToBranch.test.mjs`:

```javascript
import test from "node:test";
import assert from "node:assert/strict";
import { signatureToBranch } from "./signatureToBranch.mjs";

test("prepends the configured prefix", () => {
  assert.equal(signatureToBranch("abc123", "a11y/fix-"), "a11y/fix-abc123");
});

test("lowercases and slugifies non-git-safe chars in signature", () => {
  assert.equal(
    signatureToBranch("Rule/Color Contrast::Button[1]", "a11y/fix-"),
    "a11y/fix-rule-color-contrast-button-1"
  );
});

test("collapses repeated separators and trims trailing dashes", () => {
  assert.equal(signatureToBranch("a__b--c--", "a11y/fix-"), "a11y/fix-a-b-c");
});

test("throws on empty signature", () => {
  assert.throws(() => signatureToBranch("", "a11y/fix-"), /signature/);
});

test("throws on missing prefix", () => {
  assert.throws(() => signatureToBranch("abc", ""), /prefix/);
});
```

- [ ] **Step 3: Run the test, expect FAIL**

Run: `cd web/playwright/js && node --test scripts/a11y-autofix-helpers/signatureToBranch.test.mjs`
Expected: FAIL with `Cannot find module './signatureToBranch.mjs'`.

- [ ] **Step 4: Implement the helper**

Create `web/playwright/js/scripts/a11y-autofix-helpers/signatureToBranch.mjs`:

```javascript
export function signatureToBranch(signature, prefix) {
  if (!signature) throw new Error("signatureToBranch: signature is required");
  if (!prefix) throw new Error("signatureToBranch: prefix is required");
  const slug = String(signature)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${prefix}${slug}`;
}
```

- [ ] **Step 5: Run the test, expect PASS**

Run: `cd web/playwright/js && node --test scripts/a11y-autofix-helpers/signatureToBranch.test.mjs`
Expected: PASS for all five tests.

- [ ] **Step 6: Commit**

```bash
git add web/playwright/js/scripts/a11y-autofix-helpers/signatureToBranch.mjs \
        web/playwright/js/scripts/a11y-autofix-helpers/signatureToBranch.test.mjs
git commit -m "Add signatureToBranch helper for stable autofix branch naming"
```

---

### Task 3: Create `aggregateIssues` helper (TDD)

**Why this exists:** Task 1 established that the Evinced SDK writes one JSON file per issue under `evinced-reports/tmp/0_evincedIssues/`. The autofix needs a single array. This helper does the aggregation as a CI step so the test code stays untouched.

**Files:**
- Create: `web/playwright/js/scripts/a11y-autofix-helpers/aggregateIssues.mjs`
- Test: `web/playwright/js/scripts/a11y-autofix-helpers/aggregateIssues.test.mjs`

- [ ] **Step 1: Write the failing test**

Create `web/playwright/js/scripts/a11y-autofix-helpers/aggregateIssues.test.mjs`:

```javascript
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { aggregateIssues } from "./aggregateIssues.mjs";

test("aggregates per-issue JSON files into a single array", () => {
  const dir = mkdtempSync(join(tmpdir(), "agg-"));
  try {
    writeFileSync(join(dir, "issue-1.json"), JSON.stringify({ id: 1, url: "https://x/a" }));
    writeFileSync(join(dir, "issue-2.json"), JSON.stringify({ id: 2, url: "https://x/b" }));
    const result = aggregateIssues(dir);
    assert.equal(result.length, 2);
    assert.deepEqual(result.map(i => i.id).sort(), [1, 2]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("returns empty array when directory has no JSON files", () => {
  const dir = mkdtempSync(join(tmpdir(), "agg-"));
  try {
    assert.deepEqual(aggregateIssues(dir), []);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("ignores non-JSON files", () => {
  const dir = mkdtempSync(join(tmpdir(), "agg-"));
  try {
    writeFileSync(join(dir, "issue.json"), JSON.stringify({ id: 1 }));
    writeFileSync(join(dir, "notes.txt"), "hello");
    assert.equal(aggregateIssues(dir).length, 1);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("throws clearly when directory does not exist", () => {
  assert.throws(() => aggregateIssues("/nonexistent/path"), /not a directory/);
});
```

- [ ] **Step 2: Run the test, expect FAIL**

Run: `cd web/playwright/js && node --test scripts/a11y-autofix-helpers/aggregateIssues.test.mjs`
Expected: FAIL with `Cannot find module './aggregateIssues.mjs'`.

- [ ] **Step 3: Implement the helper**

Create `web/playwright/js/scripts/a11y-autofix-helpers/aggregateIssues.mjs`:

```javascript
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

export function aggregateIssues(dirPath) {
  let stat;
  try { stat = statSync(dirPath); } catch { throw new Error(`aggregateIssues: ${dirPath} is not a directory`); }
  if (!stat.isDirectory()) throw new Error(`aggregateIssues: ${dirPath} is not a directory`);
  return readdirSync(dirPath)
    .filter(name => name.toLowerCase().endsWith(".json"))
    .map(name => JSON.parse(readFileSync(join(dirPath, name), "utf8")));
}
```

- [ ] **Step 4: Run the test, expect PASS**

Run: `cd web/playwright/js && node --test scripts/a11y-autofix-helpers/aggregateIssues.test.mjs`
Expected: PASS for all four tests.

- [ ] **Step 5: Commit**

```bash
git add web/playwright/js/scripts/a11y-autofix-helpers/aggregateIssues.mjs \
        web/playwright/js/scripts/a11y-autofix-helpers/aggregateIssues.test.mjs
git commit -m "Add aggregateIssues helper for per-issue file consolidation"
```

---

### Task 4: Create `loadIssues` helper (TDD)

**Why:** Validates that the issues JSON has the fields downstream code depends on. Catches Evinced SDK schema drift before it confuses the agent.

**Files:**
- Create: `web/playwright/js/scripts/a11y-autofix-helpers/loadIssues.mjs`
- Test: `web/playwright/js/scripts/a11y-autofix-helpers/loadIssues.test.mjs`

**Note:** Field names below assume the schema you recorded in Task 1 Step 4. If your real fixture uses different names (e.g., `target` instead of `selector`, `rule` instead of `ruleId`, `id` instead of `signature`), replace them throughout this task.

- [ ] **Step 1: Write the failing test**

Create `web/playwright/js/scripts/a11y-autofix-helpers/loadIssues.test.mjs`:

```javascript
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadIssues } from "./loadIssues.mjs";

const VALID_ISSUE = {
  signature: "abc123",
  url: "https://demo.evinced.com/",
  selector: "button.cta",
  ruleId: "color-contrast",
  severity: "critical"
};

function fixture(issues) {
  const dir = mkdtempSync(join(tmpdir(), "load-"));
  const file = join(dir, "issues.json");
  writeFileSync(file, JSON.stringify(issues));
  return { dir, file };
}

test("loads a valid issues array", () => {
  const { dir, file } = fixture([VALID_ISSUE]);
  try {
    const issues = loadIssues(file);
    assert.equal(issues.length, 1);
    assert.equal(issues[0].signature, "abc123");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("returns empty array for empty array input", () => {
  const { dir, file } = fixture([]);
  try {
    assert.deepEqual(loadIssues(file), []);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("throws when top level is not an array", () => {
  const { dir, file } = fixture({ not: "an array" });
  try {
    assert.throws(() => loadIssues(file), /array/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("throws when an issue is missing required fields", () => {
  const { dir, file } = fixture([{ url: "x", selector: "y" }]);
  try {
    assert.throws(() => loadIssues(file), /signature|ruleId|severity/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("throws when file does not exist", () => {
  assert.throws(() => loadIssues("/nonexistent.json"), /ENOENT|not found/i);
});
```

- [ ] **Step 2: Run the test, expect FAIL**

Run: `cd web/playwright/js && node --test scripts/a11y-autofix-helpers/loadIssues.test.mjs`
Expected: FAIL — `Cannot find module './loadIssues.mjs'`.

- [ ] **Step 3: Implement the helper**

Create `web/playwright/js/scripts/a11y-autofix-helpers/loadIssues.mjs`:

```javascript
import { readFileSync } from "node:fs";

const REQUIRED = ["signature", "url", "selector", "ruleId", "severity"];

export function loadIssues(filePath) {
  const raw = readFileSync(filePath, "utf8");
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error(`loadIssues: top-level value in ${filePath} is not an array`);
  }
  for (const [i, issue] of parsed.entries()) {
    for (const field of REQUIRED) {
      if (issue[field] === undefined || issue[field] === null || issue[field] === "") {
        throw new Error(`loadIssues: issue[${i}] missing required field "${field}"`);
      }
    }
  }
  return parsed;
}
```

- [ ] **Step 4: Run the test, expect PASS**

Run: `cd web/playwright/js && node --test scripts/a11y-autofix-helpers/loadIssues.test.mjs`
Expected: PASS for all five tests.

- [ ] **Step 5: Verify against the real fixture from Task 1**

Run:
```bash
cd web/playwright/js
node -e "
  import('./scripts/a11y-autofix-helpers/loadIssues.mjs').then(({ loadIssues }) => {
    const issues = loadIssues('./fixtures/a11y/sample-issues.json');
    console.log('Loaded', issues.length, 'issues from real fixture');
  });
"
```

Expected: prints `Loaded N issues from real fixture`. If it throws, the fixture's field names differ from the REQUIRED list — go back and adjust `REQUIRED` in `loadIssues.mjs` to match the recorded field names from Task 1 Step 4, and re-run.

- [ ] **Step 6: Commit**

```bash
git add web/playwright/js/scripts/a11y-autofix-helpers/loadIssues.mjs \
        web/playwright/js/scripts/a11y-autofix-helpers/loadIssues.test.mjs
git commit -m "Add loadIssues helper with schema validation"
```

---

### Task 5: Create `resolveRoute` helper (TDD)

**Why:** The agent maps URL → `src/app/<path>/page.tsx`. This helper deterministically resolves the file path for any given URL using Next.js App Router rules. The agent then takes over for "which component inside that page owns the failing selector."

**Files:**
- Create: `web/playwright/js/scripts/a11y-autofix-helpers/resolveRoute.mjs`
- Test: `web/playwright/js/scripts/a11y-autofix-helpers/resolveRoute.test.mjs`

- [ ] **Step 1: Write the failing test**

Create `web/playwright/js/scripts/a11y-autofix-helpers/resolveRoute.test.mjs`:

```javascript
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
```

- [ ] **Step 2: Run the test, expect FAIL**

Run: `cd web/playwright/js && node --test scripts/a11y-autofix-helpers/resolveRoute.test.mjs`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the helper**

Create `web/playwright/js/scripts/a11y-autofix-helpers/resolveRoute.mjs`:

```javascript
import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

export function resolveRoute(url, { baseUrl, routeRoot, repoPath }) {
  if (!url.startsWith(baseUrl)) {
    throw new Error(`resolveRoute: URL "${url}" does not match baseUrl "${baseUrl}"`);
  }
  let path = url.slice(baseUrl.length).split("?")[0].split("#")[0];
  if (path.startsWith("/")) path = path.slice(1);
  if (path.endsWith("/")) path = path.slice(0, -1);
  const segments = path === "" ? [] : path.split("/");

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
```

- [ ] **Step 4: Run the test, expect PASS**

Run: `cd web/playwright/js && node --test scripts/a11y-autofix-helpers/resolveRoute.test.mjs`
Expected: PASS for all seven tests.

- [ ] **Step 5: Commit**

```bash
git add web/playwright/js/scripts/a11y-autofix-helpers/resolveRoute.mjs \
        web/playwright/js/scripts/a11y-autofix-helpers/resolveRoute.test.mjs
git commit -m "Add resolveRoute helper for URL → Next.js page.tsx mapping"
```

---

### Task 6: Create `a11y-autofix.config.json` at repo root

**Files:**
- Create: `a11y-autofix.config.json` (repo root)

- [ ] **Step 1: Create the config file**

Create `/Users/shane/Documents/support-golden-examples/a11y-autofix.config.json`:

```json
{
  "sourceSpec": "web/playwright/js/tests/evStartStop.spec.js",
  "reportArtifactName": "report-web-playwright-js-issues",
  "reportPath": "web/playwright/js/issues.json",
  "issuesSourceDir": "web/playwright/js/evinced-reports/tmp/0_evincedIssues",
  "target": {
    "owner": "EvincedShane",
    "repo": "demo-fe",
    "baseBranch": "main",
    "baseUrl": "https://demo-fe-orpin.vercel.app",
    "routeRoot": "src/app"
  },
  "prBranchPrefix": "a11y/fix-",
  "trackingFileDir": "a11y-findings",
  "maxIssuesPerRun": 20
}
```

**Note:** This deviates slightly from `MCPREPO.md` §4.2 — `reportGlob` is replaced with two explicit fields (`issuesSourceDir` for the per-issue files the SDK emits, `reportPath` for the aggregated output that the artifact contains). Update `MCPREPO.md` §4.2 to match before committing.

- [ ] **Step 2: Update MCPREPO.md §4.2 to match**

Edit `MCPREPO.md` §4.2 to replace `reportGlob` with `reportPath` and `issuesSourceDir`. Keep the rest of the section unchanged.

- [ ] **Step 3: Validate the JSON parses**

Run: `node -e "console.log(JSON.parse(require('fs').readFileSync('a11y-autofix.config.json','utf8')).target.repo)"`
Expected: prints `demo-fe`.

- [ ] **Step 4: Commit**

```bash
git add a11y-autofix.config.json MCPREPO.md
git commit -m "Add a11y-autofix.config.json pipeline config; sync spec"
```

---

### Task 7: Create `prompts/a11y-autofix.md`

**Files:**
- Create: `prompts/a11y-autofix.md`

- [ ] **Step 1: Create the prompt file**

Create `/Users/shane/Documents/support-golden-examples/prompts/a11y-autofix.md`:

```markdown
# A11y Auto-Fix Agent Prompt

You are running inside GitHub Actions, invoked by `web-a11y-autofix.yml` in `support-golden-examples`. Your job is to translate Evinced accessibility findings into pull requests against a Next.js front-end repository.

## Environment

- `$REPORT_PATH` — absolute path to a JSON file containing an array of Evinced issues. Use the `loadIssues` helper (`web/playwright/js/scripts/a11y-autofix-helpers/loadIssues.mjs`) to read and validate it.
- `$TARGET_REPO_PATH` — absolute path to a fresh clone of `EvincedShane/demo-fe`, checked out at the configured base branch.
- `$CONFIG_PATH` — absolute path to `a11y-autofix.config.json`.
- `$DRY_RUN` — `"true"` or `"false"`. When `"true"`, do not run `gh pr create`, `git push`, or `gh pr comment`; log the would-be invocation instead. Branch creation in the local clone is still allowed.
- The Evinced MCP is registered as `evinced` and provides `evinced_get_webpage_issue_details` for fetching expanded issue context by signature.
- `gh` CLI is authenticated against the target repo via `DEMO_FE_PAT`.

## Procedure

Read `$CONFIG_PATH`. For each issue in `$REPORT_PATH`, do the following IN ORDER. Stop after `maxIssuesPerRun` issues.

### 1. Resolve source

Use the `resolveRoute` helper to map `issue.url` → a path inside `$TARGET_REPO_PATH` under `target.routeRoot`. If `resolveRoute` returns `null`, tag the issue `route-unresolved` and skip to step 3 with `patch="(none)"`.

If the resolved `page.tsx` imports components from `src/components/**` or similar, read those imports and find the JSX subtree that owns `issue.selector`. Stop at the first file you would actually edit.

### 2. Propose patch

Make the minimal JSX edit that resolves the issue (e.g., add `alt=""`, fix `aria-label`, correct landmark nesting). Do NOT touch unrelated lines. If you are not confident the edit is correct, set `patch="(none)"` and tag `manual-review`.

### 3. Write tracking entry

Write `${trackingFileDir}/<signature>.md` (overwrite if it exists). Contents:

- Issue title, severity, WCAG ref (if present in issue data)
- URL, selector, link to screenshot (if present)
- Resolved source file
- Proposed patch as a fenced diff, or `manual review needed`
- Final line: `Verification: human must confirm fix matches intent.`

### 4. Open or update PR

Use the `signatureToBranch` helper for the branch name (`prBranchPrefix` + slugified signature).

Pre-check existing state via `gh pr list --repo $TARGET --state all --search "in:title <signature>"`:
- Open PR with same signature → check out the branch, replay the edits, `git push --force-with-lease`. If `--force-with-lease` is rejected, tag `branch-conflict`, post a comment on the PR explaining (do NOT retry with `--force`), and continue to the next issue.
- Closed/merged PR with same signature → tag `skipped-closed-pr`, do nothing.
- No matching PR → create branch from base, write changes, `git push`, `gh pr create` with title `[a11y] <issue title>`, labels `a11y,automated`, body that links the tracking file and includes the diff summary.

When all issues are processed, post a single summary comment on each PR touched this run.

## Hard rules

- Never push to `main` of the target repo.
- Never delete branches you did not create.
- Never edit files outside the resolved component file and the `trackingFileDir`.
- Stop processing after `maxIssuesPerRun` issues even if more remain.
- When `$DRY_RUN` is `"true"`, prefix every log line about a network mutation with `[DRY-RUN]` and skip the actual command.

## Output

Emit a final JSON object on stdout in this shape (one entry per processed issue):

```json
{
  "runSummary": [
    { "signature": "<sig>", "outcome": "pr-opened|pr-updated|manual-review|route-unresolved|branch-conflict|skipped-closed-pr|api-error", "prUrl": "<url|null>" }
  ]
}
```
```

- [ ] **Step 2: Verify the prompt renders correctly**

Run: `ls -la prompts/a11y-autofix.md && wc -l prompts/a11y-autofix.md`
Expected: file exists, ~60 lines.

- [ ] **Step 3: Commit**

```bash
git add prompts/a11y-autofix.md
git commit -m "Add agent prompt for a11y autofix"
```

---

### Task 8: Modify `web-js.yml` to upload issues artifact

**Files:**
- Modify: `.github/workflows/web-js.yml`

- [ ] **Step 1: Add an aggregation + upload step for the Playwright JS matrix entry**

After the `Upload HTML reports` step (around line 97 of `.github/workflows/web-js.yml`), insert two new steps. The aggregation step uses the helper from Task 3.

Edit `.github/workflows/web-js.yml`. Insert AFTER the existing `Upload HTML reports` block (`- name: Upload HTML reports ... retention-days: 14`):

```yaml
      - name: Aggregate Evinced per-issue JSON
        if: always() && matrix.example.name == 'web-playwright-js'
        working-directory: ${{ matrix.example.folder }}
        run: |
          if [ -d evinced-reports/tmp/0_evincedIssues ]; then
            node -e "
              import('./scripts/a11y-autofix-helpers/aggregateIssues.mjs').then(({ aggregateIssues }) => {
                const issues = aggregateIssues('evinced-reports/tmp/0_evincedIssues');
                require('fs').writeFileSync('issues.json', JSON.stringify(issues));
                console.log('Aggregated', issues.length, 'issues');
              });
            "
          else
            echo "No evinced-reports/tmp/0_evincedIssues — skipping aggregation"
            echo "[]" > issues.json
          fi

      - name: Upload Evinced issues artifact
        if: always() && matrix.example.name == 'web-playwright-js'
        uses: actions/upload-artifact@v4
        with:
          name: report-web-playwright-js-issues
          path: ${{ matrix.example.folder }}/issues.json
          retention-days: 14
```

- [ ] **Step 2: Validate YAML parses**

Run: `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/web-js.yml'))" && echo OK`
Expected: prints `OK`.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/web-js.yml
git commit -m "Aggregate and upload Evinced issues JSON artifact in web-js.yml"
```

---

### Task 9: Create `web-a11y-autofix.yml` workflow

**Files:**
- Create: `.github/workflows/web-a11y-autofix.yml`

- [ ] **Step 1: Create the workflow file**

Create `/Users/shane/Documents/support-golden-examples/.github/workflows/web-a11y-autofix.yml`:

```yaml
name: A11y Auto-Fix — Cross-Repo

on:
  workflow_run:
    workflows: ["Web SDK Tests — JavaScript/TypeScript"]
    types: [completed]
    branches: [main]
  workflow_dispatch:
    inputs:
      dry_run:
        description: "Skip actual git push / gh pr create / gh pr comment"
        type: boolean
        default: false
      fixture_report:
        description: "Path (in this repo) to a checked-in issues fixture JSON; if set, skip artifact download"
        type: string
        default: ""
  schedule:
    - cron: "0 7 * * 1"  # 1h after web-js.yml's Monday cron

concurrency:
  group: a11y-autofix-${{ github.ref }}
  cancel-in-progress: false

permissions:
  contents: read
  actions: read

jobs:
  autofix:
    runs-on: ubuntu-latest
    if: github.event_name != 'workflow_run' || github.event.workflow_run.conclusion == 'success'

    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Read pipeline config
        id: cfg
        run: |
          echo "target_owner=$(jq -r .target.owner a11y-autofix.config.json)" >> $GITHUB_OUTPUT
          echo "target_repo=$(jq -r .target.repo a11y-autofix.config.json)" >> $GITHUB_OUTPUT
          echo "target_branch=$(jq -r .target.baseBranch a11y-autofix.config.json)" >> $GITHUB_OUTPUT
          echo "report_artifact=$(jq -r .reportArtifactName a11y-autofix.config.json)" >> $GITHUB_OUTPUT

      - name: Download issues artifact (from triggering workflow run)
        if: github.event_name == 'workflow_run'
        uses: actions/download-artifact@v4
        with:
          name: ${{ steps.cfg.outputs.report_artifact }}
          path: ./_autofix_input
          github-token: ${{ secrets.GITHUB_TOKEN }}
          run-id: ${{ github.event.workflow_run.id }}

      - name: Stage fixture report (dispatch only)
        if: github.event_name == 'workflow_dispatch' && inputs.fixture_report != ''
        run: |
          mkdir -p ./_autofix_input
          cp "${{ inputs.fixture_report }}" ./_autofix_input/issues.json

      - name: Stage latest-run artifact (schedule / manual dispatch without fixture)
        if: github.event_name == 'schedule' || (github.event_name == 'workflow_dispatch' && inputs.fixture_report == '')
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          mkdir -p ./_autofix_input
          gh run download -R ${{ github.repository }} \
            --name "${{ steps.cfg.outputs.report_artifact }}" \
            --dir ./_autofix_input

      - name: Verify issues file present
        run: |
          if [ ! -f ./_autofix_input/issues.json ]; then
            echo "::error::issues.json missing — upstream test workflow may have failed to produce it"
            exit 1
          fi
          echo "Found $(jq length ./_autofix_input/issues.json) issues"

      - name: Clone target FE repo
        env:
          GH_TOKEN: ${{ secrets.DEMO_FE_PAT }}
        run: |
          gh repo clone "${{ steps.cfg.outputs.target_owner }}/${{ steps.cfg.outputs.target_repo }}" ./_autofix_target -- \
            --branch "${{ steps.cfg.outputs.target_branch }}" --depth 50
          cd ./_autofix_target
          git config user.email "a11y-autofix@evinced.com"
          git config user.name  "Evinced A11y Autofix"

      - name: Write runtime .mcp.json
        env:
          EVINCED_API_KEY: ${{ secrets.EVINCED_API_KEY }}
        run: |
          cat > .mcp.json <<JSON
          {
            "mcpServers": {
              "evinced": {
                "command": "npx",
                "args": ["-y", "@evinced/web-mcp"],
                "env": { "EVINCED_API_KEY": "${EVINCED_API_KEY}" }
              }
            }
          }
          JSON

      - name: Run Claude agent
        uses: anthropics/claude-code-action@beta
        env:
          REPORT_PATH: ${{ github.workspace }}/_autofix_input/issues.json
          TARGET_REPO_PATH: ${{ github.workspace }}/_autofix_target
          CONFIG_PATH: ${{ github.workspace }}/a11y-autofix.config.json
          DRY_RUN: ${{ inputs.dry_run || 'false' }}
          GH_TOKEN: ${{ secrets.DEMO_FE_PAT }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        with:
          prompt_file: prompts/a11y-autofix.md
          mcp_config: .mcp.json

      - name: Notify Slack
        if: always()
        uses: act10ns/slack@v2
        with:
          status: ${{ job.status }}
          channel: "#workflows"
          message: "a11y autofix run — ${{ job.status }}"
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

**Note on `anthropics/claude-code-action@beta` inputs:** Confirm the exact input names (`prompt_file`, `mcp_config`) against the latest action README at https://github.com/anthropics/claude-code-action. If the names differ, swap them in this step; the rest of the workflow is independent of action specifics.

- [ ] **Step 2: Validate YAML parses**

Run: `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/web-a11y-autofix.yml'))" && echo OK`
Expected: prints `OK`.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/web-a11y-autofix.yml
git commit -m "Add web-a11y-autofix workflow with workflow_run + dispatch + schedule"
```

---

### Task 10: Add README section

**Files:**
- Modify: `README.md` (repo root) — append a new section

- [ ] **Step 1: Locate insertion point**

Run: `grep -n "^## " README.md | tail -5`
Expected: a list of top-level sections. Pick a sensible spot to insert the new section (likely at the end before any "License" / footer).

- [ ] **Step 2: Append the section**

Add to `README.md`:

```markdown
## Demo: MCP-Driven Cross-Repo A11y Auto-Fix

This repo includes a demo pipeline that:

1. Runs the `evStartStop.spec.js` Playwright JS test against `https://demo.evinced.com/` (configured target).
2. Aggregates Evinced per-issue JSON into a single artifact.
3. Triggers a follow-up workflow (`web-a11y-autofix.yml`) that downloads the artifact, clones a target Next.js FE repo, and invokes Claude (via `claude-code-action` + the Evinced MCP) to open one PR per accessibility finding.

### Architecture

See `MCPREPO.md` at the repo root for the full design spec.

### One-time setup for forkers

1. Fork this repo and a target Next.js FE repo (e.g., `EvincedShane/demo-fe`).
2. Edit `a11y-autofix.config.json` so `target.owner`, `target.repo`, `target.baseUrl` point to your fork.
3. Set the following GitHub Actions secrets in this fork:
   - `EVINCED_SERVICE_ID`, `EVINCED_API_KEY` — your Evinced platform credentials.
   - `ANTHROPIC_API_KEY` — for `claude-code-action`.
   - `DEMO_FE_PAT` — a [fine-grained PAT](https://github.com/settings/personal-access-tokens) scoped to your target FE repo, with `Contents: write` and `Pull requests: write`.
   - `SLACK_WEBHOOK_URL` — optional, for the Slack notification.
4. In the target FE repo, add a `.github/CODEOWNERS` line:
   ```
   /a11y-findings/  @your-github-username
   ```
   and enable branch protection on `main` requiring CODEOWNERS review.

### Running the demo

- **Dry-run with fixture** (no PRs opened): Go to Actions → "A11y Auto-Fix — Cross-Repo" → "Run workflow" → set `dry_run = true`, `fixture_report = web/playwright/js/fixtures/a11y/sample-issues.json`. Verify the run summary shows what *would* happen.
- **Live run with fixture**: Same as above with `dry_run = false`. One PR per fixture issue appears in your target FE repo.
- **Full pipeline**: Push a change to `main`. The test workflow runs, and the autofix workflow fires automatically.

### What gets created in the target repo

- One branch per finding: `a11y/fix-<signature>` (idempotent on re-runs).
- One PR per finding, labelled `a11y,automated`.
- One tracking file: `a11y-findings/<signature>.md` summarizing what the agent saw and proposed.

Merging a PR requires CODEOWNERS approval on the tracking file — this is the human verification gate.
```

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "Document MCP cross-repo a11y autofix demo in README"
```

---

### Task 11: Coordinate with target repo (`EvincedShane/demo-fe`)

**Why:** This plan executes in `support-golden-examples`, but the autofix only works end-to-end if the target repo has the right gate. This task captures the manual setup that must happen on the target side.

**Files (in `demo-fe`, NOT this repo):**
- Create: `.github/CODEOWNERS`
- Configure: branch protection on `main`

- [ ] **Step 1: Open a PR in `EvincedShane/demo-fe` adding CODEOWNERS**

In a separate working copy of `EvincedShane/demo-fe`, create `.github/CODEOWNERS`:

```
/a11y-findings/  @EvincedShane
```

Commit and open a PR. Merge it to `main`.

- [ ] **Step 2: Configure branch protection on `demo-fe` `main`**

In the GitHub UI for `EvincedShane/demo-fe`:
- Settings → Branches → Add rule → branch name pattern `main`.
- Enable "Require a pull request before merging" → "Require review from Code Owners".
- Save.

- [ ] **Step 3: Verify**

In the target repo, push a no-op branch that modifies `a11y-findings/test.md` and open a draft PR. Confirm the PR shows "Code owner review required". Close the draft PR without merging.

- [ ] **Step 4: Record completion**

Edit `MCPREPO.md` §4.6 to remove any "TBD" or hedge language about CODEOWNERS — it is now in place. Commit if any change was needed.

---

### Task 12: Smoke test — fixture-driven dry run

**Files:** None modified. Pure verification.

- [ ] **Step 1: Push the branch with all prior commits**

```bash
git push -u origin design/mcp-repo-autofix-pipeline
```

- [ ] **Step 2: Set required secrets in the GitHub repo settings**

In `support-golden-examples` repo → Settings → Secrets and variables → Actions, confirm these are set: `EVINCED_SERVICE_ID`, `EVINCED_API_KEY`, `ANTHROPIC_API_KEY`, `DEMO_FE_PAT`, `SLACK_WEBHOOK_URL`.

- [ ] **Step 3: Dispatch the workflow with dry-run + fixture**

Via GitHub UI: Actions → "A11y Auto-Fix — Cross-Repo" → Run workflow → branch `design/mcp-repo-autofix-pipeline` → `dry_run = true` → `fixture_report = web/playwright/js/fixtures/a11y/sample-issues.json` → Run.

- [ ] **Step 4: Verify run output**

Open the workflow run. Confirm:
- All steps pass.
- The "Run Claude agent" step logs include `[DRY-RUN]` prefixes for every would-be `gh pr create` / `git push` invocation.
- No PRs were opened in `EvincedShane/demo-fe` (check `https://github.com/EvincedShane/demo-fe/pulls`).
- Slack message arrives in `#workflows` with status `success`.

---

### Task 13: Smoke test — live fixture run

**Files:** None modified. Verification + cleanup.

- [ ] **Step 1: Dispatch with dry-run off**

Same as Task 12 Step 3 but with `dry_run = false`. Same fixture.

- [ ] **Step 2: Verify PRs**

Open `https://github.com/EvincedShane/demo-fe/pulls`. Confirm:
- One PR per fixture issue is present.
- Each PR title is `[a11y] <issue title>`.
- Each PR has labels `a11y`, `automated`.
- Each PR's diff includes (a) a JSX edit (or a tracking-file-only diff with `manual-review` flagged in the body), and (b) a new file at `a11y-findings/<signature>.md`.
- Each PR shows "Code owner review required".

- [ ] **Step 3: Dispatch again (idempotency check)**

Same dispatch as Step 1. After the run completes, confirm:
- No new PRs appeared in `demo-fe`.
- Each previously-opened PR has a fresh comment from the agent noting the new run ID.

- [ ] **Step 4: Cleanup (optional, manual)**

Close any PRs in `demo-fe` that were opened by the smoke tests so the target repo doesn't accumulate noise. The agent will respect their closed state on the next run (`skipped-closed-pr`).

---

### Task 14: Open PR for `design/mcp-repo-autofix-pipeline` → `main`

**Files:** None modified.

- [ ] **Step 1: Ensure all commits pushed**

```bash
git status
git push
```

Expected: working tree clean, `Your branch is up to date with 'origin/design/mcp-repo-autofix-pipeline'`.

- [ ] **Step 2: Open PR**

```bash
gh pr create --base main --head design/mcp-repo-autofix-pipeline \
  --title "Add MCP cross-repo a11y auto-fix demo pipeline" \
  --body "$(cat <<'EOF'
## Summary
- New workflow `web-a11y-autofix.yml` that runs after `web-js.yml` succeeds.
- New helpers under `web/playwright/js/scripts/a11y-autofix-helpers/` (aggregator, loader, route resolver, branch slugifier) with `node --test` unit tests.
- New `a11y-autofix.config.json` (root) as the single source of truth for the pipeline.
- New `prompts/a11y-autofix.md` containing the agent prompt.
- Modified `web-js.yml` to aggregate Evinced per-issue JSON into a stable `issues.json` artifact.
- Spec at `MCPREPO.md`.

## Test plan
- [x] Helper unit tests pass locally (`node --test web/playwright/js/scripts/a11y-autofix-helpers/`).
- [x] Dry-run dispatch with fixture (Task 12) — no PRs opened, agent logs `[DRY-RUN]`.
- [x] Live dispatch with fixture (Task 13) — one PR per issue, CODEOWNERS gate visible.
- [x] Idempotency re-dispatch (Task 13) — no duplicate PRs, refresh comments.
- [ ] Full pipeline (test workflow → autofix) — verified after PR merges and Monday cron fires, or by manual `workflow_run` re-trigger.
EOF
)"
```

Expected: PR URL printed. Tag for human review.

---

## Self-Review

**Spec coverage check** (mapping `MCPREPO.md` sections to tasks):

- §1 Goal → covered by the whole plan; final state is Task 14's PR.
- §2 Non-goals → not implemented (correctly).
- §3 End-to-end flow → realized by Tasks 8, 9, 11.
- §4.1 Workflow file → Task 9.
- §4.2 Pipeline config → Task 6 (with deviation noted: `reportGlob` → `reportPath` + `issuesSourceDir`; spec updated in same task).
- §4.3 `.mcp.json` generated at runtime → Task 9 Step 1 (the `Write runtime .mcp.json` workflow step).
- §4.4 Agent prompt → Task 7.
- §4.5 PAT auth → Task 10 Step 2 secret + README setup in Task 10.
- §4.6 CODEOWNERS tracking file → Task 11.
- §5 Data flow → realized by Tasks 8 + 9 + agent prompt in Task 7.
- §6 Error handling → encoded in workflow gates (Task 9) and prompt rules (Task 7); `branch-conflict` semantics in Task 7's prompt.
- §6 Signature-stability self-check → **GAP.** The prompt (Task 7) does not yet include the "compare to prior run's signatures" self-check that §6 specifies. *Adding a follow-up note:* This is an enhancement worth adding to `prompts/a11y-autofix.md` after a few real runs have accumulated signatures to compare against. For initial implementation, this gap is acceptable; track as a follow-up issue.
- §7.1 Helper unit tests → Tasks 2, 3, 4, 5.
- §7.2 Dry-run + fixture mode → Task 9 workflow inputs, Task 7 prompt rules, Task 12 verification.
- §7.3 Smoke checklist → Tasks 12, 13.

**Placeholder scan:** No `TBD`, no "add appropriate error handling", no "similar to Task N", no "TODO". The one explicit gap (signature-stability self-check) is called out above and is intentional.

**Type/name consistency check:**
- `signatureToBranch(signature, prefix)` — same signature in Task 2 helper, Task 7 prompt reference, no drift.
- `resolveRoute(url, { baseUrl, routeRoot, repoPath })` — same shape in Task 5 and Task 7 prompt.
- `loadIssues(filePath)` — same in Task 4 and Task 7 prompt.
- `aggregateIssues(dirPath)` — same in Task 3 and Task 8 workflow step.
- Field names (`signature`, `url`, `selector`, `ruleId`, `severity`) — consistent across Tasks 4, 7. Task 1 Step 4 explicitly allows the engineer to substitute real field names from the captured fixture if they differ.
- Config keys — `target.owner`, `target.repo`, `target.baseBranch`, `target.baseUrl`, `target.routeRoot`, `prBranchPrefix`, `trackingFileDir`, `maxIssuesPerRun`, `reportArtifactName`, `reportPath`, `issuesSourceDir`, `sourceSpec` — consistent across Tasks 6, 8, 9, and the prompt in Task 7.

No naming drift detected.
