import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/** Retour haptique léger ; sans effet sur le web ou si l'appareil ne le gère pas. */
export function tapFeedback() {
  if (Platform.OS === 'web') return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

export function successFeedback() {
  if (Platform.OS === 'web') return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}
