begin;

-- Serialize editorial writes before row locks, including direct administrator edits.
create function public.lock_editorial_content() returns trigger
language plpgsql set search_path = public as $$
begin
  perform pg_advisory_xact_lock(76401101);
  return null;
end; $$;
revoke all on function public.lock_editorial_content() from public;
create trigger editorial_lock before insert or update or delete on public.lessons
  for each statement execute function public.lock_editorial_content();
create trigger editorial_lock before insert or update or delete on public.sources
  for each statement execute function public.lock_editorial_content();
create trigger editorial_lock before insert or update or delete on public.lesson_sources
  for each statement execute function public.lock_editorial_content();

-- Deferred checks see the final transaction, not a partially replaced citation list.
create function public.check_published_citations() returns trigger
language plpgsql security definer set search_path = public as $$
declare guide record; refs jsonb;
begin
  for guide in select id, data from lessons where status = 'published' loop
    refs := guide.data->'sources';
    if jsonb_typeof(refs) is distinct from 'array' then
      raise exception 'Published guides require a citation list.';
    end if;
    if jsonb_array_length(refs) not between 1 and 10 or exists (
      select 1 from jsonb_array_elements(refs) r
      where jsonb_typeof(r) <> 'object' or nullif(trim(r->>'id'), '') is null
        or char_length(trim(coalesce(r->>'supports', ''))) < 2
    ) or (select count(distinct r->>'id') from jsonb_array_elements(refs) r)
        <> jsonb_array_length(refs) then
      raise exception 'Published guides require distinct, described citations.';
    end if;
    if (select count(*) from lesson_sources where lesson_id = guide.id)
        <> jsonb_array_length(refs) or exists (
      select 1 from jsonb_array_elements(refs) r
      left join lesson_sources ls on ls.lesson_id = guide.id and ls.source_id = r->>'id'
      left join sources s on s.id = ls.source_id
      where ls.supports is distinct from r->>'supports' or s.status is null
        or s.status = 'needs-review'
    ) then
      raise exception 'Published citations must match reviewed sources. Unpublish affected guides before marking a source for review.';
    end if;
  end loop;
  return null;
end; $$;
revoke all on function public.check_published_citations() from public;
create constraint trigger published_citations after insert or update or delete on public.lessons
  deferrable initially deferred for each row execute function public.check_published_citations();
create constraint trigger published_citations after insert or update or delete on public.sources
  deferrable initially deferred for each row execute function public.check_published_citations();
create constraint trigger published_citations after insert or update or delete on public.lesson_sources
  deferrable initially deferred for each row execute function public.check_published_citations();

create function public.save_lesson(record jsonb) returns void
language plpgsql security invoker set search_path = public as $$
declare refs jsonb;
begin
  if not public.is_admin() then raise exception 'Administrator access required.'; end if;
  perform pg_advisory_xact_lock(76401101);
  refs := record->'sources';
  if jsonb_typeof(refs) is distinct from 'array' then
    raise exception 'Add a citation list before saving this guide.';
  end if;
  if jsonb_array_length(refs) not between 1 and 10 or exists (
    select 1 from jsonb_array_elements(refs) r
    where jsonb_typeof(r) <> 'object' or nullif(trim(r->>'id'), '') is null
      or char_length(trim(coalesce(r->>'supports', ''))) < 2
  ) or (select count(distinct r->>'id') from jsonb_array_elements(refs) r)
      <> jsonb_array_length(refs) then
    raise exception 'Cited sources must be distinct and describe what they support.';
  end if;
  if exists (
    select 1 from jsonb_array_elements(refs) r
    left join sources s on s.id = r->>'id' where s.id is null
  ) then raise exception 'Add all cited sources before saving this guide.'; end if;
  if record->>'status' = 'published' and exists (
    select 1 from jsonb_array_elements(refs) r
    join sources s on s.id = r->>'id' where s.status = 'needs-review'
  ) then raise exception 'Unverified source references cannot be published.'; end if;

  insert into lessons(id, category_id, title, level, status, data, updated_at)
    values(record->>'id', record->>'category_id', record->>'title', record->>'level',
      record->>'status', record, now())
    on conflict(id) do update set category_id = excluded.category_id,
      title = excluded.title, level = excluded.level, status = excluded.status,
      data = excluded.data, updated_at = excluded.updated_at;
  delete from lesson_sources where lesson_id = record->>'id';
  insert into lesson_sources(lesson_id, source_id, supports)
    select record->>'id', r->>'id', r->>'supports' from jsonb_array_elements(refs) r;
end; $$;
revoke all on function public.save_lesson(jsonb) from public, anon;
grant execute on function public.save_lesson(jsonb) to authenticated;
commit;
