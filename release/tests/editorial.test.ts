import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { lessons } from '../content/catalog';

test('Editorial transactions replace citations, roll back failures and enforce publication', async () => {
  const db = new PGlite();
  try {
    await db.exec(`create role anon; create role authenticated; create schema auth;
      create table auth.users(id uuid primary key, raw_user_meta_data jsonb);
      create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
      grant usage on schema auth to anon,authenticated;
      grant execute on function auth.uid() to anon,authenticated;`);
    for (const file of [
      '001_golfer_hub.sql',
      '002_feed.sql',
      '003_coach_permission_privacy.sql',
      '004_practice_archive.sql',
      '005_atomic_lesson_content.sql',
    ])
      await db.exec(
        await readFile(new URL(`../supabase/migrations/${file}`, import.meta.url), 'utf8'),
      );
    const admin = '00000000-0000-0000-0000-000000000001';
    const reader = '00000000-0000-0000-0000-000000000002';
    await db.exec(`insert into auth.users values('${admin}','{"display_name":"Editor"}'),('${reader}','{"display_name":"Reader"}');
      insert into admin_users values('${admin}');
      insert into categories values('test-category','Test category',0);
      insert into sources(id,title,publisher,url,checked_on,evidence,status) values
        ('source-one','Source one','Test publisher','https://example.com/one',current_date,'Local test evidence','verified'),
        ('source-two','Source two','Test publisher','https://example.com/two',current_date,'Local test evidence','indexed'),
        ('source-review','Needs review','Test publisher','https://example.com/review',current_date,'Local test evidence','needs-review');
      alter table lesson_sources add constraint test_late_failure check(supports <> 'Force citation write failure');`);
    const asUser = async (user: string) =>
      db.exec(`reset role; set request.jwt.claim.sub='${user}'; set role authenticated;`);
    const guide = {
      ...lessons[0],
      id: 'cms-test',
      category_id: 'test-category',
      status: 'published',
      sources: [
        { id: 'source-one', supports: 'Test supports one' },
        { id: 'source-two', supports: 'Test supports two' },
      ],
    };
    const save = (record: unknown) =>
      db.query('select public.save_lesson($1::jsonb)', [JSON.stringify(record)]);
    await db.exec('set role anon');
    await assert.rejects(save(guide), 'anonymous callers cannot execute CMS RPC');
    await asUser(reader);
    await assert.rejects(save(guide), /Administrator access required/);
    await asUser(admin);
    await save(guide);
    assert.equal((await db.query('select * from lesson_sources')).rows.length, 2);
    const reduced = { ...guide, title: 'Updated test guide', sources: [guide.sources[1]] };
    await save(reduced);
    assert.deepEqual(
      (await db.query<{ source_id: string }>('select source_id from lesson_sources')).rows.map(
        (r) => r.source_id,
      ),
      ['source-two'],
    );
    await assert.rejects(
      save({
        ...reduced,
        title: 'Must not persist',
        sources: [{ id: 'source-one', supports: 'Force citation write failure' }],
      }),
    );
    assert.equal(
      (await db.query<{ title: string }>('select title from lessons')).rows[0].title,
      reduced.title,
      'late citation failure rolls back lesson update',
    );
    assert.equal(
      (await db.query<{ source_id: string }>('select source_id from lesson_sources')).rows[0]
        .source_id,
      'source-two',
      'late failure restores original links',
    );
    await assert.rejects(
      save({ ...guide, sources: [guide.sources[0], guide.sources[0]] }),
      /distinct/,
    );
    await assert.rejects(
      save({ ...guide, sources: [{ id: 'missing-source', supports: 'Not found' }] }),
      /Add all cited sources/,
    );
    await assert.rejects(
      save({ ...guide, sources: [{ id: 'source-review', supports: 'Unverified example' }] }),
      /cannot be published/,
    );
    await assert.rejects(
      db.exec("update sources set status='needs-review' where id='source-two'"),
      /Unpublish affected guides/,
    );
    assert.equal(
      (await db.query<{ status: string }>("select status from sources where id='source-two'"))
        .rows[0].status,
      'indexed',
    );
    await assert.rejects(
      db.exec(
        "update lesson_sources set supports='Unmatched description' where source_id='source-two'",
      ),
      /Published citations must match/,
    );
    await save({ ...reduced, status: 'draft' });
    await db.exec("update sources set status='needs-review' where id='source-two'");
    await assert.rejects(save(reduced), /cannot be published/);
    await asUser(reader);
    assert.equal(
      (await db.query('select * from lessons')).rows.length,
      0,
      'unpublished guide is private',
    );
    await asUser(admin);
    await db.exec("update sources set status='verified' where id='source-two'");
    await save(reduced);
    await asUser(reader);
    assert.equal(
      (await db.query('select * from lessons')).rows.length,
      1,
      'reviewed guide can be published again',
    );
  } finally {
    await db.close();
  }
});
