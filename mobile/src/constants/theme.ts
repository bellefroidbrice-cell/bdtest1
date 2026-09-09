/**
 * Jetons de design de l'application : couleurs, espacements, rayons, typographie.
 * Les couleurs sont déclinées en thème clair et sombre.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    background: '#F7F7F9',
    surface: '#FFFFFF',
    surfaceAlt: '#F0F1F5',
    surfaceSelected: '#E7E8EF',
    border: '#E3E4EB',
    text: '#15161B',
    textSecondary: '#666B78',
    textMuted: '#9CA1AD',
    accent: '#4F46E5',
    accentSoft: '#ECEBFE',
    onAccent: '#FFFFFF',
    success: '#15803D',
    successSoft: '#DCFCE7',
    danger: '#DC2626',
    dangerSoft: '#FEE2E2',
    warning: '#B45309',
    warningSoft: '#FEF3C7',
  },
  dark: {
    background: '#0E0F13',
    surface: '#181920',
    surfaceAlt: '#212330',
    surfaceSelected: '#2A2D3C',
    border: '#2B2E3B',
    text: '#F4F5F8',
    textSecondary: '#A2A8B8',
    textMuted: '#767C8C',
    accent: '#8E8AFF',
    accentSoft: '#232243',
    onAccent: '#0E0F13',
    success: '#4ADE80',
    successSoft: '#14301F',
    danger: '#F87171',
    dangerSoft: '#3A1A1A',
    warning: '#FBBF24',
    warningSoft: '#37260B',
  },
} as const;

/** Palette d'un thème : les mêmes clés en clair et en sombre. */
export type ThemeColors = Record<keyof (typeof Colors)['light'], string>;
export type ThemeColor = keyof ThemeColors;

/** Palette proposée pour les projets. */
export const ProjectColors = [
  '#4F46E5',
  '#0EA5E9',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#EC4899',
  '#8B5CF6',
  '#64748B',
] as const;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 24,
  six: 32,
  seven: 48,
} as const;

export const Radius = {
  small: 8,
  medium: 12,
  large: 18,
  pill: 999,
} as const;

export const BottomTabInset = Platform.select({ ios: 60, android: 80, default: 24 });
export const MaxContentWidth = 720;
