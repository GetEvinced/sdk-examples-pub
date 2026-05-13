# Cross-Repo Accessibility Auto-Fix Pipeline — Design

**Status:** Design / pre-implementation
**Date:** 2026-05-13
**Author:** Shane (`shane@evinced.com`)
**Scope:** Generic public example. One test repo (this one) → one front-end repo (`EvincedShane/demo-fe`).

---

## 1. Goal

Demonstrate an end-to-end pipeline where:

1. The Evinced SDK runs inside a Playwright JS test in CI in this repo.
2. The resulting issues JSON is handed to a Claude agent with the Evinced web MCP attached.
3. The agent maps each issue's URL back to its source component in a separate Next.js repo (`demo-fe`), proposes a code patch, and opens (or refreshes) a PR per issue.
4. A human reviewer approves the PR. The "merge → loop" step is out of scope for this iteration.

The pipeline is the example. It must be legible to a forker reading one workflow file and one config file.

## 2. Non-goals

- Auto-merging fixes or closing the loop back into a re-scan.
- Coverage for Cypress / WDIO / Selenium / TestCafe. Playwright JS only, one spec.
- Fan-out to multiple target repos. Single FE repo only.
- LLM-driven verification of patch correctness. Humans verify on the PR.
- GitHub App auth. PAT is sufficient for an example.

## 3. End-to-end flow

```
┌─────────────────────────────────────────────────────────────────────┐
│ support-golden-examples (this repo)                                 │
│                                                                     │
│  web-js.yml ──► Playwright JS test ──► Evinced SDK ──► report JSON  │
│       (trigger: push / PR / weekly / dispatch)             │        │
│                                                            ▼        │
│                                                    artifact upload  │
└──────────────────────────────────────────────────────────────┬──────┘
                                                               │
                                  workflow_run completed       │
                                                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│ web-a11y-autofix.yml (new, this repo)                               │
│                                                                     │
│  download artifact ──► clone demo-fe ──► claude-code-action         │
│                                          + Evinced MCP              │
│                                              │                      │
│                                              ▼                      │
│                              for each Evinced issue:                │
│                                URL → app/<route>/page.tsx           │
│                                propose patch                        │
│                                open/update PR keyed by signature    │
└──────────────────────────────────────────────────────────────┬──────┘
                                                               │
                                                               ▼
                                            ┌────────────────────────┐
                                            │ EvincedShane/demo-fe   │
                                            │ branch:                │
                                            │  a11y/fix-<signature>  │
                                            │ PR awaits human review │
                                            └────────────────────────┘
```

## 4. Components

### 4.1 `web-a11y-autofix.yml` (new workflow, this repo)

Triggers mirror the agent's two needs: (a) "react to whatever just produced a fresh report," (b) "I want to run this on demand."

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
      fixture_report:
        type: string
        default: ""
  schedule:
    - cron: "0 7 * * 1"   # 1h after web-js.yml's Monday cron
```

A single job, gated on `workflow_run.conclusion == 'success'` (or skipped on the `workflow_run` path entirely when the prior run failed).

Concurrency:

```yaml
concurrency:
  group: a11y-autofix-${{ github.ref }}
  cancel-in-progress: false
