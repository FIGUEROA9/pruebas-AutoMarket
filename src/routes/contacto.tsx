import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { submitContact } from "@/lib/market";

export const Route = createFileRoute("/contacto")({ component: Contacto });

function Contacto() {
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await submitContact({
        data: {
          name: String(fd.get("name")),
          email: String(fd.get("email")),
          phone: String(fd.get("phone")),
          subject: String(fd.get("subject") || "") || undefined,
          message: String(fd.get("message")),
        },
      });
      setSent(true);
      toast.success("Mensaje enviado.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo enviar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <SiteShell>
      <main className="mx-auto max-w-xl px-4 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-subtle">Soporte</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">Contacto</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Dudas de un anuncio, reportes o alianzas. El equipo de AutoMarket lee
          cada mensaje.
        </p>
        {sent ? (
          <p className="mt-10 rounded-xl bg-surface p-6 text-sm text-muted shadow-[var(--shadow-border)]">
            Gracias. Te respondemos al correo que dejaste.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 grid gap-4">
            <Field label="Nombre">
              <Input name="name" required minLength={2} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Correo">
                <Input name="email" type="email" required />
              </Field>
              <Field label="Teléfono">
                <Input name="phone" required minLength={6} />
              </Field>
            </div>
            <Field label="Asunto">
              <Input name="subject" placeholder="Quiero vender / reportar / alianza" />
            </Field>
            <Field label="Mensaje">
              <Textarea name="message" required minLength={8} />
            </Field>
            <Button type="submit" disabled={busy}>
              {busy ? "Enviando…" : "Enviar"}
            </Button>
          </form>
        )}
      </main>
    </SiteShell>
  );
}
