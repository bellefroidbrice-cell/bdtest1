import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, StyleSheet, View } from 'react-native';

import { ColorPicker } from '@/components/color-picker';
import { TaskRow } from '@/components/task-row';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Field } from '@/components/ui/field';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Screen } from '@/components/ui/screen';
import { SectionTitle } from '@/components/ui/section-title';
import { Text } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import { compareForDay, projectStats } from '@/store/selectors';
import { usePlanner } from '@/store/planner-store';

export default function ProjectScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, actions } = usePlanner();

  const project = state.projects.find((candidate) => candidate.id === id);

  if (!project) {
    return (
      <Screen edges={{ top: false }}>
        <EmptyState
          icon="alert-circle-outline"
          title="Projet introuvable"
          message="Il a peut-être été supprimé."
        />
      </Screen>
    );
  }

  const stats = projectStats(state.tasks, project.id);
  const tasks = state.tasks
    .filter((task) => task.projectId === project.id)
    .sort((a, b) => (a.date ?? '9999').localeCompare(b.date ?? '9999') || compareForDay(a, b));

  const confirmDelete = () => {
    Alert.alert(
      'Supprimer le projet ?',
      `« ${project.name} » sera supprimé. Ses ${stats.total} tâche(s) seront conservées, sans projet.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            actions.deleteProject(project.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <Screen scroll edges={{ top: false }}>
      <Stack.Screen options={{ title: project.name }} />

      <View style={styles.container}>
        <Card style={styles.form}>
          <Field
            label="Nom du projet"
            value={project.name}
            onChangeText={(name) => actions.updateProject(project.id, { name })}
            placeholder="Nom du projet"
          />
          <ColorPicker
            value={project.color}
            onChange={(color) => actions.updateProject(project.id, { color })}
          />
          <View>
            <Text variant="caption" tone="muted" style={styles.statsText}>
              {stats.total === 0 ? 'Aucune tâche' : `${stats.done} sur ${stats.total} terminées`}
            </Text>
            <ProgressBar ratio={stats.ratio} color={project.color} />
          </View>
        </Card>

        <View style={styles.section}>
          <SectionTitle>Tâches du projet</SectionTitle>
          {tasks.length === 0 ? (
            <EmptyState
              icon="file-tray-outline"
              title="Aucune tâche"
              message="Associez des tâches à ce projet depuis leur fiche."
            />
          ) : (
            <Card padded={false} style={styles.list}>
              {tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  project={project}
                  showDate
                  onToggle={() => actions.toggleTask(task.id)}
                  onPress={() => router.push(`/tache/${task.id}`)}
                />
              ))}
            </Card>
          )}
        </View>

        <Button label="Supprimer le projet" variant="danger" icon="trash-outline" onPress={confirmDelete} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.four, gap: Spacing.five },
  form: { gap: Spacing.four },
  statsText: { marginBottom: Spacing.two },
  section: { gap: Spacing.two },
  list: { paddingVertical: Spacing.one, paddingHorizontal: Spacing.one },
});
