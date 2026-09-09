import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { DayAgenda } from '@/components/day-agenda';
import { TaskRow } from '@/components/task-row';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { Field } from '@/components/ui/field';
import { ProgressBar } from '@/components/ui/progress-bar';
import { SectionTitle } from '@/components/ui/section-title';
import { Text } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import { formatDuration, formatLong, formatRelativeDay, todayISO, type ISODate } from '@/lib/date';
import { usePlanner } from '@/store/planner-store';
import { dayStats, findProject, tasksForDate } from '@/store/selectors';

type Mode = 'agenda' | 'liste';

/**
 * Déroulé d'une journée. Deux lectures de la même journée :
 * la grille horaire au pas de 15 minutes, ou la liste des tâches.
 * Partagé par l'onglet « Aujourd'hui » et l'écran d'une journée du calendrier.
 */
export function DayView({ date }: { date: ISODate }) {
  const router = useRouter();
  const { state, actions } = usePlanner();
  const [intention, setIntention] = useState(state.intentions[date] ?? '');
  const [mode, setMode] = useState<Mode>('agenda');

  useEffect(() => {
    setIntention(state.intentions[date] ?? '');
  }, [date, state.intentions]);

  const tasks = tasksForDate(state.tasks, date);
  const stats = dayStats(state.tasks, date);
  const timed = tasks.filter((task) => task.startMinutes !== null);
  const untimed = tasks.filter((task) => task.startMinutes === null);

  const openTask = (id: string) => router.push(`/tache/${id}`);
  const createAt = (startMinutes: number) =>
    router.push(`/tache/nouvelle?date=${date}&start=${startMinutes}`);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="caption" tone="muted">
          {formatLong(date).toUpperCase()}
        </Text>
        <Text variant="display">{formatRelativeDay(date)}</Text>
      </View>

      <Card>
        <View style={styles.statsRow}>
          <Text variant="heading">
            {stats.total === 0
              ? 'Journée libre'
              : `${stats.done} sur ${stats.total} ${stats.total > 1 ? 'terminées' : 'terminée'}`}
          </Text>
          {stats.plannedMinutes > 0 && (
            <Text variant="caption" tone="muted">
              {formatDuration(stats.plannedMinutes)} planifiées
            </Text>
          )}
        </View>
        <View style={styles.progress}>
          <ProgressBar ratio={stats.ratio} />
        </View>
        <Field
          label="Objectif du jour"
          value={intention}
          onChangeText={(text) => {
            setIntention(text);
            actions.setIntention(date, text);
          }}
          placeholder="Ce qui compte vraiment aujourd'hui…"
          multiline
          style={styles.intention}
        />
      </Card>

      <View style={styles.section}>
        <SectionTitle
          right={
            <View style={styles.modes}>
              <Chip
                label="Agenda"
                compact
                selected={mode === 'agenda'}
                onPress={() => setMode('agenda')}
              />
              <Chip
                label="Liste"
                compact
                selected={mode === 'liste'}
                onPress={() => setMode('liste')}
              />
            </View>
          }>
          Déroulé de la journée
        </SectionTitle>

        {mode === 'agenda' ? (
          <Card style={styles.agendaCard}>
            <DayAgenda
              date={date}
              tasks={timed}
              projects={state.projects}
              onPressSlot={createAt}
              onPressTask={(task) => openTask(task.id)}
            />
          </Card>
        ) : timed.length === 0 ? (
          <EmptyState
            icon="time-outline"
            title="Aucun horaire"
            message="Touchez un créneau dans l'agenda pour en poser un."
          />
        ) : (
          <Card padded={false} style={styles.list}>
            {timed.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                project={findProject(state.projects, task.projectId)}
                showTime
                onToggle={() => actions.toggleTask(task.id)}
                onPress={() => openTask(task.id)}
              />
            ))}
          </Card>
        )}
      </View>

      <View style={styles.section}>
        <SectionTitle>Sans horaire</SectionTitle>
        {untimed.length === 0 ? (
          <Text variant="caption" tone="muted">
            {date === todayISO()
              ? 'Tout ce qui est prévu aujourd’hui a une heure.'
              : 'Aucune tâche sans horaire ce jour-là.'}
          </Text>
        ) : (
          <Card padded={false} style={styles.list}>
            {untimed.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                project={findProject(state.projects, task.projectId)}
                onToggle={() => actions.toggleTask(task.id)}
                onPress={() => openTask(task.id)}
              />
            ))}
          </Card>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.four, gap: Spacing.five },
  header: { gap: Spacing.two },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  progress: { marginTop: Spacing.three, marginBottom: Spacing.four },
  intention: {
    minHeight: 60,
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  section: { gap: Spacing.three },
  modes: { flexDirection: 'row', gap: Spacing.two },
  agendaCard: { paddingVertical: Spacing.four, paddingHorizontal: Spacing.three },
  list: { paddingVertical: Spacing.one, paddingHorizontal: Spacing.one },
});
