import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { MonthGrid } from '@/components/month-grid';
import { Chip } from '@/components/ui/chip';
import { IconButton } from '@/components/ui/icon-button';
import { Sheet } from '@/components/ui/sheet';
import { Text } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import { clampStart, SLOT_MINUTES, snapToSlot } from '@/lib/agenda';
import {
  addDays,
  addMonths,
  formatDuration,
  formatMonthYear,
  formatShort,
  formatTime,
  todayISO,
  type ISODate,
} from '@/lib/date';
import type { Priority, Project } from '@/store/types';

function PickerRow({
  label,
  right,
  children,
}: {
  label: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowHeader}>
        <Text variant="label" tone="secondary">
          {label}
        </Text>
        {right}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}>
        {children}
      </ScrollView>
    </View>
  );
}

export function DatePicker({
  value,
  onChange,
  label = 'Date',
}: {
  value: ISODate | null;
  onChange: (value: ISODate | null) => void;
  label?: string;
}) {
  const today = todayISO();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [month, setMonth] = useState<ISODate>(value ?? today);

  const quick: { label: string; value: ISODate | null }[] = [
    { label: 'Sans date', value: null },
    { label: "Aujourd'hui", value: today },
    { label: 'Demain', value: addDays(today, 1) },
    { label: formatShort(addDays(today, 2)), value: addDays(today, 2) },
  ];
  const isCustom = value !== null && !quick.some((option) => option.value === value);

  return (
    <>
      <PickerRow label={label}>
        {quick.map((option) => (
          <Chip
            key={option.label}
            label={option.label}
            selected={value === option.value}
            onPress={() => onChange(option.value)}
          />
        ))}
        <Chip
          label={isCustom && value ? formatShort(value) : 'Choisir…'}
          selected={isCustom}
          onPress={() => {
            setMonth(value ?? today);
            setSheetOpen(true);
          }}
        />
      </PickerRow>

      <Sheet visible={sheetOpen} title="Choisir une date" onClose={() => setSheetOpen(false)}>
        <View style={styles.monthHeader}>
          <IconButton
            name="chevron-back"
            label="Mois précédent"
            onPress={() => setMonth(addMonths(month, -1))}
          />
          <Text variant="heading">{formatMonthYear(month)}</Text>
          <IconButton
            name="chevron-forward"
            label="Mois suivant"
            onPress={() => setMonth(addMonths(month, 1))}
          />
        </View>
        <MonthGrid
          month={month}
          selected={value ?? today}
          today={today}
          summaries={{}}
          compact
          onSelect={(date) => {
            onChange(date);
            setSheetOpen(false);
          }}
        />
      </Sheet>
    </>
  );
}

/** Tous les créneaux de la journée, par tranches de 15 minutes. */
function timeSlots(): number[] {
  const slots: number[] = [];
  for (let minutes = 0; minutes <= 23 * 60 + 45; minutes += SLOT_MINUTES) slots.push(minutes);
  return slots;
}

/** Valeur courante, ajustable par pas de 15 minutes. */
function Stepper({
  value,
  onStep,
  unit,
}: {
  value: string;
  onStep: (delta: number) => void;
  unit: string;
}) {
  return (
    <View style={styles.stepper}>
      <Text variant="label">{value}</Text>
      <IconButton
        name="remove"
        label={`${unit} : 15 minutes de moins`}
        size={18}
        onPress={() => onStep(-SLOT_MINUTES)}
      />
      <IconButton
        name="add"
        label={`${unit} : 15 minutes de plus`}
        size={18}
        onPress={() => onStep(SLOT_MINUTES)}
      />
    </View>
  );
}

export function TimePicker({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (value: number | null) => void;
}) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const quick = [8 * 60, 9 * 60, 12 * 60, 14 * 60];
  const isCustom = value !== null && !quick.includes(value);

  return (
    <>
      <PickerRow
        label="Heure de début"
        right={
          value !== null ? (
            <Stepper
              value={formatTime(value)}
              unit="Heure de début"
              onStep={(delta) => onChange(clampStart(value + delta))}
            />
          ) : undefined
        }>
        <Chip label="Sans horaire" selected={value === null} onPress={() => onChange(null)} />
        {/* Un horaire choisi hors des propositions reste visible en tête de rangée. */}
        {isCustom && value !== null && (
          <Chip label={formatTime(value)} selected onPress={() => setSheetOpen(true)} />
        )}
        {quick.map((minutes) => (
          <Chip
            key={minutes}
            label={formatTime(minutes)}
            selected={value === minutes}
            onPress={() => onChange(minutes)}
          />
        ))}
        <Chip label="Autre…" onPress={() => setSheetOpen(true)} />
      </PickerRow>

      <Sheet visible={sheetOpen} title="Choisir une heure" onClose={() => setSheetOpen(false)}>
        <ScrollView style={styles.slots} contentContainerStyle={styles.slotsContent}>
          {timeSlots().map((minutes) => (
            <Chip
              key={minutes}
              label={formatTime(minutes)}
              selected={value === minutes}
              onPress={() => {
                onChange(snapToSlot(minutes));
                setSheetOpen(false);
              }}
            />
          ))}
        </ScrollView>
      </Sheet>
    </>
  );
}

export function DurationPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const step = (delta: number) =>
    onChange(Math.max(SLOT_MINUTES, Math.min(12 * 60, value + delta)));

  return (
    <PickerRow
      label="Durée"
      right={<Stepper value={formatDuration(value)} unit="Durée" onStep={step} />}>
      {[15, 30, 45, 60, 90, 120].map((minutes) => (
        <Chip
          key={minutes}
          label={formatDuration(minutes)}
          selected={value === minutes}
          onPress={() => onChange(minutes)}
        />
      ))}
    </PickerRow>
  );
}

export function PriorityPicker({
  value,
  onChange,
}: {
  value: Priority;
  onChange: (value: Priority) => void;
}) {
  const options: Priority[] = ['basse', 'normale', 'haute'];
  return (
    <PickerRow label="Priorité">
      {options.map((option) => (
        <Chip
          key={option}
          label={option.charAt(0).toUpperCase() + option.slice(1)}
          selected={value === option}
          onPress={() => onChange(option)}
        />
      ))}
    </PickerRow>
  );
}

export function ProjectPicker({
  projects,
  value,
  onChange,
}: {
  projects: Project[];
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  return (
    <PickerRow label="Projet">
      <Chip label="Aucun" selected={value === null} onPress={() => onChange(null)} />
      {projects.map((project) => (
        <Chip
          key={project.id}
          label={project.name}
          dotColor={project.color}
          selected={value === project.id}
          onPress={() => onChange(project.id)}
        />
      ))}
    </PickerRow>
  );
}

const styles = StyleSheet.create({
  row: { gap: Spacing.two },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 34,
  },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  chips: { flexDirection: 'row', gap: Spacing.two, paddingRight: Spacing.four },
  monthHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  slots: { maxHeight: 320 },
  slotsContent: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
});
