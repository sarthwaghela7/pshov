-- Apply this migration to the existing Supabase project.
-- It is safe to run more than once.

alter table public.admin_access
  add column if not exists revoked_at timestamptz;

alter table public.ventures
  add column if not exists detail_image_url text,
  add column if not exists landing_image_url text;

alter table public.services
  add column if not exists detail_image_url text,
  add column if not exists landing_image_url text;

-- Keep currently configured images visible until distinct images are added.
update public.ventures
set detail_image_url = coalesce(detail_image_url, image_url),
    landing_image_url = coalesce(landing_image_url, image_url);

update public.services
set detail_image_url = coalesce(detail_image_url, image_url),
    landing_image_url = coalesce(landing_image_url, image_url);

create or replace function public.set_admin_access_status(target_email text, next_is_active boolean)
returns public.admin_access
language plpgsql
security definer
set search_path = public
as $$
declare
  changed_row public.admin_access;
begin
  if not public.is_active_admin() then
    raise exception 'Only an active admin can change admin access.';
  end if;

  if not next_is_active and lower(trim(target_email)) = lower(coalesce(auth.jwt() ->> 'email', '')) then
    raise exception 'You cannot revoke your own access. Use another active admin account.';
  end if;

  update public.admin_access
  set is_active = next_is_active,
      revoked_at = case when next_is_active then null else now() end,
      updated_at = now()
  where email = lower(trim(target_email))
  returning * into changed_row;

  if changed_row.email is null then
    raise exception 'Admin email not found.';
  end if;

  return changed_row;
end;
$$;

revoke all on function public.set_admin_access_status(text, boolean) from public;
grant execute on function public.set_admin_access_status(text, boolean) to authenticated;
