import { useCallback, useEffect, useState } from "react";
import { competitionsService } from "../services/competitionsService";
import type {
  Competition,
  CreateCompetitionInput,
  UpdateCompetitionInput,
} from "../types/competition";

/** Pull a readable message out of an axios error (auth, validation, server, or network). */
function toMessage(err: unknown, fallback: string): string {
  const e = err as {
    response?: { status?: number; data?: { message?: string; title?: string } };
  };
  if (!e?.response) {
    return "Cannot reach the server. Please make sure the backend is running.";
  }
  const status = e.response.status;
  if (status === 401)
    return "Your session has expired or you're not logged in. Please log in again.";
  if (status === 403)
    return "You don't have permission to view competitions (this endpoint is Admin-only). Log in as an admin.";
  const data = e.response.data;
  if (data?.message) return data.message;
  if (data?.title) return data.title;
  return `${fallback} (HTTP ${status})`;
}

/**
 * Loads contests and exposes CRUD helpers with loading/error state.
 *   const { competitions, loading, error, reload, create, update, remove } = useCompetitions();
 */
export function useCompetitions() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCompetitions(await competitionsService.getAll());
    } catch (err) {
      setError(toMessage(err, "Failed to load competitions"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const create = useCallback(
    async (input: CreateCompetitionInput) => {
      await competitionsService.create(input);
      await reload();
    },
    [reload],
  );

  const update = useCallback(
    async (id: number, input: UpdateCompetitionInput) => {
      await competitionsService.update(id, input);
      await reload();
    },
    [reload],
  );

  const remove = useCallback(async (id: number) => {
    await competitionsService.remove(id);
    setCompetitions((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return { competitions, loading, error, reload, create, update, remove };
}
