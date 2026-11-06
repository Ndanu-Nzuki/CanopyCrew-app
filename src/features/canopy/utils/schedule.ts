import type { ScheduledTask, Species, TaskType } from '@/features/canopy/types/canopy';
import { commonName } from '@/features/canopy/utils/catalogue';

const MONTHS = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
];

export const toKey = (d: Date) => {
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
};

export const fromKey = (key: string) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const addDays = (d: Date, n: number) => {
  const next = new Date(d);
  next.setDate(next.getDate() + n);
  return next;
};

export const todayKey = () => toKey(new Date());

const initialOffsets = (frequency: string, index: number) => {
  const f = frequency.toLowerCase();
  if (f.includes('every 3 days')) return [0, 3, 6, 9, 12, 15, 18, 21, 24, 27];
  if (f.includes('once weekly')) return [0, 7, 14, 21];
  if (f.includes('biweekly')) return [7, 21];
  if (f.includes('twice weekly')) return [0, 3, 7, 10, 14, 17, 21, 24];
  return index === 0 ? [0, 7, 14, 21] : [14];
};

const classify = (task: string, fallback: TaskType): TaskType => {
  const t = task.toLowerCase();
  if (t.includes('prun')) return 'pruning';
  if (t.includes('water') || t.includes('irrigat')) return 'watering';
  if (t.includes('compost') || t.includes('weed') || t.includes('fertil')) return 'compost';
  if (t.includes('mulch') || t.includes('stake') || t.includes('tie')) return 'mulching';
  return fallback;
};

interface RawTask {
  type: TaskType;
  plantID: string;
  plantName: string;
  date: string;
  notes: string;
}

const annualDates = (frequency: string, start: Date) => {
  const f = frequency.toLowerCase();
  const month = MONTHS.findIndex((m) => f.includes(m));
  const target = month === -1 ? start.getMonth() + 6 : month;
  const dates: Date[] = [];
  for (let year = start.getFullYear(); dates.length < 2; year += 1) {
    const candidate = new Date(year, target, 15);
    if (candidate > start) dates.push(candidate);
  }
  return dates;
};

const rawTasksFor = (plant: Species, start: Date) => {
  const name = commonName(plant);
  const out: RawTask[] = [];
  const care = plant.volunteer_care_schedule;
  care.initial_month.forEach((t, i) => {
    const type = classify(t.task, i === 0 ? 'watering' : 'mulching');
    initialOffsets(t.frequency, i).forEach((offset) => {
      out.push({ type, plantID: plant.species_id, plantName: name, date: toKey(addDays(start, offset)), notes: t.task });
    });
  });
  out.push({
    type: 'mulching',
    plantID: plant.species_id,
    plantName: name,
    date: toKey(addDays(start, 5)),
    notes: 'Spread a 5–8 cm organic mulch ring, kept clear of the stem.',
  });
  care.maintenance_quarterly.forEach((t) => {
    [30, 120, 210, 300].forEach((offset) => {
      out.push({ type: classify(t.task, 'compost'), plantID: plant.species_id, plantName: name, date: toKey(addDays(start, offset)), notes: t.task });
    });
    [60, 150, 240, 330].forEach((offset) => {
      out.push({ type: 'mulching', plantID: plant.species_id, plantName: name, date: toKey(addDays(start, offset)), notes: 'Top up the mulch ring and check soil moisture.' });
    });
  });
  care.annual.forEach((t) => {
    annualDates(t.frequency, start).forEach((d) => {
      out.push({ type: classify(t.task, 'pruning'), plantID: plant.species_id, plantName: name, date: toKey(d), notes: t.task });
    });
  });
  return out;
};

const verbs: Record<TaskType, string> = {
  watering: 'Water',
  mulching: 'Mulch',
  compost: 'Compost & weed',
  pruning: 'Prune',
};

export const buildSchedule = (plants: Species[], startKey: string | null): ScheduledTask[] => {
  if (startKey === null || plants.length === 0) return [];
  const start = fromKey(startKey);
  const groups = new Map<string, RawTask[]>();
  plants.flatMap((p) => rawTasksFor(p, start)).forEach((t) => {
    const id = `${t.type}-${t.date}`;
    groups.set(id, [...(groups.get(id) ?? []), t]);
  });
  return [...groups.entries()]
    .map(([id, items]) => {
      const first = items[0];
      const names = items.map((i) => i.plantName);
      const title =
        items.length === 1
          ? `${verbs[first.type]} the ${first.plantName}`
          : `${verbs[first.type]} ${items.length} new plantings`;
      return {
        id,
        type: first.type,
        title,
        notes: items.length === 1 ? first.notes : names.join(', '),
        plantID: first.plantID,
        plantName: names.join(', '),
        date: first.date,
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date) || a.type.localeCompare(b.type));
};

export const weekRange = (ref: Date) => {
  const start = addDays(ref, -ref.getDay());
  return { start: toKey(start), end: toKey(addDays(start, 6)) };
};

export const formatDue = (key: string) =>
  fromKey(key).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

export const monthTitle = (d: Date) =>
  d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
