-- Apply only to a new isolated Supabase project. No existing tables are dropped.
begin;
create table public.admin_users (user_id uuid primary key references auth.users on delete cascade);
alter table public.admin_users enable row level security;
create function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from admin_users where user_id = auth.uid());
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 50),
  skill_level text not null default 'Beginner' check (skill_level in ('Beginner','Intermediate','Advanced')),
  created_at timestamptz not null default now()
);
create function public.new_profile() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles(id, display_name) values(new.id, left(coalesce(nullif(new.raw_user_meta_data->>'display_name',''), 'Golfer'),50));
  return new;
end; $$;
create trigger on_signup after insert on auth.users for each row execute function public.new_profile();

create table public.categories (id text primary key, name text not null unique, position integer not null default 0);
create table public.forum_categories (id text primary key, name text not null unique);
create table public.sources (
  id text primary key, title text not null, publisher text not null, url text not null check(url ~ '^https://'),
  author text, published_date text, checked_on date not null,
  evidence text not null, status text not null check(status in ('verified','indexed','needs-review'))
);
create table public.lessons (
  id text primary key, category_id text not null references categories,
  title text not null, level text not null check(level in ('Beginner','Intermediate','Advanced')),
  status text not null default 'draft' check(status in ('draft','review','published')),
  data jsonb not null check(jsonb_typeof(data)='object'), updated_at timestamptz not null default now()
);
create table public.lesson_sources (
  lesson_id text references lessons on delete cascade, source_id text references sources,
  supports text not null, primary key(lesson_id,source_id)
);
create table public.coaches (
  id uuid primary key default gen_random_uuid(), name text not null, location text not null,
  specialties text[] not null default '{}', bio text not null, philosophy text not null,
  years_experience integer not null check(years_experience >= 0), student_levels text[] not null,
  photo_url text check(photo_url ~ '^https://'), contact_url text check(contact_url ~ '^https://'),
  availability text not null, lesson_topics text[] not null default '{}', recommended_lessons text[] not null default '{}',
  authorized boolean not null default false, authorization_reference text,
  status text not null default 'draft' check(status in ('draft','review','published')),
  check(status <> 'published' or (authorized and length(authorization_reference)>5 and contact_url is not null))
);
create table public.posts (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references profiles,
  category_id text not null references forum_categories,
  title text not null check(char_length(title) between 8 and 160),
  body text not null check(char_length(body) between 20 and 10000),
  tags text[] not null default '{}' check(cardinality(tags)<=5),
  media_url text check(media_url ~ '^https://'), hidden boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.comments (
  id uuid primary key default gen_random_uuid(), post_id uuid not null references posts on delete cascade,
  user_id uuid not null references profiles, parent_id uuid references comments on delete cascade,
  body text not null check(char_length(body) between 2 and 4000), hidden boolean not null default false,
  created_at timestamptz not null default now()
);
create function public.check_reply() returns trigger language plpgsql set search_path = public as $$
begin
  if new.parent_id is not null and not exists(select 1 from comments where id=new.parent_id and post_id=new.post_id and not hidden) then
    raise exception 'Reply must belong to the same discussion';
  end if;
  return new;
end; $$;
create trigger valid_reply before insert or update on comments for each row execute function check_reply();
create table public.votes (
  user_id uuid references profiles on delete cascade, post_id uuid references posts on delete cascade,
  value smallint not null check(value in (-1,1)), created_at timestamptz not null default now(), primary key(user_id,post_id)
);
create table public.saved_lessons (user_id uuid references profiles on delete cascade, lesson_id text references lessons on delete cascade, created_at timestamptz not null default now(), primary key(user_id,lesson_id));
create table public.saved_coaches (user_id uuid references profiles on delete cascade, coach_id uuid references coaches on delete cascade, created_at timestamptz not null default now(), primary key(user_id,coach_id));
create table public.practice_items (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references profiles on delete cascade,
  kind text not null check(kind in ('goal','checklist')), title text not null check(char_length(title) between 3 and 200),
  completed boolean not null default false, week date, created_at timestamptz not null default now()
);
create table public.lesson_progress (user_id uuid references profiles on delete cascade, lesson_id text references lessons on delete cascade, completed_at timestamptz not null default now(), primary key(user_id,lesson_id));
create table public.enquiries (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references profiles,
  coach_id uuid not null references coaches, message text not null check(char_length(message) between 20 and 2000),
  state text not null default 'received' check(state in ('received','forwarded','closed')), created_at timestamptz not null default now()
);
create table public.reports (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references profiles,
  post_id uuid references posts on delete cascade, comment_id uuid references comments on delete cascade,
  reason text not null check(char_length(reason) between 10 and 1000),
  state text not null default 'open' check(state in ('open','reviewed','dismissed')),
  created_at timestamptz not null default now(), check(num_nonnulls(post_id,comment_id)=1)
);

-- All access is scoped by RLS. Administrator identities cannot be self-assigned.
do $$ declare t text; begin
  foreach t in array array['profiles','categories','forum_categories','sources','lessons','lesson_sources','coaches','posts','comments','votes','saved_lessons','saved_coaches','practice_items','lesson_progress','enquiries','reports'] loop
    execute format('alter table public.%I enable row level security',t);
    execute format('create policy admin_access on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())',t);
  end loop;
end; $$;
create policy profile_read on profiles for select using(true);
create policy profile_edit on profiles for update to authenticated using(id=auth.uid()) with check(id=auth.uid());
create policy category_read on categories for select using(true);
create policy forum_category_read on forum_categories for select using(true);
create policy source_read on sources for select using(status in ('verified','indexed'));
create policy lesson_read on lessons for select using(status='published');
create policy lesson_source_read on lesson_sources for select using(exists(select 1 from lessons l where l.id=lesson_id and l.status='published'));
create policy coach_read on coaches for select using(status='published' and authorized);
create policy post_read on posts for select using(not hidden);
create policy post_create on posts for insert to authenticated with check(user_id=auth.uid() and not hidden);
create policy post_edit on posts for update to authenticated using(user_id=auth.uid() and not hidden) with check(user_id=auth.uid() and not hidden);
create policy post_delete on posts for delete to authenticated using(user_id=auth.uid());
create policy comment_read on comments for select using(not hidden and exists(select 1 from posts where id=post_id and not hidden));
create policy comment_create on comments for insert to authenticated with check(user_id=auth.uid() and not hidden and exists(select 1 from posts where id=post_id and not hidden));
create policy comment_edit on comments for update to authenticated using(user_id=auth.uid() and not hidden) with check(user_id=auth.uid() and not hidden);
create policy comment_delete on comments for delete to authenticated using(user_id=auth.uid());
create policy votes_read on votes for select using(exists(select 1 from posts where id=post_id and not hidden));
create policy vote_own on votes for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid() and exists(select 1 from posts where id=post_id and not hidden));
do $$ declare t text; begin
  foreach t in array array['saved_lessons','saved_coaches','practice_items','lesson_progress'] loop
    execute format('create policy own_records on public.%I for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid())',t);
  end loop;
