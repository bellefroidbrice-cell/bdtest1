import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet } from 'react-native';

import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function IconButton({
  name,
  onPress,
  label,
  size = 20,
  tone = 'default',
}: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
  /** Libellé lu par les lecteurs d'écran. */
  label: string;
  size?: number;
  tone?: 'default' | 'accent' | 'danger';
}) {
  const colors = useTheme();
  const color =
    tone === 'accent' ? colors.accent : tone === 'danger' ? colors.danger : colors.textSecondary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: colors.surfaceAlt, opacity: pressed ? 0.6 : 1 },
      ]}>
      <Ionicons name={name} size={size} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
