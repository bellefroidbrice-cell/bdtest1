import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { DayView } from '@/components/day-view';
import { Fab } from '@/components/ui/fab';
import { Screen } from '@/components/ui/screen';
import { todayISO } from '@/lib/date';

export default function TodayScreen() {
  const router = useRouter();
  const today = todayISO();

  return (
    <View style={{ flex: 1 }}>
      <Screen scroll withTabBar>
        <DayView date={today} />
      </Screen>
      <Fab label="Tâche" onPress={() => router.push(`/tache/nouvelle?date=${today}`)} />
    </View>
  );
}
