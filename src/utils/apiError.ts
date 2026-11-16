import axios from "axios";

// The backend's machine-readable error code (e.g. "PHONE_EXISTS"), if any.
export function getApiErrorCode(err: unknown): string | undefined {
  if (!axios.isAxiosError(err)) return undefined;
  const data = err.response?.data as { code?: unknown } | undefined;
  return typeof data?.code === "string" ? data.code : undefined;
}

export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
   
    if (!err.response) {
      return "Cannot reach the server. Make sure the backend is running and reachable (and, in local development, that the dev certificate is trusted).";
    }

    const status = err.response.status;
    const data = err.response.data as
      | { message?: string; title?: string; errors?: Record<string, string[]> }
      | undefined;

    if (data?.message) return data.message;

    if (data?.errors) {
      const messages = Object.values(data.errors).flat().filter(Boolean);
      if (messages.length) return messages.join(" ");
    }

    if (data?.title) return data.title;

    if (status === 401)
      return "Your session has expired or you're not logged in. Please log in again.";
    if (status === 403)
      return "You don't have permission to perform this action.";
    if (status === 404) return "The requested item was not found.";

    return `${fallback} (HTTP ${status})`;
  }

  return fallback;
}
