import { addDays, todayISO } from '@/lib/date';
import { createId } from '@/lib/id';
import { STATE_VERSION, type PlannerState, type Project, type Step, type Task } from './types';

const step = (label: string, done = false): Step => ({ id: createId(), label, done });

function makeTask(task: Partial<Task> & Pick<Task, 'title'>): Task {
  return {
    id: createId(),
    notes: '',
    date: null,
    startMinutes: null,
    durationMinutes: 30,
    priority: 'normale',
    projectId: null,
    steps: [],
    done: false,
    createdAt: new Date().toISOString(),
    completedAt: null,
    ...task,
  };
}

/**
 * Contenu d'exemple affiché au tout premier lancement, pour que l'application
 * ne s'ouvre pas sur des écrans vides. Il peut être effacé dans les réglages.
 */
export function createSeedState(): PlannerState {
  const today = todayISO();
  const projects: Project[] = [
    { id: createId(), name: 'Travail', color: '#4F46E5', createdAt: new Date().toISOString() },
    { id: createId(), name: 'Perso', color: '#10B981', createdAt: new Date().toISOString() },
    { id: createId(), name: 'Maison', color: '#F59E0B', createdAt: new Date().toISOString() },
  ];
  const [travail, perso, maison] = projects;

  const tasks: Task[] = [
    makeTask({
      title: "Point d'équipe",
      date: today,
      startMinutes: 9 * 60,
      durationMinutes: 30,
      projectId: travail.id,
      steps: [step('Relire les notes de la semaine', true), step('Lister les 3 sujets à trancher')],
    }),
    makeTask({
      title: 'Préparer la présentation client',
      date: today,
      startMinutes: 10 * 60 + 30,
      durationMinutes: 90,
      priority: 'haute',
      projectId: travail.id,
      notes: "Insister sur le calendrier de livraison.",
      steps: [
        step('Rassembler les chiffres du trimestre', true),
        step('Écrire le plan en 5 parties'),
        step('Mettre en forme les slides'),
        step('Relecture à voix haute'),
      ],
    }),
    makeTask({
      title: 'Déjeuner avec Léa',
      date: today,
      startMinutes: 12 * 60 + 30,
      durationMinutes: 60,
      projectId: perso.id,
    }),
    makeTask({
      title: 'Courses de la semaine',
      date: today,
      projectId: maison.id,
      steps: [step('Marché'), step('Pharmacie'), step('Pressing')],
    }),
    makeTask({
      title: 'Revoir le budget du mois',
      date: addDays(today, 1),
      startMinutes: 14 * 60,
      durationMinutes: 45,
      projectId: perso.id,
    }),
    makeTask({
      title: 'Rendez-vous au garage',
      date: addDays(today, 3),
      startMinutes: 9 * 60,
      durationMinutes: 60,
      projectId: maison.id,
    }),
    makeTask({ title: 'Réserver les billets de train', projectId: perso.id, priority: 'haute' }),
    makeTask({ title: 'Trier les photos de vacances', projectId: perso.id, priority: 'basse' }),
  ];

  return {
    version: STATE_VERSION,
    projects,
    tasks,
    intentions: { [today]: 'Boucler la présentation avant midi.' },
  };
}