```

### 4.2 Pipeline config: `a11y-autofix.config.json` at repo root

Single source of truth a forker edits. Deliberately thin — the only "mapping" in the system.

```json
{
  "sourceSpec": "web/playwright/js/tests/evStartStop.spec.js",
  "reportArtifactName": "report-web-playwright-js-issues",
  "reportGlob": "**/evinced-reports/**/issues.json",
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

### 4.3 `.mcp.json` (generated at job runtime)

Written by a shell step at job start; not committed. Keeps the API key out of the repo and lets the same workflow file work for any forker.

```json
{
  "mcpServers": {
    "evinced": {
      "command": "npx",
      "args": ["-y", "@evinced/web-mcp"],
      "env": { "EVINCED_API_KEY": "${EVINCED_API_KEY}" }
    }
  }
}
```

### 4.4 Agent prompt: `prompts/a11y-autofix.md`

The load-bearing part. Four ordered phases per issue. Stored as a file in this repo and injected into `anthropics/claude-code-action` as the task description.

```
You are running in CI. You have:
  - An Evinced report at $REPORT_PATH (JSON, issue array).
  - A clone of EvincedShane/demo-fe at $TARGET_REPO_PATH (Next.js, src/app router).
  - The Evinced MCP for issue detail lookup.
  - gh CLI authenticated against demo-fe.

For each issue in the report:
  1. RESOLVE source. Map issue.url → src/app/<path>/page.tsx using Next.js
     file-based routing rules. If the route imports components from
     src/components/**, follow imports to find the JSX that produced
     the failing selector. Stop at the first file you'd need to edit.
  2. PROPOSE patch. Make the minimal JSX edit that resolves the issue.
     Do NOT touch unrelated lines. If you can't make a confident edit,
     skip the code change and proceed to step 3 with patch="(none)".
  3. WRITE tracking entry. Append/overwrite
     a11y-findings/<issueSignature>.md with:
       - Issue title, severity, WCAG ref
       - URL, selector, screenshot link
       - Source file you identified
       - Proposed patch (as fenced diff) or "manual review needed"
       - "Verification: human must confirm fix matches intent" line
  4. OPEN OR UPDATE PR. Branch name: a11y/fix-<issueSignature>.
     If branch exists and PR is open: push the new commit with
     --force-with-lease. If --force-with-lease is rejected (remote has
     commits you did not author), do NOT retry with --force — emit
     outcome=branch-conflict, leave the branch alone, and post a
     "branch was edited externally, skipping refresh" comment on the PR.
     If PR is closed/merged: skip (regression handled later).
     Otherwise: create branch, push, open PR titled "[a11y] <issue title>",
     body links the tracking file and includes the diff summary.

When all issues processed, emit a summary comment on each PR you touched
this run.

Hard rules (must never be violated):
  - Never push to main of demo-fe.
  - Never delete branches you did not create.
  - Never edit files outside the resolved component file and the
    a11y-findings/ directory.
  - Stop after maxIssuesPerRun issues even if more remain.
```

### 4.5 Auth

GitHub PAT in `secrets.DEMO_FE_PAT`. Fine-grained PAT scoped to `EvincedShane/demo-fe` only, with `Contents: write` + `Pull requests: write`. Documented in the README with a step-by-step PAT-creation walkthrough. GitHub App is intentionally not used — overkill for a public example.

Additional secrets reused from existing setup: `ANTHROPIC_API_KEY`, `EVINCED_API_KEY`, `EVINCED_SERVICE_ID`.

### 4.6 Tracking file convention in `demo-fe`: `a11y-findings/<signature>.md`

The verification fence. Each PR adds one such file alongside its JSX edit. The file is the human-readable record of what the agent saw, what source it identified, and the patch it proposes. Reviewing this file is the verification step that gates merge.

CODEOWNERS in `demo-fe` includes a line requiring human approval on `a11y-findings/**`:

```
/a11y-findings/  @EvincedShane
```

Branch protection on `main` of `demo-fe` requires CODEOWNERS review, which makes the tracking file a hard merge gate without any extra CI configuration.

## 5. Data flow

### Phase A — Tests run (existing `web-js.yml`, lightly extended)

1. Trigger fires (push / PR / schedule / dispatch). Matrix entry `web-playwright-js` starts.
2. Playwright spec named in `a11y-autofix.config.json` runs against the SUT. Evinced SDK captures issues and writes:
   - `web/playwright/js/evinced-reports/tmp/0_evincedIssues/*.json` — per-issue records (what the autofix consumes)
   - `web/playwright/js/evincedAggReports/aggregatedReportForRun.html` — human-readable
3. The existing `Upload HTML reports` step (`.github/workflows/web-js.yml:97`) keeps working. A new sibling step uploads the issues JSON tree as a stable, separately named artifact (`report-web-playwright-js-issues`). The autofix consumes this artifact, not a glob over the HTML one — that makes the autofix's input a contract.

### Phase B — Autofix workflow starts

4. `web-js.yml` finishes successfully → GitHub fires `workflow_run` → `web-a11y-autofix.yml` job begins.
5. Job gates: skip if `workflow_run.conclusion != 'success'`; skip if branch is not `main` (no autofix from PR runs). If issues artifact is missing despite a successful upstream run, fail loudly (see §6) — do not skip silently.
6. Read `a11y-autofix.config.json`. Download the issues artifact. Clone `demo-fe` at `target.baseBranch` using `DEMO_FE_PAT`. Write `.mcp.json` with `EVINCED_API_KEY` injected from secrets. Authenticate `gh` against `demo-fe` with the same PAT.

### Phase C — Agent loop (one pass over issues)

7. `claude-code-action` starts with the prompt from `prompts/a11y-autofix.md`. `$REPORT_PATH` and `$TARGET_REPO_PATH` env vars are injected.
8. For each issue, the agent executes:
   - **Dedup pre-check.** `gh pr list --repo <target> --state open --search "in:title <signature>"`. If matching PR exists, fetch and note the branch.
   - **Route resolution.** Strip `target.baseUrl` from `issue.url` → path segment → walk `src/app/<path>/page.tsx` per Next.js rules (dynamic segments `[id]`, route groups `(group)`). If `page.tsx` imports a component, follow imports to find the JSX owning `issue.selector`.
   - **Patch.** Minimal JSX edit. If no confident edit, `patch=(none)` and the tracking file marks "manual review needed".
   - **Branch op.** Existing branch: `git checkout <branch>`, replay edits, `git push --force-with-lease`. If `--force-with-lease` is rejected, do not retry with `--force`; tag the issue `branch-conflict` and continue. New branch: `git checkout -b a11y/fix-<signature>`, write changes, push.
   - **PR op.** `gh pr create` (title, body, labels: `a11y`, `automated`). Existing PR: `gh pr comment` with a "refreshed on run X" note.

### Phase D — Wrap-up

9. Agent emits a run summary as a workflow step output: counts of new PRs, refreshed PRs, skipped issues with reasons.
10. Workflow surfaces that summary in the GitHub Actions UI and posts one Slack message via the existing `act10ns/slack@v2` pattern (`.github/workflows/web-js.yml:106`) to `#workflows`.

### State across runs

Branch existence in `demo-fe` is the only persistent state. No database, no S3, no JSON checkpoint. Idempotency derives entirely from `issueSignature` → branch name being deterministic.

### Signature stability assumption

The pipeline assumes `issueSignature` values are stable across runs for the same underlying issue. The Evinced MCP's `evinced_get_webpage_issue_details` accepts `issueSignature` as a parameter, which strongly implies stability — but this is verified at runtime (see §6).

## 6. Error handling

Principle: **never block the test workflow, never silently swallow, isolate per-issue failures so one bad issue does not tank the run.**

### Fail-fast at the workflow level (job exits non-zero, Slack red)

- `workflow_run.conclusion != 'success'` → skip (correct behavior, not an error).
- `secrets.DEMO_FE_PAT` missing or expired → fail with "PAT secret missing or lacks `Contents: write` + `Pull requests: write` on `<target>`"; README links the renewal flow.
- `demo-fe` clone fails → fail with the underlying `gh` error.
- `.mcp.json` write fails or `EVINCED_API_KEY` missing → fail.
- Issues artifact missing entirely → fail (`web-js.yml` succeeded → this artifact must exist).

### Fail-soft, continue (job exits 0 with warnings in summary)

- Issues artifact present but empty → log "no issues, nothing to do", exit clean. This is the "everything's healthy" path and must not look like a failure.
- Anthropic API transient error during an issue → retry with backoff (3 attempts), then mark that issue `api-error` and continue.

### Per-issue outcomes (tagged in run summary)

| Outcome | Cause | Visible where |
|---|---|---|
| `pr-opened` | Happy path, new PR | Run summary + Slack |
| `pr-updated` | Existing branch refreshed | Run summary |
| `manual-review` | Agent could not find component or was not confident — tracking file written with `patch=(none)`, PR still opens | PR body flags this |
| `route-unresolved` | URL does not map to a `page.tsx` (redirect / rewrite / middleware) — no PR, tracking record in run summary only | Run summary |
| `branch-conflict` | Agent's branch was edited by a human — agent does NOT `--force-with-lease` over human edits; posts a PR comment instead | PR comment |
| `skipped-closed-pr` | Signature matches a closed/merged PR — leave alone | Run summary |
| `api-error` | Anthropic API exhausted retries on this issue | Run summary; next run retries |

### Signature-stability self-check

First-run sanity check: log every signature seen. If a second scheduled run shows zero overlap with the prior run's signatures, the autofix workflow self-disables by failing fast with a clear message, before opening duplicate PRs. README documents the failure mode and how to swap in a content-hash fallback (`sha1({url, ruleId, normalized-selector})`).

## 7. Testing & verification

Three layers.

### 7.1 Local-runnable helpers (no LLM needed)

Deterministic pieces pulled out of the prompt into Node helpers at `web/playwright/js/scripts/a11y-autofix-helpers/`:

- `resolveRoute(url, config)` — URL → `src/app/.../page.tsx`. Handles dynamic segments + route groups.
- `signatureToBranch(signature, prefix)` — pure mapping.
- `loadIssues(reportPath)` — parses and validates the issues JSON shape; throws loudly on schema drift.

Each gets a tiny `*.test.mjs` alongside it using `node --test`. Three or four tests per helper. They run in CI as a fast gate before the agent ever invokes. If the issues JSON schema changes upstream, `loadIssues` tests fail loudly first.

### 7.2 Dry-run mode

`web-a11y-autofix.yml` accepts two `workflow_dispatch` inputs (declared in §4.1):

- `dry_run` (bool, default false) — agent runs end-to-end but `gh pr create`, `git push`, and `gh pr comment` are replaced with logged no-ops. Branch creation still happens in the local clone so the diff is inspectable in the run log. Run summary prefixes every outcome with `[DRY-RUN]`.
- `fixture_report` (string, default empty) — when set, skip artifact download and use the checked-in fixture at the given path (e.g., `web/playwright/js/fixtures/a11y/sample-issues.json`). Lets the prompt be iterated on without re-running the live tests.

### 7.3 Manual smoke checklist (in README)

1. Fork both repos. Set `DEMO_FE_PAT`, `ANTHROPIC_API_KEY`, `EVINCED_API_KEY`, `EVINCED_SERVICE_ID` secrets.
2. Trigger `web-a11y-autofix.yml` with `dry_run=true` + `fixture_report=...`. Verify run summary shows expected actions, no PRs opened.
3. Trigger with `dry_run=false` + same fixture. Verify exactly one PR per fixture issue.
4. Trigger again immediately. Verify no new PRs; existing PRs get a refresh comment.
5. Close one PR. Trigger again. Verify the closed PR is not reopened.
6. Trigger the full pipeline (no fixture). Verify it runs against a live Evinced report and produces the same shape of result.

### 7.4 Not tested

- Whether the agent's *patches* are semantically correct. That is what the human reviewer + CODEOWNERS gate on `a11y-findings/**` are for.
- Cross-account auth edge cases (PAT scope reductions, App fallback).

## 8. Summary table

| Concern | Decision |
|---|---|
| Architecture | Separate workflow (`web-a11y-autofix.yml`), triggered by `workflow_run` of `web-js.yml` |
| Scope | One Playwright JS spec; one FE repo; stops at PR |
| Source locating | URL → Next.js route file → agent search in that subtree |
| PR strategy | One rolling PR per `issueSignature` (idempotent) |
| Patch model | Hybrid: code edit + `a11y-findings/<sig>.md` verification fence |
| Merge gate | CODEOWNERS on `a11y-findings/**` in `demo-fe` |
| Auth | Fine-grained PAT in `DEMO_FE_PAT` secret |
| Mapping | Thin `a11y-autofix.config.json` at this repo's root |
| Agent | `anthropics/claude-code-action` + Evinced web MCP |
| State | Branch existence in `demo-fe`; no DB, no checkpoint files |
| Cost guardrail | `maxIssuesPerRun` (default 20) |
