import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { VehicleCard } from "@/components/vehicle-card";
import { Button } from "@/components/ui/button";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { listFavorites, type Vehicle } from "@/lib/market";

export const Route = createFileRoute("/favoritos")({ component: Favoritos });

function Favoritos() {
  const { user, isPending } = useCurrentUserState();
  const [items, setItems] = useState<Vehicle[] | null>(null);

  useEffect(() => {
    if (isPending || !user) return;
    listFavorites()
      .then(setItems)
      .catch(() => setItems([]));
  }, [user, isPending]);

  if (isPending) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="h-40 animate-pulse rounded-xl bg-surface" />
        </div>
      </SiteShell>
    );
  }
  if (!user) return <RedirectToSignIn />;

  return (
    <SiteShell>
      <main className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-subtle">Guardados</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">Favoritos</h1>
        {items === null ? (
          <div className="mt-8 h-32 animate-pulse rounded-xl bg-surface" />
        ) : items.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-sm text-muted">Aún no guardas vehículos. Toca el corazón en un anuncio.</p>
            <Link to="/catalogo" className="mt-4 inline-block">
              <Button>Ir al catálogo</Button>
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        )}
      </main>
    </SiteShell>
  );
}
