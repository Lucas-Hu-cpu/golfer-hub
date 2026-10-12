# Production Owner Decisions

Prepared 12 October 2026. All wording below is a proposal, not an approved policy or a claim of legal compliance. Nothing here authorizes production deployment. The separate release approval remains `APPROVE GOLFER HUB PRODUCTION RELEASE`.

## 1. Identity, contact and public address

Please supply the actual operator/controller name, country and a monitored privacy/support email. A personal home address is not requested here; obtain advice on any contact/disclosure duties that apply to the operator.

Proposed English notice:

> Golfer Hub is an independent educational project operated by [OPERATOR NAME] in [COUNTRY]. For privacy questions, access requests, corrections or account deletion, contact [MONITORED EMAIL]. We will acknowledge your request within seven days and aim to respond within one month, subject to applicable law and appropriate identity checks. Please do not send passwords or identity documents by default.

Website address: the existing project has `golfer-hub-5rts-lucaspokerface.vercel.app` and a main-branch alias. Neither is a verified public production website. Choose that address or an owner-controlled custom domain. A custom domain is preferable for a stable brand and authenticated email; no purchase or DNS change has been made. Current Vercel protection also covers vercel.app production URLs; making one publicly accessible requires an explicit protection decision at release time. Preview protection will remain enabled.

## 2. Retention and account rights

Proposed operational schedule, which must be adopted and implemented before the public notice promises it:

| Record | Proposed handling |
| --- | --- |
| Account, bookmarks, learning progress, practice records | Retain while the account is active. After a verified deletion request, remove from the live service within 30 days, subject to a documented lawful hold. |
| Public posts/comments | Explain public visibility before posting. On account deletion, remove or anonymize author attribution and review requested contribution deletion case by case; do not promise anonymous content is automatically harmless. |
| Coach enquiries | Delete 90 days after closure. Requests are private database records, not bookings or automatically sent email. |
| Moderation reports | Retain 180 days after resolution for appeals/safety; restrict to authorized moderators. Exceptional holds need a reason and review date. |
| Application diagnostic records | Target 30 days maximum; provider retention varies by plan. Do not log passwords, recovery URLs or private form bodies. |
| Encrypted operator backups | Proposed 30-day rolling retention; after deletion, data ages out, and any restore must reapply a deletion ledger before returning to service. |

There is no automated deletion scheduler or self-service account deletion yet. Initially use a documented manual queue with weekly review and a deletion ledger stored outside the public repository. No deletion is executed by approving a schedule; irreversible deletions need case-specific authorization. Existing test data is preserved and is not copied to production. Agree who performs these tasks before publishing the promise.

## 3. Young users and public community

Recommended: keep public learning available without an account; launch community accounts as a controlled pilot until a child-risk assessment, appropriate age assurance/consent approach and named safeguarding moderator are in place. A simple age checkbox is not proof that children's obligations disappear. Do not collect dates of birth or identity documents as a shortcut. The current signup does not enforce an age policy, so an age restriction cannot be claimed without implementation and testing.

Proposed English safety wording:

> Choose a display name that does not identify your school or home. Your display name and forum contributions are visible to others. Do not post your address, school timetable, phone number, medical details or other sensitive information. Private practice records are not displayed in the forum. Report unsafe content to the moderation team. Golfer Hub is not an emergency service.

Current database grants make display names, skill levels and votes readable on public records. Before inviting young users, decide whether to narrow those public data fields and default community visibility. Forum noindex reduces search discovery but is not access control or a privacy guarantee. No private messaging, GPS, advertising or payment feature is being added.

## 4. Moderation operations

Proposed policy text:

> Be respectful and constructive. Harassment, discriminatory abuse, sexual content involving minors, doxxing, threats, impersonation and unsolicited promotion are not allowed. Moderators may hide content while reviewing a report. You may appeal through [MONITORED EMAIL]. We cannot promise continuous monitoring.

Choose a named primary moderator and backup, proposed daily report review, seven-day appeal acknowledgement and a documented urgent safeguarding escalation route. Immediate risk should be directed to appropriate local emergency services, not a claim that the student founder provides emergency response. Confirm operating capacity and relevant user-to-user online-safety duties before public forum launch. Existing report, hide/restore and reviewed-state functions are tested; staffing and escalation are not software features.

## 5. Media and coach permission

Confirm rights to the existing favicon and social-share image. Review the Courtney Cook Unsplash photo, including relevant personality/third-party rights; general copyright permission is not a model release. The optional PGA YouTube player is click-to-load and has a text lesson alternative; no captions were offered in the checked player. Choose to retain it with that limitation or remove the optional embed. Never claim organization endorsement.

Coaches stay empty until documented permission, accurate qualifications, contact preferences and photo rights are supplied. No fake coach, rating, testimonial or lesson author will be added. A real-profile enquiry test can remain deferred while the directory is empty; publication authorization and private enquiry RLS are launch-critical.

## 6. Infrastructure, mail and SEO

Recommended isolation: a new `golfer-hub-production` Supabase project in Europe; preserve `golfer-hub-preview` unchanged. Apply the five schema migrations and curated source seed only. Do not migrate test accounts, private records, QA posts/comments, QA drafts, votes or reports.

Choose free pilot versus paid reliability, SMTP provider and owner-controlled sender domain. Suggested provider: Resend Free for initial testing, subject to current limits and verified DNS. Use transaction-only mail, disable click/open tracking, preserve email confirmation, and supply the SMTP credential directly in the provider/Supabase form, never chat or Git. No subscription has been purchased.

Proposed SEO decision: allow only curated public learning, source/about/policy pages and authorized coach pages after release; keep forum, login, account, dashboard and administration noindex. Implemented switch `GOLFER_HUB_PUBLIC_INDEXING=true` works only in Vercel Production; Preview always stays noindex. It remains false/unset until approved.

## Reference Basis

Checked 12 October 2026: [ICO children guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/children-and-the-uk-gdpr/), [Supabase SMTP](https://supabase.com/docs/guides/auth/auth-smtp), [Supabase redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls), [Supabase pricing](https://supabase.com/pricing), [Vercel Hobby](https://vercel.com/docs/plans/hobby), [Resend pricing](https://resend.com/pricing). These inform preparation; legal applicability, lawful bases and transfer arrangements require operator-specific review.
