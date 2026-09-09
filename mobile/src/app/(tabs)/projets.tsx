import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Fab } from '@/components/ui/fab';
import { IconButton } from '@/components/ui/icon-button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import { usePlanner } from '@/store/planner-store';
import { projectStats } from '@/store/selectors';

export default function ProjectsScreen() {
  const router = useRouter();
  const { state } = usePlanner();

  const unassigned = state.tasks.filter((task) => task.projectId === null);
  const unassignedDone = unassigned.filter((task) => task.done).length;

  return (
    <View style={{ flex: 1 }}>
      <Screen scroll withTabBar>
        <View style={styles.container}>
          <View style={styles.titleRow}>
            <Text variant="display">Projets</Text>
            <IconButton name="settings-outline" label="Réglages" onPress={() => router.push('/reglages')} />
          </View>

          {state.projects.length === 0 && (
            <EmptyState
              icon="folder-open-outline"
              title="Aucun projet"
              message="Les projets permettent de regrouper vos tâches par couleur."
            />
          )}

          {state.projects.map((project) => {
            const stats = projectStats(state.tasks, project.id);
            return (
              <Pressable
                key={project.id}
                accessibilityRole="button"
                accessibilityLabel={project.name}
                onPress={() => router.push(`/projet/${project.id}`)}
                style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}>
                <Card>
                  <View style={styles.cardHeader}>
                    <View style={styles.nameRow}>
                      <View style={[styles.dot, { backgroundColor: project.color }]} />
                      <Text variant="heading">{project.name}</Text>
                    </View>
                    <Text variant="caption" tone="muted">
                      {stats.total === 0
                        ? 'Aucune tâche'
                        : `${stats.done}/${stats.total} terminées`}
                    </Text>
                  </View>
                  <View style={styles.progress}>
                    <ProgressBar ratio={stats.ratio} color={project.color} />
                  </View>
                </Card>
              </Pressable>
            );
          })}

          {unassigned.length > 0 && (
            <Card>
              <View style={styles.cardHeader}>
                <Text variant="heading" tone="secondary">
                  Sans projet
                </Text>
                <Text variant="caption" tone="muted">
                  {unassignedDone}/{unassigned.length} terminées
                </Text>
              </View>
            </Card>
          )}
        </View>
      </Screen>
      <Fab label="Projet" onPress={() => router.push('/projet/nouveau')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.four, gap: Spacing.three },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.one,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, flexShrink: 1 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  progress: { marginTop: Spacing.three },
});
