import { Alert, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { SectionTitle } from '@/components/ui/section-title';
import { Text } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import { usePlanner } from '@/store/planner-store';

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statRow}>
      <Text variant="body" tone="secondary">
        {label}
      </Text>
      <Text variant="heading">{value}</Text>
    </View>
  );
}

export default function SettingsScreen() {
  const { state, actions } = usePlanner();

  const done = state.tasks.filter((task) => task.done).length;
  const steps = state.tasks.reduce((total, task) => total + task.steps.length, 0);
  const plannedDays = new Set(state.tasks.filter((task) => task.date).map((task) => task.date)).size;

  const confirm = (title: string, message: string, onConfirm: () => void) =>
    Alert.alert(title, message, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Continuer', style: 'destructive', onPress: onConfirm },
    ]);

  return (
    <Screen scroll edges={{ top: false }}>
      <View style={styles.container}>
        <View style={styles.section}>
          <SectionTitle>Vue d&apos;ensemble</SectionTitle>
          <Card style={styles.stats}>
            <StatRow label="Tâches" value={`${state.tasks.length}`} />
            <StatRow label="Terminées" value={`${done}`} />
            <StatRow label="Étapes créées" value={`${steps}`} />
            <StatRow label="Journées planifiées" value={`${plannedDays}`} />
            <StatRow label="Projets" value={`${state.projects.length}`} />
          </Card>
        </View>

        <View style={styles.section}>
          <SectionTitle>Données</SectionTitle>
          <Card style={styles.actions}>
            <Text variant="body" tone="secondary">
              Tout est enregistré sur cet appareil : l&apos;application fonctionne hors ligne et
              aucune donnée n&apos;est envoyée sur Internet.
            </Text>
            <Button
              label="Recharger l'exemple"
              variant="secondary"
              icon="refresh"
              onPress={() =>
                confirm(
                  "Recharger l'exemple ?",
                  'Vos tâches et projets actuels seront remplacés par le contenu de démonstration.',
                  actions.resetToExample
                )
              }
            />
            <Button
              label="Tout effacer"
              variant="danger"
              icon="trash-outline"
              onPress={() =>
                confirm(
                  'Tout effacer ?',
                  'Toutes les tâches, étapes et projets seront définitivement supprimés.',
                  actions.eraseEverything
                )
              }
            />
          </Card>
        </View>

        <Text variant="caption" tone="muted">
          Cadence · organisation, plannings et déroulé de journée.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.four, gap: Spacing.five },
  section: { gap: Spacing.two },
  stats: { gap: Spacing.three },
  statRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  actions: { gap: Spacing.three },
});
