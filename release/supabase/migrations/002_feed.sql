begin;
-- Invoker privileges preserve every underlying table's row-level policies.
create view public.post_feed with (security_invoker = true) as
select p.*, pr.display_name,
  coalesce((select sum(v.value) from public.votes v where v.post_id=p.id),0)::integer score,
  (select count(*) from public.comments c where c.post_id=p.id)::integer comment_count,
  ((coalesce((select sum(v.value) from public.votes v where v.post_id=p.id),0) +
    (select count(*) from public.comments c where c.post_id=p.id)*0.5 + 1) /
    power(extract(epoch from (now()-p.created_at))/3600 + 2,1.5))::double precision hot_score
from public.posts p join public.profiles pr on pr.id=p.user_id;
grant select on public.post_feed to anon, authenticated;
revoke all on function public.new_profile(),public.check_reply(),public.guard_write() from public;
commit;
