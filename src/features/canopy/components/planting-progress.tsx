import { Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Image } from '@/components/image';
import { ProgressBar } from '@/features/canopy/components/progress-bar';

interface PlantingProgressProps {
  planted: number;
  goal: number;
  caption: string;
}

export function PlantingProgress({ planted, goal, caption }: PlantingProgressProps) {
  const ratio = goal === 0 ? 0 : planted / goal;
  return (
    <View className="flex-row items-center gap-3 overflow-hidden rounded-2xl bg-mint p-4">
      <View className="size-11 items-center justify-center rounded-full bg-forest">
        <Icon name="leaf" size={20} colorClassName="accent-sage" />
      </View>
      <View className="flex-1 gap-1.5">
        <Text className="text-caption text-ink-soft">{caption}</Text>
        <Text className="font-title text-lg text-forest">
          {planted} of {goal}
        </Text>
        <View className="flex-row items-center gap-2">
          <ProgressBar value={ratio} />
          <Text className="text-caption font-semibold text-forest">{Math.round(ratio * 100)}%</Text>
        </View>
      </View>
      <Image
        source={require('@/assets/images/canopy/sprig-small.png')}
        className="size-8"
        contentFit="contain"
      />
    </View>
  );
}
