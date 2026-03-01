export const API_URL =
  (import.meta as any).env.VITE_BACKEND_URL || "http://localhost:5000";

export const CONFIG = {
  BASE_URL: API_URL,
  API_PATH: `${API_URL}/api`,
};
