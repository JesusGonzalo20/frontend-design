// src/services/freepikService.ts

export async function downloadFreepikFile(url: string) {
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
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    // Antes: mostrabas todo el JSON feo al usuario
    const text = await response.text();
    console.error('Error en descarga Freepik:', response.status, text);
    // Ahora: solo mensaje simple para el usuario
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
