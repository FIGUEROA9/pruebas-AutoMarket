import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, RefreshCw, Shield, Tag } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { VehicleCard } from "@/components/vehicle-card";
import { Button } from "@/components/ui/button";
import { featuredVehicles, marketStats } from "@/lib/market";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [vehicles, stats] = await Promise.all([featuredVehicles(), marketStats()]);
    return { vehicles, stats };
  },
  component: Home,
});

function Home() {
  const { vehicles, stats } = Route.useLoaderData();

  return (
    <SiteShell>
      <section className="relative overflow-hidden">
        <img
          src="/vehicles/hero.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-linear-to-r from-bg via-bg/80 to-bg/35" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Marketplace de vehículos
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-fg md:text-6xl">
              Compra, vende o permuta. Sin ruido de concesionario.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted">
              AutoMarket conecta dueños reales en Colombia. Publica tu carro,
              envía una oferta de compra o propone una permuta con el tuyo.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/catalogo">
                <Button size="lg">
                  Ver catálogo <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link to="/publicar">
                <Button size="lg" variant="outline">
                  Publicar anuncio
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 md:col-span-5 md:content-end">
            {[
              { label: "Activos", value: stats.active },
              { label: "En venta", value: stats.sale },
              { label: "Permuta", value: stats.swap },
              { label: "Verificados", value: stats.verified },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl bg-surface/80 p-4 shadow-[var(--shadow-border)] backdrop-blur-sm"
              >
                <p className="text-xs uppercase tracking-wider text-subtle">{s.label}</p>
                <p className="mt-2 font-display text-3xl font-semibold tabular-nums">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Tag,
              title: "Comprar",
              text: "Filtra por marca, ciudad, precio y tipo. Envía una oferta formal o contraoferta al vendedor.",
            },
            {
              icon: Shield,
              title: "Vender",
              text: "Publica fotos, papeles y condiciones. Si no estás verificado, un administrador aprueba el anuncio.",
            },
            {
              icon: RefreshCw,
              title: "Permutar",
              text: "Define qué tipo de vehículo recibes: marca, línea, kilometraje y el resto de filtros.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl bg-surface p-6 shadow-[var(--shadow-border)]">
              <item.icon className="size-5 text-accent" />
              <h2 className="mt-4 font-display text-xl font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-subtle">Selección</p>
            <h2 className="mt-2 font-display text-3xl font-semibold">Destacados</h2>
          </div>
          <Link to="/catalogo" className="text-sm text-muted hover:text-fg">
            Ver todos
          </Link>
        </div>
        {vehicles.length === 0 ? (
          <p className="text-sm text-muted">Aún no hay anuncios activos.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        )}
      </section>
    </SiteShell>
  );
}
