import { siteOrigin } from './site-origin';

type ReleaseEnvironment = {
  [key: string]: string | undefined;
  VERCEL_ENV?: string;
  NEXT_PUBLIC_SITE_URL?: string;
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string;
  GOLFER_HUB_PUBLIC_INDEXING?: string;
};

export const privatePaths = [
  '/admin',
  '/dashboard',
  '/account',
  '/auth',
  '/login',
  '/signup',
  '/recover',
  '/forum',
];
export const publicPages = [
  '/',
  '/learn',
  '/coaches',
  '/sources',
  '/about',
  '/privacy',
  '/guidelines',
];

export function assertProductionConfiguration(environment: ReleaseEnvironment = process.env) {
  if (environment.VERCEL_ENV !== 'production') return;
  const value = environment.NEXT_PUBLIC_SITE_URL;
  if (!value) throw new Error('Production requires an explicit NEXT_PUBLIC_SITE_URL.');
  const origin = siteOrigin({ NEXT_PUBLIC_SITE_URL: value });
  if (
    !origin.startsWith('https://') ||
    ['localhost', '127.0.0.1', '[::1]'].includes(new URL(origin).hostname) ||
    new URL(value).pathname !== '/' ||
    new URL(value).search ||
    new URL(value).hash
  )
    throw new Error('Production Site URL must be an exact HTTPS origin.');
  const url = environment.NEXT_PUBLIC_SUPABASE_URL;
  if (!url || !environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
    throw new Error('Production requires its own Supabase URL and publishable key.');
  const database = new URL(url);
  if (
    database.protocol !== 'https:' ||
    database.username ||
    database.password ||
    database.pathname !== '/' ||
    database.search ||
    database.hash ||
    !database.hostname.endsWith('.supabase.co') ||
    database.hostname === 'uptmnezfwbzywnutpucz.supabase.co'
  )
    throw new Error('Production must not use the preview database.');
}

export function publicIndexingEnabled(environment: ReleaseEnvironment = process.env) {
  return (
    environment.VERCEL_ENV === 'production' && environment.GOLFER_HUB_PUBLIC_INDEXING === 'true'
  );
}

export function isPublicIndexablePath(pathname: string) {
  return publicPages.includes(pathname) || /^\/(learn|coaches)\/[^/]+$/.test(pathname);
}

export function shouldNoIndex(pathname: string, environment: ReleaseEnvironment = process.env) {
  return !publicIndexingEnabled(environment) || !isPublicIndexablePath(pathname);
}
