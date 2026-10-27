-- Moderación de anuncios, papeles del vehículo, permuta y verificación de identidad

alter table profiles add column if not exists verification_status text not null default 'ninguno';
alter table profiles add column if not exists id_front_url text;
alter table profiles add column if not exists id_back_url text;
alter table profiles add column if not exists verification_note text;
alter table profiles add column if not exists verified_at timestamptz;

alter table vehicles add column if not exists soat_expiry date;
alter table vehicles add column if not exists tecno_expiry date;
alter table vehicles add column if not exists impuestos_al_dia boolean not null default true;
alter table vehicles add column if not exists impuestos_detalle text;
alter table vehicles add column if not exists impuestos_valor double precision not null default 0;
alter table vehicles add column if not exists swap_any boolean not null default true;
alter table vehicles add column if not exists swap_prefs text;

insert into profiles (user_id, display_name, email, city, role, verification_status, verified_at)
values ('catalog-seed', 'AutoMarket Select', null, 'Bogotá', 'cliente', 'verificado', now())
on conflict (user_id) do update
  set verification_status = 'verificado',
      verified_at = coalesce(profiles.verified_at, now());

update vehicles
set
  soat_expiry = coalesce(soat_expiry, date '2026-12-15'),
  tecno_expiry = coalesce(tecno_expiry, date '2027-03-10'),
  impuestos_al_dia = true
where soat_expiry is null;

update vehicles
set
  tecno_expiry = date '2026-08-20',
  impuestos_al_dia = false,
  impuestos_detalle = '[{"label":"Impuesto vehicular 2025","amount":780000},{"label":"Impuesto vehicular 2026","amount":845000}]',
  impuestos_valor = 1625000
where brand = 'Renault' and model = 'Duster';

update vehicles
set
  swap_any = false,
  swap_prefs = '{"any":false,"brands":["Toyota","Mazda","Kia"],"bodyTypes":["sedan","suv"],"yearMin":2018,"mileageMax":90000,"transmissions":["automatica"]}'
where listing_type in ('permuta', 'ambos');

insert into vehicles (
  user_id, title, brand, model, year, mileage, price, condition, fuel,
  transmission, body_type, city, description, image_url, listing_type, status,
  soat_expiry, tecno_expiry, impuestos_al_dia, swap_any
) values (
  'catalog-seed',
  'Hyundai Tucson Limited 2021',
  'Hyundai', 'Tucson', 2021, 47000, 98000000,
  'usado', 'gasolina', 'automatica', 'suv', 'Pereira',
  'Full equipo, único dueño. En revisión de publicación. Soat vigente y papeles listos para traspaso.',
  '/vehicles/sportage.jpg', 'venta', 'pendiente',
  date '2027-01-22', date '2026-11-05', true, true
);
