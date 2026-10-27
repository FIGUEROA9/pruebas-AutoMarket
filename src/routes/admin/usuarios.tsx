import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/input";
import { VerifiedBadge } from "@/components/verified-badge";
import { CITIES, DOC_TYPES, STATUS_LABEL } from "@/lib/format";
import {
  adminDeleteUser,
  adminListUsers,
  adminSetAccountStatus,
  adminSetRole,
  adminUpdateUser,
  type Profile,
} from "@/lib/market";

export const Route = createFileRoute("/admin/usuarios")({ component: Usuarios });

function Usuarios() {
  const [rows, setRows] = useState<Profile[]>([]);
  const [editing, setEditing] = useState<string | null>(null);

  async function reload() {
    setRows(await adminListUsers());
  }

  useEffect(() => {
    reload().catch(() => setRows([]));
  }, []);

  async function setRole(userId: string, role: "admin" | "cliente") {
    try {
      await adminSetRole({ data: { userId, role } });
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo cambiar el rol.");
    }
  }

  async function toggleStatus(u: Profile) {
    try {
      const next = u.accountStatus === "activo" ? "deshabilitado" : "activo";
      await adminSetAccountStatus({ data: { userId: u.userId, status: next } });
      toast.success(next === "activo" ? "Usuario habilitado." : "Usuario deshabilitado.");
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo actualizar.");
    }
  }

  async function remove(u: Profile) {
    if (!window.confirm(`¿Eliminar a ${u.displayName}? Se borran sus anuncios y ofertas.`)) return;
    try {
      await adminDeleteUser({ data: { userId: u.userId } });
      toast.success("Usuario eliminado.");
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo eliminar.");
    }
  }

  async function save(e: FormEvent<HTMLFormElement>, userId: string) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await adminUpdateUser({
        data: {
          userId,
          firstName: String(fd.get("firstName")),
          lastName: String(fd.get("lastName")),
          phone: String(fd.get("phone") || "") || undefined,
          whatsapp: String(fd.get("whatsapp") || "") || undefined,
          city: String(fd.get("city") || "") || undefined,
          address: String(fd.get("address") || "") || undefined,
          email: String(fd.get("email") || "") || undefined,
          documentType: (String(fd.get("documentType") || "") as "CC" | "CE" | "NIT" | "PA") || undefined,
          documentNumber: String(fd.get("documentNumber") || "") || undefined,
          role: String(fd.get("role")) as "admin" | "cliente",
        },
      });
      toast.success("Datos actualizados. La contraseña no se modifica desde aquí.");
      setEditing(null);
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo guardar.");
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Usuarios</h1>
      <p className="mt-1 text-sm text-muted">
        {rows.length} perfiles. Puedes editar datos, deshabilitar o eliminar. La contraseña solo la cambia el titular.
      </p>
      <div className="mt-6 grid gap-3">
        {rows.map((u) => (
          <article key={u.userId} className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{u.displayName}</p>
                  {u.verificationStatus === "verificado" && <VerifiedBadge />}
                  <Badge tone={u.role === "admin" ? "accent" : "neutral"}>{u.role}</Badge>
                  <Badge tone={u.accountStatus === "deshabilitado" ? "danger" : "success"}>
                    {STATUS_LABEL[u.accountStatus] ?? u.accountStatus}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted">
                  {u.email ?? "Sin correo"} · {u.city ?? "Sin ciudad"} · {u.phone ?? "Sin teléfono"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="secondary" onClick={() => setEditing(editing === u.userId ? null : u.userId)}>
                  {editing === u.userId ? "Cerrar" : "Editar"}
                </Button>
                {u.role === "admin" ? (
                  <Button size="sm" variant="ghost" onClick={() => void setRole(u.userId, "cliente")}>
                    Quitar admin
                  </Button>
                ) : (
                  <Button size="sm" variant="secondary" onClick={() => void setRole(u.userId, "admin")}>
                    Hacer admin
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={() => void toggleStatus(u)}>
                  {u.accountStatus === "deshabilitado" ? "Habilitar" : "Deshabilitar"}
                </Button>
                <Button size="sm" variant="danger" onClick={() => void remove(u)}>
                  Eliminar
                </Button>
              </div>
            </div>
            {editing === u.userId && (
              <form onSubmit={(e) => void save(e, u.userId)} className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-2">
                <Field label="Nombres">
                  <Input name="firstName" defaultValue={u.firstName ?? u.displayName.split(" ")[0]} required />
                </Field>
                <Field label="Apellidos">
                  <Input name="lastName" defaultValue={u.lastName ?? u.displayName.split(" ").slice(1).join(" ")} required />
                </Field>
                <Field label="Correo">
                  <Input name="email" type="email" defaultValue={u.email ?? ""} />
                </Field>
                <Field label="Teléfono">
                  <Input name="phone" defaultValue={u.phone ?? ""} />
                </Field>
                <Field label="WhatsApp">
                  <Input name="whatsapp" defaultValue={u.whatsapp ?? ""} />
                </Field>
                <Field label="Ciudad">
                  <Select name="city" defaultValue={u.city ?? "Bogotá"}>
                    {CITIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Dirección">
                  <Input name="address" defaultValue={u.address ?? ""} />
                </Field>
                <Field label="Rol">
                  <Select name="role" defaultValue={u.role}>
                    <option value="cliente">cliente</option>
                    <option value="admin">admin</option>
                  </Select>
                </Field>
                <Field label="Documento">
                  <Select name="documentType" defaultValue={u.documentType ?? "CC"}>
                    {DOC_TYPES.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Número">
                  <Input name="documentNumber" defaultValue={u.documentNumber ?? ""} />
                </Field>
                <div className="sm:col-span-2">
                  <Button type="submit" size="sm">
                    Guardar cambios
                  </Button>
                </div>
              </form>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
