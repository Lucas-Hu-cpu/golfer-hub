begin;
-- Keep removed practice items recoverable instead of permanently deleting them.
alter table public.practice_items add column archived boolean not null default false;
commit;
