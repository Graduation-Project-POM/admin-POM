import { useCallback, useEffect, useState } from "react";
import { contestService } from "../services/contestService";
import type {
  Contest,
  CreateContestInput,
  UpdateContestInput,
} from "../types/contest";

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
    return "You don't have permission to view contests (this endpoint is Admin-only). Log in as an admin.";
  const data = e.response.data;
  if (data?.message) return data.message;
  if (data?.title) return data.title;
  return `${fallback} (HTTP ${status})`;
}

export function useContests() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setContests(await contestService.getAll());
    } catch (err) {
      setError(toMessage(err, "Failed to load contests"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const create = useCallback(
    async (input: CreateContestInput) => {
      await contestService.create(input);
      await reload();
    },
    [reload],
  );

  const update = useCallback(
    async (id: number, input: UpdateContestInput) => {
      await contestService.update(id, input);
      await reload();
    },
    [reload],
  );

  const remove = useCallback(async (id: number) => {
    await contestService.remove(id);
    setContests((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return { contests, loading, error, reload, create, update, remove };
}
