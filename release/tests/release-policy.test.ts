import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  assertProductionConfiguration,
  publicIndexingEnabled,
  shouldNoIndex,
  isPublicIndexablePath,
} from '../lib/release-policy';

const production = {
  VERCEL_ENV: 'production',
  NEXT_PUBLIC_SITE_URL: 'https://golfer-hub.example',
  NEXT_PUBLIC_SUPABASE_URL: 'https://separate-project.supabase.co',
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'public-test-fixture',
};

test('Production fails closed on missing origins, missing data configuration and the preview database', () => {
  assert.doesNotThrow(() => assertProductionConfiguration({ VERCEL_ENV: 'preview' }));
  assert.doesNotThrow(() => assertProductionConfiguration(production));
  for (const invalid of [
    { ...production, NEXT_PUBLIC_SITE_URL: undefined },
    { ...production, NEXT_PUBLIC_SITE_URL: 'http://localhost:3100' },
    { ...production, NEXT_PUBLIC_SITE_URL: 'https://localhost' },
    { ...production, NEXT_PUBLIC_SITE_URL: 'https://golfer-hub.example/path' },
    { ...production, NEXT_PUBLIC_SITE_URL: 'https://golfer-hub.example/?secret=1' },
    { ...production, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: undefined },
    { ...production, NEXT_PUBLIC_SUPABASE_URL: 'https://uptmnezfwbzywnutpucz.supabase.co' },
  ])
    assert.throws(() => assertProductionConfiguration(invalid));
});

test('Indexing is explicit, never enabled in Preview, and excludes private and community paths', () => {
  assert.equal(publicIndexingEnabled(production), false);
  assert.equal(
    publicIndexingEnabled({ VERCEL_ENV: 'preview', GOLFER_HUB_PUBLIC_INDEXING: 'true' }),
    false,
  );
  const enabled = { ...production, GOLFER_HUB_PUBLIC_INDEXING: 'true' };
  for (const path of ['/', '/learn', '/learn/grip', '/coaches', '/coaches/approved', '/sources'])
    assert.equal(shouldNoIndex(path, enabled), false);
  for (const path of [
    '/admin',
    '/dashboard',
    '/account/reset',
    '/auth/callback',
    '/forum',
    '/forum/private',
    '/login',
    '/unknown',
  ]) {
    assert.equal(shouldNoIndex(path, enabled), true);
    assert.equal(isPublicIndexablePath(path), false);
  }
  assert.equal(
    shouldNoIndex('/learn/grip', { VERCEL_ENV: 'preview', GOLFER_HUB_PUBLIC_INDEXING: 'true' }),
    true,
  );
});
