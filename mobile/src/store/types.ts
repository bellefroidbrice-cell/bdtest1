import type { ISODate } from '@/lib/date';

export type Priority = 'basse' | 'normale' | 'haute';

/** Une étape d'une tâche : le déroulé détaillé, à cocher une par une. */
export interface Step {
  id: string;
  label: string;
  done: boolean;
}

export interface Task {
  id: string;
  title: string;
  notes: string;
  /** `null` = tâche sans date, en attente d'être planifiée. */
  date: ISODate | null;
  /** Minutes depuis minuit, ou `null` si la tâche n'a pas d'horaire précis. */
  startMinutes: number | null;
  durationMinutes: number;
  priority: Priority;
  projectId: string | null;
  steps: Step[];
  done: boolean;
  createdAt: string;
  completedAt: string | null;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface PlannerState {
  version: number;
  tasks: Task[];
  projects: Project[];
  /** Objectif de la journée, indexé par date. */
  intentions: Record<ISODate, string>;
}

export const STATE_VERSION = 1;

export const emptyState: PlannerState = {
  version: STATE_VERSION,
  tasks: [],
  projects: [],
  intentions: {},
};
