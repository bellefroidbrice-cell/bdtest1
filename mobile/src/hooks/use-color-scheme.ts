import { useColorScheme as useSystemColorScheme } from 'react-native';

/**
 * Apparence de l'application.
 *
 * L'interface est pensée autour du noir : elle est donc forcée en sombre.
 * Passer cette constante à `'system'` rend l'application sensible au réglage
 * clair/sombre du téléphone, `'light'` force le thème clair.
 */
export const APPEARANCE: 'dark' | 'light' | 'system' = 'dark';

export function useColorScheme(): 'light' | 'dark' {
  const system = useSystemColorScheme();
  if (APPEARANCE !== 'system') return APPEARANCE;
  return system === 'light' ? 'light' : 'dark';
}
