import { API_URL } from "../services/authService";
export function resolveMediaUrl(
  url: string | null | undefined,
): string | null {
  if (!url) return null;
  if (/^(https?:|data:)/i.test(url)) return url;
  return `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

// Image rules for uploads; they mirror POST /api/Problems/upload-image on the backend.
export const IMAGE_ACCEPT = "image/png,image/jpeg,image/gif,image/webp";
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".webp"];

/** Why a picked file can't be uploaded, or null when it is fine. */
export function checkImageFile(file: File): "type" | "size" | null {
  const name = file.name.toLowerCase();
  if (!IMAGE_EXTENSIONS.some((ext) => name.endsWith(ext))) return "type";
  if (file.size > MAX_IMAGE_BYTES) return "size";
  return null;
}
