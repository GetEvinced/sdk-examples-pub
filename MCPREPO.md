# Cross-Repo Accessibility Auto-Fix Pipeline

**Status:** Live demo (as of PR #268)
**Source spec:** `web/playwright/js/tests/evMcpDemo.spec.js`
**Target FE repo:** [`EvincedShane/demo-fe`](https://github.com/EvincedShane/demo-fe) (Next.js, App Router)

This repo demonstrates an end-to-end pipeline where the Evinced Web MCP and Claude collaborate to turn accessibility findings into pull requests:

```
Evinced SDK scans  →  JSON report  →  MCP exposes findings  →  Claude implements fixes  →  PR per finding
```

---

## 1. Goal

1. The Evinced JS Playwright SDK runs in CI and produces an accessibility report (`evMcpDemo.json`).
2. A second workflow takes that JSON, hands it to the Evinced Web MCP server, and asks Claude (via [`anthropics/claude-code-action`](https://github.com/anthropics/claude-code-action)) to resolve each finding into a code patch.
3. One pull request is opened per finding against the target FE repo, with the MCP's remediation guidance recorded in a tracking file and the proposed JSX edit committed on a signature-keyed branch.
4. A CODEOWNERS gate ensures every PR requires human review before merge.

The pipeline is the example. A forker should be able to read one workflow file, one config file, and one prompt file to understand the whole thing.

## 2. Non-goals

- Auto-merging fixes or closing the loop back into a re-scan.
- Coverage for Cypress / WDIO / Selenium / TestCafe. Playwright JS only, one spec.
- Fan-out to multiple target repos. Single FE repo only.
- LLM-driven verification of patch correctness. Humans verify on the PR.
- GitHub App auth. PAT is sufficient for an example.

## 3. End-to-end flow

```
┌────────────────────────────────────────────────────────────────────────────┐
│ support-golden-examples (this repo)                                        │
│                                                                            │
│  .github/workflows/web-js.yml                                              │
│    └── matrix entry: web-playwright-js                                     │
│        └── runs evMcpDemo.spec.js → test-results/evMcpDemo.json            │
│            └── upload-artifact "report-web-playwright-js-issues"           │
└──────────────────────────────────────────┬─────────────────────────────────┘
                                           │ workflow_run / dispatch / cron
                                           ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ .github/workflows/web-a11y-autofix.yml  (three-job pipeline)               │
│                                                                            │
│  Job 1: extract                                                            │
│    ├── download issues artifact                                            │
│    ├── recursive jq scan for `signature` fields                            │
│    └── emit matrix output: {"signature": [sig1, sig2, ...]}                │
│                                                                            │
│  Job 2: fix  (strategy.matrix, max-parallel: 3, one job per signature)     │
│    For each signature:                                                     │
│      ├── checkout self                                                     │
│      ├── download staged issues JSON                                       │
│      ├── clone target FE repo (PAT embedded in remote URL)                 │
│      ├── configure .npmrc for Evinced JFrog registry                       │
│      ├── apt-get install libsecret-1-dev   (for keytar)                    │
│      ├── npx playwright install chromium    (Chromium for MCP server)      │
│      ├── npm install -g @evinced/mcp-server-web --ignore-scripts           │
│      ├── ★ Invoke Evinced MCP (tools/list + import_report)  ← visible step │
│      ├── load single-issue prompt with __SIGNATURE__ substituted            │
│      └── Run Claude (invokes Evinced MCP for remediation)                  │
│           └── per-signature loop: import_report → get_webpage_issue_       │
│               details(signature) → resolve route → JSX edit → branch →     │
│               commit → push → gh pr create                                 │
│                                                                            │
│  Job 3: summary                                                            │
│    └── post Slack notification                                             │
└──────────────────────────────────────────┬─────────────────────────────────┘
                                           │
                                           ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ EvincedShane/demo-fe (target Next.js repo)                                 │
│                                                                            │
│  One PR per signature:                                                     │
│    • branch  a11y/fix-<signature>                                          │
│    • title   [a11y] <rule title from MCP>                                  │
│    • labels  a11y, automated                                               │
│    • body    a11y-findings/<signature>.md (MCP's remediation_instructions) │
│    • diff    minimal JSX edit + the tracking file                          │
│                                                                            │
│  CODEOWNERS gate on /a11y-findings/** requires human approval to merge.    │
└────────────────────────────────────────────────────────────────────────────┘
```

The matrix shape is intentional: one MCP server + one Claude agent per signature means each finding gets a fresh, focused context and runs in parallel up to `max-parallel`.

## 4. Components

### 4.1 `web-a11y-autofix.yml` — three jobs

**Triggers:**

```yaml
on:
  workflow_run:
    workflows: ["Web SDK Tests — JavaScript/TypeScript"]
    types: [completed]
    branches: [main]
  workflow_dispatch:
    inputs:
      dry_run:
        type: boolean
        default: false
  schedule:
    - cron: "0 7 * * 1"
```

**Permissions:**

```yaml
permissions:
  contents: read
  actions: read
  id-token: write   # claude-code-action probes OIDC during init
```

**Concurrency:**

```yaml
concurrency:
  group: a11y-autofix-${{ github.ref }}
  cancel-in-progress: false
```

**Jobs:**

| Job | Purpose |
|---|---|
| `extract` | Reads the issues artifact, scans recursively for `signature` fields via `jq`, emits a `{"signature": [...]}` matrix output. Re-uploads the JSON as `a11y-issues-staged` for the matrix jobs to consume. |
| `fix` | `strategy.matrix: ${{ fromJson(needs.extract.outputs.matrix) }}` with `max-parallel: 3` and `fail-fast: false`. Each instance handles exactly one signature end-to-end. |
| `summary` | Posts a single Slack notification with the aggregate matrix result. |

### 4.2 `a11y-autofix.config.json` (repo root)

The thin "mapping" — single source of truth a forker edits:

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

### 4.3 `mcp_config` (inline in the agent step)

The Evinced Web MCP server is published as `@evinced/mcp-server-web` on Evinced's private JFrog registry. The agent step spawns it via the installed binary, NOT via `npx -y`, because the package's postinstall scripts (vite, keytar's prebuild-install) fail on a fresh Ubuntu runner without dev build tools. Installing once globally with `--ignore-scripts` and pointing `mcp_config.command` at the installed binary `evinced-mcp-server` sidesteps the issue.

```yaml
mcp_config: |
  {
    "mcpServers": {
      "evinced-web-mcp": {
        "command": "evinced-mcp-server",
        "args": ["--headless"],
        "type": "stdio",
        "env": {
          "EVINCED_SERVICE_ID": "${{ secrets.EVINCED_SERVICE_ID }}",
          "EVINCED_API_KEY": "${{ secrets.EVINCED_API_KEY }}"
        }
      }
    }
  }
```

Server key `evinced-web-mcp` matches the [Evinced docs canonical example](https://developer.evinced.com/MCP-Servers/web-mcp-server). Tool names in `allowed_tools` therefore use the prefix `mcp__evinced-web-mcp__*`.

### 4.4 Visible "Invoke Evinced MCP" step

Right before the Claude agent step, the workflow has a dedicated step that speaks MCP over stdio JSON-RPC and prints the responses:

```yaml
- name: Invoke Evinced MCP (tools/list + import_report)
  continue-on-error: true
  env:
    EVINCED_SERVICE_ID: ${{ secrets.EVINCED_SERVICE_ID }}
    EVINCED_API_KEY: ${{ secrets.EVINCED_API_KEY }}
    REPORT_PATH: ${{ github.workspace }}/_autofix_input/${{ needs.extract.outputs.report_basename }}
  run: |
    ( printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":...}\n'
      sleep 2
      printf '{"jsonrpc":"2.0","method":"notifications/initialized","params":{}}\n'
      printf '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}\n'
      sleep 2
      printf '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":...}\n'
      sleep 5 ) | timeout 30 npx -y @evinced/mcp-server-web --headless 2>&1
```

The log shows the MCP's `tools/list` response (all four `evinced_*` tools), then the `import_report` response with the `reportId` and severity/type summary. Purely demonstrative — the agent step uses its own fresh MCP instance for the actual per-signature work.

### 4.5 Agent prompt: `prompts/a11y-autofix.md`

Single-issue prompt — one agent per signature, imperative steps, MCP load-bearing. Template includes a `__SIGNATURE__` placeholder that the matrix job substitutes via `sed` before invocation.

Per-signature steps:

1. Read the pipeline config.
2. **Call `mcp__evinced-web-mcp__evinced_import_report(file=$REPORT_PATH)`** to load the report into the MCP server's internal store.
3. **Call `mcp__evinced-web-mcp__evinced_get_webpage_issue_details(issueSignature=$SIGNATURE)`** to get the rich context: rule title, severity, WCAG ref, DOM snippet, selector, screenshot, and Evinced's `remediation_instructions`. The remediation text is the agent's primary guide for the patch.
4. Check for an existing PR on `demo-fe` keyed by the signature.
5. Resolve URL → Next.js App Router source file under `target.routeRoot`.
6. Apply the minimal JSX edit per the MCP's remediation guidance (via the `Edit` tool).
7. Write `a11y-findings/<signature>.md` with the tracking record.
8. Create branch, commit, push, `gh pr create`. Honors `$DRY_RUN` for no-op runs.

If any MCP call fails, the prompt instructs the agent to fall back to reading the JSON report directly via the `Read` tool.

### 4.6 Auth — required secrets

| Secret | Used by | Notes |
|---|---|---|
| `EVINCED_NPM_TOKEN` | `Configure .npmrc` step | Full multi-line `.npmrc` content with the Evinced JFrog registry auth (see [Evinced MCP docs](https://developer.evinced.com/MCP-Servers/web-mcp-server) for template). |
| `EVINCED_SERVICE_ID` + `EVINCED_API_KEY` | Test SDK + MCP server `env` block | Token-auth flow for the Evinced platform. |
| `ANTHROPIC_API_KEY` | `claude-code-action` `with:` input | `sk-ant-…` API key. |
| `DEMO_FE_PAT` | Clone step + git push + `gh pr create` | Fine-grained PAT scoped to `EvincedShane/demo-fe` with `Contents: write` and `Pull requests: write`. Embedded in the cloned remote URL via `git remote set-url origin "https://x-access-token:${GH_TOKEN}@github.com/.../...git"` so subsequent `git push` calls authenticate non-interactively. |
| `SLACK_WEBHOOK_URL` | Summary job's `act10ns/slack@v2` | Optional. |

### 4.7 Target-repo coordination (`EvincedShane/demo-fe`)

`.github/CODEOWNERS` requires human approval on the tracking-file path:

```
/a11y-findings/  @EvincedShane
```

Branch protection on `main` requires CODEOWNERS review, which makes the tracking file a hard merge gate without any extra CI configuration on the FE repo.

## 5. Data flow

### Phase A — Tests run (`web-js.yml`)

1. `web-js.yml` triggers on push/PR/schedule/dispatch.
2. The `web-playwright-js` matrix entry runs `evMcpDemo.spec.js` against the configured `target.baseUrl`.
3. The Evinced SDK writes `test-results/evMcpDemo.html` and `test-results/evMcpDemo.json`.
4. The `Upload Evinced issues JSON artifact` step uploads `evMcpDemo.json` as `report-web-playwright-js-issues`.

### Phase B — Extract job

5. `web-a11y-autofix.yml` fires (via `workflow_run`, `workflow_dispatch`, or schedule).
6. The `extract` job downloads the issues artifact, recursively scans for `signature` fields, and emits `{"signature": [...]}` as a matrix output. The JSON is re-uploaded as `a11y-issues-staged` so each matrix instance can grab it directly.

### Phase C — Fix matrix (one job per signature)

For each signature, in parallel up to `max-parallel: 3`:

7. Clone `demo-fe` at `target.baseBranch`. Embed `DEMO_FE_PAT` in the remote URL.
8. Install system deps the Evinced MCP server needs (libsecret-1-dev, Chromium via Playwright).
9. Install the Evinced MCP package globally with `--ignore-scripts` (sidesteps the broken postinstall).
10. Run the visible "Invoke Evinced MCP" step — speaks MCP via stdio, shows the agent-observable tool list and the report being imported.
11. Substitute `__SIGNATURE__` into `prompts/a11y-autofix.md`.
12. Run `claude-code-action@beta` with:
    - `mode: agent`
    - `direct_prompt:` = the substituted single-issue prompt
    - `mcp_config:` pointing at the locally-installed `evinced-mcp-server` binary
    - `claude_env:` exporting `REPORT_PATH`, `TARGET_REPO_PATH`, `CONFIG_PATH`, `DRY_RUN`, `SIGNATURE`, `GH_TOKEN`
13. The agent inside the action:
    - Imports the report into ITS MCP instance.
    - Calls `evinced_get_webpage_issue_details` for its assigned signature.
    - Resolves the URL to a Next.js page file.
    - Applies the JSX edit if confident; otherwise tags `manual-review`.
    - Writes `a11y-findings/<signature>.md`.
    - Creates branch `a11y/fix-<signature>`, commits, pushes.
    - Opens (or refreshes) a PR via `gh pr create` (or logs `[DRY-RUN]` for dry-run mode).

### Phase D — Summary

14. The `summary` job posts a single Slack notification with the matrix result (`success`, `failure`, etc.).

### State across runs

- Branch existence in `demo-fe` is the only persistent state. No DB, no checkpoint file.
- Re-runs are idempotent: same signature → same branch name → same PR. If the PR is still open, the matrix job refreshes the branch via `git push --force-with-lease`. If merged/closed, the agent tags `skipped-closed-pr` and exits cleanly.

## 6. Error handling

Each matrix job is independent (`fail-fast: false`), so one signature's failure does not stop the others.

| Outcome | Cause | Visibility |
|---|---|---|
| `pr-opened` / `pr-updated` | Happy path | PR appears in `demo-fe`; agent prints outcome line |
| `pr-opened-dry-run` | `dry_run=true`; branch created locally but no push | Agent prints outcome line with `PR_URL: n/a` |
| `manual-review` | Agent unsure about the patch; tracking file flags it | PR still opens with `patch=(none)` |
| `route-unresolved` | URL didn't match any Next.js page file | Tracking file written; PR still opens for triage |
| `branch-conflict` | `--force-with-lease` rejected (someone manually edited the branch) | Agent posts a PR comment, does not retry with `--force` |
| `skipped-closed-pr` | Signature matches a previously-closed/merged PR | Logged in run output |
| `api-error` | LLM API exhausted retries, or `gh`/git auth fails | Final outcome line; next run retries |

### Lessons learned (from the live build-out)

These are the failure modes we hit and fixed during build-out; documenting so a forker doesn't have to repeat the discovery loop:

- **`workflow_dispatch` requires the workflow on the default branch.** Can't smoke-test a new `web-a11y-autofix.yml` from a feature branch until it's merged to `main`. Merge a minimum-viable version first, then iterate via dispatch from `main`.
- **`gh repo clone` doesn't embed credentials.** `git push` from the agent's shell fails with "could not read Username" unless you rewrite the remote URL: `git remote set-url origin "https://x-access-token:${GH_TOKEN}@github.com/<owner>/<repo>.git"` after the clone.
- **`claude-code-action@beta` requires `id-token: write` permission**, even when `anthropic_api_key` is set — the action probes OIDC first.
- **`claude-code-action@beta` ignores step-level `env:`.** Pass runtime vars via the `claude_env:` input instead; the action explicitly forwards those to the spawned subprocess.
- **`@evinced/mcp-server-web@1.0.x` postinstall is broken on fresh CI runners** — keytar's `prebuild-install` isn't on PATH and the package's own `build` script needs `vite` (a devDep). Install with `npm install -g … --ignore-scripts`; use the resulting `evinced-mcp-server` binary in `mcp_config.command` instead of `npx -y @evinced/mcp-server-web`.
- **The Evinced MCP server is browser-driven even in `--headless` mode.** Pre-install Chromium via `npx playwright install --with-deps chromium` or the server fails its handshake. Also install `libsecret-1-dev` for keytar.
- **MCP server `tools/call` for `evinced_get_webpage_issue_details` returns "not found" if no report has been imported.** The prompt MUST call `evinced_import_report` before per-signature lookups. Each matrix job runs a fresh MCP, so each one imports the report.

## 7. Testing & verification

### 7.1 Dry-run mode

`web-a11y-autofix.yml` accepts a `dry_run` `workflow_dispatch` input. When `true`:

- The agent runs end-to-end up through `git commit` (locally in the cloned target repo).
- It prints `[DRY-RUN] would push and open PR for <signature>` instead of running `git push`, `gh pr create`, `gh pr comment`.
- Final outcome is `pr-opened-dry-run` (or `pr-updated-dry-run`).
- No state changes in `demo-fe`.

### 7.2 Visible MCP probe

The "Invoke Evinced MCP" step (see §4.4) runs unconditionally in every fix job and logs the MCP's `tools/list` response plus the `import_report` response. If this step shows valid JSON-RPC frames, the MCP setup is healthy for that job. If it fails or shows an error, the agent step's MCP usage will too — and you have plain-text stderr to diagnose from.

### 7.3 Manual smoke checklist (in README)

1. Fork both repos. Set all secrets listed in §4.6.
2. Trigger `web-js.yml` once so an issues artifact exists.
3. Dispatch `web-a11y-autofix.yml` with `dry_run=true`. Verify:
   - "Invoke Evinced MCP" step shows real tool responses.
   - Each matrix job's agent step logs the MCP tool_use entries.
   - No PRs opened in `demo-fe`.
4. Dispatch again with `dry_run=false`. Verify one PR per signature in `demo-fe`.
5. Dispatch a third time, same settings. Verify no new PRs; existing PRs get refresh comments (idempotency).

### 7.4 What is NOT tested

- Whether the agent's *patches* are semantically correct. That's what the human reviewer + CODEOWNERS gate on `a11y-findings/**` are for.
- The MCP server's own behavior; we trust Evinced's published package.

## 8. Summary table

| Concern | Decision |
|---|---|
| Architecture | Three-job pipeline: `extract` → `fix` matrix (`max-parallel: 3`) → `summary` |
| Per-issue isolation | One matrix job per signature, fresh agent context, parallelism cap = 3 |
| Source locating | URL → Next.js App Router file resolved by the agent |
| PR strategy | One rolling PR per signature, idempotent on re-runs |
| Patch model | Hybrid: minimal JSX edit + `a11y-findings/<sig>.md` tracking file |
| Merge gate | CODEOWNERS on `/a11y-findings/**` in `demo-fe` |
| MCP install | `npm install -g @evinced/mcp-server-web --ignore-scripts` (broken postinstall sidestepped); use installed binary in `mcp_config.command` |
| MCP system prereqs | `libsecret-1-dev` (keytar), Chromium via Playwright (server browser) |
| MCP visibility | Dedicated "Invoke Evinced MCP" step before the agent step |
| MCP role | Load-bearing: `import_report` then `get_webpage_issue_details` per signature; remediation guidance drives the patch |
| Auth (this repo) | `EVINCED_NPM_TOKEN`, `EVINCED_SERVICE_ID`, `EVINCED_API_KEY`, `ANTHROPIC_API_KEY`, `DEMO_FE_PAT`, optional `SLACK_WEBHOOK_URL` |
| Auth (target push) | PAT embedded in the cloned remote URL so `git push` works non-interactively |
| Workflow permissions | `contents: read`, `actions: read`, `id-token: write` |
| Triggers | `workflow_run` of `web-js.yml`, `workflow_dispatch` (with `dry_run`), weekly `cron` |
| State | Branch existence in `demo-fe` only |
| Cost guardrail | `maxIssuesPerRun` in config (default 20); `max-parallel: 3` |
