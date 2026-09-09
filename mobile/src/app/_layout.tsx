import { DarkTheme, DefaultTheme, Stack, ThemeProvider, type Theme } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';
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
    <Stack screenOptions={{ headerShadowVisible: false, headerTitleStyle: { fontSize: 17, fontWeight: '600' } }}>
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
  const scheme = useColorScheme();
  const colors = useTheme();

  // Les en-têtes de navigation reprennent exactement la palette de l'application.
  const navigationTheme: Theme = {
    ...(scheme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(scheme === 'dark' ? DarkTheme : DefaultTheme).colors,
      background: colors.background,
      card: colors.background,
      text: colors.text,
      border: colors.border,
      primary: colors.accent,
      notification: colors.danger,
    },
  };

  return (
    <PlannerProvider>
      <ThemeProvider value={navigationTheme}>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        <RootNavigator />
      </ThemeProvider>
    </PlannerProvider>
  );
}
