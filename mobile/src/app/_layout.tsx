import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { PlannerProvider, usePlanner } from '@/store/planner-store';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { hydrated } = usePlanner();

  useEffect(() => {
    if (hydrated) SplashScreen.hideAsync();
  }, [hydrated]);

  // L'écran de démarrage reste affiché tant que les données ne sont pas relues.
  if (!hydrated) return null;

  return (
    <Stack screenOptions={{ headerShadowVisible: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="jour/[date]" options={{ title: 'Journée' }} />
      <Stack.Screen name="tache/[id]" options={{ title: 'Tâche' }} />
      <Stack.Screen
        name="tache/nouvelle"
        options={{ title: 'Nouvelle tâche', presentation: 'modal' }}
      />
      <Stack.Screen name="projet/[id]" options={{ title: 'Projet' }} />
      <Stack.Screen
        name="projet/nouveau"
        options={{ title: 'Nouveau projet', presentation: 'modal' }}
      />
      <Stack.Screen name="reglages" options={{ title: 'Réglages' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <PlannerProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <StatusBar style="auto" />
        <RootNavigator />
      </ThemeProvider>
    </PlannerProvider>
  );
}
