import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { adminDeleteContact, adminListContacts, type ContactRow } from "@/lib/market";

export const Route = createFileRoute("/admin/contactos")({ component: ContactosAdmin });

function ContactosAdmin() {
  const [rows, setRows] = useState<ContactRow[]>([]);

  async function reload() {
    setRows(await adminListContacts());
  }

  useEffect(() => {
    reload().catch(() => setRows([]));
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Contactos</h1>
      <p className="mt-1 text-sm text-muted">{rows.length} mensajes recibidos.</p>
      <ul className="mt-6 grid gap-3">
        {rows.map((c) => (
          <li key={c.id} className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-sm text-muted">
                  {c.email} · {c.phone}
                </p>
                {c.subject && <p className="mt-1 text-sm text-fg">{c.subject}</p>}
                <p className="mt-2 text-sm leading-relaxed text-muted">{c.message}</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => void adminDeleteContact({ data: { id: c.id } }).then(reload)}>
                Borrar
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
