// frontend/src/lib/api.ts

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";


export async function apiGet<T>(path: string, params?: Record<string, any>): Promise<T> {
  const qs = params
    ? "?" +
      new URLSearchParams(
        Object.entries(params)
          .filter(([_, v]) => v !== undefined && v !== null && v !== "")
          .map(([k, v]) => [k, String(v)])
      ).toString()
    : "";

  const res = await fetch(`${API_BASE_URL}${path}${qs}`);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}
