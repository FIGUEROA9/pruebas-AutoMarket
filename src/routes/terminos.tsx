import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/terminos")({ component: Terminos });

function Terminos() {
  return (
    <SiteShell>
      <main className="mx-auto max-w-2xl px-4 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-subtle">Legal</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">Términos de uso</h1>
        <div className="mt-8 grid gap-6 text-sm leading-relaxed text-muted">
          <p>
            AutoMarket es un marketplace de anuncios entre particulares. No
            interviene como comprador, vendedor ni intermediario de dinero. El
            acuerdo, la revisión mecánica y el traspaso son responsabilidad de
            las partes.
          </p>
          <p>
            Quien publica declara ser dueño o estar autorizado a disponer del
            vehículo, y que la información (precio, kilometraje, estado, papeles
            y fotos) es veraz. AutoMarket puede pausar o retirar anuncios que
            incumplan estas reglas.
          </p>
          <p>
            Un anuncio no es público hasta que un administrador lo apruebe, salvo
            que el vendedor ya tenga la cuenta verificada. La verificación se
            hace con fotos del documento de identidad y queda a criterio del
            equipo. El sello de verificado identifica a esa persona, no garantiza
            el estado del vehículo.
          </p>
          <p>
            Las ofertas de compra o permuta, y las contraofertas, no constituyen
            un contrato hasta que la otra parte las acepte. Aceptar una oferta
            marca el anuncio como vendido y cierra las demás ofertas pendientes
            sobre ese vehículo.
          </p>
          <p>
            Los datos de contacto, documento y fotos de cédula se usan solo para
            operar el marketplace, verificar identidad y responder mensajes. No
            se venden a terceros.
          </p>
        </div>
      </main>
    </SiteShell>
  );
}
