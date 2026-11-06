import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Image } from '@/components/image';
import { Pressable } from '@/components/pressable';
import { InfoChip } from '@/features/canopy/components/info-chip';
import { useCatalogueStore } from '@/features/canopy/store/catalogue-store';
import type { Species } from '@/features/canopy/types/canopy';
import {
  commonName,
  formatMeters,
  speciesImage,
  sunSummary,
} from '@/features/canopy/utils/catalogue';

export function PlantCard({ plant }: { plant: Species }) {
  const router = useRouter();
  const favourite = useCatalogueStore((s) => s.favourites.includes(plant.species_id));
  const toggleFavourite = useCatalogueStore((s) => s.toggleFavourite);

  return (
    <View className="flex-1 overflow-hidden rounded-2xl bg-mint">
      <Pressable
        onPress={() => router.push({ pathname: '/plant/[id]', params: { id: plant.species_id } })}
        accessibilityRole="button"
        accessibilityLabel={commonName(plant)}
      >
        <View>
          <Image source={speciesImage(plant.species_id)} className="h-28 w-full" contentFit="cover" />
          <View className="gap-1 p-3">
            <Text className="font-title text-base text-forest" numberOfLines={1}>
              {commonName(plant)}
            </Text>
            <Text className="font-title-italic text-caption text-ink-soft" numberOfLines={1}>
              {plant.botanical.scientific_name}
            </Text>
            <View className="flex-row flex-wrap gap-1 pt-1">
              <InfoChip label={formatMeters(plant.physical_profile.mature_height_meters)} icon="resize-outline" />
              <InfoChip label={sunSummary(plant)} icon="sunny-outline" />
              {plant.physical_profile.sidewalk_wire_safe ? (
                <InfoChip label="Wire-safe" icon="flash-outline" />
              ) : null}
            </View>
          </View>
        </View>
      </Pressable>
      <View className="absolute right-2 top-2">
        <Pressable
          onPress={() => toggleFavourite(plant.species_id)}
          accessibilityRole="button"
          accessibilityLabel={favourite ? 'Remove from favourites' : 'Add to favourites'}
        >
          <View className="size-8 items-center justify-center rounded-full bg-paper">
            <Icon
              name={favourite ? 'heart' : 'heart-outline'}
              size={16}
              colorClassName={favourite ? 'accent-ochre-ink' : 'accent-leaf'}
            />
          </View>
        </Pressable>
      </View>
    </View>
  );
}
