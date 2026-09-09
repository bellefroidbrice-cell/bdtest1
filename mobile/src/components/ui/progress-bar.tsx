import { StyleSheet, View } from 'react-native';

import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function ProgressBar({
  ratio,
  color,
  height = 3,
}: {
  /** Valeur entre 0 et 1. */
  ratio: number;
  color?: string;
  height?: number;
}) {
  const colors = useTheme();
  const clamped = Math.max(0, Math.min(1, ratio));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      style={[styles.track, { backgroundColor: colors.surfaceAlt, height, borderRadius: height }]}>
      <View
        style={{
          width: `${clamped * 100}%`,
          height,
          borderRadius: height,
          backgroundColor: color ?? colors.accent,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { width: '100%', overflow: 'hidden', borderRadius: Radius.pill },
});
