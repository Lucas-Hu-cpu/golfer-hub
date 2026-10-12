# Deployment and Account Handoff

## Local Candidate

Run from `release/` with Node 24.x and pnpm 11.25.0:

```sh
pnpm install
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm dev -- --port 3100
```

On this Mac the sandbox cannot start Turbopack's FSEvent stream in dev mode. The tested development fallback is `WATCHPACK_POLLING=true pnpm dev -- --webpack --port 3100`. Production Turbopack build passed; this is a local watcher limitation, not a website deployment error.

Copy `.env.example` to an ignored local environment file and supply the isolated test project URL and public publishable key. Do not use a service-role key at runtime. `NEXT_PUBLIC_SITE_URL` must match the actual test origin; allow that origin's `/auth/callback` in Supabase Auth URL configuration. Keep email confirmation enabled.

## Applied Test Database

Migrations 001 through 005 were run through the Supabase SQL Editor with user authorization on 12 October 2026, only in `golfer-hub-preview`. Content imported: 15 lessons, 17 sources, 14 categories and nine forum categories. No user identities or coaches were invented. A clearly labeled QA discussion, comment and reply were created by the confirmed test account for integration tests, then the discussion was hidden reversibly. One clearly labeled CMS QA lesson was tested and restored to a private draft, not deleted. The initial content-import attempt appended to the previous editor content and failed at an existing table before insertion; the editor was fully replaced and the idempotent import succeeded.

The isolated project's Site URL remains `http://localhost:3100`. Its allowlist contains `http://localhost:3100/auth/callback` and, after exact approval, `https://golfer-hub-5rts-3x6x4pw8c-lucaspokerface.vercel.app/auth/callback`. No wildcard was added; email confirmation remains enabled. The user personally completed signup and confirmation. Lucaca was granted site administration after account-specific approval; organization privileges were not changed. The owner reported local and hosted recovery/re-login success; the resulting authenticated dashboards and retained private data were independently verified. The ordinary QA Member account was denied administration. Rollback-only live PostgreSQL role/claims checks passed without retaining fixtures or changing permissions. Expired/reused links remain acceptance gaps.

For a new independent project, apply migrations in filename order. Run `pnpm db:seed` to generate `.local/content-seed.sql`, then run the entire transaction in that project's SQL Editor. This command only generates a local script; it does not alter a remote database. The transaction inserts missing records without overwriting existing editorial records. Publication and normalized citations must commit together. No service-role key is required. Generated SQL is ignored; source content stays version-controlled.

## Owner Administration

Hosted ordinary-account login is independently verified on the exact candidate Preview. Private data carried over, a hosted checklist write/completion survived reload and was also visible locally, a bookmark persisted, and admin/hidden discussion/private draft access was denied. The owner reported completing hosted email recovery and re-login; the resulting authenticated dashboard retained both bookmarks and practice/progress data. Do not request or extract passwords, email links or session tokens. Credentials and full authentication URLs must never enter the repository or acceptance evidence.

After the owner signs up and confirms email, an explicitly authorized operator may insert that exact Supabase Auth user UUID into `admin_users` using SQL Editor. Do not infer the user from display name, grant administrator to all users, or assign a role through user-editable metadata. Ordinary users receive a 404 at `/admin`.

The administrator can edit structured category, forum category, lesson, source and coach records and publication status, hide/restore discussions/comments, review reports and read private enquiries. Coach publication requires permission evidence and a contact URL. Session enquiries are saved, not automatically emailed or booked. The administrator-only `save_lesson` RPC now atomically replaces course content and normalized citation links. Duplicate/missing references are rejected. Editorial statement triggers serialize lesson/source writes; deferred checks prohibit publication with mismatched or needs-review sources. Unpublish affected guides before marking an existing cited source for review. Local PostgreSQL tests verify late-write rollback and source status guards; a live two-session contention test is still pending.

Private practice goals support edit, completion, archive and restore. The weekly checklist uses Monday UTC; prior-week records are preserved rather than deleted.

## Preview / Production Gate

Current Preview: https://golfer-hub-5rts-3x6x4pw8c-lucaspokerface.vercel.app, READY, deployment `dpl_DUL1Jpod8EhbLQf2P1uUQW2WVC8Z`. Local source candidate `eafde95d143c59598ec7a9c040e43396fca92056`; matching GitHub source commit `26030f655543d7cd2d037371e3b39cacb2ba2b40` on `codex/golfer-hub-preview`; release tree `e3b50b2194012a25b9c491eb801f6750c137c4b9`. The 58 tracked release files were deployed through the authenticated source-file API, not a GitHub build. CLI authentication was unavailable and connector write returned 403, so synchronization used GitHub's official VS Code web editor after owner authorization. The editor recognized the existing GitHub session; no broader OAuth scope was accepted. An unresponsive directory import was canceled before staging files; individual files were then imported into verified matching folders. All 58 paths were checked before commit. A remote Git fetch confirmed the exact release tree and only additions under `release/`. Main remains `ff85a3301d176d06025c229764e3ad599b340850`; no main push, PR, force push or history rewrite occurred. Local and remote commit SHAs differ because the existing remote history was preserved; the release tree is identical.

Two public Supabase configuration values were added to Preview only. Branch scoping was unavailable during creation; the later remote branch creation has not changed that scope. No Production values or deployment protection were changed. Global root/build/install settings are preserved; `release/` was specified per deployment. Documentation commits after the candidate do not alter the deployed release tree. Preserve legacy files when adding only tracked `release/` and `docs/` files; never upload `.env.local`, build output or credentials. Do not force-push local history over the remote branch. Existing global settings still target legacy root source, so automatic Git previews are not accepted replacements for the source-file Preview. At inspection, the new `golfer-hub-5rts` Git Preview `dpl_G8M7157wrU4eaXoB65vE28XZ1q3k` was QUEUED for source commit `26030f6` with no build events; the other existing `golfer-hub` project's check reported failure. Neither changed the verified Preview or Production. Resolve the automatic pipeline separately with branch-isolated settings or an independent approved preview project, never by silently changing shared Production settings.

Preview only, after candidate checks pass. Scope environment variables to Preview and an isolated source branch where possible. Never modify Production variables or push main to test deployment. Preserve existing project settings and source. Record the exact commit, deployment ID and URL in the acceptance report and inspect the deployed result. Auth and metadata use the explicitly configured site origin, otherwise the exact platform-provided `VERCEL_URL`, otherwise localhost. Before hosted signup/recovery, obtain approval to add only that exact preview origin's `/auth/callback` to the isolated Supabase allowlist; do not add a wildcard or disable confirmation.

Production requires explicit `APPROVE GOLFER HUB PRODUCTION RELEASE` for that identified candidate. Privacy contact, retention, email deliverability, live auth/authorization tests, verified media and remaining acceptance gaps must be resolved first. No domain purchase, subscription, payments or deployment-protection reduction without separate authorization.
