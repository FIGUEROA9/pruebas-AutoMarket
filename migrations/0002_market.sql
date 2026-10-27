-- AutoMarket schema + seed catalog (idempotent)

create table if not exists profiles (
  user_id text primary key,
  display_name text not null,
  email text,
  phone text,
  city text,
  role text not null default 'cliente',
  created_at timestamptz not null default now()
);

create table if not exists vehicles (
  id serial primary key,
  user_id text not null references profiles(user_id) on delete cascade,
  title text not null,
  brand text not null,
  model text not null,
  year integer not null,
  mileage integer not null,
  price integer not null,
  condition text not null,
  fuel text not null,
  transmission text not null,
  body_type text not null,
  city text not null,
  description text not null,
  image_url text not null,
  listing_type text not null,
  status text not null default 'activo',
  created_at timestamptz not null default now()
);

create index if not exists vehicles_status_created_idx on vehicles (status, created_at desc);
create index if not exists vehicles_user_id_idx on vehicles (user_id);
create index if not exists vehicles_brand_idx on vehicles (brand);
create index if not exists vehicles_city_idx on vehicles (city);

create table if not exists offers (
  id serial primary key,
  vehicle_id integer not null references vehicles(id) on delete cascade,
  buyer_id text not null references profiles(user_id) on delete cascade,
  offer_type text not null,
  amount integer,
  swap_vehicle_id integer references vehicles(id) on delete set null,
  message text,
  status text not null default 'pendiente',
  created_at timestamptz not null default now()
);

create index if not exists offers_vehicle_id_idx on offers (vehicle_id);
create index if not exists offers_buyer_id_idx on offers (buyer_id);
create index if not exists offers_status_idx on offers (status);

create table if not exists favorites (
  user_id text not null references profiles(user_id) on delete cascade,
  vehicle_id integer not null references vehicles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, vehicle_id)
);

create table if not exists contacts (
  id serial primary key,
  user_id text,
  name text not null,
  email text not null,
  phone text not null,
  subject text,
  message text not null,
  created_at timestamptz not null default now()
);

insert into profiles (user_id, display_name, email, phone, city, role)
values
  ('seed-camila', 'Camila Restrepo', 'camila@automarket.co', '3005550101', 'Medellín', 'cliente'),
  ('seed-andres', 'Andrés Molina', 'andres@automarket.co', '3105550144', 'Bogotá', 'cliente'),
  ('seed-laura', 'Laura Gómez', 'laura@automarket.co', '3205550188', 'Cali', 'cliente'),
  ('seed-diego', 'Diego Herrera', 'diego@automarket.co', '3155550199', 'Pereira', 'cliente')
on conflict (user_id) do nothing;

