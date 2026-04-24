export const API_BASE = `${import.meta.env.VITE_BACKEND_BASE_URL}`;

export async function checkBackend() {
  const res = await fetch(`${API_BASE}/`);
  return res.json();
}
