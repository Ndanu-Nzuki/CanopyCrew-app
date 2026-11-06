import { Text, View } from 'react-native';

import { Image } from '@/components/image';
import { taskStyle } from '@/features/canopy/components/task-style';
import type { TaskType } from '@/features/canopy/types/canopy';

const TYPES: TaskType[] = ['watering', 'mulching', 'compost', 'pruning'];

export function TaskLegend() {
  return (
    <View className="w-28 justify-between gap-3 rounded-2xl bg-mint p-3">
      <View className="gap-2">
        <Text className="text-3xs font-semibold uppercase tracking-widest text-leaf">Tasks</Text>
        {TYPES.map((t) => (
          <View key={t} className="flex-row items-center gap-2">
            <View className={`size-2 rounded-full ${taskStyle[t].dot}`} />
            <Text className="text-2xs text-forest">{taskStyle[t].label}</Text>
          </View>
        ))}
      </View>
      <View className="h-px bg-border" />
      <Text className="text-2xs leading-snug text-ink-soft">Consistent care helps your plants thrive!</Text>
      <Image
        source={require('@/assets/images/canopy/leaf-buddy.png')}
        className="h-16 w-full"
        contentFit="contain"
      />
    </View>
  );
}
