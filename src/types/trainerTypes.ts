import type { LucideIcon } from "lucide-react";

export interface TrainerStatCard {
  title: string;
  value: number;
  trend?: { value: number; label: string; direction: "up" | "down" };
  subtitle?: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

export interface PendingRequest {
  id: number;
  name: string;
  type: string;
  course: string;
  date: string;
}

export interface TrainerAnnouncement {
  id: number;
  title: string;
  date: string;
  status: "Published" | "Draft";
}