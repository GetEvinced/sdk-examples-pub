# A11y Auto-Fix — Execute Now

You are an agent running INSIDE a GitHub Actions step. You are NOT writing code that someone else will run later. Every numbered step below requires you to invoke a tool RIGHT NOW. Read a step, do it, move to the next step. Do not summarize. Do not plan. Do not describe what you would do. Do it.

## Hard rules (violating any of these = run FAILED)

- Do NOT create any `.mjs`, `.js`, `.ts`, `.sh`, `.py` file at the repo root or in any directory under this repo. The only files you may create are: (a) markdown files under `$TARGET_REPO_PATH/a11y-findings/` and (b) edits via the `Edit` tool to existing `.tsx`/`.jsx` files under `$TARGET_REPO_PATH`.
- Do NOT invoke `node` on any script you wrote. The only `node` invocations allowed are calling the pre-existing helpers under `web/playwright/js/scripts/a11y-autofix-helpers/`.
- Do NOT write a "main loop" or "agent" — YOU are the loop, executing one tool call at a time.
- If you reach the end of this prompt without making MCP tool calls AND running `gh pr create` (or its `[DRY-RUN]` equivalent), you have FAILED.

## Environment (already set, just reference)

- `$REPORT_PATH` — Evinced issues JSON file
- `$TARGET_REPO_PATH` — fresh clone of the FE repo
- `$CONFIG_PATH` — `a11y-autofix.config.json`
- `$DRY_RUN` — `"true"` skips network mutations (git push, gh pr create, gh pr comment); branch creation and tracking-file writes still happen locally

## Step 1 — Read config

Use the `Read` tool on `$CONFIG_PATH`. Remember these keys: `target.owner`, `target.repo`, `target.baseBranch`, `target.baseUrl`, `target.routeRoot`, `prBranchPrefix`, `trackingFileDir`, `maxIssuesPerRun`.

## Step 2 — Load issues via the Evinced MCP

Call `mcp__evinced__evinced_import_report` with `file=$REPORT_PATH` and `model=claude-opus-4-7`. The tool returns the report's issue list (or a `reportId` you can follow up with).

If `evinced_import_report` returns an error OR the issue list is empty BUT the file is non-empty, fall back: use `Read` on `$REPORT_PATH`, parse as JSON, find the array — it may be the top-level value, or nested under a key like `issues`, `data.issues`, or per-page `pages[*].issues`. Flatten to a single array. Each item must have some stable identifier; use whichever field looks like a signature/id/hash, and refer to its value as `<signature>` for the rest of this run.

Log the issue count. If zero, write a summary saying "no issues, nothing to do" and STOP (run is successful).

## Step 3 — Process each issue

Cap the loop at `maxIssuesPerRun` (default 20). For each issue in order, run Steps 3.a through 3.f. Do NOT skip steps. Do NOT batch.

### 3.a — Get rich details via the MCP

Call `mcp__evinced__evinced_get_webpage_issue_details` with `issueSignature=<signature>` and `model=claude-opus-4-7`. Capture: rule title, severity, WCAG ref, DOM snippet, selector, screenshot URL/id, bounding box, AND the remediation instructions field. Evinced's remediation text is your PRIMARY guide for the patch. The summary JSON is just a table of contents.

If the MCP call fails for one issue, log `outcome=api-error` for that signature and continue to the next issue.

### 3.b — Pre-check for an existing PR

Run via `Bash`:

```
gh pr list \
  --repo <target.owner>/<target.repo> \
  --state all \
  --search "in:title <signature>" \
  --json number,state,headRefName
```

- If a result has `state=MERGED` or `state=CLOSED`: log `outcome=skipped-closed-pr` and SKIP to the next issue.
- If a result has `state=OPEN`: note the `headRefName` for Step 3.e; this issue will refresh that branch.
- If no results: this issue gets a new branch.

### 3.c — Resolve the source file

Strip `<target.baseUrl>` from the issue's URL. Walk `$TARGET_REPO_PATH/<target.routeRoot>/` for the matching Next.js App Router `page.tsx`, handling:

- literal directory segments (preferred match)
- route groups `(group)` (consume zero URL segments)
- dynamic `[id]` (consume one URL segment)

