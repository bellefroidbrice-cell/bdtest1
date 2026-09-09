import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { DatePicker, DurationPicker, PriorityPicker, ProjectPicker, TimePicker } from '@/components/pickers';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { clampStart, snapToSlot } from '@/lib/agenda';
import { todayISO, type ISODate } from '@/lib/date';
import { usePlanner } from '@/store/planner-store';
import type { Priority } from '@/store/types';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export default function NewTaskScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ date?: string; start?: string }>();
  const { state, actions } = usePlanner();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState<ISODate | null>(
    params.date && ISO_DATE.test(params.date) ? params.date : todayISO()
  );
  // `start` est renseigné quand la tâche est créée depuis un créneau de l'agenda.
  const [startMinutes, setStartMinutes] = useState<number | null>(() => {
    const parsed = Number(params.start);
    return Number.isFinite(parsed) ? snapToSlot(clampStart(parsed)) : null;
  });
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [priority, setPriority] = useState<Priority>('normale');
  const [projectId, setProjectId] = useState<string | null>(null);

  const create = () => {
    if (!title.trim()) return;
    actions.createTask({ title, date, startMinutes, durationMinutes, priority, projectId });
    router.back();
  };

  return (
    <Screen scroll edges={{ top: false }}>
      <View style={styles.container}>
        <Field
          label="Que faut-il faire ?"
          value={title}
          onChangeText={setTitle}
          placeholder="Préparer la réunion de lundi"
          autoFocus
          returnKeyType="done"
          onSubmitEditing={create}
        />

        <Card style={styles.pickers}>
          <DatePicker value={date} onChange={setDate} />
          <TimePicker value={startMinutes} onChange={setStartMinutes} />
          {startMinutes !== null && (
            <DurationPicker value={durationMinutes} onChange={setDurationMinutes} />
          )}
          <PriorityPicker value={priority} onChange={setPriority} />
          <ProjectPicker projects={state.projects} value={projectId} onChange={setProjectId} />
        </Card>

        <View style={styles.actions}>
          <Button label="Créer la tâche" icon="add" onPress={create} disabled={!title.trim()} />
          <Button label="Annuler" variant="ghost" onPress={() => router.back()} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.four, gap: Spacing.four },
  pickers: { gap: Spacing.four },
  actions: { gap: Spacing.two },
});
