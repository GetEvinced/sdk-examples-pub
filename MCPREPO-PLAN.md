# Cross-Repo A11y Auto-Fix Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a CI pipeline in `support-golden-examples` that, after `evMcpDemo.spec.js` runs in CI and produces `test-results/evMcpDemo.json`, uses Claude (via `claude-code-action` + Evinced MCP) to open one PR per finding against `EvincedShane/demo-fe`.

**Architecture:** Separate `web-a11y-autofix.yml` workflow, triggered by `workflow_run` of `web-js.yml`. Consumes the issues JSON written directly by `evincedService.evSaveFile(..., "json", ...)` in `evMcpDemo.spec.js`. Each issue → one branch `a11y/fix-<signature>` → one rolling PR with a JSX edit (when confident) + a tracking file under `a11y-findings/` (always). Verification gated by CODEOWNERS in the target repo.

**Tech Stack:** GitHub Actions, Node.js 20 (`node --test`), `anthropics/claude-code-action@beta`, Evinced JS Playwright SDK, Evinced web MCP (`@evinced/web-mcp`), `gh` CLI, Next.js 14+ App Router.

**Spec:** `MCPREPO.md` at repo root.

**Branch:** `design/mcp-repo-autofix-pipeline` (spec + plan already committed).

---

## File Structure

**This repo (`support-golden-examples`):**
- Create: `a11y-autofix.config.json` — pipeline config (root)
- Create: `prompts/a11y-autofix.md` — agent prompt
- Create: `.github/workflows/web-a11y-autofix.yml` — new workflow
- Create: `web/playwright/js/scripts/a11y-autofix-helpers/signatureToBranch.mjs` + `.test.mjs`
- Create: `web/playwright/js/scripts/a11y-autofix-helpers/loadIssues.mjs` + `.test.mjs`
- Create: `web/playwright/js/scripts/a11y-autofix-helpers/resolveRoute.mjs` + `.test.mjs`
- Modify: `.github/workflows/web-js.yml` — add upload step for `test-results/evMcpDemo.json`
- Modify: `README.md` — add demo section

**Target repo (`EvincedShane/demo-fe`):**
- Add: `.github/CODEOWNERS` line for `/a11y-findings/`
- Configure: branch protection on `main` requiring CODEOWNERS review

---

## Subagent-Executable Tasks (1–8)

These have no external credential requirements and can be dispatched to fresh implementer subagents.

---

### Task 1: `signatureToBranch` helper (TDD)

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

- [ ] **Step 3: Run the test — expect FAIL**

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

- [ ] **Step 5: Run the test — expect PASS**

Run: `cd web/playwright/js && node --test scripts/a11y-autofix-helpers/signatureToBranch.test.mjs`
Expected: PASS for all five tests.

- [ ] **Step 6: Commit**

```bash
git add web/playwright/js/scripts/a11y-autofix-helpers/signatureToBranch.mjs \
        web/playwright/js/scripts/a11y-autofix-helpers/signatureToBranch.test.mjs
git commit -m "Add signatureToBranch helper for stable autofix branch naming"
```

---

### Task 2: `loadIssues` helper (TDD)

**Why:** Validates that the issues JSON has the fields downstream code depends on. Catches Evinced SDK schema drift loudly before the agent runs.

**Note on field names:** The exact field name for the stable identifier in Evinced output may be `signature`, `id`, or similar. The tests below assume `signature`. After the first live run, if logs show a different field name, update the `REQUIRED` constant and re-run.

**Files:**
- Create: `web/playwright/js/scripts/a11y-autofix-helpers/loadIssues.mjs`
- Test: `web/playwright/js/scripts/a11y-autofix-helpers/loadIssues.test.mjs`

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
  url: "https://demo-fe-orpin.vercel.app/",
  selector: "button.cta",
  ruleId: "color-contrast",
  severity: "critical"
};

