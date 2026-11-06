import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Image } from '@/components/image';
import { ListRow } from '@/components/list-row';
import { Card } from '@/components/card';
import { BackButton } from '@/features/canopy/components/back-button';
import { Eyebrow } from '@/features/canopy/components/eyebrow';
import { Fact } from '@/features/canopy/components/fact';
import { InfoChip } from '@/features/canopy/components/info-chip';
import {
  commonName,
  formatMeters,
  getSiteMeta,
  getSpecies,
  humanize,
  speciesImage,
  sunLabel,
} from '@/features/canopy/utils/catalogue';
import type { CareTask } from '@/features/canopy/types/canopy';

function CareGroup({ title, tasks }: { title: string; tasks: CareTask[] }) {
  if (tasks.length === 0) return null;
  return (
    <View className="gap-1">
      <Text className="text-caption font-semibold text-leaf">{title}</Text>
      {tasks.map((t) => (
        <View key={t.task} className="gap-0.5 py-1">
          <Text className="text-row text-forest">{t.task}</Text>
          <Text className="text-2xs text-ink-soft">{t.frequency}{t.notes ? ` · ${t.notes}` : ''}</Text>
        </View>
      ))}
    </View>
  );
}

export default function PlantScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const plant = getSpecies(id);

  if (!plant) {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-background px-5">
        <Text className="font-title text-xl text-forest">Species not found</Text>
        <BackButton />
      </View>
    );
  }

  const b = plant.botanical;
  const p = plant.physical_profile;
  const e = plant.ecological_interactions;
  const care = plant.volunteer_care_schedule;

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="pb-safe-offset-4 gap-5">
      <View>
        <Image source={speciesImage(plant.species_id)} className="h-72 w-full" contentFit="cover" />
        <View className="absolute left-5 top-safe-offset-2">
          <BackButton />
        </View>
      </View>
      <View className="gap-5 px-5">
        <View className="gap-1">
          <Eyebrow label={b.family} />
          <Text className="font-title-bold text-title leading-tight text-forest">{commonName(plant)}</Text>
          <Text className="font-title-italic text-lg text-ink-soft">{b.scientific_name}</Text>
          <Text className="text-caption text-muted">{b.common_name_en} · {b.biome_origin}</Text>
        </View>
        <View className="flex-row flex-wrap gap-1">
          {plant.site_tolerances.sunlight.map((s) => (
            <InfoChip key={s} label={sunLabel(s)} icon="sunny-outline" />
          ))}
          {p.sidewalk_wire_safe ? <InfoChip label="Wire-safe" icon="flash-outline" /> : null}
          {plant.site_tolerances.drought_tolerant ? <InfoChip label="Drought tolerant" icon="water-outline" /> : null}
          {plant.site_tolerances.compacted_soil_tolerant ? <InfoChip label="Copes with compacted soil" tone="ochre" /> : null}
        </View>

        <View className="rounded-2xl bg-mint px-4 py-2">
          <View className="flex-row flex-wrap">
            <Fact label="Mature height" value={formatMeters(p.mature_height_meters)} />
            <Fact label="Canopy spread" value={formatMeters(p.canopy_spread_meters)} />
            <Fact label="Growth" value={`${plant.estimates.growth_rate_cm_per_year} cm / year`} />
            <Fact label="Shade at year 3" value={`${plant.estimates.canopy_coverage_m2_at_year_3} m²`} />
            <Fact label="Habit" value={humanize(p.growth_habit)} />
            <Fact label="Roots" value={humanize(p.root_system)} />
          </View>
        </View>

        <View className="gap-2">
          <Eyebrow label="Wildlife" />
          <Text className="text-row text-ink-soft">{e.ecological_role}</Text>
          {e.pollinators.length > 0 ? (
            <Text className="text-caption text-forest">
              <Text className="font-semibold">Pollinators: </Text>
              {e.pollinators.join(', ')}
            </Text>
          ) : null}
          {e.seed_dispersers_avifauna.length > 0 ? (
            <Text className="text-caption text-forest">
              <Text className="font-semibold">Birds: </Text>
              {e.seed_dispersers_avifauna.join(', ')}
            </Text>
          ) : null}
        </View>

        <View className="gap-2">
          <Eyebrow label="Fits these sites" />
          <Card list>
            {plant.site_tolerances.suitable_site_ids.map((sid) => (
              <ListRow
                key={sid}
                title={getSiteMeta(sid).title}
                onPress={() => router.push({ pathname: '/site/[id]', params: { id: sid } })}
              />
            ))}
          </Card>
        </View>

        <View className="gap-3">
          <Eyebrow label="Volunteer care" />
          <CareGroup title="First month" tasks={care.initial_month} />
          <CareGroup title="Every quarter" tasks={care.maintenance_quarterly} />
          <CareGroup title="Every year" tasks={care.annual} />
        </View>
        <View className="flex-row items-center gap-2">
          <Icon name="ribbon-outline" size={12} colorClassName="accent-muted" />
          <Text className="flex-1 text-2xs text-muted">{b.municipal_compliance.join(' · ')}</Text>
        </View>
      </View>
    </ScrollView>
  );
}
