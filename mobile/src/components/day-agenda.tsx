import { useState } from 'react';
import { Pressable, StyleSheet, View, type LayoutChangeEvent } from 'react-native';

import { Text } from '@/components/ui/text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { agendaLayout, SLOT_HEIGHT, SLOT_MINUTES, slotsBetween } from '@/lib/agenda';
import { formatTime, nowMinutes, todayISO, type ISODate } from '@/lib/date';
import { findProject } from '@/store/selectors';
import type { Project, Task } from '@/store/types';

const GUTTER = 46;

/**
 * Grille horaire d'une journée, au pas de 15 minutes.
 * Chaque créneau vide est tactile : il ouvre la création d'une tâche à cette heure.
 */
export function DayAgenda({
  date,
  tasks,
  projects,
  onPressSlot,
  onPressTask,
}: {
  date: ISODate;
  tasks: Task[];
  projects: Project[];
  onPressSlot: (startMinutes: number) => void;
  onPressTask: (task: Task) => void;
}) {
  const colors = useTheme();
  // La largeur est mesurée pour placer les tâches simultanées côte à côte.
  const [gridWidth, setGridWidth] = useState(0);
  const onLayout = (event: LayoutChangeEvent) => setGridWidth(event.nativeEvent.layout.width);
  const contentWidth = Math.max(0, gridWidth - GUTTER - Spacing.two);
  const layout = agendaLayout(tasks);
  const slots = slotsBetween(layout.startMinute, layout.endMinute);

  const currentMinute = nowMinutes();
  const showNow =
    date === todayISO() &&
    currentMinute >= layout.startMinute &&
    currentMinute <= layout.endMinute;
  const nowTop = ((currentMinute - layout.startMinute) / SLOT_MINUTES) * SLOT_HEIGHT;

  return (
    <View style={[styles.grid, { height: layout.totalHeight }]} onLayout={onLayout}>
      {slots.map((minute) => {
        const isHour = minute % 60 === 0;
        const top = ((minute - layout.startMinute) / SLOT_MINUTES) * SLOT_HEIGHT;
        return (
          <Pressable
            key={minute}
            accessibilityRole="button"
            accessibilityLabel={`${formatTime(minute)}, créneau libre`}
            onPress={() => onPressSlot(minute)}
            style={({ pressed }) => [
              styles.slot,
              {
                top,
                left: GUTTER,
                borderTopColor: isHour ? colors.border : colors.surfaceAlt,
                backgroundColor: pressed ? colors.surfaceAlt : 'transparent',
              },
            ]}
          />
        );
      })}

      {layout.hours.map((hour) => (
        <View
          key={hour}
          pointerEvents="none"
          style={[
            styles.hourLabel,
            { top: ((hour * 60 - layout.startMinute) / SLOT_MINUTES) * SLOT_HEIGHT - 7 },
          ]}>
          <Text variant="caption" tone="muted">
            {hour} h
          </Text>
        </View>
      ))}

      {showNow && (
        <View pointerEvents="none" style={[styles.now, { top: nowTop, left: GUTTER - 4 }]}>
          <View style={[styles.nowDot, { backgroundColor: colors.accent }]} />
          <View style={[styles.nowLine, { backgroundColor: colors.accent }]} />
        </View>
      )}

      {contentWidth > 0 &&
        layout.blocks.map(({ task, top, height, column, columns }) => {
          const project = findProject(projects, task.projectId);
          const columnWidth = contentWidth / columns;
          const compact = height < 34;
          return (
            <Pressable
              key={task.id}
              accessibilityRole="button"
              accessibilityLabel={`${task.title}, ${formatTime(task.startMinutes ?? 0)}`}
              onPress={() => onPressTask(task)}
              style={({ pressed }) => [
                styles.block,
                {
                  top,
                  height: height - 2,
                  left: GUTTER + Spacing.two + column * columnWidth,
                  width: columnWidth - 2,
                  backgroundColor: colors.surfaceAlt,
                  borderLeftColor: project?.color ?? colors.textMuted,
                  opacity: pressed ? 0.7 : task.done ? 0.45 : 1,
                },
              ]}>
              <Text
                variant="caption"
                numberOfLines={compact ? 1 : 2}
                style={[styles.blockTitle, task.done && styles.done]}>
                {task.title}
              </Text>
              {!compact && (
                <Text variant="caption" tone="muted" numberOfLines={1}>
                  {formatTime(task.startMinutes ?? 0)}
                  {project ? ` · ${project.name}` : ''}
                </Text>
              )}
            </Pressable>
          );
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { position: 'relative', width: '100%' },
  slot: {
    position: 'absolute',
    right: 0,
    height: SLOT_HEIGHT,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  hourLabel: { position: 'absolute', left: 0, width: GUTTER - Spacing.two, alignItems: 'flex-end' },
  now: { position: 'absolute', right: 0, flexDirection: 'row', alignItems: 'center' },
  nowDot: { width: 6, height: 6, borderRadius: 3 },
  nowLine: { flex: 1, height: StyleSheet.hairlineWidth },
  block: {
    position: 'absolute',
    borderRadius: Radius.small,
    borderLeftWidth: 2,
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    overflow: 'hidden',
  },
  blockTitle: { fontWeight: '500' },
  done: { textDecorationLine: 'line-through' },
});
