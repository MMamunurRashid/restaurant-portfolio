import { CONFIG } from "@/config";

export function getMediaUrl(path?: string | null) {
  const cleanPath = path?.trim();

  if (!cleanPath) return "";
  if (/^(https?:|data:)/i.test(cleanPath)) return cleanPath;

  return `${CONFIG.BASE_URL.replace(/\/$/, "")}/${cleanPath.replace(/^\/+/, "")}`;
}
