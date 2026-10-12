# Privacy and Safety Release Review

This is an engineering checklist, not legal advice or a declaration of compliance. The controlled preview must not be marketed as a public service until the owner completes this review.

## Confirmed design

- No advertising, analytics, GPS, payment processing or automatic coach emails.
- Required account data: email, authentication records, chosen display name; skill level defaults to Beginner.
- Saves, practice records, progress, enquiries and reports use owner/admin RLS.
- Coach permission evidence is excluded from public column grants and exposed only through an administrator-checked RPC.
- Passwords are handled by Supabase Auth, never application database columns or logs.
- Community contributions and display names are public; the posting form warns against sensitive information.
- YouTube content loads on an explicit click; authentication uses cookies.

## Owner decisions required before production

1. Identify the controller and a verified privacy/support email; approve a real retention schedule and deletion/access process.
2. Determine applicable lawful bases and provider/transfer arrangements, without treating a generic checkbox as sufficient for every processing purpose.
3. Assess the student/junior audience, children’s privacy risks, age-appropriate design and suitable consent/age-assurance measures. Do not collect dates of birth or identity documents as a shortcut without a justified need.
4. Review default public profiles, votes and forum visibility for young users; determine whether privacy-by-default changes are necessary.
5. Establish moderation response, escalation, reporting and safeguarding practices before inviting public users.
6. Review the applicability of online-safety duties for a user-to-user forum with qualified guidance.
7. Configure owner-controlled SMTP and test confirmation/recovery delivery; do not disable email confirmation to hide delivery failures.
8. Verify media rights and actual video playback.

## Primary research

ICO, Children and the UK GDPR: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/children-and-the-uk-gdpr/ (updated 15 May 2026; checked 12 October 2026). It identifies child-specific considerations and points services likely to be accessed by children to the Children’s Code. Applicability to this project requires an owner-specific review.

Supabase, Password-based Auth: https://supabase.com/docs/guides/auth/passwords (checked 12 October 2026). Default test email delivery has strict rate limits and production SMTP should be considered.
