// src/services/freepikService.ts

export interface FreepikOption {
  id: string;
  label: string;
}

/**
 * Obtiene las opciones de descarga disponibles para una URL de Freepik
 * (por ejemplo: 4K / 1080p / 720p / JPG / PNG / PSD).
 */
export async function getFreepikOptions(
  url: string,
): Promise<FreepikOption[]> {
  if (!url.trim()) {
    throw new Error('La URL de Freepik está vacía.');
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

  const token =
    (typeof window !== 'undefined' && sessionStorage.getItem('token')) || '';

  const response = await fetch(`${baseUrl}/freepik/options`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    console.error(
      'Error obteniendo opciones Freepik:',
      response.status,
      text,
    );
    throw new Error('Vuelve a intentarlo');
  }

  return response.json();
}

export async function downloadFreepikFile(
  url: string,
  optionId?: string, // 🔹 NUEVO parámetro opcional
) {
  if (!url.trim()) {
    throw new Error('La URL de Freepik está vacía.');
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

  const token =
    (typeof window !== 'undefined' && sessionStorage.getItem('token')) || '';

  const response = await fetch(`${baseUrl}/freepik/download`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    // 🔹 ANTES: body: JSON.stringify({ url })
    // 🔹 AHORA: mandamos también optionId (si viene)
    body: JSON.stringify({ url, optionId }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('Error en descarga Freepik:', response.status, text);
    throw new Error('Vuelve a intentarlo');
  }

  const blob = await response.blob();

  const cd = response.headers.get('Content-Disposition') || '';
  const match = cd.match(/filename="(.+)"/);
  const filename = match ? decodeURIComponent(match[1]) : 'freepik-file';

  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(href);
}
