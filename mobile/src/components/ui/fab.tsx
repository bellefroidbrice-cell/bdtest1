import Ionicons from '@expo/vector-icons/Ionicons';
import { Platform, Pressable, StyleSheet } from 'react-native';

import { BottomTabInset, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * Bouton d'action flottant : un simple disque, sans libellé, pour ne pas
 * charger l'écran. Le libellé reste lu par les lecteurs d'écran.
 */
export function Fab({
  label,
  onPress,
  withTabBar = true,
}: {
  label: string;
  onPress: () => void;
  withTabBar?: boolean;
}) {
  const colors = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.fab,
        {
          backgroundColor: colors.accent,
          bottom: (withTabBar ? BottomTabInset : 0) + Spacing.five,
          opacity: pressed ? 0.75 : 1,
        },
      ]}>
      <Ionicons name="add" size={24} color={colors.onAccent} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: Spacing.four,
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.pill,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 3 },
      default: {},
    }),
  },
});
