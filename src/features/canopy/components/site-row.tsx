import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Image } from '@/components/image';
import { Pressable } from '@/components/pressable';
import { InfoChip } from '@/features/canopy/components/info-chip';
import type { Site } from '@/features/canopy/types/canopy';
import { getSiteMeta, siteChips, speciesForSite } from '@/features/canopy/utils/catalogue';

const chipIcons = {
  sun: 'sunny-outline',
  height: 'resize-outline',
  area: 'scan-outline',
  wire: 'flash-outline',
} as const;

export function SiteRow({ site }: { site: Site }) {
  const router = useRouter();
  const meta = getSiteMeta(site.site_id);
  const fits = speciesForSite(site.site_id).length;

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/site/[id]', params: { id: site.site_id } })}
      accessibilityRole="button"
      accessibilityLabel={meta.title}
    >
      <View className="min-h-36 flex-row overflow-hidden rounded-2xl bg-mint">
        <Image source={meta.image} className="w-2/5" contentFit="cover" />
        <View className="flex-1 justify-between gap-1 p-3">
          <View className="gap-1">
            <Text className="font-title text-lg leading-tight text-forest" numberOfLines={1}>
              {meta.title}
            </Text>
            <View className="flex-row items-center gap-1">
              <Icon name="location-outline" size={11} colorClassName="accent-leaf" />
              <Text className="text-2xs text-ink-soft" numberOfLines={1}>
                {meta.address}
              </Text>
            </View>
            <Text className="text-3xs text-muted">Last visited {meta.lastVisited}</Text>
          </View>
          <View className="gap-2">
            <View className="h-px bg-border" />
            <View className="flex-row items-center gap-1">
              <Icon name="leaf-outline" size={12} colorClassName="accent-leaf" />
              <Text className="flex-1 text-2xs font-semibold text-forest">
                {fits} native species fit
              </Text>
              <Icon name="arrow-forward" size={12} colorClassName="accent-leaf" />
            </View>
            <View className="flex-row flex-wrap gap-1">
              {siteChips(site).map((c) => (
                <InfoChip key={c.label} label={c.label} tone={c.tone} icon={chipIcons[c.icon]} />
              ))}
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
