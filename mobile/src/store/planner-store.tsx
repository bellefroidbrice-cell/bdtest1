import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import type { ISODate } from '@/lib/date';
import { createId } from '@/lib/id';
import { createSeedState } from './seed';
import { clearState, loadState, saveState } from './storage';
import {
  emptyState,
  type PlannerState,
  type Priority,
  type Project,
  type Step,
  type Task,
} from './types';

type Action =
  | { type: 'hydrate'; state: PlannerState }
  | { type: 'createTask'; task: Task }
  | { type: 'updateTask'; id: string; patch: Partial<Task> }
  | { type: 'toggleTask'; id: string }
  | { type: 'deleteTask'; id: string }
  | { type: 'addStep'; taskId: string; step: Step }
  | { type: 'toggleStep'; taskId: string; stepId: string }
  | { type: 'renameStep'; taskId: string; stepId: string; label: string }
  | { type: 'deleteStep'; taskId: string; stepId: string }
  | { type: 'createProject'; project: Project }
  | { type: 'updateProject'; id: string; patch: Partial<Project> }
  | { type: 'deleteProject'; id: string }
  | { type: 'setIntention'; date: ISODate; text: string }
  | { type: 'replaceAll'; state: PlannerState };

function mapTask(state: PlannerState, id: string, update: (task: Task) => Task): PlannerState {
  return { ...state, tasks: state.tasks.map((task) => (task.id === id ? update(task) : task)) };
}

function mapSteps(
  state: PlannerState,
  taskId: string,
  update: (steps: Step[]) => Step[]
): PlannerState {
  return mapTask(state, taskId, (task) => ({ ...task, steps: update(task.steps) }));
}

function reducer(state: PlannerState, action: Action): PlannerState {
  switch (action.type) {
    case 'hydrate':
    case 'replaceAll':
      return action.state;

    case 'createTask':
      return { ...state, tasks: [...state.tasks, action.task] };

    case 'updateTask':
      return mapTask(state, action.id, (task) => ({ ...task, ...action.patch }));

    case 'toggleTask':
      return mapTask(state, action.id, (task) => {
        const done = !task.done;
        return { ...task, done, completedAt: done ? new Date().toISOString() : null };
      });

    case 'deleteTask':
      return { ...state, tasks: state.tasks.filter((task) => task.id !== action.id) };

    case 'addStep':
      return mapSteps(state, action.taskId, (steps) => [...steps, action.step]);

    case 'toggleStep':
      return mapSteps(state, action.taskId, (steps) =>
        steps.map((step) => (step.id === action.stepId ? { ...step, done: !step.done } : step))
      );

    case 'renameStep':
      return mapSteps(state, action.taskId, (steps) =>
        steps.map((step) => (step.id === action.stepId ? { ...step, label: action.label } : step))
      );

    case 'deleteStep':
      return mapSteps(state, action.taskId, (steps) =>
        steps.filter((step) => step.id !== action.stepId)
      );

    case 'createProject':
      return { ...state, projects: [...state.projects, action.project] };

    case 'updateProject':
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === action.id ? { ...project, ...action.patch } : project
        ),
      };

    case 'deleteProject':
      // Les tâches du projet sont conservées, simplement détachées.
      return {
        ...state,
        projects: state.projects.filter((project) => project.id !== action.id),
        tasks: state.tasks.map((task) =>
          task.projectId === action.id ? { ...task, projectId: null } : task
        ),
      };

    case 'setIntention': {
      const intentions = { ...state.intentions };
      if (action.text.trim()) {
        intentions[action.date] = action.text;
      } else {
        delete intentions[action.date];
      }
      return { ...state, intentions };
    }
  }
}

export interface NewTaskInput {
  title: string;
  notes?: string;
  date?: ISODate | null;
  startMinutes?: number | null;
  durationMinutes?: number;
  priority?: Priority;
  projectId?: string | null;
}

interface PlannerActions {
  createTask: (input: NewTaskInput) => Task;
  updateTask: (id: string, patch: Partial<Task>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  addStep: (taskId: string, label: string) => void;
  toggleStep: (taskId: string, stepId: string) => void;
  renameStep: (taskId: string, stepId: string, label: string) => void;
  deleteStep: (taskId: string, stepId: string) => void;
  createProject: (name: string, color: string) => Project;
  updateProject: (id: string, patch: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setIntention: (date: ISODate, text: string) => void;
  resetToExample: () => void;
  eraseEverything: () => void;
}

interface PlannerContextValue {
  state: PlannerState;
  /** `false` tant que les données sauvegardées n'ont pas été relues. */
  hydrated: boolean;
  actions: PlannerActions;
}

const PlannerContext = createContext<PlannerContextValue | null>(null);

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, emptyState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadState().then((saved) => {
      if (cancelled) return;
      dispatch({ type: 'hydrate', state: saved ?? createSeedState() });
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Sauvegarde différée : on regroupe les modifications rapprochées en une écriture.
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!hydrated) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => saveState(state), 300);
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [state, hydrated]);

  const actions = useMemo<PlannerActions>(
    () => ({
      createTask: (input) => {
        const task: Task = {
          id: createId(),
          title: input.title.trim(),
          notes: input.notes ?? '',
          date: input.date ?? null,
          startMinutes: input.startMinutes ?? null,
          durationMinutes: input.durationMinutes ?? 30,
          priority: input.priority ?? 'normale',
          projectId: input.projectId ?? null,
          steps: [],
          done: false,
          createdAt: new Date().toISOString(),
          completedAt: null,
        };
        dispatch({ type: 'createTask', task });
        return task;
      },
      updateTask: (id, patch) => dispatch({ type: 'updateTask', id, patch }),
      toggleTask: (id) => dispatch({ type: 'toggleTask', id }),
      deleteTask: (id) => dispatch({ type: 'deleteTask', id }),
      addStep: (taskId, label) =>
        dispatch({ type: 'addStep', taskId, step: { id: createId(), label: label.trim(), done: false } }),
      toggleStep: (taskId, stepId) => dispatch({ type: 'toggleStep', taskId, stepId }),
      renameStep: (taskId, stepId, label) => dispatch({ type: 'renameStep', taskId, stepId, label }),
      deleteStep: (taskId, stepId) => dispatch({ type: 'deleteStep', taskId, stepId }),
      createProject: (name, color) => {
        const project: Project = {
          id: createId(),
          name: name.trim(),
          color,
          createdAt: new Date().toISOString(),
        };
        dispatch({ type: 'createProject', project });
        return project;
      },
      updateProject: (id, patch) => dispatch({ type: 'updateProject', id, patch }),
      deleteProject: (id) => dispatch({ type: 'deleteProject', id }),
      setIntention: (date, text) => dispatch({ type: 'setIntention', date, text }),
      resetToExample: () => dispatch({ type: 'replaceAll', state: createSeedState() }),
      eraseEverything: () => {
        clearState();
        dispatch({ type: 'replaceAll', state: { ...emptyState, intentions: {} } });
      },
    }),
    []
  );

  const value = useMemo(() => ({ state, hydrated, actions }), [state, hydrated, actions]);

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
}

export function usePlanner(): PlannerContextValue {
  const context = useContext(PlannerContext);
  if (!context) {
    throw new Error('usePlanner doit être utilisé à l’intérieur de <PlannerProvider>.');
  }
  return context;
}
