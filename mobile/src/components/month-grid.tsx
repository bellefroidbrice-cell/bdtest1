import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { isSameMonth, monthMatrix, parseISO, WEEKDAY_INITIALS, type ISODate } from '@/lib/date';
import type { DaySummary } from '@/store/selectors';

interface MonthGridProps {
  /** N'importe quelle date du mois affiché. */
  month: ISODate;
  selected: ISODate;
  today: ISODate;
  summaries: Record<ISODate, DaySummary>;
  onSelect: (date: ISODate) => void;
  /** Masque les pastilles de couleur (sélecteur de date compact). */
  compact?: boolean;
}

export function MonthGrid({
  month,
  selected,
  today,
  summaries,
  onSelect,
  compact = false,
}: MonthGridProps) {
  const colors = useTheme();
  const weeks = monthMatrix(month);

  return (
    <View style={styles.grid}>
      <View style={styles.week}>
        {WEEKDAY_INITIALS.map((initial, index) => (
          <View key={`${initial}-${index}`} style={styles.cell}>
            <Text variant="caption" tone="muted">
              {initial}
            </Text>
          </View>
        ))}
      </View>

      {weeks.map((week) => (
        <View key={week[0]} style={styles.week}>
          {week.map((date) => {
            const summary = summaries[date];
            const isSelected = date === selected;
            const isToday = date === today;
            const outside = !isSameMonth(date, month);
            const allDone = summary ? summary.done === summary.total : false;

            return (
              <Pressable
                key={date}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`${parseISO(date).getDate()}, ${
                  summary ? `${summary.total} tâche(s)` : 'aucune tâche'
                }`}
                onPress={() => onSelect(date)}
                style={styles.cell}>
                <View
                  style={[
                    styles.dayCircle,
                    isSelected && { backgroundColor: colors.accent },
                    !isSelected && isToday && { backgroundColor: colors.accentSoft },
                  ]}>
                  <Text
                    variant="label"
                    style={{
                      color: isSelected
                        ? colors.onAccent
                        : outside
                          ? colors.textMuted
                          : isToday
                            ? colors.accent
                            : colors.text,
                    }}>
                    {parseISO(date).getDate()}
                  </Text>
                </View>

                {!compact && (
                  <View style={styles.dots}>
                    {summary
                      ? (summary.colors.length > 0 ? summary.colors : [colors.textMuted])
                          .slice(0, 3)
                          .map((color, index) => (
                            <View
                              key={`${date}-${index}`}
                              style={[
                                styles.dot,
                                { backgroundColor: color, opacity: allDone ? 0.35 : 1 },
                              ]}
                            />
                          ))
                      : null}
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { gap: Spacing.one },
  week: { flexDirection: 'row' },
  cell: { flex: 1, alignItems: 'center', paddingVertical: Spacing.half, gap: 2 },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: { flexDirection: 'row', gap: 3, height: 5, alignItems: 'center' },
  dot: { width: 4, height: 4, borderRadius: 2 },
});
