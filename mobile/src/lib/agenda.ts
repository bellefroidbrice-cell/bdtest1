/**
 * Calculs de mise en page de la grille horaire.
 *
 * L'unité de base est le créneau de 15 minutes : toutes les positions et
 * hauteurs en découlent, et tout horaire manipulé dans l'application est
 * arrondi à ce pas.
 */

import type { Task } from '@/store/types';

/** Pas de la grille, en minutes. */
export const SLOT_MINUTES = 15;

/** Hauteur d'un créneau de 15 minutes, en points. */
export const SLOT_HEIGHT = 17;

export const HOUR_HEIGHT = (60 / SLOT_MINUTES) * SLOT_HEIGHT;

/** Plage affichée par défaut, élargie si des tâches débordent. */
const DEFAULT_START_HOUR = 7;
const DEFAULT_END_HOUR = 22;

const MAX_MINUTE = 24 * 60 - SLOT_MINUTES;

/** Arrondit un horaire au créneau de 15 minutes le plus proche. */
export function snapToSlot(minutes: number): number {
  const snapped = Math.round(minutes / SLOT_MINUTES) * SLOT_MINUTES;
  return Math.max(0, Math.min(MAX_MINUTE, snapped));
}

export function clampStart(minutes: number): number {
  return Math.max(0, Math.min(MAX_MINUTE, minutes));
}

export interface AgendaBlock {
  task: Task;
  /** Position et hauteur en points, depuis le haut de la grille. */
  top: number;
  height: number;
  /** Colonne occupée parmi les tâches qui se chevauchent. */
  column: number;
  columns: number;
}

export interface AgendaLayout {
  /** Première et dernière minute affichées. */
  startMinute: number;
  endMinute: number;
  /** Heures pleines à étiqueter. */
  hours: number[];
  totalHeight: number;
  blocks: AgendaBlock[];
}

/**
 * Répartit les tâches horodatées d'une journée sur la grille.
 * Les tâches qui se chevauchent sont placées côte à côte.
 */
export function agendaLayout(tasks: Task[]): AgendaLayout {
  const timed = tasks
    .filter((task) => task.startMinutes !== null)
    .sort((a, b) => (a.startMinutes ?? 0) - (b.startMinutes ?? 0));

  let startMinute = DEFAULT_START_HOUR * 60;
  let endMinute = DEFAULT_END_HOUR * 60;
  for (const task of timed) {
    const start = task.startMinutes ?? 0;
    startMinute = Math.min(startMinute, Math.floor(start / 60) * 60);
    endMinute = Math.max(endMinute, Math.ceil((start + task.durationMinutes) / 60) * 60);
  }
  endMinute = Math.min(endMinute, 24 * 60);

  // Regroupe les tâches qui se chevauchent pour leur attribuer des colonnes.
  const blocks: AgendaBlock[] = [];
  let cluster: { task: Task; column: number; end: number }[] = [];
  let clusterEnd = -1;

  const flush = () => {
    if (cluster.length === 0) return;
    const columns = Math.max(...cluster.map((entry) => entry.column)) + 1;
    for (const entry of cluster) {
      const start = entry.task.startMinutes ?? 0;
      blocks.push({
        task: entry.task,
        top: ((start - startMinute) / SLOT_MINUTES) * SLOT_HEIGHT,
        height: Math.max(
          SLOT_HEIGHT,
          (entry.task.durationMinutes / SLOT_MINUTES) * SLOT_HEIGHT
        ),
        column: entry.column,
        columns,
      });
    }
    cluster = [];
    clusterEnd = -1;
  };

  for (const task of timed) {
    const start = task.startMinutes ?? 0;
    const end = start + task.durationMinutes;
    if (start >= clusterEnd) flush();

    // Première colonne libre à cet instant.
    const busy = new Set(cluster.filter((entry) => entry.end > start).map((e) => e.column));
    let column = 0;
    while (busy.has(column)) column += 1;

    cluster.push({ task, column, end });
    clusterEnd = Math.max(clusterEnd, end);
  }
  flush();

  const hours: number[] = [];
  for (let minute = startMinute; minute < endMinute; minute += 60) hours.push(minute / 60);

  return {
    startMinute,
    endMinute,
    hours,
    totalHeight: ((endMinute - startMinute) / SLOT_MINUTES) * SLOT_HEIGHT,
    blocks,
  };
}

/** Liste des créneaux de 15 minutes d'une plage, pour la couche tactile. */
export function slotsBetween(startMinute: number, endMinute: number): number[] {
  const slots: number[] = [];
  for (let minute = startMinute; minute < endMinute; minute += SLOT_MINUTES) slots.push(minute);
  return slots;
}