function fixture(payload) {
  const dir = mkdtempSync(join(tmpdir(), "load-"));
  const file = join(dir, "issues.json");
  writeFileSync(file, JSON.stringify(payload));
  return { dir, file };
}

test("loads a valid issues array", () => {
  const { dir, file } = fixture([VALID_ISSUE]);
  try {
    const issues = loadIssues(file);
    assert.equal(issues.length, 1);
    assert.equal(issues[0].signature, "abc123");
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("returns empty array for empty array input", () => {
  const { dir, file } = fixture([]);
  try {
    assert.deepEqual(loadIssues(file), []);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("throws when top level is not an array", () => {
  const { dir, file } = fixture({ not: "an array" });
  try {
    assert.throws(() => loadIssues(file), /array/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("throws when an issue is missing required fields", () => {
  const { dir, file } = fixture([{ url: "x", selector: "y" }]);
  try {
    assert.throws(() => loadIssues(file), /signature|ruleId|severity/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("throws when file does not exist", () => {
  assert.throws(() => loadIssues("/nonexistent.json"), /ENOENT|not found/i);
});
```

- [ ] **Step 2: Run the test — expect FAIL**

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

- [ ] **Step 4: Run the test — expect PASS**

Run: `cd web/playwright/js && node --test scripts/a11y-autofix-helpers/loadIssues.test.mjs`
Expected: PASS for all five tests.

- [ ] **Step 5: Commit**

```bash
git add web/playwright/js/scripts/a11y-autofix-helpers/loadIssues.mjs \
        web/playwright/js/scripts/a11y-autofix-helpers/loadIssues.test.mjs
git commit -m "Add loadIssues helper with schema validation"
```

---

### Task 3: `resolveRoute` helper (TDD)

**Why:** Deterministically maps a URL to its Next.js App Router source file. The agent then takes over for "which component inside that page owns the failing selector."

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

- [ ] **Step 2: Run the test — expect FAIL**

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

- [ ] **Step 4: Run the test — expect PASS**

Run: `cd web/playwright/js && node --test scripts/a11y-autofix-helpers/resolveRoute.test.mjs`
Expected: PASS for all seven tests.

- [ ] **Step 5: Commit**

```bash
git add web/playwright/js/scripts/a11y-autofix-helpers/resolveRoute.mjs \
        web/playwright/js/scripts/a11y-autofix-helpers/resolveRoute.test.mjs
git commit -m "Add resolveRoute helper for URL → Next.js page.tsx mapping"
```

---

### Task 4: Create `a11y-autofix.config.json`

**Files:**
- Create: `a11y-autofix.config.json` (repo root)

- [ ] **Step 1: Create the config file**

Create `/Users/shane/Documents/support-golden-examples/a11y-autofix.config.json`:

```json
{
  "sourceSpec": "web/playwright/js/tests/evMcpDemo.spec.js",
  "reportArtifactName": "report-web-playwright-js-issues",
  "reportPath": "web/playwright/js/test-results/evMcpDemo.json",
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

- [ ] **Step 2: Validate the JSON parses**

Run: `node -e "console.log(JSON.parse(require('fs').readFileSync('a11y-autofix.config.json','utf8')).target.repo)"`
Expected: prints `demo-fe`.

- [ ] **Step 3: Commit**

```bash
git add a11y-autofix.config.json
git commit -m "Add a11y-autofix.config.json pipeline config"
```

---

### Task 5: Create agent prompt `prompts/a11y-autofix.md`

**Files:**
- Create: `prompts/a11y-autofix.md`

- [ ] **Step 1: Create the prompt directory**

```bash
mkdir -p prompts
```

- [ ] **Step 2: Create the prompt file**

Create `prompts/a11y-autofix.md` with the following content (the exact content below is what gets written — do not paraphrase):

````markdown
# A11y Auto-Fix Agent Prompt

You are running inside GitHub Actions, invoked by `web-a11y-autofix.yml` in `support-golden-examples`. Your job is to translate Evinced accessibility findings into pull requests against a Next.js front-end repository.

## Environment

- `$REPORT_PATH` — absolute path to a JSON file containing an array of Evinced issues. Use the `loadIssues` helper (`web/playwright/js/scripts/a11y-autofix-helpers/loadIssues.mjs`) to read and validate it.
- `$TARGET_REPO_PATH` — absolute path to a fresh clone of `EvincedShane/demo-fe`, checked out at the configured base branch.
- `$CONFIG_PATH` — absolute path to `a11y-autofix.config.json`.
- `$DRY_RUN` — `"true"` or `"false"`. When `"true"`, do NOT run `gh pr create`, `git push`, or `gh pr comment`; log the would-be invocation instead. Branch creation in the local clone is still allowed.
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
````

- [ ] **Step 3: Verify the file exists**

Run: `wc -l prompts/a11y-autofix.md`
Expected: roughly 55–70 lines.

- [ ] **Step 4: Commit**

```bash
git add prompts/a11y-autofix.md
git commit -m "Add agent prompt for a11y autofix"
```

---

### Task 6: Modify `web-js.yml` to upload the issues artifact

**Files:**
- Modify: `.github/workflows/web-js.yml`

- [ ] **Step 1: Read existing workflow to locate the insertion point**

Read `.github/workflows/web-js.yml` and locate the `- name: Upload HTML reports` block (around line 97). The new step goes immediately after that block, still inside the same job's `steps:` list.

- [ ] **Step 2: Insert the upload step**

Insert AFTER the existing `Upload HTML reports` block (the one with `retention-days: 14`):

```yaml
      - name: Upload Evinced issues JSON artifact
        if: always() && matrix.example.name == 'web-playwright-js'
        uses: actions/upload-artifact@v4
        with:
          name: report-web-playwright-js-issues
          path: ${{ matrix.example.folder }}/test-results/evMcpDemo.json
          retention-days: 14
          if-no-files-found: warn
```

- [ ] **Step 3: Validate YAML parses**

Run: `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/web-js.yml'))" && echo OK`
Expected: prints `OK`.

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/web-js.yml
git commit -m "Upload Evinced issues JSON artifact in web-js.yml"
```

---

### Task 7: Create `web-a11y-autofix.yml` workflow

**Files:**
- Create: `.github/workflows/web-a11y-autofix.yml`

- [ ] **Step 1: Create the workflow file**

Create `.github/workflows/web-a11y-autofix.yml`:

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
        description: "Skip git push / gh pr create / gh pr comment; log no-ops instead"
        type: boolean
        default: false
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

      - name: Download latest issues artifact (schedule / manual dispatch)
        if: github.event_name != 'workflow_run'
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          mkdir -p ./_autofix_input
          gh run download -R ${{ github.repository }} \
            --name "${{ steps.cfg.outputs.report_artifact }}" \
            --dir ./_autofix_input

      - name: Verify issues file present
        run: |
          if [ ! -f ./_autofix_input/evMcpDemo.json ]; then
            echo "::error::evMcpDemo.json missing — upstream test workflow may not have produced it"
            ls -la ./_autofix_input || true
            exit 1
          fi
          echo "Found $(jq length ./_autofix_input/evMcpDemo.json) issues"

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
          REPORT_PATH: ${{ github.workspace }}/_autofix_input/evMcpDemo.json
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

**Note on `anthropics/claude-code-action@beta`:** Confirm the exact input names (`prompt_file`, `mcp_config`) against the latest action README at https://github.com/anthropics/claude-code-action. If the names differ, swap them in this step; the rest of the workflow is independent.

- [ ] **Step 2: Validate YAML parses**

Run: `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/web-a11y-autofix.yml'))" && echo OK`
Expected: prints `OK`.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/web-a11y-autofix.yml
git commit -m "Add web-a11y-autofix workflow with workflow_run + dispatch + schedule"
```

---

### Task 8: Add README section

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Locate insertion point**

Run: `grep -n "^## " README.md | tail -5`
Expected: a list of top-level sections. Append the new section at the end before any "License" / footer.

- [ ] **Step 2: Append the section**

Append the following to `README.md`:

```markdown
## Demo: MCP-Driven Cross-Repo A11y Auto-Fix

This repo includes a demo pipeline that:

1. Runs `web/playwright/js/tests/evMcpDemo.spec.js` against `https://demo-fe-orpin.vercel.app/`.
2. Saves the Evinced findings to `test-results/evMcpDemo.json` and uploads them as a CI artifact.
3. Triggers `web-a11y-autofix.yml`, which clones the target Next.js FE repo and invokes Claude (via `claude-code-action` + the Evinced MCP) to open one PR per accessibility finding.

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

- **Live**: push to `main`, or wait for the Monday cron. `web-js.yml` runs the test → uploads `evMcpDemo.json` → `web-a11y-autofix.yml` fires automatically.
- **Dry-run** (no PRs opened): trigger `web-js.yml` first so an artifact exists, then dispatch `web-a11y-autofix.yml` with `dry_run = true`. The agent runs end-to-end and logs `[DRY-RUN]` in place of every PR mutation.

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

## User-Executable Tasks (9–12)

These require credentials, target-repo write access, or GitHub UI dispatch — not safe to delegate to subagents.

---

### Task 9: Coordinate with target repo (`EvincedShane/demo-fe`)

- [ ] **Step 1: Add CODEOWNERS to `demo-fe`**

In a separate working copy of `EvincedShane/demo-fe`, create `.github/CODEOWNERS`:

```
/a11y-findings/  @EvincedShane
```

Commit and merge to `main`.

- [ ] **Step 2: Configure branch protection on `main`**

GitHub UI → `EvincedShane/demo-fe` → Settings → Branches → Add rule:
- Branch name pattern: `main`
- Require pull request before merging
- Require review from Code Owners
- Save.

- [ ] **Step 3: Verify the gate**

Push a no-op branch to `demo-fe` that adds `a11y-findings/test.md`, open a draft PR, confirm "Code owner review required" appears. Close without merging.

---

### Task 10: Smoke test — dry-run

- [ ] **Step 1: Push the branch**

```bash
git push -u origin design/mcp-repo-autofix-pipeline
```

- [ ] **Step 2: Set required secrets**

`support-golden-examples` repo → Settings → Secrets and variables → Actions. Confirm: `EVINCED_SERVICE_ID`, `EVINCED_API_KEY`, `ANTHROPIC_API_KEY`, `DEMO_FE_PAT`, `SLACK_WEBHOOK_URL`.

- [ ] **Step 3: Run `web-js.yml` once**

Actions → "Web SDK Tests — JavaScript/TypeScript" → Run workflow → branch `design/mcp-repo-autofix-pipeline` → Run. Wait for completion. Verify `report-web-playwright-js-issues` artifact exists on the run page.

- [ ] **Step 4: Dispatch `web-a11y-autofix.yml` with `dry_run=true`**

Actions → "A11y Auto-Fix — Cross-Repo" → Run workflow → branch `design/mcp-repo-autofix-pipeline` → `dry_run = true` → Run.

- [ ] **Step 5: Verify**

- All steps green.
- "Run Claude agent" step logs include `[DRY-RUN]` prefixes for every would-be `gh pr create` / `git push`.
- No PRs opened in `EvincedShane/demo-fe`.
- Slack `#workflows` message with `success` status arrives.

---

### Task 11: Smoke test — live

- [ ] **Step 1: Dispatch with `dry_run=false`**

Same as Task 10 Step 4 but `dry_run = false`.

- [ ] **Step 2: Verify PRs**

`https://github.com/EvincedShane/demo-fe/pulls`:
- One PR per issue in the report.
- Titles match `[a11y] <issue title>`.
- Labels `a11y`, `automated` present.
- Each PR diff contains a JSX edit (or `manual-review` flagged in body) + new `a11y-findings/<signature>.md`.
- "Code owner review required" appears on each PR.

- [ ] **Step 3: Idempotency check**

Dispatch again with same settings. Confirm:
- No new PRs in `demo-fe`.
- Each existing PR gets a fresh comment from the agent with the new run ID.

- [ ] **Step 4: Cleanup (optional)**

Close any PRs that were opened by the smoke tests so the target repo doesn't accumulate noise. The agent will respect their closed state on the next run (`skipped-closed-pr`).

---

### Task 12: Open PR `design/mcp-repo-autofix-pipeline` → `main`

- [ ] **Step 1: Verify clean state**

```bash
git status
git push
```

Expected: working tree clean, branch in sync with origin.

- [ ] **Step 2: Open PR**

```bash
gh pr create --base main --head design/mcp-repo-autofix-pipeline \
  --title "Add MCP cross-repo a11y auto-fix demo pipeline" \
  --body "$(cat <<'EOF'
## Summary
- New workflow `web-a11y-autofix.yml` triggered by `workflow_run` of `web-js.yml`.
- New helpers under `web/playwright/js/scripts/a11y-autofix-helpers/` (signatureToBranch, loadIssues, resolveRoute) with `node --test` unit tests.
- New `a11y-autofix.config.json` (root) as the single source of truth.
- New `prompts/a11y-autofix.md` containing the agent prompt.
- Modified `web-js.yml` to upload the Evinced issues JSON as a CI artifact.
- Spec at `MCPREPO.md`; plan at `MCPREPO-PLAN.md`.

## Test plan
- [x] Helper unit tests pass (`node --test web/playwright/js/scripts/a11y-autofix-helpers/`).
- [x] Dry-run dispatch — no PRs opened, agent logs `[DRY-RUN]`.
- [x] Live dispatch — one PR per issue, CODEOWNERS gate visible.
- [x] Idempotency re-dispatch — no duplicate PRs, refresh comments.
- [ ] Full pipeline (test workflow → autofix) — verified after PR merges and Monday cron fires, or manual re-trigger.
EOF
)"
```

Expected: PR URL printed.

---

## Self-Review

**Spec coverage** (`MCPREPO.md` sections → tasks):
- §1 Goal → realized by full plan; final state is Task 12.
- §3 End-to-end flow → Tasks 6, 7, 9.
- §4.1 Workflow file → Task 7.
- §4.2 Pipeline config → Task 4.
- §4.3 Runtime `.mcp.json` → Task 7 (workflow step "Write runtime .mcp.json").
- §4.4 Agent prompt → Task 5.
- §4.5 PAT auth → README setup (Task 8) + Task 10 secret confirmation.
- §4.6 CODEOWNERS → Task 9.
- §5 Data flow → Tasks 6 + 7 + prompt in Task 5.
- §6 Error handling → workflow gates (Task 7) + prompt rules (Task 5); `branch-conflict` semantics in Task 5's prompt.
- §6 Signature-stability self-check → **GAP, intentional.** Not in initial prompt; track as follow-up after a few real runs accumulate signatures.
- §7.1 Helper unit tests → Tasks 1, 2, 3.
- §7.2 Dry-run mode → Task 7 input + Task 5 prompt rules + Task 10 verification.
- §7.3 Smoke checklist → Tasks 10, 11.

**Placeholder scan:** None. The single intentional gap (signature-stability self-check) is called out above.

**Name consistency:**
- `signatureToBranch(signature, prefix)` — same shape in Task 1 helper + Task 5 prompt.
- `loadIssues(filePath)` — same in Task 2 + Task 5 prompt.
- `resolveRoute(url, { baseUrl, routeRoot, repoPath })` — same in Task 3 + Task 5 prompt.
- Required fields (`signature`, `url`, `selector`, `ruleId`, `severity`) — consistent across Tasks 2 + 5.
- Config keys — consistent across Tasks 4, 5, 7.

No naming drift.
