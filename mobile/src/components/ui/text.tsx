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
  display: { fontSize: 27, lineHeight: 33, fontWeight: '600', letterSpacing: -0.6 },
  title: { fontSize: 20, lineHeight: 26, fontWeight: '600', letterSpacing: -0.4 },
  heading: { fontSize: 16, lineHeight: 21, fontWeight: '600', letterSpacing: -0.2 },
  body: { fontSize: 15, lineHeight: 21, fontWeight: '400' },
  label: { fontSize: 13, lineHeight: 18, fontWeight: '500' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
});