Use `LS`, `Glob`, and `Read` tools — NOT a script. If no `page.tsx` matches the URL path, log `outcome=route-unresolved` and proceed to Step 3.d to write a tracking record (skip the JSX edit; the PR is still useful as a tracking artifact).

If `page.tsx` imports other components, follow imports via `Read` + `Grep` to find the JSX element that owns the issue's selector. Stop at the first file you would actually edit.

### 3.d — Apply the JSX edit

Use the `Edit` tool (NOT `Bash` + `sed`) to apply the minimal change that implements Evinced's remediation instructions verbatim. For example, if the remediation says "Add `aria-label='Submit'`", literally add `aria-label="Submit"` to that JSX element. Do NOT touch unrelated lines.

If you are not confident the edit matches Evinced's intent, skip the JSX edit and tag this issue `manual-review`.

### 3.e — Write the tracking file

Use the `Write` tool to create `$TARGET_REPO_PATH/<trackingFileDir>/<signature>.md`. Content:

```
# <issue rule title>

- Signature: <signature>
- Severity: <severity>
- WCAG: <wcag-ref>
- URL: <issue.url>
- Selector: <issue.selector>
- Screenshot: <url or id>
- Source file: <resolved path or "route-unresolved">

## Evinced remediation guidance

<verbatim from MCP>

## Applied patch

\`\`\`diff
<the diff you applied, or "manual review needed">
\`\`\`

Verification: human must confirm fix matches intent.
```

### 3.f — Branch, commit, and PR

Slugify the signature into a branch name. Run:

```
node -e "import('./web/playwright/js/scripts/a11y-autofix-helpers/signatureToBranch.mjs').then(({signatureToBranch}) => console.log(signatureToBranch('<signature>', '<prBranchPrefix>')))"
```

via `Bash` to get the branch name. Then:

```
cd $TARGET_REPO_PATH
git checkout -b <branch>   # OR `git checkout <branch>` if 3.b found an existing open PR's branch
git add -A
git commit -m "[a11y] <rule title>"
```

If `$DRY_RUN=true`:
- Log `[DRY-RUN] would push and open PR for <signature>`.
- Log `outcome=pr-opened` (or `pr-updated`) for this signature with `prUrl=null`.
- Move to the next issue.

If `$DRY_RUN=false`:
- For a NEW branch:
  ```
  git push --set-upstream origin <branch>
  gh pr create \
    --repo <target.owner>/<target.repo> \
    --base <target.baseBranch> \
    --head <branch> \
    --title "[a11y] <rule title>" \
    --body "$(cat <trackingFileDir>/<signature>.md)" \
    --label a11y --label automated
  ```
  Capture the returned PR URL. Log `outcome=pr-opened`.
- For an EXISTING branch:
  ```
  git push --force-with-lease
  ```
  If accepted: `gh pr comment <pr-number> --body "Refreshed by run ${GITHUB_RUN_ID}"`. Log `outcome=pr-updated`.
  If rejected: do NOT use `--force`. Run `gh pr comment <pr-number> --body "Branch was edited externally; autofix skipping refresh."` Log `outcome=branch-conflict`.

## Step 4 — Emit run summary

After all issues are processed, print to stdout (no shell needed — just include it in your final response):

```json
{
  "runSummary": [
    {"signature": "...", "outcome": "pr-opened|pr-updated|manual-review|route-unresolved|branch-conflict|skipped-closed-pr|api-error", "prUrl": "..."}
  ]
}
```

## Success criteria

This run is SUCCESSFUL only if:

1. You called `mcp__evinced__evinced_get_webpage_issue_details` at least once per non-skipped issue.
2. You ran `gh pr create` (or its `[DRY-RUN]` log equivalent) for each issue that was not `route-unresolved` or `skipped-closed-pr`.
3. The total count of PRs opened or updated (in real or dry-run mode) equals the total issues processed minus `route-unresolved` minus `skipped-closed-pr` minus `api-error`.

If the run summary shows fewer PRs than expected, the run has FAILED.

## Reminder

DO NOT write a script that does this. DO NOT plan. DO THE WORK NOW, one tool call at a time, starting with Step 1.
