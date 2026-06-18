import { useCallback, useEffect, useState } from "react";
import { groupService } from "../services/groupService";
import { getApiErrorMessage } from "../utils/apiError";
import type { Group, CreateGroupInput, UpdateGroupInput } from "../types/group";

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setGroups(await groupService.getAll());
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to load groups"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const create = useCallback(
    async (input: CreateGroupInput) => {
      await groupService.create(input);
      await reload();
    },
    [reload],
  );

  const update = useCallback(
    async (id: number, input: UpdateGroupInput) => {
      await groupService.update(id, input);
      await reload();
    },
    [reload],
  );

  const remove = useCallback(async (id: number) => {
    await groupService.remove(id);
    setGroups((prev) => prev.filter((g) => g.id !== id));
  }, []);

  return { groups, loading, error, reload, create, update, remove };
}
