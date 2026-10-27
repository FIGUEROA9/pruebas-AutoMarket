-- AutoMarket schema: vehicles, offers, profiles, contacts, favorites

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
  user_id text not null,
  title text not null,
  brand text not null,
  model text not null,
  year int not null,
  mileage int not null,
  price double precision not null,
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

create index if not exists vehicles_user_id_idx on vehicles (user_id);
create index if not exists vehicles_status_idx on vehicles (status);
create index if not exists vehicles_brand_idx on vehicles (brand);

create table if not exists offers (
  id serial primary key,
  vehicle_id int not null references vehicles(id) on delete cascade,
  buyer_id text not null,
  offer_type text not null,
  amount double precision,
  swap_vehicle_id int references vehicles(id) on delete set null,
  message text,
  status text not null default 'pendiente',
  created_at timestamptz not null default now()
);

create index if not exists offers_buyer_id_idx on offers (buyer_id);
create index if not exists offers_vehicle_id_idx on offers (vehicle_id);

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

create table if not exists favorites (
  user_id text not null,
  vehicle_id int not null references vehicles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, vehicle_id)
);

insert into vehicles (
  user_id, title, brand, model, year, mileage, price, condition, fuel,
  transmission, body_type, city, description, image_url, listing_type, status
) values
(
  'catalog-seed',
  'Toyota Corolla XEI 2021',
  'Toyota', 'Corolla', 2021, 42000, 78000000,
  'usado', 'gasolina', 'automatica', 'sedan', 'Bogotá',
  'Único dueño, mantenimiento en concesionario, papeles al día. Aire, cámara de reversa y sensor de punto ciego. Ideal para ciudad.',
  '/vehicles/corolla.jpg', 'venta', 'activo'
),
(
  'catalog-seed',
  'Mazda CX-5 Grand Touring 2020',
  'Mazda', 'CX-5', 2020, 58000, 95000000,
  'usado', 'gasolina', 'automatica', 'suv', 'Medellín',
  'Versión tope de gama. Techo panorámico, cuero, Bose. Recibe permuta por sedán reciente o SUV compacto.',
  '/vehicles/cx5.jpg', 'ambos', 'activo'
),
(
  'catalog-seed',
  'Chevrolet Onix Turbo LTZ 2022',
  'Chevrolet', 'Onix', 2022, 28000, 52000000,
  'seminuevo', 'gasolina', 'automatica', 'hatchback', 'Cali',
  'Poco kilometraje, garantía restante. Consumo eficiente y pantalla Apple CarPlay. Perfecto primer auto.',
  '/vehicles/onix.jpg', 'venta', 'activo'
),
(
  'catalog-seed',
  'Renault Duster Intens 2019',
  'Renault', 'Duster', 2019, 71000, 58000000,
  'usado', 'gasolina', 'manual', 'suv', 'Bucaramanga',
  'Lista para viajar. Altura libre, 4x2. Se ofrece principalmente en permuta por pickup o SUV más reciente; diferencia negociable.',
  '/vehicles/duster.jpg', 'permuta', 'activo'
),
(
  'catalog-seed',
  'Kia Sportage Desire 2021',
  'Kia', 'Sportage', 2021, 39000, 89000000,
  'usado', 'gasolina', 'automatica', 'suv', 'Bogotá',
  'Garantía de motor 5 años vigente. Full equipo de seguridad. Soat y tecnomecánica nuevos.',
  '/vehicles/sportage.jpg', 'venta', 'activo'
),
(
  'catalog-seed',
  'Nissan Frontier NP300 2018',
  'Nissan', 'Frontier', 2018, 86000, 82000000,
  'usado', 'diesel', 'manual', 'pickup', 'Barranquilla',
  'Diésel, platón forrado, estribos y barra antivuelco. Recibe camioneta familiar en parte de pago.',
  '/vehicles/frontier.jpg', 'ambos', 'activo'
),
(
  'catalog-seed',
  'Ford Ranger Limited 2020',
  'Ford', 'Ranger', 2020, 64000, 118000000,
  'usado', 'diesel', 'automatica', 'pickup', 'Medellín',
  'Limited 4x4, cuero, navegación. Lista para trabajo y carretera. Historial de servicio disponible.',
  '/vehicles/ranger.jpg', 'venta', 'activo'
),
(
  'catalog-seed',
  'Volkswagen Tiguan Comfortline 2019',
  'Volkswagen', 'Tiguan', 2019, 61000, 92000000,
  'usado', 'gasolina', 'automatica', 'suv', 'Bogotá',
  'Tercera fila, turbo 1.4. Se busca permuta por sedán ejecutivo o SUV más reciente.',
  '/vehicles/tiguan.jpg', 'permuta', 'activo'
),
(
  'catalog-seed',
  'Toyota Hilux SRV 2022',
  'Toyota', 'Hilux', 2022, 34000, 165000000,
  'seminuevo', 'diesel', 'automatica', 'pickup', 'Cali',
  'La más pedida del mercado. 4x4, poco uso, nunca de trabajo pesado. Factura original.',
  '/vehicles/hilux.jpg', 'venta', 'activo'
),
(
  'catalog-seed',
  'Mazda 3 Grand Touring 2023',
  'Mazda', 'Mazda 3', 2023, 18000, 88000000,
  'seminuevo', 'gasolina', 'automatica', 'hatchback', 'Bogotá',
  'Como nueva. HUD, Bose, head-up. Único dueño. Entrega inmediata.',
  '/vehicles/mazda3.jpg', 'venta', 'activo'
);
