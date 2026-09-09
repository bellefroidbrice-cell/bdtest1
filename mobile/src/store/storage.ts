import AsyncStorage from '@react-native-async-storage/async-storage';

import { STATE_VERSION, type PlannerState, type Project, type Task } from './types';

const STORAGE_KEY = 'cadence:state:v1';

/**
 * Relit l'état sauvegardé. Toute donnée illisible ou corrompue est ignorée
 * plutôt que de faire planter le démarrage de l'application.
 */
export async function loadState(): Promise<PlannerState | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PlannerState>;
    if (!parsed || typeof parsed !== 'object') return null;
    return {
      version: STATE_VERSION,
      tasks: Array.isArray(parsed.tasks) ? (parsed.tasks as Task[]) : [],
      projects: Array.isArray(parsed.projects) ? (parsed.projects as Project[]) : [],
      intentions:
        parsed.intentions && typeof parsed.intentions === 'object'
          ? (parsed.intentions as Record<string, string>)
          : {},
    };
  } catch {
    return null;
  }
}

export async function saveState(state: PlannerState): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Un échec d'écriture ne doit pas interrompre l'utilisation de l'application.
  }
}

export async function clearState(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // Idem : on ignore l'échec.
  }
}
