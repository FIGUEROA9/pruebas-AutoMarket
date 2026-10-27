import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, Textarea } from "@/components/ui/input";
import { STATUS_LABEL } from "@/lib/format";
import { adminListVerifications, adminReviewVerification, type Profile } from "@/lib/market";

export const Route = createFileRoute("/admin/verificaciones")({ component: Verificaciones });

function Verificaciones() {
  const [rows, setRows] = useState<Profile[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});

  async function reload() {
    setRows(await adminListVerifications());
  }

  useEffect(() => {
    reload().catch(() => setRows([]));
  }, []);

  async function review(userId: string, status: "verificado" | "rechazado") {
    try {
      await adminReviewVerification({
        data: { userId, status, note: notes[userId] || undefined },
      });
      toast.success(status === "verificado" ? "Usuario verificado. Sus anuncios en cola salieron al catálogo." : "Solicitud rechazada.");
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo resolver.");
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Verificaciones</h1>
      <p className="mt-1 text-sm text-muted">
        Revisa frente y reverso de la cédula. Al aprobar, los anuncios pendientes de esa persona se publican.
      </p>
      <ul className="mt-6 grid gap-4">
        {rows.length === 0 && <li className="text-sm text-muted">No hay solicitudes.</li>}
        {rows.map((u) => (
          <li key={u.userId} className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium">{u.displayName}</p>
              <Badge
                tone={
                  u.verificationStatus === "verificado"
                    ? "success"
                    : u.verificationStatus === "pendiente"
                      ? "warn"
                      : "danger"
                }
              >
                {STATUS_LABEL[u.verificationStatus]}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted">
              {u.documentType} {u.documentNumber} · {u.email} · {u.city}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {u.idFrontUrl ? (
                <img src={u.idFrontUrl} alt="Frente cédula" className="h-40 w-full rounded-md object-cover" />
              ) : (
                <div className="grid h-40 place-items-center rounded-md bg-elevated text-sm text-muted">Sin frente</div>
              )}
              {u.idBackUrl ? (
                <img src={u.idBackUrl} alt="Reverso cédula" className="h-40 w-full rounded-md object-cover" />
              ) : (
                <div className="grid h-40 place-items-center rounded-md bg-elevated text-sm text-muted">Sin reverso</div>
              )}
            </div>
            {u.verificationStatus === "pendiente" && (
              <div className="mt-4 grid gap-3">
                <Field label="Nota (opcional)">
                  <Textarea
                    value={notes[u.userId] ?? ""}
                    onChange={(e) => setNotes((n) => ({ ...n, [u.userId]: e.target.value }))}
                    placeholder="Motivo si rechazas, o comentario interno."
                  />
                </Field>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => void review(u.userId, "verificado")}>
                    Aprobar
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => void review(u.userId, "rechazado")}>
                    Rechazar
                  </Button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
