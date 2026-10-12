import type { MetadataRoute } from 'next';
import { publicIndexingEnabled, privatePaths } from '../lib/release-policy';
import { siteOrigin } from '../lib/site-origin';

export const dynamic = 'force-dynamic';
export default function robots(): MetadataRoute.Robots {
  if (!publicIndexingEnabled()) return { rules: { userAgent: '*', disallow: '/' } };
  return {
    rules: { userAgent: '*', allow: '/', disallow: privatePaths },
    sitemap: `${siteOrigin()}/sitemap.xml`,
  };
}
