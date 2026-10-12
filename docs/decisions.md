# Decisions

2026-10-12: Continue existing Golfer Hub; retain original prototype and assets without deleting or rewriting them. Create release/ for a standard Next.js implementation compatible with Vercel. Existing Vercel golfer-hub-5rts is not live; latest deployment is ERROR. Its environment variable inventory is empty. Connected GitHub repository is Lucas-Hu-cpu/golfer-hub.

Supabase provides maintained authentication and durable PostgreSQL. Every app request uses user/anonymous credentials subject to RLS, not a service key. Administrator membership is held in a protected table, not mutable profile metadata. SQL is source-controlled. Real service testing remains blocked until isolated project access is provided.

No production deployment, main push, domain change, deletion, or paid service activation is authorized by preview work. Explicit identified-version production approval is mandatory.

Public lessons are original concise instructional syntheses with claim-level further reading and original instructional diagrams. No copied editorial imagery or unverified book/page/video citations. Founder background uses only provided facts; named private feedback omitted.
