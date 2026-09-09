import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { MonthGrid } from '@/components/month-grid';
import { TaskRow } from '@/components/task-row';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Fab } from '@/components/ui/fab';
import { IconButton } from '@/components/ui/icon-button';
import { Screen } from '@/components/ui/screen';
import { SectionTitle } from '@/components/ui/section-title';
import { Text } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import { addMonths, formatLong, formatMonthYear, formatRelativeDay, todayISO } from '@/lib/date';
import { usePlanner } from '@/store/planner-store';
import { dayStats, findProject, summariesByDate, tasksForDate } from '@/store/selectors';

export default function CalendarScreen() {
  const router = useRouter();
  const { state, actions } = usePlanner();
  const today = todayISO();
  const [month, setMonth] = useState(today);
  const [selected, setSelected] = useState(today);

  const summaries = summariesByDate(state);
  const tasks = tasksForDate(state.tasks, selected);
  const stats = dayStats(state.tasks, selected);

  return (
    <View style={{ flex: 1 }}>
      <Screen scroll withTabBar>
        <View style={styles.container}>
          <View style={styles.titleRow}>
            <Text variant="display">Calendrier</Text>
            {(month.slice(0, 7) !== today.slice(0, 7) || selected !== today) && (
              <Button
                label="Aujourd'hui"
                variant="secondary"
                onPress={() => {
                  setMonth(today);
                  setSelected(today);
                }}
              />
            )}
          </View>

          <Card>
            <View style={styles.monthHeader}>
              <IconButton
                name="chevron-back"
                label="Mois précédent"
                onPress={() => setMonth(addMonths(month, -1))}
              />
              <Text variant="heading">{formatMonthYear(month)}</Text>
              <IconButton
                name="chevron-forward"
                label="Mois suivant"
                onPress={() => setMonth(addMonths(month, 1))}
              />
            </View>
            <View style={styles.grid}>
              <MonthGrid
                month={month}
                selected={selected}
                today={today}
                summaries={summaries}
                onSelect={(date) => {
                  setSelected(date);
                  if (date.slice(0, 7) !== month.slice(0, 7)) setMonth(date);
                }}
              />
            </View>
          </Card>

          <View style={styles.section}>
            <SectionTitle>{formatRelativeDay(selected)}</SectionTitle>
            <Text variant="caption" tone="muted">
              {formatLong(selected)}
              {stats.total > 0 ? ` · ${stats.done}/${stats.total} terminées` : ''}
            </Text>

            {tasks.length === 0 ? (
              <EmptyState
                icon="calendar-clear-outline"
                title="Journée libre"
                message="Aucune tâche prévue ce jour-là."
              />
            ) : (
              <Card padded={false} style={styles.list}>
                {tasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    project={findProject(state.projects, task.projectId)}
                    showTime
                    onToggle={() => actions.toggleTask(task.id)}
                    onPress={() => router.push(`/tache/${task.id}`)}
                  />
                ))}
              </Card>
            )}

            <Button
              label="Ouvrir la journée"
              variant="ghost"
              icon="arrow-forward"
              onPress={() => router.push(`/jour/${selected}`)}
            />
          </View>
        </View>
      </Screen>
      <Fab label="Tâche" onPress={() => router.push(`/tache/nouvelle?date=${selected}`)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.four, gap: Spacing.five },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  monthHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  grid: { marginTop: Spacing.three },
  section: { gap: Spacing.two },
  list: { paddingVertical: Spacing.one, paddingHorizontal: Spacing.one },
});
