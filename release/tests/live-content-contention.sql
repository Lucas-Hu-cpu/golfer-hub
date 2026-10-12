-- Preview only. Run A and B in separate SQL Editor browser tabs.
-- A holds the same editorial lock used by source and lesson writes.
-- Start B while A sleeps. Neither transaction commits content changes.

-- Session A:
begin;
update public.lessons set title = title
where id = (select id from public.lessons where status = 'published' order by id limit 1);
select pg_sleep(40);
rollback;
select 'A: editorial lock released; no content committed' as verification;

-- Session B (run only this block, not the Session A block):
begin;
do $$
declare started timestamptz := clock_timestamp(); source_id text;
begin
  select ls.source_id into source_id from public.lesson_sources ls
    join public.lessons l on l.id = ls.lesson_id
    where l.status = 'published' order by ls.source_id limit 1;
  if source_id is null then raise exception 'No published citation to test.'; end if;
  begin
    update public.sources set status = 'needs-review' where id = source_id;
    set constraints all immediate;
    raise exception 'Unsafe source-review transition was accepted.';
  exception when raise_exception then
    if sqlerrm not like 'Published citations must match reviewed sources.%' then raise; end if;
  end;
  if clock_timestamp() - started < interval '2 seconds' then
    raise exception 'No contention observed: rerun B while A holds its lock.';
  end if;
  if exists(select 1 from public.sources where id = source_id and status = 'needs-review') then
    raise exception 'Rejected source change persisted.';
  end if;
end; $$;
select 'B: waited for editorial lock, rejected unsafe review, original source retained' as verification;
rollback;
