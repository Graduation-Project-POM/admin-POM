import { ContestStatus } from "../types/contest";

export type ContestStatusLabel = "Upcoming" | "Ongoing" | "Ended";

export const getContestStatus = (
  startAt: string | number | Date,
  endAt: string | number | Date,
  now: number = Date.now(),
): ContestStatusLabel => {
  const start = new Date(startAt).getTime();
  const end = new Date(endAt).getTime();
  if (Number.isNaN(start) || Number.isNaN(end)) return "Upcoming";
  if (now < start) return "Upcoming";
  if (now > end) return "Ended";
  return "Ongoing";
};

export const getContestStatusNumber = (
  startAt: string | number | Date,
  endAt: string | number | Date,
  now?: number,
): ContestStatus => {
  switch (getContestStatus(startAt, endAt, now)) {
    case "Ended":
      return ContestStatus.Ended;
    case "Ongoing":
      return ContestStatus.Running;
    default:
      return ContestStatus.Upcoming;
  }
};
