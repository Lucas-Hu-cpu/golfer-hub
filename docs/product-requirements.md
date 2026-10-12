# Golfer Hub Requirements Traceability

Authority: the latest master instruction pasted on 12 October 2026. The Desktop historical brief supplies context, not independent release authority.

Status definitions: pending, implemented, locally verified, externally verified, partially verified, blocked. Implementation is not acceptance; see acceptance-report.md for uncompleted gates.

| ID | Requirement and provenance | Status | Implementation / verification | Acceptance |
| --- | --- | --- | --- | --- |
| GH-01 | English independent student-built golf platform; confirmed | implemented | release/app, About; no invented affiliations | Final editorial review |
| GH-02 | Preserve green editorial golf identity and assets; confirmed | partially verified | Desktop/mobile learning screenshots; media register | Latest private/admin screens still need review |
| GH-03 | Home, Learn, Forum first; all core/support pages; confirmed | partially verified | Next.js routes; browser navigation to core workflows | Remaining routes/error-state checks |
| GH-04 | 14 categories; sourced substantial lessons; confirmed | locally verified | 15 structured guides; content/ref tests; live import | Detailed source/editorial review |
| GH-05 | Real sources and instructional media; confirmed | partially verified | Direct/indexed references; original diagrams; attribution; hosted video playback to 39 seconds | Asset rights, video accessibility and wider availability |
| GH-06 | Real signup/login/logout/recovery; confirmed | partially verified | Two confirmed accounts; owner-completed local/hosted recovery; authenticated persistence observed | Expired/reused links and broader auth regression |
| GH-07 | Persistent posts/comments/replies/votes; confirmed | partially verified | Live create/comment/reply/vote + refresh; SQL ownership tests | Live second account and re-login |
| GH-08 | Forum search/categories/hot/new/top/unanswered; confirmed | partially verified | Documented query sorting; live search/Top/Unanswered | Broader fixture/category/pagination checks |
| GH-09 | Persistent saves/goals/checklist/progress; confirmed | partially verified | Two accounts; edit/archive/restore; hosted writes and local cross-origin read; post-recovery persistence | Broader hosted regression |
| GH-10 | Honest authorized coach discovery/enquiries; confirmed | implemented | Truthful empty directory; protected permission records | Authorized live profile/contact tests |
| GH-11 | Secure CMS/moderation; confirmed | partially verified | Admin denial; category edit; reports/hide/restore; atomic lesson/citations and live publication transitions | Concurrent source writes; broader CMS checks |
| GH-12 | Input validation/rate limits/private records; confirmed | partially verified | Zod + RLS tests; live rollback-only two-account role/claims checks | Direct REST/concurrent-session checks |
| GH-13 | Privacy/guidelines/accessibility/SEO; confirmed | implemented | support routes, metadata, noindex, privacy review | Owner policy decisions and accessibility review |
| GH-14 | Source code, migrations, env template, owner docs; confirmed | partially verified | docs + release, migrations 001-005 applied | Frozen commit and setup reproduction |
| GH-15 | Isolated verified preview and acceptance report; confirmed | partially verified | Exact candidate eafde95; Preview READY; hosted public/mobile and ordinary-account persistence/denial checks | Remaining acceptance-report gates |
| GH-16 | Production approval gate; confirmed | in force | deployment docs | Require APPROVE GOLFER HUB PRODUCTION RELEASE for identified version |
| GH-17 | Preserve files/data; confirmed | in force | release/ separate from legacy | No destructive Git/data actions |

## Technical Decisions (Not Product Requirements)

- Standard Next.js 16 / React / TypeScript, avoiding Vinext-to-Vercel incompatibility.
- Supabase Auth + PostgreSQL RLS. No service-role credential in browser or runtime application.
- Preserve legacy source untouched; new release directory uses existing visual identity/assets.
- SQL-enforced per-user rate limits; plain text community content; validated HTTPS media links instead of file uploads.
- No seeded public engagement or coaches. Content fallback only when database is intentionally unconfigured; failure of configured service is visible.

## Unresolved / Account-Dependent

- Isolated project, migrations, two confirmed users, approved administrator, local/hosted post-recovery persistence, live SQL role isolation and hosted ordinary-account denial are established; expired/reused links and broader acceptance checks remain.
- Real coach permission and contact records.
- Owner confirmation of privacy contact and operational retention before production.
- Production approval, domain choice, paid services require user action.

## Historical Context Only

Blog/tournaments/messages/coach dashboards and prototype sample counts are not mandatory fake production content. Founder started golf in 2018, not the website. Bridgend/UWC background is not institutional endorsement. Private third-party feedback is not public testimony.

## Excluded

AI, payments, real bookings, full coach operations, GPS, official handicaps, equipment store, live scores. No purchases without approval.
