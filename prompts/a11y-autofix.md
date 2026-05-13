# A11y Auto-Fix — Process ONE Issue

You are running inside ONE matrix job of a GitHub Actions workflow. Your scope is EXACTLY ONE Evinced accessibility issue, identified by its signature. You are NOT writing code that someone else will run. Every numbered step requires you to invoke a tool RIGHT NOW. Read a step, do it, move to the next.

## Issue to process

**Signature: `__SIGNATURE__`**

This is the only signature you handle. Do not process any other issue, even if you see them in the report.

## Environment (already set)

- `$REPORT_PATH` — Evinced issues JSON file
- `$TARGET_REPO_PATH` — fresh clone of the FE repo
- `$CONFIG_PATH` — `a11y-autofix.config.json`
- `$DRY_RUN` — `"true"` skips git push / `gh pr create` / `gh pr comment`; branch creation and file writes still happen locally
- `$SIGNATURE` — same value as `__SIGNATURE__` above

## Hard rules (violating any of these = run FAILED)

- Do NOT create any `.mjs`, `.js`, `.ts`, `.sh`, or `.py` file anywhere. The only files you may create are: (a) ONE markdown file at `$TARGET_REPO_PATH/<trackingFileDir>/__SIGNATURE__.md` and (b) edits via the `Edit` tool to existing `.tsx`/`.jsx` files inside `$TARGET_REPO_PATH`.
- Do NOT invoke `node` on any script you wrote. The only `node` invocation allowed is the one shown in Step 6 for the pre-existing `signatureToBranch` helper.
- Do NOT process any signature other than `__SIGNATURE__`.
- If you reach the end of this prompt without calling the Evinced MCP AND running `gh pr create` (or its `[DRY-RUN]` equivalent), you have FAILED.

## Step 1 — Read config

Use `Read` on `$CONFIG_PATH`. Remember: `target.owner`, `target.repo`, `target.baseBranch`, `target.baseUrl`, `target.routeRoot`, `prBranchPrefix`, `trackingFileDir`.

## Step 2 — Get issue details via the Evinced MCP

Call `mcp__evinced__evinced_get_webpage_issue_details` with `issueSignature="__SIGNATURE__"` and `model="claude-opus-4-7"`. Capture from the response: rule title, severity, WCAG ref, URL, selector, DOM snippet, screenshot URL/id, AND the remediation instructions field. **Evinced's remediation text is your PRIMARY guide for the patch.**

If the MCP call fails or returns nothing for this signature: fall back. Use `Read` on `$REPORT_PATH`, find the entry where the `signature` field equals `"__SIGNATURE__"` (recursive search — the entry may be at the top level or nested under `issues`, `pages[*].issues`, etc.), and use that entry's data instead. Log "fell back to direct JSON read for __SIGNATURE__" in your reasoning so the operator knows the MCP isn't working.

## Step 3 — Check for an existing PR

Run via `Bash`:

```
gh pr list \
  --repo <target.owner>/<target.repo> \
  --state all \
  --search "in:title __SIGNATURE__" \
  --json number,state,headRefName
```

- If a result has `state=MERGED` or `state=CLOSED`: print `outcome=skipped-closed-pr`, finish Step 7, and stop.
- If a result has `state=OPEN`: note `headRefName` for Step 6 (this run will refresh that branch).
- Otherwise: this signature gets a NEW branch in Step 6.

## Step 4 — Resolve the source file

Strip `<target.baseUrl>` from the issue's URL. Walk `$TARGET_REPO_PATH/<target.routeRoot>/` for the matching Next.js App Router `page.tsx`, handling:

- literal directory segments (preferred match)
- route groups `(group)` (consume zero URL segments)
- dynamic segments `[id]` (consume one URL segment)

Use the `LS`, `Glob`, and `Read` tools — not a script. If no `page.tsx` matches the URL path, print `outcome=route-unresolved`, proceed to Step 5 to write a tracking file (skip the JSX edit), then proceed to Step 6 (branch + commit + PR still happen so the operator has an artifact to triage).

If `page.tsx` imports other components, follow imports via `Read` + `Grep` to find the JSX element that owns the issue's selector. Stop at the first file you would actually edit.

## Step 5 — Apply JSX edit + write tracking file

If a source file was found in Step 4, use the `Edit` tool (NOT `Bash + sed`) to apply the minimal change that implements Evinced's remediation instructions verbatim. Example: if remediation says `Add aria-label="Submit"`, add literally `aria-label="Submit"` to that JSX element. Do not touch unrelated lines. If you are not confident the edit matches Evinced's intent, skip the JSX edit and tag the outcome `manual-review`.

Use the `Write` tool to create `$TARGET_REPO_PATH/<trackingFileDir>/__SIGNATURE__.md` with this content:

```
# <rule title>

- Signature: __SIGNATURE__
- Severity: <severity>
- WCAG: <wcag-ref>
- URL: <url>
- Selector: <selector>
- Screenshot: <url or id>
- Source file: <resolved path or "route-unresolved">

## Evinced remediation guidance

<verbatim from MCP / fallback JSON>

## Applied patch

```diff
<the diff you applied, or "manual review needed">
```

Verification: human must confirm fix matches intent.
```

## Step 6 — Branch + commit + PR

Compute the branch name via `Bash`:

```
node -e "import('./web/playwright/js/scripts/a11y-autofix-helpers/signatureToBranch.mjs').then(({signatureToBranch}) => console.log(signatureToBranch(process.env.SIGNATURE, '<prBranchPrefix>')))"
```

Capture the output as `<branch>`. Then:

```
cd $TARGET_REPO_PATH
git checkout -b <branch>    # OR `git checkout <branch>` if Step 3 found an existing open PR's headRefName
git add -A
git commit -m "[a11y] <rule title>"
```

If `$DRY_RUN=true`:
- Print `[DRY-RUN] would push and open PR for __SIGNATURE__ on branch <branch>`.
- Set `outcome=pr-opened-dry-run` (or `pr-updated-dry-run` if refreshing) and proceed to Step 7.

If `$DRY_RUN=false`:
- For a NEW branch:
  ```
  git push --set-upstream origin <branch>
  gh pr create \
    --repo <target.owner>/<target.repo> \
    --base <target.baseBranch> \
    --head <branch> \
    --title "[a11y] <rule title>" \
    --body-file <trackingFileDir>/__SIGNATURE__.md \
    --label a11y --label automated
  ```
  Capture the PR URL. Set `outcome=pr-opened`.
- For an EXISTING branch (refresh):
  ```
  git push --force-with-lease
  ```
  - If accepted: `gh pr comment <pr-number> --body "Refreshed by run ${GITHUB_RUN_ID}"`. Set `outcome=pr-updated`.
  - If `--force-with-lease` is rejected (someone else pushed to the branch): do NOT use `--force`. Run `gh pr comment <pr-number> --body "Branch was edited externally; autofix skipping refresh."` Set `outcome=branch-conflict`.

## Step 7 — Print final outcome

As the very last lines of your response, print exactly:

```
SIGNATURE: __SIGNATURE__
OUTCOME: <one of: pr-opened | pr-updated | pr-opened-dry-run | pr-updated-dry-run | manual-review | route-unresolved | branch-conflict | skipped-closed-pr | api-error>
PR_URL: <url or "n/a">
```

## Reminder

DO NOT write a script. DO NOT plan. DO NOT process any other signature. DO THE WORK NOW for `__SIGNATURE__`, one tool call at a time, starting with Step 1.
