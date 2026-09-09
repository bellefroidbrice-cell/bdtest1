import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, TextInput, View } from 'react-native';

import { DatePicker, DurationPicker, PriorityPicker, ProjectPicker, TimePicker } from '@/components/pickers';
import { StepRow } from '@/components/step-row';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Field } from '@/components/ui/field';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Screen } from '@/components/ui/screen';
import { SectionTitle } from '@/components/ui/section-title';
import { Text } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { addDays, formatLong, todayISO } from '@/lib/date';
import { usePlanner } from '@/store/planner-store';
import { findProject, stepProgress } from '@/store/selectors';

export default function TaskScreen() {
  const router = useRouter();
  const colors = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, actions } = usePlanner();
  const [newStep, setNewStep] = useState('');

  const task = state.tasks.find((candidate) => candidate.id === id);

  if (!task) {
    return (
      <Screen edges={{ top: false }}>
        <EmptyState
          icon="alert-circle-outline"
          title="Tâche introuvable"
          message="Elle a peut-être été supprimée."
        />
      </Screen>
    );
  }

  const project = findProject(state.projects, task.projectId);
  const steps = stepProgress(task);

  const addStep = () => {
    if (!newStep.trim()) return;
    actions.addStep(task.id, newStep);
    setNewStep('');
  };

  const confirmDelete = () => {
    Alert.alert('Supprimer la tâche ?', `« ${task.title} » sera définitivement supprimée.`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: () => {
          actions.deleteTask(task.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <Screen scroll edges={{ top: false }}>
      <Stack.Screen options={{ title: task.done ? 'Tâche terminée' : 'Tâche' }} />

      <View style={styles.container}>
        <Card>
          <TextInput
            value={task.title}
            onChangeText={(title) => actions.updateTask(task.id, { title })}
            placeholder="Titre de la tâche"
            placeholderTextColor={colors.textMuted}
            multiline
            style={[styles.title, { color: colors.text }]}
          />
          {task.date && (
            <Text variant="caption" tone="muted">
              {formatLong(task.date)}
            </Text>
          )}
          <Button
            label={task.done ? 'Rouvrir la tâche' : 'Marquer comme terminée'}
            icon={task.done ? 'refresh' : 'checkmark'}
            variant={task.done ? 'secondary' : 'primary'}
            onPress={() => actions.toggleTask(task.id)}
            style={styles.mainAction}
          />
        </Card>

        <View style={styles.section}>
          <SectionTitle
            right={
              steps ? (
                <Text variant="caption" tone={steps.done === steps.total ? 'success' : 'muted'}>
                  {steps.done}/{steps.total}
                </Text>
              ) : undefined
            }>
            Étapes
          </SectionTitle>

          <Card>
            {steps && (
              <View style={styles.stepsProgress}>
                <ProgressBar ratio={steps.done / steps.total} color={project?.color} />
              </View>
            )}

            {task.steps.length === 0 && (
              <Text variant="body" tone="muted" style={styles.stepsHint}>
                Découpez la tâche en étapes pour suivre son déroulé.
              </Text>
            )}

            {task.steps.map((step) => (
              <StepRow
                key={step.id}
                step={step}
                onToggle={() => actions.toggleStep(task.id, step.id)}
                onRename={(label) => actions.renameStep(task.id, step.id, label)}
                onDelete={() => actions.deleteStep(task.id, step.id)}
              />
            ))}

            <View style={styles.addStep}>
              <TextInput
                value={newStep}
                onChangeText={setNewStep}
                onSubmitEditing={addStep}
                placeholder="Ajouter une étape…"
                placeholderTextColor={colors.textMuted}
                returnKeyType="done"
                style={[styles.addStepInput, { color: colors.text, borderColor: colors.border }]}
              />
              <Button label="Ajouter" variant="secondary" onPress={addStep} disabled={!newStep.trim()} />
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <SectionTitle>Planification</SectionTitle>
          <Card style={styles.pickers}>
            <DatePicker
              value={task.date}
              onChange={(date) => actions.updateTask(task.id, { date })}
            />
            <TimePicker
              value={task.startMinutes}
              onChange={(startMinutes) => actions.updateTask(task.id, { startMinutes })}
            />
            {task.startMinutes !== null && (
              <DurationPicker
                value={task.durationMinutes}
                onChange={(durationMinutes) => actions.updateTask(task.id, { durationMinutes })}
              />
            )}
            <PriorityPicker
              value={task.priority}
              onChange={(priority) => actions.updateTask(task.id, { priority })}
            />
            <ProjectPicker
              projects={state.projects}
              value={task.projectId}
              onChange={(projectId) => actions.updateTask(task.id, { projectId })}
            />
          </Card>
        </View>

        <View style={styles.section}>
          <SectionTitle>Notes</SectionTitle>
          <Card>
            <Field
              value={task.notes}
              onChangeText={(notes) => actions.updateTask(task.id, { notes })}
              placeholder="Contexte, liens, points d'attention…"
              multiline
            />
          </Card>
        </View>

        <View style={styles.actions}>
          <Button
            label="Reporter à demain"
            variant="ghost"
            icon="arrow-forward-circle-outline"
            onPress={() =>
              actions.updateTask(task.id, { date: addDays(task.date ?? todayISO(), 1) })
            }
          />
          <Button label="Supprimer" variant="danger" icon="trash-outline" onPress={confirmDelete} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.four, gap: Spacing.five },
  title: { fontSize: 22, lineHeight: 28, fontWeight: '700', padding: 0, marginBottom: Spacing.two },
  mainAction: { marginTop: Spacing.four },
  section: { gap: Spacing.two },
  stepsProgress: { marginBottom: Spacing.three },
  stepsHint: { paddingVertical: Spacing.two },
  addStep: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginTop: Spacing.three },
  addStepInput: {
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: Spacing.two,
    fontSize: 15,
  },
  pickers: { gap: Spacing.four },
  actions: { gap: Spacing.two },
});
