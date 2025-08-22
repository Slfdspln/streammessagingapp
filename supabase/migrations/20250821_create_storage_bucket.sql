-- Create public bucket for profile photos
select storage.create_bucket('profile-photos', public => true);

-- Allow authenticated users to upload to this bucket
create policy "auth can upload to profile-photos"
on storage.objects for insert
to authenticated
with check (bucket_id = 'profile-photos');

-- Allow authenticated users to list/read from this bucket
create policy "auth can list profile-photos"
on storage.objects for select
to authenticated
using (bucket_id = 'profile-photos');
