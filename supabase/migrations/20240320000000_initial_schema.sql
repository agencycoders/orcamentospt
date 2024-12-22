-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create customers table
create table public.customers (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    type text check (type in ('individual', 'company')) not null,
    name text not null,
    email text,
    phone text,
    address text,
    city text,
    state text,
    postal_code text,
    tax_id text,
    company_name text,
    trading_name text,
    contact_name text,
    contact_phone text,
    contact_email text,
    website text,
    notes text,
    is_active boolean default true not null
);

-- Create budgets table
create table public.budgets (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    customer_id uuid references public.customers(id) on delete cascade not null,
    budget_number serial not null,
    revision integer default 1 not null,
    status text check (status in ('draft', 'sent', 'approved', 'rejected', 'cancelled')) default 'draft' not null,
    validity_days integer default 30 not null,
    payment_term text check (payment_term in ('immediate', '15_days', '30_days', '45_days', '60_days', 'custom')) default 'immediate' not null,
    custom_payment_term text,
    delivery_time text,
    shipping_cost numeric(10,2) default 0 not null,
    discount_percentage numeric(5,2) default 0 not null,
    discount_amount numeric(10,2) default 0 not null,
    total_cost numeric(10,2) default 0 not null,
    total_selling numeric(10,2) default 0 not null,
    profit_margin numeric(10,2) default 0 not null,
    profit_percentage numeric(5,2) default 0 not null,
    notes text,
    internal_notes text,
    terms_and_conditions text,
    payment_conditions text,
    warranty_terms text,
    technical_details text,
    sent_at timestamp with time zone,
    approved_at timestamp with time zone,
    rejected_at timestamp with time zone,
    rejection_reason text,
    approved_by text,
    created_by text,
    last_updated_by text
);

-- Create budget items table
create table public.budget_items (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    budget_id uuid references public.budgets(id) on delete cascade not null,
    sequence integer not null,
    reference text not null,
    description text not null,
    detailed_description text,
    technical_details text,
    unit text default 'un' not null,
    quantity numeric(10,2) default 1 not null,
    cost_price numeric(10,2) default 0 not null,
    selling_price numeric(10,2) default 0 not null,
    discount_percentage numeric(5,2) default 0 not null,
    total_cost numeric(10,2) default 0 not null,
    total_selling numeric(10,2) default 0 not null,
    profit_margin numeric(10,2) default 0 not null,
    profit_percentage numeric(5,2) default 0 not null,
    delivery_time text,
    warranty_terms text,
    notes text,
    supplier_info text,
    manufacturer text,
    brand text,
    model text
);

-- Create budget history table
create table public.budget_history (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    budget_id uuid references public.budgets(id) on delete cascade not null,
    action text not null,
    status text check (status in ('draft', 'sent', 'approved', 'rejected', 'cancelled')),
    user_id text,
    notes text,
    changes jsonb
);

-- Create budget files table
create table public.budget_files (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    budget_id uuid references public.budgets(id) on delete cascade not null,
    file_name text not null,
    file_size integer not null,
    file_type text not null,
    storage_path text not null,
    description text,
    category text,
    uploaded_by text,
    is_public boolean default false not null
);

-- Create views for statistics
create or replace view public.budget_statistics as
select
    count(*) as total_budgets,
    count(case when status = 'approved' then 1 end) as approved_count,
    count(case when status = 'sent' then 1 end) as sent_count,
    count(case when status = 'draft' then 1 end) as pending_count,
    count(case when status = 'rejected' then 1 end) as rejected_count,
    coalesce(sum(total_selling), 0) as total_value,
    coalesce(avg(profit_percentage), 0) as average_margin,
    coalesce(sum(case when status = 'approved' then total_selling else 0 end), 0) as approved_value,
    coalesce(avg(case when status = 'approved' then profit_percentage else null end), 0) as approved_margin,
    min(created_at) as first_budget_date,
    max(created_at) as last_budget_date,
    coalesce(sum(case when status = 'approved' then profit_margin else 0 end), 0) as total_profit_approved,
    (select count(*) from customers) as total_customers
from budgets;

create or replace view public.monthly_budget_statistics as
select
    to_char(created_at, 'YYYY-MM') as month,
    count(*) as total_budgets,
    count(case when status = 'approved' then 1 end) as approved_count,
    coalesce(sum(total_selling), 0) as total_value,
    coalesce(sum(profit_margin), 0) as total_profit,
    coalesce(avg(profit_percentage), 0) as average_margin,
    count(distinct customer_id) as unique_customers
from budgets
group by to_char(created_at, 'YYYY-MM')
order by month desc;

create or replace view public.customer_statistics as
select
    c.id as customer_id,
    c.name as customer_name,
    c.type as customer_type,
    count(b.id) as total_budgets,
    count(case when b.status = 'approved' then 1 end) as approved_budgets,
    coalesce(sum(b.total_selling), 0) as total_value,
    coalesce(avg(b.profit_percentage), 0) as average_margin,
    max(b.created_at) as last_budget_date,
    min(b.created_at) as first_budget_date
from customers c
left join budgets b on b.customer_id = c.id
group by c.id, c.name, c.type;

-- Enable Row Level Security (RLS)
alter table public.customers enable row level security;
alter table public.budgets enable row level security;
alter table public.budget_items enable row level security;
alter table public.budget_history enable row level security;
alter table public.budget_files enable row level security;

-- Create policies
create policy "Enable read access for all users" on public.customers
    for select
    using (true);

create policy "Enable read access for all users" on public.budgets
    for select
    using (true);

create policy "Enable read access for all users" on public.budget_items
    for select
    using (true);

create policy "Enable read access for all users" on public.budget_history
    for select
    using (true);

create policy "Enable read access for all users" on public.budget_files
    for select
    using (true);

-- Create triggers for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

create trigger handle_customers_updated_at
    before update on public.customers
    for each row
    execute function public.handle_updated_at();

create trigger handle_budgets_updated_at
    before update on public.budgets
    for each row
    execute function public.handle_updated_at();

create trigger handle_budget_items_updated_at
    before update on public.budget_items
    for each row
    execute function public.handle_updated_at();
