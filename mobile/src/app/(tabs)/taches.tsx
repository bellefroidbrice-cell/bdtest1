import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { TaskRow } from '@/components/task-row';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { Fab } from '@/components/ui/fab';
import { Field } from '@/components/ui/field';
import { Screen } from '@/components/ui/screen';
import { SectionTitle } from '@/components/ui/section-title';
import { Text } from '@/components/ui/text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatLong, formatRelativeDay, todayISO } from '@/lib/date';
import { usePlanner } from '@/store/planner-store';
import {
  completedTasks,
  findProject,
  groupByDate,
  overdueTasks,
  searchTasks,
  undatedTasks,
  upcomingTasks,
} from '@/store/selectors';
import type { Task } from '@/store/types';

type Filter = 'a-faire' | 'sans-date' | 'terminees';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'a-faire', label: 'À faire' },
  { key: 'sans-date', label: 'Sans date' },
  { key: 'terminees', label: 'Terminées' },
];

export default function TasksScreen() {
  const router = useRouter();
  const colors = useTheme();
  const { state, actions } = usePlanner();
  const today = todayISO();
  const [filter, setFilter] = useState<Filter>('a-faire');
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState('');

  // L'ajout rapide date la tâche du jour, sauf dans la liste « Sans date ».
  const quickAdd = () => {
    if (!draft.trim()) return;
    actions.createTask({ title: draft, date: filter === 'sans-date' ? null : today });
    setDraft('');
  };

  const matching = searchTasks(state.tasks, query);
  const late = overdueTasks(matching, today);
  const upcoming = groupByDate(upcomingTasks(matching, today));
  const undated = undatedTasks(matching);
  const done = completedTasks(matching);

  const renderRows = (tasks: Task[], showDate = false) => (
    <Card padded={false} style={styles.list}>
      {tasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          project={findProject(state.projects, task.projectId)}
          showDate={showDate}
          onToggle={() => actions.toggleTask(task.id)}
          onPress={() => router.push(`/tache/${task.id}`)}
        />
      ))}
    </Card>
  );

  const isEmpty =
    (filter === 'a-faire' && late.length === 0 && upcoming.length === 0) ||
    (filter === 'sans-date' && undated.length === 0) ||
    (filter === 'terminees' && done.length === 0);

  return (
    <View style={{ flex: 1 }}>
      <Screen scroll withTabBar>
        <View style={styles.container}>
          <Text variant="display">Tâches</Text>

          {filter !== 'terminees' && (
            <View style={[styles.quickAdd, { borderColor: colors.border }]}>
              <Ionicons name="add" size={20} color={colors.textMuted} />
              <TextInput
                value={draft}
                onChangeText={setDraft}
                onSubmitEditing={quickAdd}
                blurOnSubmit={false}
                returnKeyType="done"
                placeholder={
                  filter === 'sans-date' ? 'Ajouter à la liste…' : "Ajouter à aujourd'hui…"
                }
                placeholderTextColor={colors.textMuted}
                style={[styles.quickAddInput, { color: colors.text }]}
              />
              {draft.trim().length > 0 && (
                <Pressable accessibilityRole="button" accessibilityLabel="Ajouter" onPress={quickAdd}>
                  <Text variant="label" tone="accent">
                    Ajouter
                  </Text>
                </Pressable>
              )}
            </View>
          )}

          <Field
            value={query}
            onChangeText={setQuery}
            placeholder="Rechercher une tâche ou une étape…"
            autoCorrect={false}
            clearButtonMode="while-editing"
          />

          <View style={styles.filters}>
            {FILTERS.map((option) => (
              <Chip
                key={option.key}
                label={option.label}
                selected={filter === option.key}
                onPress={() => setFilter(option.key)}
              />
            ))}
          </View>

          {isEmpty && (
            <EmptyState
              icon={query ? 'search-outline' : 'checkmark-done-outline'}
              title={query ? 'Aucun résultat' : 'Rien à afficher'}
              message={
                query
                  ? 'Essayez un autre mot-clé.'
                  : filter === 'terminees'
                    ? 'Les tâches terminées apparaîtront ici.'
                    : 'Ajoutez une tâche pour commencer.'
              }
            />
          )}

          {filter === 'a-faire' && (
            <>
              {late.length > 0 && (
                <View style={styles.section}>
                  <SectionTitle>En retard</SectionTitle>
                  {renderRows(late, true)}
                </View>
              )}
              {upcoming.map((group) => (
                <View key={group.date} style={styles.section}>
                  <SectionTitle>{formatRelativeDay(group.date)}</SectionTitle>
                  <Text variant="caption" tone="muted">
                    {formatLong(group.date)}
                  </Text>
                  {renderRows(group.tasks)}
                </View>
              ))}
            </>
          )}

          {filter === 'sans-date' && undated.length > 0 && (
            <View style={styles.section}>
              <SectionTitle>À planifier</SectionTitle>
              {renderRows(undated)}
            </View>
          )}

          {filter === 'terminees' && done.length > 0 && (
            <View style={styles.section}>
              <SectionTitle>{`${done.length} tâche${done.length > 1 ? 's' : ''} terminée${done.length > 1 ? 's' : ''}`}</SectionTitle>
              {renderRows(done, true)}
            </View>
          )}
        </View>
      </Screen>
      <Fab label="Tâche" onPress={() => router.push('/tache/nouvelle')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.four, gap: Spacing.four },
  quickAdd: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderWidth: 1,
    borderRadius: Radius.medium,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  quickAddInput: { flex: 1, fontSize: 15, lineHeight: 20, paddingVertical: 0 },
  filters: { flexDirection: 'row', gap: Spacing.two, flexWrap: 'wrap' },
  section: { gap: Spacing.two },
  list: { paddingVertical: Spacing.one, paddingHorizontal: Spacing.one },
});
