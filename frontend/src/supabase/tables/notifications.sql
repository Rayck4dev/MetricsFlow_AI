create table if not exists public.notifications (
    id uuid not null default gen_random_uuid(),
    user_id uuid not null,
    actor_user_id uuid null,
    company_id uuid null,
    type varchar(50) not null,
    title varchar(150) not null,
    message text not null,
    read boolean not null default false,
    created_at timestamptz not null default now(),

    constraint notifications_pkey
        primary key (id),

    constraint notifications_user_id_fkey
        foreign key (user_id)
        references auth.users(id)
        on delete cascade,

    constraint notifications_actor_user_id_fkey
        foreign key (actor_user_id)
        references auth.users(id)
        on delete set null,

    constraint notifications_company_id_fkey
        foreign key (company_id)
        references public.companies(id)
        on delete cascade
);
