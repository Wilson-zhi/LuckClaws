-- Run once in the Supabase SQL Editor.
-- Keeps discount data server-only and records the discount used on completed orders.

alter table public.orders
  add column if not exists discount_code text,
  add column if not exists discount_amount numeric(12, 2) not null default 0;

grant usage on schema public to service_role;
grant select, insert, update, delete on table public.discount_codes to service_role;

create unique index if not exists orders_paypal_order_id_unique
  on public.orders (paypal_order_id)
  where paypal_order_id is not null;

create or replace function public.increment_discount_usage_if_available(p_code text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.discount_codes
  set
    used_count = coalesce(used_count, 0) + 1,
    updated_at = now()
  where upper(code) = upper(trim(p_code))
    and status = 'active'
    and (max_uses is null or max_uses <= 0 or coalesce(used_count, 0) < max_uses);

  return found;
end;
$$;

revoke all on function public.increment_discount_usage_if_available(text) from public, anon, authenticated;
grant execute on function public.increment_discount_usage_if_available(text) to service_role;
