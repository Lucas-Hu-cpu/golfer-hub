# Production Preparation and Rollback

Status: NOT RELEASED. Never deploy, stage a Production build, promote, push main or remove public-access protection before the owner's exact release approval. A Production build with `--skip-domain` is still a Production deployment and is prohibited before approval.

## Deployment configuration and blast radius

Project `golfer-hub-5rts`, ID `prj_XW71Ui0yNbyVsuKegVT9pW9ltOcb`, team `lucaspokerface`. Creating an independent release project through the connector returned 403; no new project was created. The existing project's future-build configuration was then changed under the preparation request:

- Root Directory: `release` (previously empty/legacy repository root).
- Install: `corepack pnpm install --frozen-lockfile` (previously `pnpm install`).
- Build: `corepack pnpm run build` (previously `pnpm run build`).
- Node 24.x and Next.js retained; include-outside-root disabled (previously enabled).
- Ignored Build Step: `if [ "$VERCEL_ENV" = "production" ]; then exit 0; else exit 1; fi` (previously Automatic).
- Deployment Protection remains `all_except_custom_domains`. No domain or Production env was changed.

Shared settings affect future Production builds, not just Preview. Existing deployments are not rebuilt by this change. The ignored step blocks automatic Production Git builds; it is not a universal access-control gate against a manual deployment API. The agent also enforces the owner's release prohibition. Only `codex/golfer-hub-preview` is synchronized for testing; main is untouched. The other connected legacy `golfer-hub` project is not modified.

Production inventory before new source synchronization: four deployments, all ERROR, newest `dpl_55CrQLwGvQ6QY8WhvHc9E7ffkPZZ`, created 22 July 2026. There is no verified previous READY production site for this project. Do not describe rollback to those failed deployments as a working-site recovery.

## Supabase separation and migration

Preview: `uptmnezfwbzywnutpucz`, project `golfer-hub-preview`. Production: new independent project, not yet created. Vercel Preview variables must continue to point at Preview; Production variables must point only at the new project. Never overwrite a test URL globally across both environments. Runtime needs only the public publishable key, never a service-role key or SMTP password.

Before any migration, inventory the target and create/export a restorable backup for any non-empty existing database. An empty new project is preferred. Record project reference, region, counts and schema versions. Do not run migration 001 over an existing populated schema; it is an initialization script, not a universal upgrade.

For the new approved project, apply in order:
1. `release/supabase/migrations/001_golfer_hub.sql`
2. `002_feed.sql`
3. `003_coach_permission_privacy.sql`
4. `004_practice_archive.sql`
5. `005_atomic_lesson_content.sql`

Run `pnpm db:seed` locally; it generates `.local/content-seed.sql` and does not contact a database. Apply the entire reviewed transaction only to the new project. Expected curated records: 15 published lessons, 17 sources, 14 learning categories, nine forum categories; zero coaches or community engagement. Existing editorial changes are not automatically migrated: export/review approved curated content separately if needed. Preserve the original databases and Git history. No QA account, password, private practice record, bookmark, test discussion, comment, draft, report, enquiry or vote is transferred. Accounts must register anew in Production; do not copy test Auth users or hashes.

Verify RLS, column grants, anonymous/draft visibility and ordinary/admin actions on the new project before release. Assign the exact confirmed Production operator UUID site administration only after explicit account-specific approval. Use neither display name nor editable user metadata to assign roles.

## Production environment and auth manifest

| Name / setting | Planned value | Scope |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | New Production project's HTTPS URL | Production only |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Matching public key | Production only |
| `NEXT_PUBLIC_SITE_URL` | Owner-selected exact HTTPS canonical origin | Production only |
| `NEXT_PUBLIC_PRIVACY_EMAIL` | Verified monitored operator address | Production only |
| `GOLFER_HUB_PUBLIC_INDEXING` | `false` until explicit indexing decision | Production only |
| Supabase Site URL | Same canonical origin, never localhost | New Production project |
| Supabase redirect allowlist | Exactly `<canonical-origin>/auth/callback` | New Production project |
| Email confirmation | Enabled | New Production project |
| Custom SMTP | Verified transactional sender/provider | Supabase Auth only |

No wildcard callback and no localhost callback in the Production project. The application's PKCE flow sends exact `redirectTo`/`emailRedirectTo` and exchanges the code at `/auth/callback`; recovery intent is an HttpOnly cookie. Preserve provider verification links using `{{ .ConfirmationURL }}` in the email template; do not replace them with a bare callback or blindly insert a token into a different flow. Preview continues using its separate exact callback allowlist. A new Preview URL needs its own precise test callback approval before email tests.

Production builds fail if the canonical origin is missing/not exact HTTPS, database credentials are missing, or the known Preview database URL is used. That guard is not proof of successful SMTP or of the matching key's validity; those require real checks.

## Mail test matrix

Before public registration: verify ownership of sender domain, SPF/DKIM, recommended DMARC, sender/from/reply-to, disabled link/open tracking and production provider quota. Owner enters secrets directly. Deliver confirmation and recovery to at least two owner-controlled mailbox providers; inspect delivery/spam and provider event status without logging full links.

For each browser-bound flow: request link in that browser, open latest message there, verify exact HTTPS callback, owner submits password personally, sign in and check persistent records. For reuse: owner reopens the already consumed provider verification link after sign-out and confirms it cannot authorize another reset; inspect resulting failure UI. For expiry: record the project expiry duration, leave one real link unused beyond it, then owner opens it; confirm no reset/session is granted. An arbitrary invalid callback code is not an expired-link test. Do not reduce global expiry or disable confirmation merely to pass testing. Supabase default mail is a test service, not an acceptable Production SMTP completion.

## Release and recovery

Freeze exact GitHub commit and release-tree hash after all blockers close. Obtain the exact approval phrase for that version. Only afterward prepare Production env/auth, remove the automatic-build pause deliberately if using Git, and create a Production build from the accepted commit without silently rebuilding a newer branch head. Because Production environment differs from Preview, run a protected Production verification before making its canonical domain public, then recheck the public URL: anonymous learning, real signup/confirmation, login/logout, recovery including denial, saved learning, practice persistence, ordinary/admin denial, posting/reporting/moderation and truthful coach empty state.

Rollback code only to an identified known-good Production build after one exists. First launch currently has no working Production predecessor: if smoke tests fail, do not expose it; retain the protected Preview and restore a reviewed safe/static or maintenance state. Never point public Production back at the Preview database. Preserve newly created real records; use forward corrective migrations, not destructive down migrations. A database restore requires a separately verified backup, explicit restoration scope/approval and deletion-ledger replay. Domain reassignment, security reduction and destructive restore require action-time authorization.

To abandon the configuration preparation, restore the original root/build/install/outside-root values recorded above; retain the Production ignore rule while release is prohibited. Restoration changes only future builds, not existing source. Keep all release source and Git history.

## Costs and limitations

Checked 12 October 2026: Vercel Hobby is $0 for non-commercial personal projects within quota. Supabase Free is $0, allows two active projects and may pause after one inactive week; automatic backups are not included. Supabase Pro starts at US$25/month including the first project; additional project compute may add cost. A reliable backup/export and restore drill is needed whichever plan is chosen. Resend offers a free tier with a 100-email daily limit; verify current monthly quota at selection. Domain registration, mailbox and any SMTP/paid-plan costs depend on the selected provider. No paid plan, domain or subscription has been purchased. See official [Vercel Hobby](https://vercel.com/docs/plans/hobby), [Supabase pricing](https://supabase.com/pricing), [Resend pricing](https://resend.com/pricing).
