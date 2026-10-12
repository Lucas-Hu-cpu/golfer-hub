# Release Readiness: 12 October 2026

Status: PREPARATION, NOT APPROVED FOR PRODUCTION. A functioning Preview is not a public release or proof that Production services are configured.

## Identified candidate

- GitHub source: `2c52c1e6b0a347db8a334069c339e089a744966d` on `codex/golfer-hub-preview`.
- Local matching source: `1541054bfb6c6d9c540fadd03ba1bbc3f744e21c`.
- Release tree: `8e28a8b577c0e7cb0e7925ed57582671e57e02fa`.
- Automatic Git Preview: https://golfer-hub-5rts-hevc59424-lucaspokerface.vercel.app.
- Deployment: `dpl_2E8QPcrhx6fp9bPQSwRU1QoZiCym`, READY, `source=git`, Preview, branch and SHA verified. Build logs clone the exact branch/commit and use release's pnpm 11.25.0 / Next.js 16.4.0. A separate API-triggered Git build `dpl_65CSSY2g6vHQCUikS8syng1zjFtt` is not used as automatic-trigger evidence.
- Main remains `ff85a3301d176d06025c229764e3ad599b340850`. No Production build, promotion, main push, domain reassignment or access-protection reduction occurred.

Future documentation and rollback-only test-script commits do not change the application implementation of this identified candidate. Do not replace its immutable Preview URL with a moving branch alias in acceptance evidence.

## Release-required gates

| Gate | Evidence / status | Why required |
| --- | --- | --- |
| Reproducible Git Preview | PASS: exact branch/SHA, shared root `release`, lockfile install and READY automatic Git build; shared settings affect future Production and are recorded in the runbook. Production automatic builds paused by ignored-step rule. | Prevent releasing legacy root source or silently rebuilding untested code. |
| Isolated Production data | OPEN: migration/env manifest prepared; new Production project not created, schema/RLS not verified there. Preserve Preview; curated seed only, zero QA identity/activity/private-data transfer. | Real account isolation and data preservation cannot be inferred from test configuration. |
| Official origin / auth | OPEN: owner must select canonical HTTPS origin; new Production Site URL and exact callback must match it. Preview Site URL remains localhost and its existing allowlist is retained. The new Preview URL needs its own exact callback approval before email tests. | Incorrect allowlists send confirmation/recovery to the wrong site. |
| Transactional mail | OPEN: verified sender/domain, custom SMTP and two mailbox-provider confirmation/recovery tests required. Owner enters SMTP secret directly. | Default Supabase test mail is not production-ready delivery. |
| Expired / reused recovery | OPEN: real unused expired link and already consumed link must deny a reset/session. Invalid-code error UI passed but is not equivalent. | Credentials must not be recoverable from stale/consumed links. |
| Permissions | Existing real two-account browser isolation/admin denial and rollback-only live PostgreSQL claims tests passed. New Preview anonymous dashboard redirects to login; noindex/no-store confirmed locally. Reauthenticate ordinary and admin accounts on the final candidate and repeat real-session mutation/denial. Direct adversarial REST/JWT coverage remains untested. | Account boundaries are launch-critical; SQL impersonation alone is not full request-path verification. |
| CMS integrity | Existing real draft/publish/rejected-save/citation replacement/unpublish passed. NEW: two real SQL Editor sessions passed editorial-lock contention and rejected a cited source's unsafe needs-review transition; both transactions rolled back. This is database concurrency evidence, not two simultaneous authenticated CMS clients. | Prevent mismatched or unreviewed published instruction. |
| Accessibility / mobile | Skip link focuses main after fix; 320px learning-detail/coach mobile navigation passed. Local signup/recovery/empty/404/admin-denial pages had no horizontal overflow and labeled controls. Prior mobile CMS at 390px passed. Final authenticated dashboard/admin/report flows and keyboard-only forms need renewed final-candidate checks. | Essential functions must remain usable on phones and keyboard; not a WCAG certification. |
| Error states | PASS: isolated temporary source copy with a deliberately unreachable localhost database rendered HTTP 500, useful retry/home controls, no sample-data substitution, no visible stack trace; retry remounted the error and 320px document did not overflow. Invalid callback, empty search/coach, not-found and required-input states inspected. Provider SMTP rejection/rate-limit flows remain to test. | Failures must not fabricate user records or expose diagnostics. |
| Operator / youth / moderation / media | OPEN: concrete proposed notices and handling in production-owner-decisions.md await owner facts, choices and operating capacity. No policy promises applied. Current signup has no age enforcement. | A public user-to-user service aimed at students needs more than technical tests. |
| Backup / restoration | OPEN: no verified restorable Production backup yet; export/restore drill and deletion-ledger handling required after project choice. | Code rollback cannot restore lost data. |
| SEO | PASS policy tests: Preview never indexes; production opt-in required; forum/auth/private/unknown routes remain noindex. Preview robots disallows all and sitemap is empty. Production guard rejects missing HTTPS origin/missing DB config/known test project. Actual Production headers/sitemap verified only after exact release approval. | Avoid indexing tests or private pages and accidental test-database use. |

## Can Be Deferred With These Conditions

- Populated coach directory, ratings, enquiries to real coaches and review UI: only while there are zero authorized profiles; never manufacture people or engagement. Private enquiry authorization remains mandatory before enabling real profiles.
- Full booking/payment, coach-side dashboard and AI swing analysis: outside agreed scope.
- Automated retention scheduler and self-service deletion: manual deletion queue is acceptable only with a named responsible operator, realistic deadlines, records and verified backup/deletion handling before the notice promises them.
- Broad performance tuning, public-page CDN caching and advanced analytics: correctness/privacy currently take priority; private/no-store is deliberate and should not be weakened merely for a score.
- Full external accessibility certification: can follow a pilot, but keyboard, meaningful labels, contrast and critical-flow mobile defects cannot be deferred. Optional video should be removed if its accessibility/right-to-use cannot be supported; a text lesson does not automatically certify the player.
- Search indexing may remain disabled at launch. Enabling curated public pages is an owner choice, not a prerequisite for authenticated learning.

## Next Owner Handoff

Review production-owner-decisions.md once: actual operator/country/contact; official origin/domain; infrastructure budget and sender; retention and named moderation; young-user launch model; material rights and optional video; public indexing choice. Do not send passwords, SMTP secrets, service-role keys or complete email links. Those are entered personally in the relevant provider form. These decisions are NOT the separate Production release approval.

Costs and non-destructive recovery are in production-runbook.md. No successful old Production build was found, so the first release must remain protected if its smoke tests fail rather than pretending that rollback to an ERROR deployment restores a working site.
