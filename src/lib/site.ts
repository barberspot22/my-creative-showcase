/** URL canônica do site em produção (sem barra final). Defina VITE_SITE_URL no .env. */
const DEFAULT_SITE_URL = "https://gbia.com.br";

export const SITE_URL = (
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SITE_URL) ||
  (typeof process !== "undefined" && process.env?.VITE_SITE_URL) ||
  (typeof process !== "undefined" && process.env?.SITE_URL) ||
  DEFAULT_SITE_URL
).replace(/\/$/, "");

export function siteUrl(path = ""): string {
  const p = !path ? "" : path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}
