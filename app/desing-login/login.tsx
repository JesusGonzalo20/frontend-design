"use client";
import api from "../../src/services/apiService";
import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res: any = await api.post("/auth/login", { username, password });

      // ajusta esto según lo que devuelva tu backend:
      const token = res.token || res.access_token;

      if (!token) {
        alert("El backend respondió pero no envió token");
        return;
      }

      // Guardamos el token donde ApiService lo buscará después
      sessionStorage.setItem("token", token);

      alert("Login correcto");
      // aquí puedes hacer router.push('/lo-que-siga');
    } catch (e: any) {
      console.error(e);
      alert("Error en login: " + (e.message ?? ""));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 px-4">
      <div className="relative w-full max-w-5xl bg-white/5 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row backdrop-blur-md">
        {/* LADO IZQUIERDO */}
        <div className="md:w-1/2 px-10 py-12 lg:px-14 lg:py-16 text-white bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
          <h1 className="text-3xl md:text-4xl font-semibold mb-4">
            Welcome to website
          </h1>
          <p className="text-sm md:text-base max-w-md leading-relaxed text-white/90">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam
            nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat
            volutpat.
          </p>

          <div className="mt-10 hidden md:block">
            <div className="flex gap-4">
              <span className="h-10 w-10 rounded-full bg-white/20" />
              <span className="h-10 w-24 rounded-full bg-white/25" />
            </div>
            <div className="mt-4 flex gap-6">
              <span className="h-2 w-16 rounded-full bg-white/35" />
              <span className="h-2 w-10 rounded-full bg-white/25" />
              <span className="h-2 w-20 rounded-full bg-white/15" />
            </div>
          </div>
        </div>

        {/* LADO DERECHO - FORM */}
        <div className="md:w-1/2 bg-white px-8 py-10 lg:px-12 lg:py-14 flex flex-col justify-center">
          <h2 className="text-center text-xs tracking-[0.35em] text-slate-500 font-semibold mb-8">
            USER LOGIN
          </h2>

          {/* Usuario */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Username
            </label>
            <div className="flex items-center gap-3 bg-violet-50 rounded-full px-4 py-2 border border-transparent focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-300 transition">
              <span className="text-slate-400 text-sm">👤</span>
              <input
                className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Password
            </label>
            <div className="flex items-center gap-3 bg-violet-50 rounded-full px-4 py-2 border border-transparent focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-300 transition">
              <span className="text-slate-400 text-sm">🔒</span>
              <input
                className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
                placeholder="Contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Remember / Forgot */}
          <div className="flex items-center justify-between mb-6 text-xs">
            <label className="inline-flex items-center gap-2 text-slate-500">
              <input
                type="checkbox"
                className="rounded border-slate-300 text-violet-500 focus:ring-violet-400"
              />
              <span>Remember</span>
            </label>
            <button
              type="button"
              className="text-violet-500 hover:text-violet-600 transition"
            >
              Forgot password?
            </button>
          </div>

          {/* Botón */}
          <button
            onClick={handleLogin}
            className="w-full rounded-full bg-gradient-to-r from-pink-500 to-violet-500 text-white font-semibold text-sm py-2.5 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:translate-y-[1px] active:translate-y-[2px] transition"
          >
            LOGIN
          </button>
        </div>
      </div>

      <span className="absolute bottom-4 text-[11px] text-white/70">
        designed by you ✨
      </span>
    </div>
  );
}
