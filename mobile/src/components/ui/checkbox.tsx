import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { successFeedback, tapFeedback } from '@/lib/haptics';

export function Checkbox({
  checked,
  onToggle,
  color,
  size = 24,
  label = 'Marquer comme terminé',
}: {
  checked: boolean;
  onToggle: () => void;
  /** Couleur de remplissage quand la case est cochée (couleur du projet par défaut). */
  color?: string;
  size?: number;
  label?: string;
}) {
  const colors = useTheme();
  const fill = color ?? colors.accent;

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      hitSlop={10}
      onPress={() => {
        if (checked) tapFeedback();
        else successFeedback();
        onToggle();
      }}
      style={({ pressed }) => [
        styles.box,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: checked ? fill : colors.border,
          backgroundColor: checked ? fill : 'transparent',
          opacity: pressed ? 0.6 : 1,
        },
      ]}>
      {checked && <Ionicons name="checkmark" size={size * 0.62} color={colors.surface} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