insert into vehicles (
  user_id, title, brand, model, year, mileage, price, condition, fuel,
  transmission, body_type, city, description, image_url, listing_type, status
)
select * from (values
  ('seed-andres'::text, 'Toyota Corolla Seg 2021'::text, 'Toyota'::text, 'Corolla'::text, 2021, 34200, 68000000, 'usado'::text, 'gasolina'::text, 'automatica'::text, 'sedan'::text, 'Bogotá'::text,
   'Único dueño, mantenimientos en concesionario, papeles al día y listo para traspaso. Aire, cámara de reversa y sensores. Nunca taxi ni plataforma.'::text,
   '/vehicles/corolla.jpg'::text, 'venta'::text, 'activo'::text),
  ('seed-camila', 'Mazda CX-30 Grand Touring 2022', 'Mazda', 'CX-30', 2022, 18600, 98000000, 'seminuevo', 'gasolina', 'automatica', 'suv', 'Medellín',
   'Full equipo: techo, asientos en piel, Bose y HUD. Garaje cubierto en El Poblado. Permuto por SUV más grande y recibo diferencia.',
   '/vehicles/cx30.jpg', 'ambos', 'activo'),
  ('seed-laura', 'Chevrolet Onix Turbo 2020', 'Chevrolet', 'Onix', 2020, 41000, 42000000, 'usado', 'gasolina', 'manual', 'hatchback', 'Cali',
   'Motor turbo, bajo consumo, ideal para ciudad. Kit de distribución recién cambiado. Permuto por sedán del mismo rango.',
   '/vehicles/onix.jpg', 'permuta', 'activo'),
  ('seed-laura', 'Renault Duster Intens 2019', 'Renault', 'Duster', 2019, 62400, 55000000, 'usado', 'gasolina', 'manual', 'suv', 'Cali',
   '4x2, aire dual, exploradoras. Perfecta para carretera. Revisión de suspensión en marzo. Recibo moto de alta o hatchback.',
   '/vehicles/duster.jpg', 'ambos', 'activo'),
  ('seed-camila', 'Kia Sportage Vibrant 2023', 'Kia', 'Sportage', 2023, 9800, 118000000, 'seminuevo', 'gasolina', 'automatica', 'suv', 'Barranquilla',
   'Casi nueva, garantía de fábrica vigente. Nunca chocada. Precio un poco negociable de contado.',
   '/vehicles/sportage.jpg', 'venta', 'activo'),
  ('seed-diego', 'Nissan Frontier NP300 2018', 'Nissan', 'Frontier', 2018, 78000, 89000000, 'usado', 'diesel', 'manual', 'pickup', 'Bucaramanga',
   'Diésel, platón original, 4x4. Trabajo liviano de finca. Aceite y filtros al día. Permuto por camioneta familiar.',
   '/vehicles/frontier.jpg', 'ambos', 'activo'),
  ('seed-diego', 'Ford Ranger XLT 2021', 'Ford', 'Ranger', 2021, 45500, 125000000, 'usado', 'diesel', 'automatica', 'pickup', 'Pereira',
   'XLT automática diésel, sincronizada, nunca de carga pesada. Llanta de repuesto nueva. Solo venta.',
   '/vehicles/ranger.jpg', 'venta', 'activo'),
  ('seed-andres', 'Volkswagen Jetta Comfortline 2017', 'Volkswagen', 'Jetta', 2017, 91000, 48000000, 'usado', 'gasolina', 'automatica', 'sedan', 'Bogotá',
   'Caja DSG recién intervenida, llantas Michelin. Busco permuta por SUV compacto (CX-30, Tucson, Sportage).',
   '/vehicles/jetta.jpg', 'permuta', 'activo'),
  ('seed-laura', 'Hyundai Tucson Limited 2022', 'Hyundai', 'Tucson', 2022, 22100, 105000000, 'seminuevo', 'gasolina', 'automatica', 'suv', 'Medellín',
   'Limited, panorámico, 360°. Un solo dueño. Factura original. Recibo vehículo menor y diferencia a favor.',
   '/vehicles/tucson.jpg', 'ambos', 'activo')
) as x(user_id, title, brand, model, year, mileage, price, condition, fuel, transmission, body_type, city, description, image_url, listing_type, status)
where not exists (select 1 from vehicles where user_id like 'seed-%');

insert into offers (vehicle_id, buyer_id, offer_type, amount, swap_vehicle_id, message, status)
select v.id, 'seed-andres', 'compra', 90000000, null,
  'Te ofrezco de contado esta semana. Puedo verlo en El Poblado el sábado.', 'pendiente'
from vehicles v
where v.title = 'Mazda CX-30 Grand Touring 2022'
  and not exists (
    select 1 from offers o where o.buyer_id = 'seed-andres' and o.vehicle_id = v.id
  )
limit 1;

insert into offers (vehicle_id, buyer_id, offer_type, amount, swap_vehicle_id, message, status)
select v.id, 'seed-laura', 'permuta', 0, s.id,
  'Cambio el Onix más $20 millones. Ambos en Cali/Bogotá, coordinamos traspaso.', 'pendiente'
from vehicles v
join vehicles s on s.title = 'Chevrolet Onix Turbo 2020'
where v.title = 'Toyota Corolla Seg 2021'
  and not exists (
    select 1 from offers o where o.buyer_id = 'seed-laura' and o.vehicle_id = v.id
  )
limit 1;

insert into offers (vehicle_id, buyer_id, offer_type, amount, swap_vehicle_id, message, status)
select v.id, 'seed-diego', 'compra', 110000000, null,
  'Oferta firme. Transferencia el mismo día de la revisión mecánica.', 'pendiente'
from vehicles v
where v.title = 'Kia Sportage Vibrant 2023'
  and not exists (
    select 1 from offers o where o.buyer_id = 'seed-diego' and o.vehicle_id = v.id
  )
limit 1;

insert into favorites (user_id, vehicle_id)
select 'seed-laura', v.id from vehicles v
where v.title in ('Toyota Corolla Seg 2021', 'Kia Sportage Vibrant 2023')
on conflict do nothing;

insert into contacts (name, email, phone, subject, message)
select * from (values
  ('María Peña'::text, 'maria.pena@correo.com'::text, '3014442211'::text, 'Quiero vender'::text, 'Tengo un Spark GT 2019 en Bogotá y quiero publicarlo. ¿Me ayudan con el anuncio?'::text),
  ('Flotas Andinas', 'compras@flotasandinas.com', '6045557788', 'Compra de flota', 'Buscamos 8 pickups diésel en el Eje Cafetero para operación de campo.')
) as c(name, email, phone, subject, message)
where not exists (select 1 from contacts);
