import { useCallback, useEffect, useState } from "react";
import { contestService } from "../services/contestService";
import { getApiErrorMessage } from "../utils/apiError";
import type {
  Contest,
  CreateContestInput,
  UpdateContestInput,
} from "../types/contest";

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
      setError(getApiErrorMessage(err, "Failed to load contests"));
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
