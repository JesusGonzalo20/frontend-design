// lib/api.ts
import axios from "axios";

// URL base del backend
// Si algún día quieres usar .env, NEXT_PUBLIC_API_URL tendrá prioridad.
// Si no, usa directamente http://localhost:4000/api
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// Instancia de axios configurada
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

// =======================
//  AUTH
// =======================

/**
 * Login contra el backend.
 * El backend espera: { username, password }
 * Devuelve: { token }
 */
export async function loginApi(email: string, password: string) {
  const res = await api.post("/auth/login", {
    username: email,     // usamos el email del form como username
    password,
  });

  // aquí asumimos que el backend responde { token: "..." }
  return res.data as { token: string };
}

// =======================
//  DOWNLOAD
// =======================

export type Provider = "freepik" | "envato" | "other";

/**
 * Descarga un recurso del backend.
 * provider: "freepik" | "envato" | "other"
 * url: enlace del recurso
 * token: JWT obtenido en el login
 */
export async function downloadApi(
  provider: Provider,
  url: string,
  token: string
): Promise<Blob> {
  const res = await api.post(
    "/download",
    { provider, url },
    {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // devolvemos el blob para que el frontend pueda forzar la descarga
  return res.data as Blob;
}
