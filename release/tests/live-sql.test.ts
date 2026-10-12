import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

test('Live isolation SQL is valid and rolls back every temporary fixture', async () => {
  const db = new PGlite();
  try {
    await db.exec(`create role anon; create role authenticated; create schema auth;
      create table auth.users(id uuid primary key,raw_user_meta_data jsonb,email_confirmed_at timestamptz);
      create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
      grant usage on schema auth to anon,authenticated;
      grant execute on function auth.uid() to anon,authenticated;`);
    for (const name of [
      '001_golfer_hub',
      '002_feed',
      '003_coach_permission_privacy',
      '004_practice_archive',
      '005_atomic_lesson_content',
    ])
      await db.exec(
        await readFile(new URL(`../supabase/migrations/${name}.sql`, import.meta.url), 'utf8'),
      );
    const owner = '00000000-0000-0000-0000-000000000001';
    const member = '00000000-0000-0000-0000-000000000002';
    await db.exec(`insert into auth.users values('${owner}','{"display_name":"Lucaca"}',now()),('${member}','{"display_name":"QA Member"}',now());
      insert into admin_users values('${owner}');
      insert into categories values('swing','Swing',0);
      insert into forum_categories values('swing-help','Swing Help');
      insert into lessons values('qa-cms-citation-check','swing','Private test','Beginner','draft','{}',now());
      insert into posts(user_id,category_id,title,body,hidden) values('${owner}','swing-help','QA test: driver flight practice discussion','A clearly labeled local permission test.',true);
      insert into saved_lessons(user_id,lesson_id) values('${owner}','qa-cms-citation-check'),('${member}','qa-cms-citation-check');
      insert into lesson_progress(user_id,lesson_id) values('${owner}','qa-cms-citation-check'),('${member}','qa-cms-citation-check');
      insert into practice_items(user_id,kind,title) values('${owner}','goal','Owner goal remains intact'),('${member}','goal','Member goal remains intact');`);
    const sql = await readFile(new URL('./live-isolation.sql', import.meta.url), 'utf8');
    const results = await db.exec(sql);
    assert.match(JSON.stringify(results), /PASS: live PostgreSQL role isolation/);
    assert.equal((await db.query('select * from coaches')).rows.length, 0);
    assert.equal((await db.query('select * from enquiries')).rows.length, 0);
    assert.equal((await db.query('select * from reports')).rows.length, 0);
    assert.equal(
      (
        await db.query<{ title: string }>(
          `select title from practice_items where user_id='${owner}'`,
        )
      ).rows[0].title,
      'Owner goal remains intact',
    );
    assert.equal((await db.query('select * from admin_users')).rows.length, 1);
  } finally {
    await db.close();
  }
});
