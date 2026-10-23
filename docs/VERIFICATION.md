# Verification — 2026-10-23

Executed on dev-desktop in the isolated atomic worktree with Node 22 and installed Google Chrome.

| Check | Result |
| --- | --- |
| npm ci | PASS |
| npm run format:check | PASS |
| npm test | PASS, 12 tests |
| CHROME_BIN=/usr/bin/google-chrome npm run test:browser | PASS, 2 browser tests |
| npm run build | PASS |
| npm audit --audit-level=high | Zero known vulnerabilities |

Unit checks cover gateway paths, bearer/session handling, tenant/ID validation, correlation IDs, safe errors, redirect credential protection, pagination and graph validation. Browser checks load and save a visible graph using its saved version and show malformed saved nodes are rejected without replacing the current graph. Identity and API responses are synthetic browser fixtures; no real Keycloak/Kong runtime certification is claimed.

Known build warning: Vite ignores the upstream React Flow package's "use client" directive in this standalone client application.

Independent review's missing-pagination and malformed-node findings are addressed. Original local starter hashes remain unchanged. The remote was empty and had no rulesets; this first atomic branch is a bootstrap review candidate, not a promoted subsection or production release. An empty subsection/bootstrap-editor base was subsequently created for the initial PR; application code remains on the atomic branch. Live gateway/identity setup remains pending.


## Standalone foundation — 2026-10-23

On dev-desktop: formatting, 16 unit/HTTP tests, branch-policy tests, bundle build and 3 Chromium browser tests passed; npm audit reported 0 vulnerabilities. Tests cover saved-reference downloads without credentials/content/unsaved edits, metadata-only project lists, full detail reads, static hosting, forged headers, path bounds and gateway redirect refusal. The list regression was observed failing before its fix; corresponding backend PostgreSQL tests also passed. Browser tests use synthetic identity and intercepted project responses, not a live Keycloak or gateway.

A fresh independent source review was completed and both Important findings were fixed with regressions. The planned operation/handoff runbook is present. Local temporary test files used private memory-backed scratch after the shared host disk reached 100%; assertions were unchanged and expectation timeouts were extended locally.

The required hosted container-smoke job must verify the exact published image before promotion; the interrupted local image attempt is not passing evidence. See RUNBOOK.md and GOVERNANCE.md for startup, rollback, independent review and owner integration gates. No production effects, merge or deployment was enabled.
