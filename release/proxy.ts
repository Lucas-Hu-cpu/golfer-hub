import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { shouldNoIndex } from './lib/release-policy';
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const protectResponse = () => {
    response.headers.set('Cache-Control', 'private, no-store');
    if (shouldNoIndex(request.nextUrl.pathname))
      response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  };
  protectResponse();
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
    return response;
  const db = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(values) {
          values.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          values.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          response.headers.set('Cache-Control', 'private, no-store');
          protectResponse();
        },
      },
    },
  );
  await db.auth.getClaims();
  return response;
}
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.svg|.*\\.(?:png|jpg|jpeg|svg|webp)$).*)'],
};
