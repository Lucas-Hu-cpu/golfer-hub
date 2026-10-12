import { test } from 'node:test';
import assert from 'node:assert/strict';
import { siteOrigin } from '../lib/site-origin';

test('Auth and metadata use one exact trusted deployment origin', () => {
  assert.equal(siteOrigin({}), 'http://localhost:3100');
  assert.equal(
    siteOrigin({ VERCEL_URL: 'candidate.example.vercel.app' }),
    'https://candidate.example.vercel.app',
  );
  assert.equal(
    siteOrigin({
      NEXT_PUBLIC_SITE_URL: 'https://golf.example/path',
      VERCEL_URL: 'other.vercel.app',
    }),
    'https://golf.example',
  );
  assert.equal(
    siteOrigin({ NEXT_PUBLIC_SITE_URL: 'http://localhost:3100' }),
    'http://localhost:3100',
  );
  for (const value of [
    'http://golf.example',
    'javascript:alert(1)',
    'https://user:password@golf.example',
  ])
    assert.throws(() => siteOrigin({ NEXT_PUBLIC_SITE_URL: value }));
});
