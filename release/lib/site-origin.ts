type SiteEnvironment = {
  NEXT_PUBLIC_SITE_URL?: string;
  VERCEL_URL?: string;
};

export function siteOrigin(
  environment: SiteEnvironment = {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    VERCEL_URL: process.env.VERCEL_URL,
  },
): string {
  const value =
    environment.NEXT_PUBLIC_SITE_URL ||
    (environment.VERCEL_URL ? `https://${environment.VERCEL_URL}` : 'http://localhost:3100');
  const url = new URL(value);
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if (
    url.username ||
    url.password ||
    (url.protocol !== 'https:' && !(local && url.protocol === 'http:'))
  )
    throw new Error('The site origin must use HTTPS, except for local development.');
  return url.origin;
}
