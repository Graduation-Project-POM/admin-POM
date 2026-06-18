import { API_URL } from "../services/authService";
export function resolveMediaUrl(
  url: string | null | undefined,
): string | null {
  if (!url) return null;
  if (/^(https?:|data:)/i.test(url)) return url;
  return `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}
