import { ScrollView, Text, TextInput, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Pressable } from '@/components/pressable';
import { AppHeader } from '@/features/canopy/components/app-header';
import { FilterChip } from '@/features/canopy/components/filter-chip';
import { PageHeading } from '@/features/canopy/components/page-heading';
import { PlantCard } from '@/features/canopy/components/plant-card';
import { sortLabels, useCatalogueScreen } from '@/features/canopy/hooks/use-catalogue-screen';
import type { HeightFilter, SortKey, SunFilter } from '@/features/canopy/types/canopy';
import { cn } from '@/lib/cn';

const SUN: { key: SunFilter; label: string }[] = [
  { key: 'full_sun', label: 'Full sun' },
  { key: 'partial_shade', label: 'Partial shade' },
  { key: 'shade', label: 'Shade' },
];
const HEIGHTS: { key: HeightFilter; label: string }[] = [
  { key: 'small', label: '< 2 m' },
  { key: 'medium', label: '2 – 5 m' },
  { key: 'tall', label: '> 5 m' },
];
const SORTS = Object.keys(sortLabels) as SortKey[];

export default function CatalogueScreen() {
  const s = useCatalogueScreen();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="px-5 pt-safe-offset-2 pb-safe-offset-22 gap-4"
      keyboardShouldPersistTaps="handled"
    >
      <AppHeader />
      <PageHeading
        eyebrow="Catalogue"
        title="Native species"
        subtitle="Trees and plants for healthier, greener cities"
      />
      <View className="flex-row items-center gap-2 rounded-full bg-mint px-4 py-3">
        <Icon name="search" size={15} colorClassName="accent-leaf" />
        <TextInput
          value={s.search}
          onChangeText={s.setSearch}
          placeholder="Search species (e.g. pitangueira, aroeira…)"
          placeholderTextColorClassName="accent-muted"
          className="flex-1 text-row leading-none text-forest"
          autoCorrect={false}
          returnKeyType="search"
        />
        {s.search.length > 0 ? (
          <Pressable onPress={() => s.setSearch('')} accessibilityRole="button" accessibilityLabel="Clear search">
            <Icon name="close-circle" size={16} colorClassName="accent-sage" />
          </Pressable>
        ) : null}
      </View>
      <View className="gap-2">
        <View className="flex-row flex-wrap gap-2">
          {SUN.map((f) => (
            <FilterChip
              key={f.key}
              label={f.label}
              selected={s.store.sun.includes(f.key)}
              onPress={() => s.store.toggleSun(f.key)}
            />
          ))}
        </View>
        <View className="flex-row flex-wrap gap-2">
          {HEIGHTS.map((f) => (
            <FilterChip
              key={f.key}
              label={f.label}
              selected={s.store.heights.includes(f.key)}
              onPress={() => s.store.toggleHeight(f.key)}
            />
          ))}
          <FilterChip label="Wire-safe" selected={s.store.wireSafe} onPress={s.store.toggleWireSafe} />
        </View>
      </View>
      <View className="flex-row items-center justify-between">
        <Text className="text-row font-semibold text-forest">
          {s.results.length} {s.results.length === 1 ? 'species' : 'species'}
        </Text>
        <Pressable onPress={s.toggleSort} accessibilityRole="button" accessibilityLabel="Sort species">
          <View className="flex-row items-center gap-1">
            <Text className="text-caption text-muted">Sort by</Text>
            <Text className="text-caption font-semibold text-forest">{sortLabels[s.store.sort]}</Text>
            <Icon name={s.sortOpen ? 'chevron-up' : 'chevron-down'} size={12} colorClassName="accent-forest" />
          </View>
        </Pressable>
      </View>
      {s.sortOpen ? (
        <View className="flex-row flex-wrap gap-2">
          {SORTS.map((k) => (
            <FilterChip key={k} label={sortLabels[k]} selected={s.store.sort === k} onPress={() => s.chooseSort(k)} />
          ))}
        </View>
      ) : null}
      {s.results.length === 0 ? (
        <View className="items-center gap-3 rounded-2xl bg-mint px-6 py-8">
          <Icon name="leaf-outline" size={28} colorClassName="accent-sage" />
          <Text className="font-title text-lg text-forest">No species match these filters</Text>
          <Text className="text-center text-caption text-ink-soft">
            Try fewer filters or a different name.
          </Text>
          <Pressable onPress={s.clearAll} accessibilityRole="button">
            <View className="rounded-full bg-forest px-4 py-2">
              <Text className="text-caption font-semibold text-white">Clear filters</Text>
            </View>
          </Pressable>
        </View>
      ) : (
        <View className="gap-3">
          {s.rows.map((row) => (
            <View key={row[0].species_id} className={cn('flex-row gap-3')}>
              {row.map((plant) => (
                <PlantCard key={plant.species_id} plant={plant} />
              ))}
              {row.length === 1 ? <View className="flex-1" /> : null}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
