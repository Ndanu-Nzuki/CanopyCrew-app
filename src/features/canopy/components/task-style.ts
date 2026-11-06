import type { TaskType } from '@/features/canopy/types/canopy';

export const taskStyle: Record<
  TaskType,
  { label: string; icon: 'water' | 'leaf' | 'clipboard' | 'cut'; dot: string; color: string }
> = {
  watering: { label: 'Watering', icon: 'water', dot: 'bg-water', color: 'accent-water' },
  mulching: { label: 'Mulching', icon: 'leaf', dot: 'bg-mulch', color: 'accent-mulch' },
  compost: { label: 'Compost', icon: 'clipboard', dot: 'bg-compost', color: 'accent-compost' },
  pruning: { label: 'Pruning', icon: 'cut', dot: 'bg-prune', color: 'accent-prune' },
};
