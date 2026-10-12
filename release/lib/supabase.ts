import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function configured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}
export async function database() {
  if (!configured()) return null;
  const jar = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => jar.getAll(),
        setAll(values) {
          try {
            values.forEach(({ name, value, options }) => jar.set(name, value, options));
          } catch {
            /* Server components cannot set cookies; proxy refreshes the session. */
          }
        },
      },
    },
  );
}
export async function currentUser() {
  const db = await database();
  if (!db) return null;
  const { data, error } = await db.auth.getUser();
  if (error) return null;
  return data.user;
}
export async function authenticated() {
  const db = await database();
  if (!db) throw new Error('Accounts are not available in this preview yet.');
  const { data, error } = await db.auth.getUser();
  if (error || !data.user) throw new Error('Please sign in to continue.');
  return { db, user: data.user };
}
