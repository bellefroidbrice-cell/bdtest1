import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';

import { Checkbox } from '@/components/ui/checkbox';
import { Text } from '@/components/ui/text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatDuration, formatRelativeDay, formatTime } from '@/lib/date';
import { stepProgress } from '@/store/selectors';
import type { Project, Task } from '@/store/types';

interface TaskRowProps {
  task: Task;
  project?: Project;
  onToggle: () => void;
  onPress: () => void;
  /** Affiche l'heure de début dans une colonne à gauche (vue journée). */
  showTime?: boolean;
  /** Affiche la date dans la ligne d'informations (listes multi-jours). */
  showDate?: boolean;
}

export function TaskRow({
  task,
  project,
  onToggle,
  onPress,
  showTime = false,
  showDate = false,
}: TaskRowProps) {
  const colors = useTheme();
  const steps = stepProgress(task);

  const meta: string[] = [];
  if (showDate && task.date) meta.push(formatRelativeDay(task.date));
  if (!showTime && task.startMinutes !== null) meta.push(formatTime(task.startMinutes));
  if (task.startMinutes !== null) meta.push(formatDuration(task.durationMinutes));
  if (project) meta.push(project.name);
  if (task.priority === 'haute' && !task.done) meta.push('Prioritaire');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={task.title}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: pressed ? colors.surfaceAlt : 'transparent' },
      ]}>
      {showTime && (
        <View style={styles.timeColumn}>
          {task.startMinutes !== null ? (
            <Text variant="label" tone={task.done ? 'muted' : 'default'}>
              {formatTime(task.startMinutes)}
            </Text>
          ) : (
            <Ionicons name="ellipsis-horizontal" size={14} color={colors.textMuted} />
          )}
        </View>
      )}

      <Checkbox checked={task.done} onToggle={onToggle} color={project?.color} />

      <View style={styles.content}>
        <View style={styles.titleRow}>
          {project && <View style={[styles.dot, { backgroundColor: project.color }]} />}
          <Text
            variant="body"
            numberOfLines={2}
            tone={task.done ? 'muted' : 'default'}
            style={[styles.title, task.done && styles.doneTitle]}>
            {task.title}
          </Text>
        </View>

        {(meta.length > 0 || steps) && (
          <View style={styles.metaRow}>
            {meta.length > 0 && (
              <Text variant="caption" tone="muted">
                {meta.join(' · ')}
              </Text>
            )}
            {steps && (
              <Text
                variant="caption"
                tone={steps.done === steps.total ? 'success' : 'muted'}>
                {meta.length > 0 ? '· ' : ''}
                {steps.done}/{steps.total} étapes
              </Text>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.medium,
  },
  timeColumn: { width: 54, paddingTop: 1 },
  content: { flex: 1, gap: Spacing.one },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  title: { flexShrink: 1 },
  doneTitle: { textDecorationLine: 'line-through' },
  dot: { width: 6, height: 6, borderRadius: 3 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, flexWrap: 'wrap' },
});
