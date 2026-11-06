import { ScrollView, Text, View } from 'react-native';

import { AppHeader } from '@/features/canopy/components/app-header';
import { Eyebrow } from '@/features/canopy/components/eyebrow';
import { PageHeading } from '@/features/canopy/components/page-heading';
import { PlantingProgress } from '@/features/canopy/components/planting-progress';
import { SiteRow } from '@/features/canopy/components/site-row';
import { usePlantingProgress } from '@/features/canopy/hooks/use-planting-progress';
import { sites } from '@/features/canopy/utils/catalogue';

export default function SitesScreen() {
  const progress = usePlantingProgress();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="px-5 pt-safe-offset-2 pb-safe-offset-22 gap-4"
    >
      <AppHeader />
      <PageHeading
        eyebrow="Field guide"
        title="Sample sites"
        subtitle={`${sites.length} planting sites in your area`}
      />
      <View className="gap-3">
        {sites.map((site) => (
          <SiteRow key={site.site_id} site={site} />
        ))}
      </View>
      <View className="gap-3 pt-2">
        <Eyebrow label="Your planting progress" />
        <PlantingProgress planted={progress.planted} goal={progress.goal} caption={progress.caption} />
        {progress.hint ? <Text className="text-2xs text-muted">{progress.hint}</Text> : null}
      </View>
    </ScrollView>
  );
}
