# Golfer Hub Release Architecture

## Isolation

The legacy Vinext site is retained at the repository root. `release/` is a standalone standard Next.js application. No production deployment, remote main push, alias change or destructive migration is authorized.

The independently created Supabase test project is `golfer-hub-preview`, reference `uptmnezfwbzywnutpucz`, in organization `Golfer Hub Preview`, Europe/Ireland. It is not connected to GitHub. The user created and retained the database password themselves. No database password or service-role credential is in the source.

## Runtime

Server-rendered App Router pages use Supabase SSR cookies. `proxy.ts` refreshes claims; protected pages and every mutation verify the user with `auth.getUser()`. No server authorization depends on client state. The runtime uses only the public publishable key, with PostgreSQL RLS deciding access. Private pages are dynamically rendered, never exported as static user data.

Real community records are plain text. React escapes them; there is no raw HTML rendering. Submitted external media links require HTTPS and are linked instead of automatically embedded. Lesson video embeds are click-to-load with a separate external fallback.

## Tables / Ownership

Auth creates one profile. Public records: published lessons, checked source records, authorized published coaches, visible discussions/comments and votes. Private user-owned records: saves, progress, practice items, enquiries and reports. `admin_users` is not writable by application clients; `is_admin()` checks it via a fixed-search-path security-definer function.

Database triggers validate reply ownership, immutable author fields and rate limits. Policies reject cross-user changes. The feed view is `security_invoker`, preserving underlying RLS. Hot = `(net votes + visible comments * 0.5 + 1) / (age hours + 2)^1.5`; stable UUID tie-break. Top uses all-time net votes, New uses created time, Unanswered uses zero visible comments/newest. Twenty posts per page.

## Editorial Content

15 original guides cover all 14 categories. 17 source records distinguish direct retrieved official text from search-index evidence. JSON lesson records are validated before administrator save. The administrator-only, security-invoker `save_lesson` RPC updates the guide and replaces its citation links in one transaction. All lesson/source/citation writes take the same transaction-scoped advisory lock before row changes; deferred constraints verify final published citation integrity. No extra administrator identities or privileges are granted by this RPC. The SQL seed runs as one transaction and does not overwrite existing editorial records. No fake public members, coaches, comments, reviews or activity are seeded. The extra labeled CMS QA guide remains a private draft.

## Known Work Still Required

Full live two-account isolation, remaining moderator/CMS and concurrent-source checks, expired/reused recovery links, instructional-video playback, remaining image/model rights review, complete browser/mobile accessibility QA, isolated Vercel preview and exact source commit, owner privacy contact/retention and acceptance review. Owner-approved administrator assignment and post-recovery persistence have passed. A successful build is not full acceptance.
