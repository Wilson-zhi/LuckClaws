-- Run once in the Supabase SQL Editor before using account avatar uploads.

alter table public.profiles
  add column if not exists avatar_url text;

grant select, update on table public.profiles to authenticated;

drop policy if exists "Account holders can read own profile" on public.profiles;
create policy "Account holders can read own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "Account holders can update own profile" on public.profiles;
create policy "Account holders can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'avatars',
  'avatars',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view account avatars" on storage.objects;
create policy "Public can view account avatars"
on storage.objects
for select
to public
using (bucket_id = 'avatars');

drop policy if exists "Account holders can upload own avatar" on storage.objects;
create policy "Account holders can upload own avatar"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Account holders can update own avatar" on storage.objects;
create policy "Account holders can update own avatar"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Account holders can delete own avatar" on storage.objects;
create policy "Account holders can delete own avatar"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);
