import { Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Image } from '@/components/image';
import { Pressable } from '@/components/pressable';
import type { Species } from '@/features/canopy/types/canopy';
import {
  commonName,
  formatMeters,
  speciesImage,
  sunSummary,
} from '@/features/canopy/utils/catalogue';
import { cn } from '@/lib/cn';

interface PlantPickerProps {
  plants: Species[];
  isChosen: (id: string) => boolean;
  onToggle: (id: string) => void;
  onDone: () => void;
}

export function PlantPicker({ plants, isChosen, onToggle, onDone }: PlantPickerProps) {
  return (
    <View className="gap-1 rounded-2xl border border-border bg-white p-3">
      <Text className="font-title text-base text-forest">Choose plants for this site</Text>
      <Text className="text-2xs text-ink-soft">
        Only species that fit this site&apos;s light, space and wires are listed.
      </Text>
      {plants.map((p) => {
        const chosen = isChosen(p.species_id);
        return (
          <Pressable
            key={p.species_id}
            onPress={() => onToggle(p.species_id)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: chosen }}
            accessibilityLabel={commonName(p)}
          >
            <View className="flex-row items-center gap-3 border-b border-border py-2">
              <Image source={speciesImage(p.species_id)} className="size-10 rounded-lg" contentFit="cover" />
              <View className="flex-1 gap-0.5">
                <Text className="text-row font-semibold text-forest">{commonName(p)}</Text>
                <Text className="text-2xs text-ink-soft">
                  {p.botanical.scientific_name} · {formatMeters(p.physical_profile.mature_height_meters)} · {sunSummary(p)}
                </Text>
              </View>
              <View
                className={cn(
                  'size-6 items-center justify-center rounded-md border-2',
                  chosen ? 'border-forest bg-forest' : 'border-sage bg-white',
                )}
              >
                {chosen ? <Icon name="checkmark" size={14} colorClassName="accent-white" /> : null}
              </View>
            </View>
          </Pressable>
        );
      })}
      <View className="pt-2">
        <Pressable onPress={onDone} accessibilityRole="button">
          <View className="items-center rounded-full bg-forest py-3">
            <Text className="text-row font-semibold text-white">Done</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
