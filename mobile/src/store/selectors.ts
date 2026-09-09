import { daysBetween, type ISODate } from '@/lib/date';
import type { PlannerState, Priority, Project, Task } from './types';

const PRIORITY_RANK: Record<Priority, number> = { haute: 0, normale: 1, basse: 2 };

/** Tri d'une journée : d'abord les tâches à l'heure, puis les tâches sans horaire. */
export function compareForDay(a: Task, b: Task): number {
  if (a.startMinutes !== null && b.startMinutes !== null) {
    if (a.startMinutes !== b.startMinutes) return a.startMinutes - b.startMinutes;
  } else if (a.startMinutes !== null) {
    return -1;
  } else if (b.startMinutes !== null) {
    return 1;
  }
  const rank = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
  return rank !== 0 ? rank : a.createdAt.localeCompare(b.createdAt);
}

export function tasksForDate(tasks: Task[], date: ISODate): Task[] {
  return tasks.filter((task) => task.date === date).sort(compareForDay);
}

export interface DayStats {
  total: number;
  done: number;
  plannedMinutes: number;
  /** Part de tâches terminées, entre 0 et 1. */
  ratio: number;
}

export function dayStats(tasks: Task[], date: ISODate): DayStats {
  const ofDay = tasks.filter((task) => task.date === date);
  const done = ofDay.filter((task) => task.done).length;
  const plannedMinutes = ofDay
    .filter((task) => task.startMinutes !== null)
    .reduce((total, task) => total + task.durationMinutes, 0);
  return {
    total: ofDay.length,
    done,
    plannedMinutes,
    ratio: ofDay.length === 0 ? 0 : done / ofDay.length,
  };
}

export interface DaySummary {
  total: number;
  done: number;
  /** Couleurs des projets présents ce jour-là, pour les pastilles du calendrier. */
  colors: string[];
}

/** Résumé de chaque journée contenant au moins une tâche, indexé par date. */
export function summariesByDate(state: PlannerState): Record<ISODate, DaySummary> {
  const colorOf = new Map(state.projects.map((project) => [project.id, project.color]));
  const summaries: Record<ISODate, DaySummary> = {};
  for (const task of state.tasks) {
    if (!task.date) continue;
    const summary = summaries[task.date] ?? { total: 0, done: 0, colors: [] };
    summary.total += 1;
    if (task.done) summary.done += 1;
    const color = task.projectId ? colorOf.get(task.projectId) : undefined;
    if (color && !summary.colors.includes(color)) summary.colors.push(color);
    summaries[task.date] = summary;
  }
  return summaries;
}

/** Tâches en retard : datées avant aujourd'hui et toujours à faire. */
export function overdueTasks(tasks: Task[], today: ISODate): Task[] {
  return tasks
    .filter((task) => !task.done && task.date !== null && daysBetween(today, task.date) < 0)
    .sort((a, b) => (a.date ?? '').localeCompare(b.date ?? '') || compareForDay(a, b));
}

/** Tâches à faire à partir d'aujourd'hui, groupées ensuite par date. */
export function upcomingTasks(tasks: Task[], today: ISODate): Task[] {
  return tasks
    .filter((task) => !task.done && task.date !== null && daysBetween(today, task.date) >= 0)
    .sort((a, b) => (a.date ?? '').localeCompare(b.date ?? '') || compareForDay(a, b));
}

export function undatedTasks(tasks: Task[]): Task[] {
  return tasks.filter((task) => !task.done && task.date === null).sort(compareForDay);
}

export function completedTasks(tasks: Task[]): Task[] {
  return tasks
    .filter((task) => task.done)
    .sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''));
}

/** Regroupe une liste de tâches par date, en conservant l'ordre chronologique. */
export function groupByDate(tasks: Task[]): { date: ISODate; tasks: Task[] }[] {
  const groups: { date: ISODate; tasks: Task[] }[] = [];
  for (const task of tasks) {
    if (!task.date) continue;
    const last = groups[groups.length - 1];
    if (last && last.date === task.date) {
      last.tasks.push(task);
    } else {
      groups.push({ date: task.date, tasks: [task] });
    }
  }
  return groups;
}

export interface ProjectStats {
  total: number;
  done: number;
  ratio: number;
}

export function projectStats(tasks: Task[], projectId: string): ProjectStats {
  const ofProject = tasks.filter((task) => task.projectId === projectId);
  const done = ofProject.filter((task) => task.done).length;
  return {
    total: ofProject.length,
    done,
    ratio: ofProject.length === 0 ? 0 : done / ofProject.length,
  };
}

export function findProject(projects: Project[], id: string | null): Project | undefined {
  return id ? projects.find((project) => project.id === id) : undefined;
}

/** Avancement des étapes d'une tâche, ou `null` si elle n'en a pas. */
export function stepProgress(task: Task): { done: number; total: number } | null {
  if (task.steps.length === 0) return null;
  return { done: task.steps.filter((step) => step.done).length, total: task.steps.length };
}

export function searchTasks(tasks: Task[], query: string): Task[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return tasks;
  return tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(needle) ||
      task.notes.toLowerCase().includes(needle) ||
      task.steps.some((step) => step.label.toLowerCase().includes(needle))
  );
}
