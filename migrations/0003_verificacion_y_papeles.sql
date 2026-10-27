-- Perfiles ampliados, verificación, papeles del vehículo, galería y contraofertas.

alter table profiles add column if not exists first_name text;
alter table profiles add column if not exists last_name text;
alter table profiles add column if not exists document_type text;
alter table profiles add column if not exists document_number text;
alter table profiles add column if not exists address text;
alter table profiles add column if not exists whatsapp text;
alter table profiles add column if not exists verification_status text not null default 'sin_verificar';
alter table profiles add column if not exists id_front_url text;
alter table profiles add column if not exists id_back_url text;
alter table profiles add column if not exists verification_note text;
alter table profiles add column if not exists account_status text not null default 'activo';
alter table profiles add column if not exists verified_at timestamptz;

alter table vehicles add column if not exists images text not null default '[]';
alter table vehicles add column if not exists soat_expires date;
alter table vehicles add column if not exists tecno_expires date;
alter table vehicles add column if not exists taxes_current boolean not null default true;
alter table vehicles add column if not exists taxes_detail text;
alter table vehicles add column if not exists taxes_amount double precision not null default 0;
alter table vehicles add column if not exists fines_current boolean not null default true;
alter table vehicles add column if not exists fines_detail text;
alter table vehicles add column if not exists fines_amount double precision not null default 0;
alter table vehicles add column if not exists swap_any boolean not null default true;
alter table vehicles add column if not exists swap_prefs text;

alter table offers add column if not exists last_actor_id text;
alter table offers add column if not exists counter_count integer not null default 0;

create table if not exists offer_events (
  id serial primary key,
  offer_id integer not null references offers(id) on delete cascade,
  actor_id text not null,
  action text not null,
  amount double precision,
  swap_vehicle_id integer,
  message text,
  created_at timestamptz not null default now()
);

create index if not exists offer_events_offer_id_idx on offer_events (offer_id);

insert into profiles (
  user_id, display_name, first_name, last_name, email, phone, whatsapp, city,
  role, verification_status, account_status
) values (
  'catalog-seed', 'AutoMarket Catálogo', 'AutoMarket', 'Catálogo',
  'catalogo@automarket.co', '3005550100', '3005550100', 'Bogotá',
  'cliente', 'verificado', 'activo'
) on conflict (user_id) do nothing;

update vehicles set images = '["/vehicles/corolla.jpg","/vehicles/jetta.jpg","/vehicles/mazda3.jpg"]',
  soat_expires = '2027-03-12', tecno_expires = '2027-01-20',
  taxes_current = true, fines_current = true, swap_any = true
where title = 'Toyota Corolla XEI 2021' and (images = '[]' or images is null or images = '');

update vehicles set images = '["/vehicles/cx5.jpg","/vehicles/cx30.jpg","/vehicles/tucson.jpg"]',
  soat_expires = '2026-11-02', tecno_expires = '2026-12-15',
  taxes_current = false, taxes_detail = 'Impuesto vehicular 2026 pendiente en Secretaría de Movilidad de Medellín',
  taxes_amount = 1280000, fines_current = true, swap_any = false,
  swap_prefs = '{"any":false,"bodyType":"sedan","yearMin":2020,"mileageMax":50000}'
where title like 'Mazda CX-5%' and (images = '[]' or images is null or images = '');

update vehicles set images = '["/vehicles/onix.jpg","/vehicles/mazda3.jpg","/vehicles/corolla.jpg"]',
  soat_expires = '2026-10-08', tecno_expires = '2027-02-01',
  taxes_current = true, fines_current = true, swap_any = true
where title like 'Chevrolet Onix%' and (images = '[]' or images is null or images = '');

update vehicles set images = '["/vehicles/duster.jpg","/vehicles/sportage.jpg","/vehicles/tucson.jpg"]',
  soat_expires = '2027-05-19', tecno_expires = '2026-09-30',
  taxes_current = true, fines_current = false,
  fines_detail = 'Comparendo por exceso de velocidad en Bucaramanga (octubre 2025)',
  fines_amount = 450000, swap_any = false,
  swap_prefs = '{"any":false,"bodyType":"pickup","yearMin":2018,"mileageMax":90000}'
where title like 'Renault Duster%' and (images = '[]' or images is null or images = '');

update vehicles set images = '["/vehicles/sportage.jpg","/vehicles/tucson.jpg","/vehicles/cx5.jpg"]',
  soat_expires = '2027-06-01', tecno_expires = '2027-04-12',
  taxes_current = true, fines_current = true, swap_any = true
where title like 'Kia Sportage%' and (images = '[]' or images is null or images = '');

update vehicles set images = '["/vehicles/frontier.jpg","/vehicles/ranger.jpg","/vehicles/hilux.jpg"]',
  soat_expires = '2026-12-22', tecno_expires = '2027-01-05',
  taxes_current = false, taxes_detail = 'Impuesto de rodamiento 2025 y 2026',
  taxes_amount = 2100000, fines_current = true, swap_any = false,
  swap_prefs = '{"any":false,"bodyType":"suv","yearMin":2019}'
where title like 'Nissan Frontier%' and (images = '[]' or images is null or images = '');

update vehicles set images = '["/vehicles/ranger.jpg","/vehicles/hilux.jpg","/vehicles/frontier.jpg"]',
  soat_expires = '2027-02-14', tecno_expires = '2027-03-01',
  taxes_current = true, fines_current = true, swap_any = true
where title like 'Ford Ranger%' and (images = '[]' or images is null or images = '');

update vehicles set images = '["/vehicles/tiguan.jpg","/vehicles/cx5.jpg","/vehicles/tucson.jpg"]',
  soat_expires = '2027-01-30', tecno_expires = '2026-11-18',
  taxes_current = true, fines_current = false,
  fines_detail = 'Foto-multa semáforo en Bogotá, curso pendiente',
  fines_amount = 312000, swap_any = false,
  swap_prefs = '{"any":false,"bodyType":"sedan","brand":"Toyota","yearMin":2021,"mileageMax":40000}'
where title like 'Volkswagen Tiguan%' and (images = '[]' or images is null or images = '');

update vehicles set images = '["/vehicles/hilux.jpg","/vehicles/ranger.jpg","/vehicles/frontier.jpg"]',
  soat_expires = '2027-08-09', tecno_expires = '2027-07-21',
  taxes_current = true, fines_current = true, swap_any = true
where title like 'Toyota Hilux%' and (images = '[]' or images is null or images = '');

update vehicles set images = '["/vehicles/mazda3.jpg","/vehicles/onix.jpg","/vehicles/corolla.jpg"]',
  soat_expires = '2027-04-04', tecno_expires = '2027-04-04',
  taxes_current = true, fines_current = true, swap_any = true
where title like 'Mazda 3%' and (images = '[]' or images is null or images = '');

update vehicles
set images = '["' || image_url || '"]'
where images = '[]' or images is null or images = '';
