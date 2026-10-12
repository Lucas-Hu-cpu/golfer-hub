begin;
-- Permission evidence can contain private correspondence: never expose it via Data API.
revoke select on coaches from anon,authenticated;
grant select(id,name,location,specialties,bio,philosophy,years_experience,student_levels,photo_url,contact_url,availability,lesson_topics,recommended_lessons,authorized,status) on coaches to anon,authenticated;
create function public.admin_coaches() returns setof public.coaches
language plpgsql stable security definer set search_path=public as $$
begin
  if not public.is_admin() then raise exception 'Administrator required'; end if;
  return query select * from public.coaches;
end; $$;
revoke all on function public.admin_coaches() from public;
grant execute on function public.admin_coaches() to authenticated;
commit;
