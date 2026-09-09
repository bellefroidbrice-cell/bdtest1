import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Text } from './text';

export interface FieldProps extends TextInputProps {
  label?: string;
  hint?: string;
}

export function Field({ label, hint, style, multiline, ...rest }: FieldProps) {
  const colors = useTheme();

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text variant="label" tone="secondary">
          {label}
        </Text>
      )}
      <TextInput
        placeholderTextColor={colors.textMuted}
        multiline={multiline}
        style={[
          styles.input,
          {
            backgroundColor: colors.surfaceAlt,
            borderColor: colors.border,
            color: colors.text,
          },
          multiline && styles.multiline,
          style,
        ]}
        {...rest}
      />
      {hint && (
        <Text variant="caption" tone="muted">
          {hint}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: Spacing.two },
  input: {
    borderRadius: Radius.medium,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    fontSize: 15,
    lineHeight: 20,
  },
  multiline: { minHeight: 96, textAlignVertical: 'top' },
});
