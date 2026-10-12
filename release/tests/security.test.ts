import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { postInput, safeNext } from '../lib/validation';

test('Form validation and redirect boundaries', () => {
  assert.equal(safeNext('//evil.example'), '/dashboard');
  assert.equal(safeNext('/\\evil.example'), '/dashboard');
  assert.equal(safeNext('/dashboard'), '/dashboard');
  assert.equal(
    postInput.safeParse({
      title: 'A useful golf question',
      body: 'A sufficiently detailed golf question.',
      category_id: 'swing-help',
      tags: [],
      media_url: 'javascript:alert(1)',
    }).success,
    false,
  );
  assert.equal(
    postInput.safeParse({
      title: 'short',
      body: 'tiny',
      category_id: 'swing-help',
      tags: [],
      media_url: null,
    }).success,
    false,
  );
});

test('PostgreSQL RLS, ownership, replies and write limits', async () => {
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
    ])
      await db.exec(
        await readFile(new URL(`../supabase/migrations/${file}`, import.meta.url), 'utf8'),
      );
    const a = '00000000-0000-0000-0000-000000000001',
      b = '00000000-0000-0000-0000-000000000002',
      admin = '00000000-0000-0000-0000-000000000003';
    await db.exec(`insert into auth.users values('${a}','{"display_name":"Alice"}'),('${b}','{"display_name":"Bob"}'),('${admin}','{"display_name":"Moderator"}');
      insert into admin_users values('${admin}'); insert into categories values('swing','Swing',0); insert into forum_categories values('swing-help','Swing Help');
      insert into lessons values('test-lesson','swing','Test lesson','Beginner','published','{}',now());
      insert into lessons values('draft-lesson','swing','Draft lesson','Beginner','draft','{}',now());`);
    const asUser = async (user: string) =>
      db.exec(`reset role; set request.jwt.claim.sub='${user}'; set role authenticated;`);
    await db.exec('set role anon;');
    assert.equal((await db.query('select * from lessons')).rows.length, 1, 'draft lessons private');
    await assert.rejects(
      db.exec('select authorization_reference from coaches'),
      'private coach permission evidence',
    );
    await assert.rejects(
      db.exec(
        `insert into posts(user_id,category_id,title,body) values('${a}','swing-help','Anonymous question','This should not be permitted.')`,
      ),
    );
    await asUser(a);
    const p = (
      await db.query<{ id: string }>(
        `insert into posts(user_id,category_id,title,body) values('${a}','swing-help','Why does my driver curve?','I am looking for a useful practice routine.') returning id`,
      )
    ).rows[0].id;
    await db.exec(`insert into saved_lessons(user_id,lesson_id) values('${a}','test-lesson');`);
    const goal = (
      await db.query<{ id: string }>(
        `insert into practice_items(user_id,title,kind) values('${a}','Record ten iron strikes','goal') returning id`,
      )
    ).rows[0].id;
    await db.exec(
      `update practice_items set title='Record twenty iron strikes',archived=true where id='${goal}';`,
    );
    assert.equal(
      (
        await db.query<{ archived: boolean }>(
          `select archived from practice_items where id='${goal}'`,
        )
      ).rows[0].archived,
      true,
    );
    await assert.rejects(
      db.exec(`insert into admin_users values('${a}')`),
      'cannot self-assign administrator',
    );
    await asUser(b);
    await assert.rejects(
      db.exec('select * from admin_coaches()'),
      'ordinary user cannot retrieve coach permission evidence',
    );
    assert.equal(
      (await db.query('select * from saved_lessons')).rows.length,
      0,
      'other user saves are private',
    );
    assert.equal(
      (await db.query(`update practice_items set archived=false where id='${goal}' returning id`))
        .rows.length,
      0,
      'other user cannot restore private practice goals',
    );
    assert.equal(
      (await db.query(`update posts set title='Unauthorized edit' where id='${p}' returning id`))
        .rows.length,
      0,
    );
    await assert.rejects(
      db.exec(`insert into comments(post_id,user_id,body) values('${p}','${a}','Forged author')`),
    );
    const c = (
      await db.query<{ id: string }>(
        `insert into comments(post_id,user_id,body) values('${p}','${b}','Try collecting your strike feedback.') returning id`,
      )
    ).rows[0].id;
    const p2 = (
      await db.query<{ id: string }>(
        `insert into posts(user_id,category_id,title,body) values('${b}','swing-help','Another golf question','Another sufficiently long discussion body.') returning id`,
      )
    ).rows[0].id;
    await assert.rejects(
      db.exec(
        `insert into comments(post_id,user_id,parent_id,body) values('${p2}','${b}','${c}','Cross-post reply')`,
      ),
    );
    await db.exec(`insert into votes values('${b}','${p}',1,now());`);
    assert.equal(
      (await db.query<{ score: number }>(`select score from post_feed where id='${p}'`)).rows[0]
        .score,
      1,
    );
    await asUser(a);
    await db.exec(`update practice_items set archived=false where id='${goal}';`);
    assert.equal(
      (await db.query<{ title: string }>(`select title from practice_items where id='${goal}'`))
        .rows[0].title,
      'Record twenty iron strikes',
      'restoring preserves edited goal',
    );
    await assert.rejects(
      db.exec(`update posts set hidden=true where id='${p}'`),
      'ordinary user cannot moderate',
    );
    await db.exec(`insert into posts(user_id,category_id,title,body) values('${a}','swing-help','Another valid question','A sufficiently long second discussion body.');
      insert into posts(user_id,category_id,title,body) values('${a}','swing-help','Third valid question','A sufficiently long third discussion body.');`);
    await assert.rejects(
      db.exec(
        `insert into posts(user_id,category_id,title,body) values('${a}','swing-help','Rate limited question','A sufficiently long fourth discussion body.')`,
      ),
    );
    await asUser(admin);
    await db.exec(`update posts set hidden=true where id='${p}'`);
    await asUser(b);
    assert.equal(
      (await db.query(`select * from posts where id='${p}'`)).rows.length,
      0,
      'hidden posts private',
    );
    assert.equal(
      (await db.query(`select * from comments where post_id='${p}'`)).rows.length,
      0,
      'hidden discussion comments private',
    );
    assert.equal(
      (await db.query(`select * from post_feed where id='${p}'`)).rows.length,
      0,
      'feed respects RLS',
    );
  } finally {
    await db.close();
  }
});
