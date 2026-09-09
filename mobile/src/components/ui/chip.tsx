import { Pressable, StyleSheet, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Text } from './text';

export function Chip({
  label,
  selected = false,
  onPress,
  dotColor,
  compact = false,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  dotColor?: string;
  compact?: boolean;
}) {
  const colors = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        compact && styles.compact,
        {
          backgroundColor: selected ? colors.accent : 'transparent',
          borderColor: selected ? colors.accent : colors.border,
          opacity: pressed ? 0.6 : 1,
        },
      ]}>
      {dotColor && <View style={[styles.dot, { backgroundColor: dotColor }]} />}
      <Text
        variant="label"
        style={{ color: selected ? colors.onAccent : colors.textSecondary }}
        numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  compact: { paddingHorizontal: Spacing.two, paddingVertical: Spacing.one },
  dot: { width: 7, height: 7, borderRadius: 3.5 },
});
