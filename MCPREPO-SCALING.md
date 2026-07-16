# Scaling the A11y Auto-Fix Pipeline to Many Front-End Repos

> **Status:** Forward-looking architecture guide. The demo in this repo (see [`MCPREPO.md`](./MCPREPO.md)) is 1:1 — one test spec → one front-end repo. This document describes what changes if you want **N test specs → M front-end repos** (e.g. one test per UI surface, each surface owned by a different team / repo).
>
> Nothing in this document is implemented yet. It's intended as a sketch for customers who are evaluating the demo and asking "how do I run this against my real estate of 30/50/100 repos?"

---

## The shape of the problem

The 1:1 demo couples three things into a single configuration:

1. **One Playwright test** that scans **one site URL**.
2. **One Evinced JSON report** uploaded as **one CI artifact**.
3. **One target FE repo** that receives **all** the PRs.

In a real environment with many UI surfaces — marketing site, dashboard, checkout flow, embedded widget, mobile-web variant, internal tools — these usually fan out across multiple repositories owned by different teams. The autofix pipeline needs to know which repo to PR into for each finding.

```
                          1:1 (current demo)              1:N (this guide)
                          ──────────────────              ─────────────────
                                                                  ┌─► marketing-site
                          ┌─► demo-fe                              │   (PRs for marketing issues)
   one test ── one report─┤                       multiple tests ─┼─► internal-dashboard
                          │   (all PRs land here)  multiple reports│   (PRs for dashboard issues)
                          │                                        │
                                                                  └─► checkout-frontend
                                                                      (PRs for checkout issues)
```

## The mapping is the key

Replace the single `target` block in `a11y-autofix.config.json` with a list of **scopes**. Each scope binds one test → one report → one target repo. The pipeline iterates over scopes.

```json
{
  "scopes": [
    {
      "name": "marketing-site",
      "sourceSpec": "web/playwright/js/tests/marketingSite.spec.js",
      "reportArtifactName": "report-marketing-site",
      "reportFile": "marketingSite.json",
      "target": {
        "owner": "acme",
        "repo": "marketing-site",
        "baseBranch": "main",
        "baseUrl": "https://www.acme.com",
        "routeRoot": "src/pages",
        "framework": "next-pages-router"
      }
    },
    {
      "name": "dashboard",
      "sourceSpec": "web/playwright/js/tests/dashboard.spec.js",
      "reportArtifactName": "report-dashboard",
      "reportFile": "dashboard.json",
      "target": {
        "owner": "acme",
        "repo": "internal-dashboard",
        "baseBranch": "develop",
        "baseUrl": "https://app.acme.com",
        "routeRoot": "src/app",
        "framework": "next-app-router"
      }
    },
    {
      "name": "checkout",
      "sourceSpec": "web/playwright/js/tests/checkout.spec.js",
      "reportArtifactName": "report-checkout",
      "reportFile": "checkout.json",
      "target": {
        "owner": "acme-payments",
        "repo": "checkout-frontend",
        "baseBranch": "main",
        "baseUrl": "https://pay.acme.com",
        "routeRoot": "app/routes",
        "framework": "remix"
      }
    }
    /* ... 100s more ... */
  ],
  "prBranchPrefix": "a11y/fix-",
  "trackingFileDir": "a11y-findings",
  "maxIssuesPerRun": 20
}
```

The `framework` field is a hint the agent prompt uses to pick the right routing convention for that target (App Router vs. Pages Router vs. Remix vs. SvelteKit vs. plain HTML, etc.). The hint changes how URL → source file resolution behaves inside that scope only.

## Architecture diagram (1:N)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ support-golden-examples (this repo)                                          │
│                                                                              │
│  web-js.yml                                                                  │
│    ├── runs marketingSite.spec.js → upload-artifact report-marketing-site    │
│    ├── runs dashboard.spec.js     → upload-artifact report-dashboard         │
│    └── runs checkout.spec.js      → upload-artifact report-checkout          │
└──────────────────────────────────────────┬───────────────────────────────────┘
                                           │
                                           ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ web-a11y-autofix.yml                                                         │
