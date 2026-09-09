import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ColorPicker } from '@/components/color-picker';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Screen } from '@/components/ui/screen';
import { ProjectColors, Spacing } from '@/constants/theme';
import { usePlanner } from '@/store/planner-store';

export default function NewProjectScreen() {
  const router = useRouter();
  const { state, actions } = usePlanner();
  const [name, setName] = useState('');
  // On propose une couleur encore inutilisée pour distinguer les projets d'un coup d'œil.
  const [color, setColor] = useState<string>(
    ProjectColors.find((candidate) => !state.projects.some((p) => p.color === candidate)) ??
      ProjectColors[0]
  );

  const create = () => {
    if (!name.trim()) return;
    actions.createProject(name, color);
    router.back();
  };

  return (
    <Screen scroll edges={{ top: false }}>
      <View style={styles.container}>
        <Field
          label="Nom du projet"
          value={name}
          onChangeText={setName}
          placeholder="Travail, Maison, Sport…"
          autoFocus
          returnKeyType="done"
          onSubmitEditing={create}
        />
        <Card>
          <ColorPicker value={color} onChange={setColor} />
        </Card>
        <View style={styles.actions}>
          <Button label="Créer le projet" icon="add" onPress={create} disabled={!name.trim()} />
          <Button label="Annuler" variant="ghost" onPress={() => router.back()} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.four, gap: Spacing.four },
  actions: { gap: Spacing.two },
});
