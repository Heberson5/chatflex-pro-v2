import bcrypt from 'bcryptjs'

export async function ensureSchema(pool){
  await pool.query(`
  create extension if not exists "uuid-ossp";
  create table if not exists tenants(id uuid primary key default uuid_generate_v4(), slug text unique, name text);
  insert into tenants (id,slug,name) select uuid_generate_v4(),'univida','Univida' where not exists (select 1 from tenants where slug='univida');
  create table if not exists users(
    id uuid primary key default uuid_generate_v4(),
    tenant_id uuid references tenants(id) on delete cascade,
    email text unique not null,
    password_hash text not null,
    role text default 'AGENT' check (role in ('MASTER','SUPERVISOR','AGENT')),
    department text,
    active boolean default true
  );
  create table if not exists conversations(
    id uuid primary key default uuid_generate_v4(),
    tenant_id uuid references tenants(id) on delete cascade,
    customer_name text, customer_number text,
    status text default 'open',
    assigned_user_id uuid references users(id),
    department text,
    accepted_at timestamptz, accepted_by uuid references users(id),
    closed_at timestamptz, closed_by uuid references users(id),
    source_number text, session text,
    created_at timestamptz default now()
  );
  create table if not exists messages(
    id uuid primary key default uuid_generate_v4(),
    conversation_id uuid references conversations(id) on delete cascade,
    sender text not null, body text, media_url text, created_at timestamptz default now()
  );
  create table if not exists quick_replies(
    id uuid primary key default uuid_generate_v4(),
    tenant_id uuid references tenants(id) on delete cascade,
    department text, title text not null, body text not null,
    created_by uuid references users(id), created_at timestamptz default now()
  );
  create table if not exists contacts(
    id uuid primary key default uuid_generate_v4(),
    tenant_id uuid references tenants(id) on delete cascade,
    name text, number text not null unique, email text, doc_id text, custom jsonb default '{}'::jsonb,
    created_at timestamptz default now(), updated_at timestamptz default now()
  );
  create table if not exists entry_flows(
    id uuid primary key default uuid_generate_v4(),
    tenant_id uuid references tenants(id) on delete cascade,
    name text not null, config jsonb not null default '{}'::jsonb, version int default 1, published boolean default false
  );
  create table if not exists phone_numbers(
    id uuid primary key default uuid_generate_v4(),
    tenant_id uuid references tenants(id) on delete cascade,
    label text, number text not null unique, connector text default 'evolution', flow_id uuid, session text
  );
  create table if not exists user_permissions(user_id uuid references users(id) on delete cascade, permission text not null, primary key(user_id,permission));
  create table if not exists department_permissions(tenant_id uuid references tenants(id) on delete cascade, department text not null, permission text not null, primary key(tenant_id,department,permission));
  `)
}

export async function seedMasterAdmin(pool){
  const email = process.env.MASTER_ADMIN_EMAIL, pass = process.env.MASTER_ADMIN_PASSWORD
  const t = await pool.query("select id from tenants where slug='univida'"); const tenant_id = t.rows[0].id
  const u = await pool.query('select id from users where email=$1',[email])
  if(!u.rowCount){
    const hpw = await bcrypt.hash(pass, 10)
    await pool.query("insert into users(tenant_id,email,password_hash,role,active) values($1,$2,$3,'MASTER',true)",[tenant_id,email,hpw])
  }
}