│                                                                              │
│  Job 1: extract  (one job for the whole run)                                 │
│    For each scope in a11y-autofix.config.json:                               │
│      ├── download that scope's artifact                                      │
│      └── jq for signatures                                                   │
│    Emit one combined matrix output:                                          │
│      [ {scope: "marketing-site", signature: "abc123"},                       │
│        {scope: "marketing-site", signature: "def456"},                       │
│        {scope: "dashboard",      signature: "789abc"},                       │
│        ... ]                                                                 │
│                                                                              │
│  Job 2: fix  (matrix.include, one job per (scope, signature) pair)           │
│    For each (scope, signature):                                              │
│      ├── clone scope.target.repo (uses scoped install token)                 │
│      ├── install Evinced MCP                                                 │
│      ├── invoke MCP with that scope's report                                 │
│      └── Claude agent: get_webpage_issue_details → patch → PR                │
│                                                                              │
│  Job 3: summary                                                              │
│    Aggregate outcomes per scope, post one rolled-up Slack message            │
└──────────────────────────────────────────┬───────────────────────────────────┘
                                           │
              ┌────────────────────────────┼────────────────────────────┐
              ▼                            ▼                            ▼
   ┌─────────────────────┐      ┌─────────────────────┐      ┌─────────────────────┐
   │ acme/marketing-site │      │ acme/internal-      │      │ acme-payments/      │
   │                     │      │   dashboard         │      │   checkout-frontend │
   │  PR per marketing   │      │  PR per dashboard   │      │  PR per checkout    │
   │  issue              │      │  issue              │      │  issue              │
   └─────────────────────┘      └─────────────────────┘      └─────────────────────┘
```

## What changes in the workflow

### Matrix becomes 2D via `matrix.include`

```yaml
fix:
  strategy:
    fail-fast: false
    max-parallel: 10           # bump from 3 — more parallelism with more scopes
    matrix:
      include: ${{ fromJson(needs.extract.outputs.matrix) }}
  steps:
    - uses: actions/checkout@v4
    - name: Clone target FE repo for this scope
      run: |
        gh repo clone "${{ matrix.scope.target.owner }}/${{ matrix.scope.target.repo }}" \
          ./_autofix_target -- --branch "${{ matrix.scope.target.baseBranch }}" --depth 50
    # ... rest of the per-job steps use matrix.scope.* everywhere
```

### Extract job emits a combined include[]

```yaml
extract:
  outputs:
    matrix: ${{ steps.list.outputs.matrix }}
  steps:
    - name: Build combined (scope, signature) matrix
      id: list
      run: |
        # for each scope in the config:
        #   download its artifact (or skip if missing)
        #   jq the signatures
        #   emit {scope: ..., signature: ...} entries
        # combine into one include[] JSON for the fix matrix
```

### Per-job prompt loading substitutes scope-specific values

```yaml
- name: Load agent prompt for this (scope, signature)
  run: |
    sed -e "s|__SIGNATURE__|${{ matrix.signature }}|g" \
        -e "s|__FRAMEWORK__|${{ matrix.scope.target.framework }}|g" \
        -e "s|__ROUTE_ROOT__|${{ matrix.scope.target.routeRoot }}|g" \
        -e "s|__BASE_URL__|${{ matrix.scope.target.baseUrl }}|g" \
        prompts/a11y-autofix.md > /tmp/prompt.md
