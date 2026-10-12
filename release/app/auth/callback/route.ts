import { NextRequest, NextResponse } from 'next/server';
import { database } from '../../../lib/supabase';
import { safeNext } from '../../../lib/validation';
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const db = await database();
  if (code && db) {
    const { error } = await db.auth.exchangeCodeForSession(code);
    if (!error) {
      const recovery = request.cookies.get('golfer-hub-auth-intent')?.value === 'recovery';
      const next = recovery ? '/account/reset' : safeNext(request.nextUrl.searchParams.get('next'));
      const response = NextResponse.redirect(new URL(next, request.url));
      response.cookies.set('golfer-hub-auth-intent', '', { path: '/auth/callback', maxAge: 0 });
      return response;
    }
  }
  return NextResponse.redirect(new URL('/login?notice=confirmation-failed', request.url));
}
