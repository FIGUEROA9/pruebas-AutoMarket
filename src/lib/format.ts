export function formatCop(value: number) {
  return Number(value).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}

export function formatKm(value: number) {
  return `${Number(value).toLocaleString("es-CO")} km`;
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "Sin registrar";
  const d = new Date(`${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}

export function isExpired(value: string | null | undefined) {
  if (!value) return false;
  return value < new Date().toISOString().slice(0, 10);
}

export function isExpiringSoon(value: string | null | undefined, days = 30) {
  if (!value || isExpired(value)) return false;
  const limit = new Date();
  limit.setDate(limit.getDate() + days);
  return value <= limit.toISOString().slice(0, 10);
}

export function digitsPhone(phone: string) {
  const d = phone.replace(/\D/g, "");
  if (!d) return "";
  return d.startsWith("57") ? d : `57${d}`;
}

export function whatsappHref(phone: string, message: string) {
  const n = digitsPhone(phone);
  if (!n) return "";
  return `https://wa.me/${n}?text=${encodeURIComponent(message)}`;
}

export function mailtoHref(email: string, subject: string, body: string) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export const LISTING_LABEL: Record<string, string> = {
  venta: "Venta",
  permuta: "Permuta",
  ambos: "Venta o permuta",
};

export const STATUS_LABEL: Record<string, string> = {
  activo: "Activo",
  pausado: "Pausado",
  vendido: "Vendido",
  rechazado: "Rechazado",
  pendiente: "Pendiente",
  pendiente_revision: "En revisión",
  aceptada: "Aceptada",
  cerrada: "Cerrada",
  contraoferta: "Contraoferta",
  sin_verificar: "Sin verificar",
  verificado: "Verificado",
  deshabilitado: "Deshabilitado",
};

export const BODY_LABEL: Record<string, string> = {
  sedan: "Sedán",
  suv: "SUV",
  pickup: "Pickup",
  hatchback: "Hatchback",
  van: "Van",
  coupe: "Coupé",
};

export const FUEL_LABEL: Record<string, string> = {
  gasolina: "Gasolina",
  diesel: "Diésel",
  hibrido: "Híbrido",
  electrico: "Eléctrico",
};

export const TRANS_LABEL: Record<string, string> = {
  manual: "Manual",
  automatica: "Automática",
};

export const CONDITION_LABEL: Record<string, string> = {
  nuevo: "Nuevo",
  seminuevo: "Seminuevo",
  usado: "Usado",
};

export const OFFER_TYPE_LABEL: Record<string, string> = {
  compra: "Compra",
  permuta: "Permuta",
};

export const DOC_TYPES = [
  { value: "CC", label: "Cédula de ciudadanía" },
  { value: "CE", label: "Cédula de extranjería" },
  { value: "NIT", label: "NIT" },
  { value: "PA", label: "Pasaporte" },
] as const;

export const BRANDS = [
  "Toyota",
  "Mazda",
  "Chevrolet",
  "Renault",
  "Kia",
  "Nissan",
  "Ford",
  "Volkswagen",
  "Hyundai",
  "BMW",
  "Mercedes-Benz",
  "Otro",
] as const;

export const CITIES = [
  "Bogotá",
  "Medellín",
  "Cali",
  "Barranquilla",
  "Bucaramanga",
  "Cartagena",
  "Pereira",
  "Manizales",
  "Santa Marta",
  "Villavicencio",
  "Ibagué",
  "Otra",
] as const;

export const STOCK_IMAGES = [
  { src: "/vehicles/corolla.jpg", label: "Sedán plata" },
  { src: "/vehicles/cx30.jpg", label: "SUV rojo" },
  { src: "/vehicles/cx5.jpg", label: "SUV oscuro" },
  { src: "/vehicles/onix.jpg", label: "Hatch blanco" },
  { src: "/vehicles/duster.jpg", label: "SUV gris" },
  { src: "/vehicles/sportage.jpg", label: "SUV negro" },
  { src: "/vehicles/frontier.jpg", label: "Pickup gris" },
  { src: "/vehicles/ranger.jpg", label: "Pickup naranja" },
  { src: "/vehicles/jetta.jpg", label: "Sedán azul" },
  { src: "/vehicles/tucson.jpg", label: "SUV perla" },
  { src: "/vehicles/hilux.jpg", label: "Pickup blanca" },
  { src: "/vehicles/tiguan.jpg", label: "SUV familiar" },
  { src: "/vehicles/mazda3.jpg", label: "Hatch rojo" },
] as const;
