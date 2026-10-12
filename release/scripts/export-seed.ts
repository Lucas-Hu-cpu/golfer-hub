import { writeFile, mkdir } from 'node:fs/promises';
import { categories, forumCategories, lessons, sources } from '../content/catalog';
const literal = (rows: unknown) => `'${JSON.stringify(rows).replaceAll("'", "''")}'::jsonb`;
const batches = [
  `insert into categories select * from jsonb_to_recordset(${literal(categories)}) as x(id text,name text,position integer) on conflict do nothing;`,
  `insert into forum_categories select * from jsonb_to_recordset(${literal(forumCategories)}) as x(id text,name text) on conflict do nothing;`,
  `insert into sources select * from jsonb_to_recordset(${literal(sources)}) as x(id text,title text,publisher text,url text,author text,published_date text,checked_on date,evidence text,status text) on conflict do nothing;`,
  `insert into lessons(id,category_id,title,level,status,data) select * from jsonb_to_recordset(${literal(lessons.map((l) => ({ id: l.id, category_id: l.category_id, title: l.title, level: l.level, status: l.status, data: l })))}) as x(id text,category_id text,title text,level text,status text,data jsonb) on conflict do nothing;`,
  `insert into lesson_sources select * from jsonb_to_recordset(${literal(lessons.flatMap((l) => l.sources.map((s) => ({ lesson_id: l.id, source_id: s.id, supports: s.supports }))))}) as x(lesson_id text,source_id text,supports text) on conflict do nothing;`,
];
await mkdir('.local', { recursive: true });
await writeFile(
  '.local/content-seed.sql',
  `begin;\n${batches.join('\n')}\ncommit;\nselect (select count(*) from lessons) as lessons, (select count(*) from sources) as sources, (select count(*) from categories) as categories;\n`,
);
console.log('Generated idempotent content seed; no users, coaches or engagement created.');
