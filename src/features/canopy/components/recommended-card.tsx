import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Image } from '@/components/image';
import { Pressable } from '@/components/pressable';
import type { Species } from '@/features/canopy/types/canopy';
import { commonName, speciesImage, sunSummary } from '@/features/canopy/utils/catalogue';
import { cn } from '@/lib/cn';

interface RecommendedCardProps {
  plant: Species;
  chosen: boolean;
  onToggle: () => void;
}

export function RecommendedCard({ plant, chosen, onToggle }: RecommendedCardProps) {
  const router = useRouter();
  return (
    <View className="w-32 overflow-hidden rounded-xl border border-border bg-white">
      <Pressable
        onPress={() => router.push({ pathname: '/plant/[id]', params: { id: plant.species_id } })}
        accessibilityRole="button"
        accessibilityLabel={commonName(plant)}
      >
        <View>
          <Image source={speciesImage(plant.species_id)} className="h-16 w-full" contentFit="cover" />
          <View className="gap-0.5 px-2 pt-2">
            <Text className="text-caption leading-tight text-forest" numberOfLines={2}>
              {plant.botanical.scientific_name}
            </Text>
          </View>
        </View>
      </Pressable>
      <View className="flex-row items-center justify-between gap-1 px-2 pb-2 pt-1">
        <View className="flex-1 flex-row items-center gap-1">
          <Icon name="sunny-outline" size={10} colorClassName="accent-leaf" />
          <Text className="text-3xs text-ink-soft" numberOfLines={1}>
            {sunSummary(plant)}
          </Text>
        </View>
        <Pressable
          onPress={onToggle}
          accessibilityRole="button"
          accessibilityLabel={chosen ? `Remove ${commonName(plant)} from plan` : `Add ${commonName(plant)} to plan`}
        >
          <View className={cn('size-7 items-center justify-center rounded-full', chosen ? 'bg-forest' : 'bg-mint-deep')}>
            <Icon name={chosen ? 'checkmark' : 'add'} size={16} colorClassName={chosen ? 'accent-white' : 'accent-forest'} />
          </View>
        </Pressable>
      </View>
    </View>
  );
}
