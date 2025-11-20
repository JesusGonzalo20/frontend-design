"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "../../src/utils/auth";
import { downloadFreepikFile } from "../../src/services/freepikService";

export default function FreepikView() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!url.trim()) {
      setError("Pega primero el enlace de Freepik.");
      return;
    }

    try {
      setLoading(true);
      await downloadFreepikFile(url);
      setMessage("Descarga iniciada correctamente.");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al realizar la descarga");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-xl">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="mb-6 text-xs text-slate-300 hover:text-white"
        >
          ← Volver al panel
        </button>

        <h1 className="text-2xl font-semibold mb-2">Freepik</h1>
        <p className="text-sm text-slate-300 mb-6">
          Pega aquí el enlace del recurso de Freepik que quieres descargar.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              URL de Freepik
            </label>
          <input
            className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
            placeholder="https://www.freepik.es/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-semibold py-2.5 mt-2"
          >
            {loading ? "Descargando..." : "Descargar de Freepik"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-xs text-emerald-300 border border-emerald-700/40 bg-emerald-900/30 rounded-xl px-3 py-2">
            {message}
          </p>
        )}

        {error && (
          <p className="mt-4 text-xs text-red-300 border border-red-700/40 bg-red-900/30 rounded-xl px-3 py-2">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
