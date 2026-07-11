---
name: detect-dead-duplicate-code
description: Finds dead code, duplicate logic, and unused symbols in a codebase. Use when the user asks to detect dead code, duplicate code, unused methods, variables, exports, assignments, files, or wants a cleanup audit.
---

# Detect Dead & Duplicate Code

Audit a workspace for code that can likely be deleted or consolidated.

Prefer SonarQube when the repo already has it configured. Use jscpd only to corroborate and quantify duplication.

## Playoff method

Use Playoff Method as a tournament, not a single-pass ranking.

1. Generate multiple candidate issue lists from different local passes, for example symbol references, import/export chains, lint output, and nearby duplicate clusters.
2. Compare the candidates against each other on evidence quality, true-unused likelihood, maintenance impact, and breadth of effect.
3. Pick the winner, tighten it, then run another round against the next-best candidates.
4. Stop when the report is stable and contains the top 10 issues only.

If two candidates are close, prefer the one with the clearest deletion test or the widest duplication footprint. Do not spend time on lower-ranked items unless they are needed to validate a top-10 candidate.

## Quick start

1. Identify likely issue groups: unused methods, unused variables, unused files, unused exports, unused assignments, dead branches, and duplicated logic.
2. Verify each candidate with nearby usages, references, call sites, and import/export chains.
3. Prefer findings that are concrete and actionable over speculative style complaints.

## Workflow

1. Start from the most concrete anchor: a suspicious file, symbol, lint result, or screenshot.
2. Use targeted search and symbol references to confirm whether the code is truly unused or repeated.
3. Group duplicates by shared behavior, not by superficial text similarity alone.
4. Report only what you can support with local evidence from the workspace.
5. Stop after the top 10 issues are identified and validated.

## Output format

Return findings in a table with these columns:

| Issue Type    | Severity | Likelihood     | Issues  |
| ------------- | -------- | -------------- | ------- |
| Unused method | Major    | Seen in 1 file | 1 issue |

Use the same issue types as the examples when possible:

- Unused method
- Unused variable
- Unused files
- Unused exports
- Unused assignments should be removed
- Duplicate code

## Severity guide

- Major: likely safe deletion or consolidation with meaningful maintenance impact.
- Minor: low-risk cleanup, local dead code, or small duplicate clusters.

## Advanced checks

- Follow import and export chains before calling something unused.
- Check whether a symbol is only used in tests, generated code, or dynamic reflection before reporting it.
- Treat one-off similarities as duplicates only when the shared behavior is substantial.

## Using jscpd well

Use jscpd for duplicate-code evidence, not as the final decision maker.

Run it through `npx` when it is not installed locally.

1. Scope it narrowly to the source folders that matter, not the whole repo and definitely not build output or dependencies.
2. Run it with a report format you can inspect locally, then sort by clone length and token count so the largest real duplicates rise to the top.
3. Prefer reports that include file pairs, start lines, and clone blocks; those are the only findings worth turning into action.
4. Set thresholds so noise drops out: ignore tiny repeats, generated code, lockfiles, compiled artifacts, and vendor directories.
5. Treat a jscpd hit as a lead, then confirm with local reading and symbol/reference checks before reporting it.

Example:

```bash
npx jscpd apps/datalake/src --format json --output .reports/jscpd
```

## Reporters

Use the reporter that best matches the next step.

- `ai` - best default when the result will be read by an AI agent; compact and token-efficient.
- `json` - best when you want a machine-readable report file you can sort, filter, or post-process.
- `markdown` - good for a human-readable summary that can be pasted into a review.
- `console` - good for a quick terminal pass when you only need a short list.
- `consoleFull` - use only when you need the code blocks inline.
- `sarif` - use when you need code-scanning style integration.
- `html` - use when a browsable duplicate report is helpful.
- `csv` and `xml` - use only when an external tool requires them.
- `verbose` - avoid unless you are debugging jscpd itself.

For this skill, prefer `ai` first, then `json` if you need a durable artifact.

Good jscpd output should answer three questions: what was duplicated, where it occurred, and whether the duplicate is large enough to matter.