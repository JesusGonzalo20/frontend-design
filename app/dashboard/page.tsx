"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "../../src/utils/auth";

const providers = [
  {
    id: "freepik",
    name: "Freepik",
    description: "Descargar recursos de Freepik pegando el enlace del recurso.",
    href: "/freepik",
  },
  {
    id: "envato",
    name: "Envato Elements",
    description: "Descargar assets, themes, plantillas de Envato Elements.",
    href: "/dashboard/envato",
  },
  // aquí luego puedes añadir más proveedores
];

export default function DashboardPage() {
  const router = useRouter();

  // proteger la ruta: si no hay token, saco al login
  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="w-full max-w-3xl px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold">Panel de descargas</h1>
          <p className="text-sm text-slate-300 mt-2">
            Elige desde qué servicio quieres descargar. Luego solo pegarás el link del recurso.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {providers.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => router.push(p.href)}
              className="group rounded-2xl border border-slate-700 bg-slate-900/70 p-5 text-left hover:border-indigo-400 hover:bg-slate-900 transition-transform transform hover:-translate-y-0.5"
            >
              <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">
                Proveedor
              </div>
              <div className="text-xl font-medium mb-1">
                {p.name}
              </div>
              <div className="text-xs text-slate-300 mb-4">
                {p.description}
              </div>
              <div className="text-xs text-indigo-300 group-hover:text-indigo-100">
                Entrar →
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
