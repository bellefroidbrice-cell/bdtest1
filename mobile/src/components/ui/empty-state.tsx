import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Text } from './text';

export function EmptyState({
  icon = 'sparkles-outline',
  title,
  message,
}: {
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  message?: string;
}) {
  const colors = useTheme();

  return (
    <View style={styles.wrapper}>
      <Ionicons name={icon} size={30} color={colors.textMuted} />
      <Text variant="heading" tone="secondary" style={styles.centered}>
        {title}
      </Text>
      {message && (
        <Text variant="body" tone="muted" style={styles.centered}>
          {message}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', gap: Spacing.two, paddingVertical: Spacing.six },
  centered: { textAlign: 'center' },
});