```

The prompt's "Resolve source file" step then consults `__FRAMEWORK__` to pick the right routing convention.

## Auth at scale — use a GitHub App, not 100 PATs

The 1:1 demo uses a fine-grained PAT (`DEMO_FE_PAT`) scoped to one repo. That doesn't scale:

- PATs are per-user — if you leave, all 100 tokens rotate.
- Fine-grained PATs have a max-repo-count limit per token (currently 50).
- Token rotation is manual.

**Recommended at scale:** create a single GitHub App, install it on each target repo, mint short-lived installation tokens at runtime.

| Aspect | PAT (current demo) | GitHub App (scaled) |
|---|---|---|
| Setup | One token per target | One app, install on each target |
| Permissions | Per-token | App-level, applied to every install |
| Rotation | Manual | Auto (tokens are 1-hour TTL) |
| Identity | Tied to a user | App identity (e.g. "a11y-autofix") |
| Audit trail | "user X opened PR" | "a11y-autofix opened PR" |
| Per-repo write | Token must include each repo | App must be installed on each repo |

Workflow change:

```yaml
- name: Generate installation token for ${{ matrix.scope.target.owner }}/${{ matrix.scope.target.repo }}
  uses: actions/create-github-app-token@v1
  id: app-token
  with:
    app-id: ${{ secrets.A11Y_APP_ID }}
    private-key: ${{ secrets.A11Y_APP_PRIVATE_KEY }}
    owner: ${{ matrix.scope.target.owner }}
    repositories: ${{ matrix.scope.target.repo }}

- name: Clone target FE repo
  env:
    GH_TOKEN: ${{ steps.app-token.outputs.token }}
  run: |
    gh repo clone "${{ matrix.scope.target.owner }}/${{ matrix.scope.target.repo }}" \
      ./_autofix_target -- --branch "${{ matrix.scope.target.baseBranch }}" --depth 50
    # embed token in remote URL for git push
    cd ./_autofix_target
    git remote set-url origin "https://x-access-token:${GH_TOKEN}@github.com/${{ matrix.scope.target.owner }}/${{ matrix.scope.target.repo }}.git"
```

This repo only needs two secrets total for all targets: `A11Y_APP_ID` and `A11Y_APP_PRIVATE_KEY`. The token is minted per matrix job, scoped to that target only, and expires in 1 hour.

## Cost & rate-limit considerations

At 100 scopes × ~30 issues/scope × multiple LLM calls/issue, a single full run is a multi-thousand-API-call event. Practical caps:

| Limit | Where you'll hit it | Mitigation |
|---|---|---|
| Anthropic API rate limit | `429 Too Many Requests` on agent invocations | Cap `max-parallel` in the matrix (10–20 is safe for most tiers); enable [prompt caching](https://docs.claude.com/en/docs/build-with-claude/prompt-caching) on the system prompt so repeated calls reuse cached tokens |
| GitHub Actions concurrent runners | Free: 20, Pro: 40, Enterprise: 180 | Same — `max-parallel` caps concurrent runners |
| Anthropic monthly token budget | Per-org spend cap | Enforce `maxIssuesPerRun` per scope in config; skip scopes whose test passed this run |
| GitHub abuse-detection (PR creation) | Too many PRs in too short a window | Build a small jitter into PR creation, or sample scopes per run |

### Sampling — don't process every scope every run

Most CI changes only affect a subset of scopes. Three sampling strategies:

1. **Artifact-presence sampling** (simplest). Extract job iterates `scopes[]`; if a scope's artifact wasn't produced by the upstream `web-js.yml` run, skip it. Naturally limits work to "tests that ran this trigger."
2. **Path-filtered triggers**. Each scope's test directory drives a separate `paths:` filter in `web-js.yml`. Only run the affected test suite.
3. **Manual scope filter on dispatch**. Add a `scopes` text input to `workflow_dispatch` so the operator can scope a run: `dry_run=false scopes=marketing-site,checkout`.

## Framework heterogeneity

The agent's Step 4 ("Resolve the source file") currently assumes Next.js App Router. At scale, target repos use a mix of frameworks. Encode the conventions per scope:

| `framework` value | Source file convention | Routing rule |
|---|---|---|
| `next-app-router` | `src/app/<segment>/page.tsx` | literal / `(group)` / `[id]` / `[...slug]` |
| `next-pages-router` | `src/pages/<segment>.tsx` | literal / `[id]` / `[...slug]` |
| `remix` | `app/routes/<segment>.tsx` | dot-separated nested + `$id` dynamic |
| `sveltekit` | `src/routes/<segment>/+page.svelte` | literal / `[id]` / `[...slug]` |
| `vue-router` / `nuxt` | `pages/<segment>.vue` | similar conventions |
| `static-html` | `public/<segment>.html` | direct URL → file mapping |

Add a `Framework conventions` section to the agent prompt that consults `__FRAMEWORK__` and picks the right resolution rules. Or extract framework-specific resolvers into separate helper files like `web/playwright/js/scripts/a11y-autofix-helpers/resolveRoute.next-app.mjs`, `resolveRoute.next-pages.mjs`, etc. — and load the matching helper at agent-start.

## Observability — one run, many scopes

The summary job's Slack notification becomes more important at scale. Instead of a single `success/failure` line, aggregate per scope:

```
A11y autofix run #1234 — completed

  marketing-site:  ✅  8 PRs opened, 2 manual-review
  dashboard:       ⚠️  4 PRs opened, 6 route-unresolved
  checkout:        ❌  0 PRs opened (api-error)
  ... 97 more scopes (collapsed)

  Totals: 412 PRs opened, 28 manual-review, 73 route-unresolved, 5 api-error
  Full run: https://github.com/.../actions/runs/...
