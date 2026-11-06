import { Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Pressable } from '@/components/pressable';
import { taskStyle } from '@/features/canopy/components/task-style';
import type { ScheduledTask, TaskType } from '@/features/canopy/types/canopy';
import { addDays, monthTitle, toKey, todayKey } from '@/features/canopy/utils/schedule';
import { cn } from '@/lib/cn';

interface CareCalendarProps {
  month: Date;
  tasks: ScheduledTask[];
  selected: string;
  onSelect: (key: string) => void;
  onShift: (delta: number) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const buildWeeks = (month: Date) => {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const start = addDays(first, -first.getDay());
  const weeks: Date[][] = [];
  for (let w = 0; w < 6; w += 1) {
    const week = Array.from({ length: 7 }, (_, d) => addDays(start, w * 7 + d));
    if (w > 3 && week[0].getMonth() !== month.getMonth()) break;
    weeks.push(week);
  }
  return weeks;
};

export function CareCalendar({ month, tasks, selected, onSelect, onShift }: CareCalendarProps) {
  const byDay = new Map<string, Set<TaskType>>();
  tasks.forEach((t) => {
    const set = byDay.get(t.date) ?? new Set<TaskType>();
    set.add(t.type);
    byDay.set(t.date, set);
  });
  const today = todayKey();

  return (
    <View className="flex-1 gap-2 rounded-2xl border border-border bg-white p-3">
      <View className="flex-row items-center justify-between">
        <Text className="font-title text-base text-forest">{monthTitle(month)}</Text>
        <View className="flex-row gap-1">
          <Pressable onPress={() => onShift(-1)} accessibilityRole="button" accessibilityLabel="Previous month">
            <View className="size-7 items-center justify-center rounded-full bg-mint">
              <Icon name="caret-back" size={13} colorClassName="accent-forest" />
            </View>
          </Pressable>
          <Pressable onPress={() => onShift(1)} accessibilityRole="button" accessibilityLabel="Next month">
            <View className="size-7 items-center justify-center rounded-full bg-mint">
              <Icon name="caret-forward" size={13} colorClassName="accent-forest" />
            </View>
          </Pressable>
        </View>
      </View>
      <View className="flex-row">
        {WEEKDAYS.map((d) => (
          <Text key={d} className="flex-1 text-center text-3xs font-semibold text-muted">
            {d}
          </Text>
        ))}
      </View>
      {buildWeeks(month).map((week) => (
        <View key={toKey(week[0])} className="flex-row">
          {week.map((day) => {
            const key = toKey(day);
            const inMonth = day.getMonth() === month.getMonth();
            const isToday = key === today;
            const isSelected = key === selected;
            const types = [...(byDay.get(key) ?? [])];
            return (
              <Pressable
                key={key}
                className="flex-1"
                onPress={() => onSelect(key)}
                accessibilityRole="button"
                accessibilityLabel={day.toDateString()}
              >
                <View className="items-center gap-0.5 py-0.5">
                  <View
                    className={cn(
                      'size-6 items-center justify-center rounded-full',
                      isToday ? 'bg-forest' : null,
                      isSelected && !isToday ? 'border border-leaf' : null,
                    )}
                  >
                    <Text
                      className={cn(
                        'text-2xs',
                        isToday ? 'font-bold text-white' : 'text-forest',
                        inMonth ? null : 'opacity-30',
                      )}
                    >
                      {day.getDate()}
                    </Text>
                  </View>
                  <View className="h-1 flex-row gap-0.5">
                    {types.map((t) => (
                      <View key={t} className={cn('size-1 rounded-full', taskStyle[t].dot)} />
                    ))}
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}
