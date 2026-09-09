/**
 * Jetons de design de l'application.
 *
 * Parti pris : sobre et moderne, construit autour du noir. Fond quasi noir,
 * surfaces à peine détachées, un accent unique (blanc sur noir, noir sur blanc)
 * et des couleurs de projet désaturées — la couleur distingue, elle ne décore pas.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    background: '#FAFAFA',
    surface: '#FFFFFF',
    surfaceAlt: '#F2F2F2',
    surfaceSelected: '#E8E8E8',
    border: '#E4E4E4',
    text: '#0F0F0F',
    textSecondary: '#6B6B6B',
    textMuted: '#9E9E9E',
    accent: '#0F0F0F',
    accentSoft: '#F0F0F0',
    onAccent: '#FFFFFF',
    success: '#4F6B52',
    successSoft: '#EDF1EC',
    danger: '#8C4A42',
    dangerSoft: '#F6ECEB',
    warning: '#8A6A3B',
    warningSoft: '#F5F0E7',
  },
  dark: {
    background: '#0A0A0A',
    surface: '#141414',
    surfaceAlt: '#1C1C1C',
    surfaceSelected: '#262626',
    border: '#242424',
    text: '#F5F5F5',
    textSecondary: '#8F8F8F',
    textMuted: '#5C5C5C',
    accent: '#FAFAFA',
    accentSoft: '#1F1F1F',
    onAccent: '#0A0A0A',
    success: '#8FAE91',
    successSoft: '#161C16',
    danger: '#C98D85',
    dangerSoft: '#1F1616',
    warning: '#C4A272',
    warningSoft: '#1E1810',
  },
} as const;

/** Palette d'un thème : les mêmes clés en clair et en sombre. */
export type ThemeColors = Record<keyof (typeof Colors)['light'], string>;
export type ThemeColor = keyof ThemeColors;

/** Couleurs de projet, volontairement désaturées pour rester discrètes. */
export const ProjectColors = [
  '#7C8DA8',
  '#84A38B',
  '#BE9270',
  '#A2849E',
  '#95998B',
  '#B4817A',
  '#7796A1',
  '#9C9994',
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
  small: 6,
  medium: 10,
  large: 14,
  pill: 999,
} as const;

export const BottomTabInset = Platform.select({ ios: 60, android: 80, default: 24 });
export const MaxContentWidth = 720;
