import { FileCheck, FileWarning } from "lucide-react";
import type { Vehicle } from "@/lib/market";
import { formatCop, formatDate, isExpired, isExpiringSoon } from "@/lib/format";

function Row({
  label,
  ok,
  detail,
}: {
  label: string;
  ok: boolean;
  detail: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-elevated px-3 py-3">
      {ok ? (
        <FileCheck className="mt-0.5 size-4 shrink-0 text-success" />
      ) : (
        <FileWarning className="mt-0.5 size-4 shrink-0 text-danger" />
      )}
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted">{detail}</p>
      </div>
    </div>
  );
}

function dateStatus(value: string | null | undefined, name: string) {
  if (!value) return { ok: false, detail: `${name} sin fecha registrada.` };
  if (isExpired(value)) return { ok: false, detail: `Venció el ${formatDate(value)}.` };
  if (isExpiringSoon(value)) return { ok: true, detail: `Vence pronto: ${formatDate(value)}.` };
  return { ok: true, detail: `Vigente hasta ${formatDate(value)}.` };
}

export function PapersPanel({ vehicle }: { vehicle: Vehicle }) {
  const soat = dateStatus(vehicle.soatExpires, "SOAT");
  const tecno = dateStatus(vehicle.tecnoExpires, "Tecnomecánica");
  const taxes = vehicle.taxesCurrent
    ? { ok: true, detail: "Impuestos al día." }
    : {
        ok: false,
        detail: `${vehicle.taxesDetail || "Impuestos pendientes."}${
          vehicle.taxesAmount ? ` Valor: ${formatCop(vehicle.taxesAmount)}.` : ""
        }`,
      };
  const fines = vehicle.finesCurrent
    ? { ok: true, detail: "Sin comparendos pendientes." }
    : {
        ok: false,
        detail: `${vehicle.finesDetail || "Hay comparendos pendientes."}${
          vehicle.finesAmount ? ` Valor: ${formatCop(vehicle.finesAmount)}.` : ""
        }`,
      };

  return (
    <section className="mt-8">
      <h2 className="font-display text-2xl font-semibold">Papeles y obligaciones</h2>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Row label="SOAT" ok={soat.ok} detail={soat.detail} />
        <Row label="Tecnomecánica" ok={tecno.ok} detail={tecno.detail} />
        <Row label="Impuestos" ok={taxes.ok} detail={taxes.detail} />
        <Row label="Comparendos" ok={fines.ok} detail={fines.detail} />
      </div>
    </section>
  );
}
