/**
 * Utilitaires de date en français, sans dépendance externe ni Intl :
 * les libellés sont écrits en dur pour rester identiques quelle que soit
 * la langue configurée sur le téléphone.
 *
 * Une date est représentée par une chaîne ISO courte « AAAA-MM-JJ » (heure locale).
 */

export type ISODate = string;

const MONTHS = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
];

const MONTHS_SHORT = [
  'janv.',
  'févr.',
  'mars',
  'avr.',
  'mai',
  'juin',
  'juil.',
  'août',
  'sept.',
  'oct.',
  'nov.',
  'déc.',
];

/** Jours de la semaine, du lundi au dimanche. */
const WEEKDAYS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

/** Initiales des jours pour l'en-tête du calendrier. */
export const WEEKDAY_INITIALS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const pad = (value: number) => String(value).padStart(2, '0');

export function toISO(date: Date): ISODate {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Convertit « AAAA-MM-JJ » en Date locale (midi, pour éviter les décalages d'heure d'été). */
export function parseISO(iso: ISODate): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

export function todayISO(): ISODate {
  return toISO(new Date());
}

export function addDays(iso: ISODate, days: number): ISODate {
  const date = parseISO(iso);
  date.setDate(date.getDate() + days);
  return toISO(date);
}

export function addMonths(iso: ISODate, months: number): ISODate {
  const date = parseISO(iso);
  const day = date.getDate();
  date.setDate(1);
  date.setMonth(date.getMonth() + months);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  date.setDate(Math.min(day, lastDay));
  return toISO(date);
}

/** Index du jour dans la semaine, 0 = lundi … 6 = dimanche. */
export function weekdayIndex(iso: ISODate): number {
  return (parseISO(iso).getDay() + 6) % 7;
}

/** Nombre de jours entre deux dates (positif si `iso` est après `from`). */
export function daysBetween(from: ISODate, iso: ISODate): number {
  const diff = parseISO(iso).getTime() - parseISO(from).getTime();
  return Math.round(diff / 86_400_000);
}

/** « mardi 9 septembre 2026 » */
export function formatLong(iso: ISODate): string {
  const date = parseISO(iso);
  return `${WEEKDAYS[weekdayIndex(iso)]} ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/** « mar. 9 sept. » */
export function formatShort(iso: ISODate): string {
  const date = parseISO(iso);
  const weekday = WEEKDAYS[weekdayIndex(iso)].slice(0, 3);
  return `${weekday}. ${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}`;
}

/** « septembre 2026 » */
export function formatMonthYear(iso: ISODate): string {
  const date = parseISO(iso);
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/** « Aujourd'hui », « Demain », « Hier », sinon la date courte. */
export function formatRelativeDay(iso: ISODate, today: ISODate = todayISO()): string {
  const diff = daysBetween(today, iso);
  if (diff === 0) return "Aujourd'hui";
  if (diff === 1) return 'Demain';
  if (diff === -1) return 'Hier';
  return formatShort(iso);
}

/** « 9 h 05 » à partir d'un nombre de minutes depuis minuit. */
export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours} h ${pad(mins)}`;
}

/** « 1 h 30 », « 45 min » */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins === 0 ? `${hours} h` : `${hours} h ${pad(mins)}`;
}

/** Minutes écoulées depuis minuit, pour l'instant présent. */
export function nowMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

/**
 * Grille du mois contenant `iso`, en semaines de 7 jours commençant le lundi.
 * Les cases de début et de fin débordent sur les mois voisins.
 */
export function monthMatrix(iso: ISODate): ISODate[][] {
  const date = parseISO(iso);
  const firstOfMonth = toISO(new Date(date.getFullYear(), date.getMonth(), 1, 12));
  const start = addDays(firstOfMonth, -weekdayIndex(firstOfMonth));
  const weeks: ISODate[][] = [];
  let cursor = start;
  for (let week = 0; week < 6; week += 1) {
    const days: ISODate[] = [];
    for (let day = 0; day < 7; day += 1) {
      days.push(cursor);
      cursor = addDays(cursor, 1);
    }
    weeks.push(days);
  }
  return weeks;
}

export function isSameMonth(a: ISODate, b: ISODate): boolean {
  return a.slice(0, 7) === b.slice(0, 7);
}
