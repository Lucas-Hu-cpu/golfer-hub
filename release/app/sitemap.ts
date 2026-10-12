import type { MetadataRoute } from 'next';
import { catalog, coaches } from '../lib/queries';
import { publicIndexingEnabled, publicPages } from '../lib/release-policy';
import { siteOrigin } from '../lib/site-origin';

export const dynamic = 'force-dynamic';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!publicIndexingEnabled()) return [];
  const [library, directory] = await Promise.all([catalog(), coaches()]);
  const paths = [
    ...publicPages,
    ...library.lessons.map((lesson) => `/learn/${encodeURIComponent(lesson.id)}`),
    ...directory.map((coach) => `/coaches/${encodeURIComponent(coach.id)}`),
  ];
  return paths.map((path) => ({ url: `${siteOrigin()}${path}` }));
}
