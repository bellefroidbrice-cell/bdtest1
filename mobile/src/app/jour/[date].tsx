import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { DayView } from '@/components/day-view';
import { Fab } from '@/components/ui/fab';
import { IconButton } from '@/components/ui/icon-button';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import { addDays, formatRelativeDay, todayISO } from '@/lib/date';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export default function DayScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ date?: string }>();
  const initial = params.date && ISO_DATE.test(params.date) ? params.date : todayISO();
  const [date, setDate] = useState(initial);

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ title: formatRelativeDay(date) }} />
      <Screen scroll edges={{ top: false }}>
        <View style={styles.nav}>
          <IconButton
            name="chevron-back"
            label="Jour précédent"
            onPress={() => setDate(addDays(date, -1))}
          />
          <Text variant="label" tone="secondary">
            Naviguer d&apos;un jour à l&apos;autre
          </Text>
          <IconButton
            name="chevron-forward"
            label="Jour suivant"
            onPress={() => setDate(addDays(date, 1))}
          />
        </View>
        <DayView date={date} />
      </Screen>
      <Fab
        label="Tâche"
        withTabBar={false}
        onPress={() => router.push(`/tache/nouvelle?date=${date}`)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
});
