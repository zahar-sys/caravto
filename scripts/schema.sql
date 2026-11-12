-- Run in a dedicated Supabase PostgreSQL project. Never expose service_role to browser.
create table if not exists public.records (
 key text primary key,
 kind text not null,
 value jsonb not null
);
create index if not exists records_kind_idx on public.records(kind);
alter table public.records enable row level security;
revoke all on public.records from anon, authenticated;
grant all on public.records to service_role;
create or replace function public.rate_hit(p_key text,p_max integer,p_expires bigint)
returns boolean language plpgsql security definer set search_path=public as $$
declare hits integer;
begin
 insert into public.records(key,kind,value) values(p_key,'rate',jsonb_build_object('count',1,'expires',p_expires))
 on conflict(key) do update set value=jsonb_set(records.value,'{count}',to_jsonb((records.value->>'count')::integer+1))
 returning (value->>'count')::integer into hits;
 return hits<=p_max;
end;$$;
revoke all on function public.rate_hit(text,integer,bigint) from public,anon,authenticated;
grant execute on function public.rate_hit(text,integer,bigint) to service_role;
-- Daily housekeeping; schedule in infrastructure, not in the browser.
-- delete from public.records where kind='rate' and (value->>'expires')::bigint < extract(epoch from now())*1000;
-- delete from public.records where kind='session' and (value->>'expires')::bigint < extract(epoch from now())*1000;
-- delete from public.records where kind='photo' and not (value ? 'order') and (value->>'created')::bigint < extract(epoch from now()-interval '7 days')*1000;
