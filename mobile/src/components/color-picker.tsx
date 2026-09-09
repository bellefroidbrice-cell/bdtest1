import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { ProjectColors, Radius, Spacing } from '@/constants/theme';

export function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) {
  return (
    <View style={styles.wrapper}>
      <Text variant="label" tone="secondary">
        Couleur
      </Text>
      <View style={styles.swatches}>
        {ProjectColors.map((color) => (
          <Pressable
            key={color}
            accessibilityRole="button"
            accessibilityLabel={`Couleur ${color}`}
            accessibilityState={{ selected: value === color }}
            onPress={() => onChange(color)}
            style={({ pressed }) => [
              styles.swatch,
              { backgroundColor: color, opacity: pressed ? 0.7 : 1 },
            ]}>
            {value === color && <Ionicons name="checkmark" size={18} color="#FFFFFF" />}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: Spacing.two },
  swatches: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.three },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
