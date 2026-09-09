import { StyleSheet, Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export type TextVariant = 'display' | 'title' | 'heading' | 'body' | 'label' | 'caption';

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  /** Couleur secondaire, atténuée ou d'accentuation. */
  tone?: 'default' | 'secondary' | 'muted' | 'accent' | 'danger' | 'success';
}

export function Text({ variant = 'body', tone = 'default', style, ...rest }: TextProps) {
  const colors = useTheme();
  const color =
    tone === 'secondary'
      ? colors.textSecondary
      : tone === 'muted'
        ? colors.textMuted
        : tone === 'accent'
          ? colors.accent
          : tone === 'danger'
            ? colors.danger
            : tone === 'success'
              ? colors.success
              : colors.text;

  return <RNText {...rest} style={[styles[variant], { color }, style]} />;
}

const styles = StyleSheet.create({
  display: { fontSize: 30, lineHeight: 36, fontWeight: '700', letterSpacing: -0.5 },
  title: { fontSize: 22, lineHeight: 28, fontWeight: '700', letterSpacing: -0.3 },
  heading: { fontSize: 17, lineHeight: 22, fontWeight: '600' },
  body: { fontSize: 15, lineHeight: 21 },
  label: { fontSize: 13, lineHeight: 18, fontWeight: '600' },
  caption: { fontSize: 12, lineHeight: 16 },
});
