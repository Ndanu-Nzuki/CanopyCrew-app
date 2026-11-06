import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Image } from '@/components/image';
import { Pressable } from '@/components/pressable';
import { useAuth } from '@/contexts/AuthContext';
import { BackButton } from '@/features/canopy/components/back-button';
import { Eyebrow } from '@/features/canopy/components/eyebrow';
import { Fact } from '@/features/canopy/components/fact';
import { InfoChip } from '@/features/canopy/components/info-chip';
import { PlantCard } from '@/features/canopy/components/plant-card';
import { useWorkspaceStore } from '@/features/canopy/store/workspace-store';
import {
  formatMeters,
  getSite,
  getSiteMeta,
  humanize,
  siteChips,
  speciesForSite,
  sunLabel,
} from '@/features/canopy/utils/catalogue';

const chipIcons = { sun: 'sunny-outline', height: 'resize-outline', area: 'scan-outline', wire: 'flash-outline' } as const;

export default function SiteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const chooseSite = useWorkspaceStore((s) => s.chooseSite);
  const planned = useWorkspaceStore((s) => s.plan.site_id === id);
  const site = getSite(id);

  if (!site) {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-background px-5">
        <Text className="font-title text-xl text-forest">Site not found</Text>
        <BackButton />
      </View>
    );
  }

  const meta = getSiteMeta(site.site_id);
  const fits = speciesForSite(site.site_id);
  const rows: (typeof fits)[] = [];
  for (let i = 0; i < fits.length; i += 2) rows.push(fits.slice(i, i + 2));
  const c = site.constraints;
  const r = site.requirements;
  const needs = [
    r.sidewalk_wire_safe ? 'Wire-safe height' : null,
    r.non_invasive_roots ? 'Non-invasive roots' : null,
    r.low_lux_tolerance ? 'Low-light tolerant' : null,
    r.pioneer_priority ? 'Pioneer species first' : null,
    r.avifauna_support_priority ? 'Feeds birds' : null,
  ].filter((n): n is string => n !== null);

  const plan = () => {
    if (!user) {
      router.push('/sign-in');
      return;
    }
    chooseSite(site.site_id);
    router.navigate('/workspace');
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="pb-safe-offset-4 gap-5">
      <View>
        <Image source={meta.image} className="h-64 w-full" contentFit="cover" />
        <View className="absolute left-5 top-safe-offset-2">
          <BackButton />
        </View>
      </View>
      <View className="gap-5 px-5">
        <View className="gap-2">
          <Eyebrow label={site.archetype_label} />
          <Text className="font-title-bold text-title leading-tight text-forest">{meta.title}</Text>
          <View className="flex-row items-center gap-1">
            <Icon name="location-outline" size={12} colorClassName="accent-leaf" />
            <Text className="text-caption text-ink-soft">{meta.address} · Last visited {meta.lastVisited}</Text>
          </View>
          <View className="flex-row flex-wrap gap-1">
            {siteChips(site).map((ch) => (
              <InfoChip key={ch.label} label={ch.label} tone={ch.tone} icon={chipIcons[ch.icon]} />
            ))}
          </View>
          <Text className="text-row text-ink-soft">{site.description}</Text>
        </View>

        <View className="gap-1 rounded-2xl bg-mint px-4 py-2">
          <View className="flex-row flex-wrap">
            <Fact label="Light" value={sunLabel(site.sunlight_exposure)} />
            <Fact label="Size" value={site.typical_dimensions} />
            <Fact label="Max mature height" value={formatMeters(c.max_mature_height_meters)} />
            <Fact label="Area" value={`${c.min_area_m2}–${c.max_area_m2} m²`} />
            <Fact label="Soil compaction" value={humanize(c.soil_compaction_level)} />
            <Fact label="Overhead wires" value={c.overhead_power_lines ? 'Yes' : 'None'} />
          </View>
        </View>

        {needs.length > 0 ? (
          <View className="gap-2">
            <Eyebrow label="Plants here need" />
            <View className="flex-row flex-wrap gap-1">
              {needs.map((n) => (
                <InfoChip key={n} label={n} icon="checkmark" />
              ))}
            </View>
          </View>
        ) : null}

        <View className="gap-2">
          <Eyebrow label="Ecological goals" />
          {site.ecological_goals.map((g) => (
            <View key={g} className="flex-row gap-2">
              <Icon name="leaf" size={12} colorClassName="accent-sage" />
              <Text className="flex-1 text-caption text-ink-soft">{g}</Text>
            </View>
          ))}
          <Text className="text-2xs italic text-muted">Reference: {r.municipal_reference}</Text>
        </View>

        <View className="gap-3">
          <Eyebrow label={`${fits.length} catalogue plants fit this site`} />
          {rows.map((row) => (
            <View key={row[0].species_id} className="flex-row gap-3">
              {row.map((p) => (
                <PlantCard key={p.species_id} plant={p} />
              ))}
              {row.length === 1 ? <View className="flex-1" /> : null}
            </View>
          ))}
        </View>

        <Pressable onPress={plan} accessibilityRole="button">
          <View className="flex-row items-center justify-center gap-2 rounded-full bg-forest py-3.5">
            <Icon name="clipboard-outline" size={15} colorClassName="accent-white" />
            <Text className="text-row font-semibold text-white">
              {planned ? 'Open in my workspace' : 'Plan this site in my workspace'}
            </Text>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
}
