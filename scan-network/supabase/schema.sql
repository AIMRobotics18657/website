-- SCAN (Student Clean Air Network): Supabase schema
-- Run once in Supabase: SQL Editor → New query → paste → Run.

create extension if not exists pgcrypto with schema extensions;

-- One row per physical sensor. token_hash is a bcrypt hash of the device's secret.
create table if not exists public.devices (
  id           text primary key,                 -- e.g. 'SCAN-01'; printed on the case
  name         text not null,                    -- shown on the map, e.g. 'Riverdale · Fieldston'
  neighborhood text,
  lat          double precision not null,
  lng          double precision not null,
  token_hash   text not null,
  created_at   timestamptz not null default now()
);

create table if not exists public.readings (
  id        bigint generated always as identity primary key,
  device_id text not null references public.devices(id) on delete cascade,
  ts        timestamptz not null default now(),
  pm1       real,
  pm25      real not null,
  pm10      real,
  rssi      int                                  -- Wi-Fi signal strength, for debugging placement
);
create index if not exists readings_device_ts on public.readings (device_id, ts desc);
create index if not exists readings_ts on public.readings (ts desc);

-- Row-level security: the public can READ readings, nobody can write directly.
alter table public.devices  enable row level security;
alter table public.readings enable row level security;
drop policy if exists "public read readings" on public.readings;
create policy "public read readings" on public.readings for select using (true);
-- (no policies on devices → secrets in token_hash are never readable through the API)

-- Latest reading per device, with map info. Runs with owner rights, exposes only public columns.
create or replace view public.latest_readings as
  select distinct on (r.device_id)
         r.device_id, d.name, d.neighborhood, d.lat, d.lng, r.ts, r.pm1, r.pm25, r.pm10, r.rssi
  from public.readings r join public.devices d on d.id = r.device_id
  order by r.device_id, r.ts desc;
grant select on public.latest_readings to anon, authenticated;

-- The ONLY write path. Sensors call POST /rest/v1/rpc/submit_reading with their id + secret.
create or replace function public.submit_reading(
  p_device text, p_token text, p_pm1 real, p_pm25 real, p_pm10 real, p_rssi int default null
) returns void
language plpgsql security definer
set search_path = public, extensions
as $$
begin
  if not exists (select 1 from devices where id = p_device and token_hash = crypt(p_token, token_hash)) then
    raise exception 'unauthorized device' using errcode = '28000';
  end if;
  if p_pm25 is null or p_pm25 < 0 or p_pm25 > 1000 then
    raise exception 'pm25 out of range';
  end if;
  -- simple rate limit: ignore posts closer than 20 s apart from the same device
  if exists (select 1 from readings where device_id = p_device and ts > now() - interval '20 seconds') then
    return;
  end if;
  insert into readings (device_id, pm1, pm25, pm10, rssi) values (p_device, p_pm1, p_pm25, p_pm10, p_rssi);
end $$;
revoke all on function public.submit_reading(text, text, real, real, real, int) from public;
grant execute on function public.submit_reading(text, text, real, real, real, int) to anon;

-- Optional: keep 90 days of minute data (enable pg_cron in Database → Extensions first).
-- select cron.schedule('scan-prune', '15 3 * * *', $$delete from public.readings where ts < now() - interval '90 days'$$);

-- Register sensors. Use a long random secret per device (e.g. from `openssl rand -hex 16`)
-- and type the same secret into that sensor's setup portal.
-- insert into public.devices (id, name, neighborhood, lat, lng, token_hash) values
--   ('SCAN-01', 'Riverdale · Fieldston', 'Riverdale', 40.8895, -73.9087, crypt('PASTE-SECRET-HERE', gen_salt('bf')));