```

Implementation: each fix matrix job writes one outcome line to a job-step output. The summary job collects all matrix outputs and renders the per-scope table. For 100+ scopes, only show outliers in the Slack message and link to a generated `runs/<run-id>.md` artifact for the full table.

## Idempotency across scopes

Branch names in target repos need to disambiguate scope:

```
prBranchPrefix per-scope:  a11y/fix-<scope>-<signature>
```

The signature alone might (theoretically) collide across two scopes — `prBranchPrefix` becomes a per-scope value so the resulting branch is `a11y/fix-marketing-site-abc123` versus `a11y/fix-dashboard-abc123`. Same for the tracking file path: `a11y-findings/<scope>/<signature>.md`.

## Migration path

A reasonable sequence to get from the demo to the scaled architecture:

| Step | Change | Why |
|---|---|---|
| 1 | Refactor config to `scopes[]` with one item | Foundation — verify the 1:1 demo still works end-to-end with the new shape. |
| 2 | Add a second scope with the **same** target repo as scope 1 | Verifies the matrix expansion logic; nothing changes in the FE world. |
| 3 | Swap `DEMO_FE_PAT` for a GitHub App, single target | Auth at scale without changing routing yet. |
| 4 | Add a second scope with a **different** target repo | Cross-repo PR creation works. Confirms the App is installed on both. |
| 5 | Wire `framework` hint into the prompt; add resolvers for the framework(s) you target | Framework heterogeneity. |
| 6 | Add sampling so unchanged scopes are skipped | Cost / rate-limit / runtime control. |
| 7 | Roll up the summary Slack into a per-scope table | Observability. |
| 8 | Onboard the next 10 / 50 / 100 scopes | Each is a config entry + GitHub App install. |

Each step is one PR plus one CI dispatch to validate.

## Open questions to think through with your team

- **Who owns the PR triage?** Per-scope CODEOWNERS in each target repo, or a central a11y team that reviews everything?
- **What's the merge gate?** CODEOWNERS-only (demo), or require CI green on the target repo too (production)?
- **Schedule cadence.** Per-scope cron, or one global cron that fans out?
- **Cost ownership.** Single Anthropic key billed to one team, or per-team keys per scope?
- **What happens when a target repo refactors and routes change?** The agent will start emitting `route-unresolved`. Worth a separate alert.
- **What's the lifecycle of stale PRs?** Auto-close after N days with no activity? Comment with a refresh reminder?

These aren't blockers for the architecture — they're the operational decisions that turn a working pipeline into a healthy production service.

---

## What this document is not

- Not a runbook. The 1:N architecture isn't implemented in this repo.
- Not a guarantee of cost. Real numbers depend on your scopes, issue counts, and Anthropic tier.
- Not the only valid architecture. A team that owns 100 repos through monorepo tooling might prefer a single monorepo target with a `routes/` partition map instead of N separate repos.

It's a starting point for the conversation about taking the demo to production. Pair it with [`MCPREPO.md`](./MCPREPO.md) (what's actually built) when evaluating with stakeholders.
