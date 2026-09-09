import { StyleSheet, TextInput, View } from 'react-native';

import { Checkbox } from '@/components/ui/checkbox';
import { IconButton } from '@/components/ui/icon-button';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Step } from '@/store/types';

/** Une étape modifiable directement dans la liste. */
export function StepRow({
  step,
  onToggle,
  onRename,
  onDelete,
}: {
  step: Step;
  onToggle: () => void;
  onRename: (label: string) => void;
  onDelete: () => void;
}) {
  const colors = useTheme();

  return (
    <View style={styles.row}>
      <Checkbox
        checked={step.done}
        onToggle={onToggle}
        size={20}
        label={`Étape : ${step.label}`}
      />
      <TextInput
        value={step.label}
        onChangeText={onRename}
        placeholder="Décrire l'étape…"
        placeholderTextColor={colors.textMuted}
        multiline
        style={[
          styles.input,
          { color: step.done ? colors.textMuted : colors.text },
          step.done && styles.done,
        ]}
      />
      <IconButton name="trash-outline" label="Supprimer l'étape" size={16} onPress={onDelete} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.two,
  },
  input: { flex: 1, fontSize: 15, lineHeight: 20, paddingVertical: 0 },
  done: { textDecorationLine: 'line-through' },
});
