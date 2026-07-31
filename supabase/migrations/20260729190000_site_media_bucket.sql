-- Bucket público para imagens do admin (home cards + portfólio).
-- Sem isso, o admin grava data:URL no Postgres e imagens grandes “corrompem”.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-media',
  'site-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Leitura pública
drop policy if exists "site-media public read" on storage.objects;
create policy "site-media public read"
on storage.objects for select
using (bucket_id = 'site-media');

-- Upload/update/delete só para autenticados (admin)
drop policy if exists "site-media auth write" on storage.objects;
create policy "site-media auth write"
on storage.objects for insert
to authenticated
with check (bucket_id = 'site-media');

drop policy if exists "site-media auth update" on storage.objects;
create policy "site-media auth update"
on storage.objects for update
to authenticated
using (bucket_id = 'site-media')
with check (bucket_id = 'site-media');

drop policy if exists "site-media auth delete" on storage.objects;
create policy "site-media auth delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'site-media');
