-- Run only in golfer-hub-preview after both owner-confirmed accounts exist.
-- All fixture inserts and attempted updates are rolled back; no permissions change.
begin;
do $$
declare owner_id uuid; member_id uuid; fixture_coach uuid; discussion_id uuid;
begin
  perform set_config('request.jwt.claim.sub','',true);
  perform set_config('request.jwt.claims','{}',true);
  if (select count(*) from profiles p join auth.users u on u.id=p.id
      join admin_users a on a.user_id=p.id
      where p.display_name='Lucaca' and u.email_confirmed_at is not null) <> 1 then
    raise exception 'Expected exactly one confirmed Lucaca administrator.';
  end if;
  if (select count(*) from profiles p join auth.users u on u.id=p.id
      where p.display_name='QA Member' and u.email_confirmed_at is not null
      and not exists(select 1 from admin_users a where a.user_id=p.id)) <> 1 then
    raise exception 'Expected exactly one confirmed ordinary QA Member.';
  end if;
  select p.id into owner_id from profiles p join admin_users a on a.user_id=p.id
    where p.display_name='Lucaca';
  select p.id into member_id from profiles p where p.display_name='QA Member'
    and not exists(select 1 from admin_users a where a.user_id=p.id);
  select id into discussion_id from posts where user_id=owner_id and hidden
    and title='QA test: driver flight practice discussion';
  if discussion_id is null then raise exception 'Expected hidden owner QA discussion.'; end if;
  perform set_config('golfer_hub.qa_owner',owner_id::text,true);
  perform set_config('golfer_hub.qa_member',member_id::text,true);
  perform set_config('golfer_hub.qa_discussion',discussion_id::text,true);

  -- Private, non-published fixture; never represented as a real coach or enquiry.
  insert into coaches(name,location,bio,philosophy,years_experience,student_levels,
      availability,status,authorized)
    values('QA rollback fixture - not a real coach','Isolated transaction',
      'Private permission test fixture, not a real person.',
      'No coaching offered.',0,'{Beginner}','No availability','draft',false)
    returning id into fixture_coach;
  insert into saved_coaches(user_id,coach_id) values(owner_id,fixture_coach);
  insert into enquiries(user_id,coach_id,message)
    values(owner_id,fixture_coach,'QA rollback-only privacy fixture, not a genuine contact request.');
  insert into reports(user_id,post_id,reason)
    values(owner_id,discussion_id,'QA rollback-only report visibility fixture.');
  perform set_config('request.jwt.claim.sub',member_id::text,true);
  perform set_config('request.jwt.claims',jsonb_build_object('sub',member_id,'role','authenticated')::text,true);
end; $$;

set local role authenticated;
do $$
declare owner_id uuid := current_setting('golfer_hub.qa_owner')::uuid;
  member_id uuid := current_setting('golfer_hub.qa_member')::uuid;
  discussion_id uuid := current_setting('golfer_hub.qa_discussion')::uuid;
  affected integer;
begin
  if auth.uid() is distinct from member_id or is_admin() then
    raise exception 'Ordinary account identity check failed.';
  end if;
  if exists(select 1 from saved_lessons where user_id=owner_id)
    or exists(select 1 from lesson_progress where user_id=owner_id)
    or exists(select 1 from practice_items where user_id=owner_id)
    or exists(select 1 from saved_coaches where user_id=owner_id)
    or exists(select 1 from enquiries where user_id=owner_id)
    or exists(select 1 from reports where user_id=owner_id) then
    raise exception 'Another account private record was visible.';
  end if;
  if not exists(select 1 from saved_lessons where user_id=member_id)
    or not exists(select 1 from lesson_progress where user_id=member_id)
    or not exists(select 1 from practice_items where user_id=member_id) then
    raise exception 'Expected the member own browser-created records.';
  end if;
  if exists(select 1 from posts where id=discussion_id)
    or exists(select 1 from comments where post_id=discussion_id)
    or exists(select 1 from post_feed where id=discussion_id)
    or exists(select 1 from lessons where id='qa-cms-citation-check') then
    raise exception 'Moderated or draft content was visible.';
  end if;
  update practice_items set title='QA unauthorized alteration' where user_id=owner_id;
  get diagnostics affected=row_count;
  if affected <> 0 then raise exception 'Another account goal was changed.'; end if;
  update posts set title='QA unauthorized alteration' where user_id=owner_id;
  get diagnostics affected=row_count;
  if affected <> 0 then raise exception 'Another account post was changed.'; end if;
  update comments set body='QA unauthorized alteration' where user_id=owner_id;
  get diagnostics affected=row_count;
  if affected <> 0 then raise exception 'Another account comment was changed.'; end if;
  update reports set state='reviewed' where user_id=owner_id;
  get diagnostics affected=row_count;
  if affected <> 0 then raise exception 'Another account report was changed.'; end if;
  begin
    insert into practice_items(user_id,kind,title)
      values(owner_id,'goal','QA forged owner goal');
    raise exception 'Forged ownership unexpectedly accepted.';
  exception when insufficient_privilege then null; end;
  begin
    perform * from admin_users;
    raise exception 'Administrator list unexpectedly readable.';
  exception when insufficient_privilege then null; end;
  begin
    perform admin_coaches();
    raise exception 'Coach permission evidence unexpectedly readable.';
  exception when raise_exception then
    if sqlerrm <> 'Administrator required' then raise; end if;
  end;
  begin
    perform save_lesson('{}'::jsonb);
    raise exception 'CMS unexpectedly writable.';
  exception when raise_exception then
    if sqlerrm <> 'Administrator access required.' then raise; end if;
  end;
end; $$;
reset role;
rollback;
select 'PASS: live PostgreSQL role isolation; all fixtures and attempted changes rolled back' as verification;
