import type { ReactNode } from 'react';
import { Platform, ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface ScreenProps {
  children: ReactNode;
  /** Ajoute un défilement vertical et l'espace nécessaire au-dessus de la barre d'onglets. */
  scroll?: boolean;
  /** Réserve la hauteur de la barre d'onglets en bas (écrans d'onglet uniquement). */
  withTabBar?: boolean;
  edges?: { top?: boolean };
  contentStyle?: ViewStyle;
}

export function Screen({
  children,
  scroll = false,
  withTabBar = false,
  edges,
  contentStyle,
}: ScreenProps) {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  // Sur le web, la barre d'onglets flotte en haut de la page : on lui laisse la place.
  const webTabBarInset = Platform.OS === 'web' && withTabBar ? 76 : 0;
  const paddingTop = (edges?.top === false ? 0 : insets.top) + webTabBarInset;
  const paddingBottom = (withTabBar ? BottomTabInset : 0) + Spacing.five;

  const inner = (
    <View style={[styles.content, contentStyle]}>
      <View style={styles.centered}>{children}</View>
    </View>
  );

  if (scroll) {
    return (
      <ScrollView
        style={[styles.flex, { backgroundColor: colors.background }]}
        contentContainerStyle={{ paddingTop, paddingBottom }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag">
        {inner}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.flex, { backgroundColor: colors.background, paddingTop, paddingBottom }]}>
      {inner}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flex: 1, alignItems: 'center' },
  centered: { width: '100%', maxWidth: MaxContentWidth, flex: 1 },
});
