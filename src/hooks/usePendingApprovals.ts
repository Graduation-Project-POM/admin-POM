import { useCallback, useEffect, useState } from "react";
import { approvalService } from "../services/userService";

// Fired after an approval is accepted/rejected anywhere in the app so the
// sidebar badge refreshes immediately instead of waiting for the next poll.
const APPROVALS_CHANGED = "approvals:changed";

export const notifyApprovalsChanged = () => {
  window.dispatchEvent(new Event(APPROVALS_CHANGED));
};

const POLL_MS = 30_000;

/**
 * Number of sign-up requests waiting for admin approval.
 * Only fetches when `enabled` (i.e. the current user is an admin).
 * Refreshes every 30s, when the tab regains focus, when `refreshKey`
 * changes (e.g. on navigation) and whenever notifyApprovalsChanged() fires.
 */
export const usePendingApprovalsCount = (enabled: boolean, refreshKey?: unknown) => {
  const [count, setCount] = useState(0);

  const refresh = useCallback(() => {
    if (!enabled) return;
    approvalService
      .getAll()
      .then((all) => setCount(all.filter((r) => !r.isAccepted).length))
      .catch(() => {
        /* keep the last known count; the badge is only a hint */
      });
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      setCount(0);
      return;
    }
    refresh();
    const timer = window.setInterval(refresh, POLL_MS);
    window.addEventListener(APPROVALS_CHANGED, refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener(APPROVALS_CHANGED, refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [enabled, refresh]);

  useEffect(() => {
    refresh();
  }, [refreshKey, refresh]);

  return count;
};