end; $$;
create policy enquiry_own_read on enquiries for select to authenticated using(user_id=auth.uid());
create policy enquiry_create on enquiries for insert to authenticated with check(user_id=auth.uid() and state='received' and exists(select 1 from coaches where id=coach_id and authorized and status='published'));
create policy report_own_read on reports for select to authenticated using(user_id=auth.uid());
create policy report_create on reports for insert to authenticated with check(user_id=auth.uid() and state='open');

-- Atomic, database-enforced limits also cover direct Data API calls.
create table public.write_buckets(user_id uuid, bucket text, minute timestamptz, count integer not null, primary key(user_id,bucket,minute));
alter table write_buckets enable row level security;
create function public.guard_write() returns trigger language plpgsql security definer set search_path=public as $$
declare n integer; limit_count integer;
begin
  if auth.uid() is null then return new; end if;
  if tg_op='UPDATE' then
    if new.user_id<>old.user_id or new.created_at<>old.created_at then raise exception 'Immutable identity'; end if;
    if tg_table_name in ('posts','comments') then
      if new.hidden<>old.hidden and not is_admin() then raise exception 'Moderator required'; end if;
    end if;
    if tg_table_name='comments' then
      if new.post_id<>old.post_id or new.parent_id is distinct from old.parent_id then raise exception 'Immutable discussion'; end if;
    end if;
    if tg_table_name='votes' then
      if new.post_id<>old.post_id then raise exception 'Immutable vote'; end if;
    end if;
  end if;
  limit_count := case tg_table_name when 'posts' then 3 when 'comments' then 10 when 'enquiries' then 2 when 'reports' then 3 else 30 end;
  insert into write_buckets values(auth.uid(),tg_table_name,date_trunc('minute',now()),1)
  on conflict(user_id,bucket,minute) do update set count=write_buckets.count+1 returning count into n;
  if n>limit_count then raise exception 'Please wait a minute before trying again'; end if;
  return new;
end; $$;
do $$ declare t text; begin
  foreach t in array array['posts','comments','votes','enquiries','reports','practice_items'] loop
    execute format('create trigger guard_write before insert or update on %I for each row execute function guard_write()',t);
  end loop;
end; $$;
create index posts_category_time on posts(category_id,created_at desc);
create index posts_user on posts(user_id);
create index comments_post on comments(post_id,created_at);
create index comments_user on comments(user_id);
create index goals_user on practice_items(user_id);
create index reports_open on reports(state,created_at);
create index enquiry_coach on enquiries(coach_id,state);
create index lessons_category on lessons(category_id,status);
create index post_search on posts using gin(to_tsvector('english',title || ' ' || body));
grant usage on schema public to anon, authenticated;
grant select on profiles,categories,forum_categories,sources,lessons,lesson_sources,coaches,posts,comments,votes to anon;
grant select,insert,update,delete on profiles,categories,forum_categories,sources,lessons,lesson_sources,coaches,posts,comments,votes,saved_lessons,saved_coaches,practice_items,lesson_progress,enquiries,reports to authenticated;
revoke all on admin_users,write_buckets from anon,authenticated;
commit;
