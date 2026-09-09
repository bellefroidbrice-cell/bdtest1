import Ionicons from '@expo/vector-icons/Ionicons';
import { Platform, Pressable, StyleSheet } from 'react-native';

import { BottomTabInset, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Text } from './text';

/** Bouton d'action flottant, placé au-dessus de la barre d'onglets. */
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
          opacity: pressed ? 0.85 : 1,
        },
      ]}>
      <Ionicons name="add" size={22} color={colors.onAccent} />
      <Text variant="label" style={{ color: colors.onAccent }}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: Spacing.four,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingLeft: Spacing.three,
    paddingRight: Spacing.four,
    paddingVertical: Spacing.three,
    borderRadius: Radius.pill,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 4 },
      default: {},
    }),
  },
});
