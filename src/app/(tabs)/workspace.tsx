import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Image } from '@/components/image';
import { Pressable } from '@/components/pressable';
import { AppHeader } from '@/features/canopy/components/app-header';
import { CareCalendar } from '@/features/canopy/components/care-calendar';
import { FilterChip } from '@/features/canopy/components/filter-chip';
import { InfoChip } from '@/features/canopy/components/info-chip';
import { PageHeading } from '@/features/canopy/components/page-heading';
import { PlantPicker } from '@/features/canopy/components/plant-picker';
import { ProgressBar } from '@/features/canopy/components/progress-bar';
import { RecommendedCard } from '@/features/canopy/components/recommended-card';
import { TaskLegend } from '@/features/canopy/components/task-legend';
import { TaskRow } from '@/features/canopy/components/task-row';
import { WeekCelebration } from '@/features/canopy/components/week-celebration';
import { useWorkspaceScreen } from '@/features/canopy/hooks/use-workspace-screen';
import { getSiteMeta, siteChips, sites } from '@/features/canopy/utils/catalogue';
import { formatDue } from '@/features/canopy/utils/schedule';

const chipIcons = {
  sun: 'sunny-outline',
  height: 'resize-outline',
  area: 'scan-outline',
  wire: 'flash-outline',
} as const;

function SignedOut() {
  const router = useRouter();
  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="px-5 pt-safe-offset-2 pb-safe-offset-22 gap-5">
      <AppHeader />
      <PageHeading eyebrow="Planting workspace" title="Sign in to plan a site" subtitle="Pick a site, choose native plants and get a care calendar." />
      <View className="items-center gap-3 rounded-2xl bg-mint px-6 py-8">
        <Image source={require('@/assets/images/canopy/leaf-buddy.png')} className="size-24" contentFit="contain" />
        <Text className="text-center font-title text-lg text-forest">Your plan follows you</Text>
        <Text className="text-center text-caption text-ink-soft">
          Your site, chosen plants and ticked care tasks are saved to your account, so you can pick up on any phone.
        </Text>
        <Pressable onPress={() => router.push('/sign-in')} accessibilityRole="button">
          <View className="flex-row items-center gap-2 rounded-full bg-forest px-6 py-3">
            <Icon name="log-in-outline" size={16} colorClassName="accent-white" />
            <Text className="text-row font-semibold text-white">Sign in or create account</Text>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
}

export default function WorkspaceScreen() {
  const router = useRouter();
  const w = useWorkspaceScreen();

  if (!w.user) return <SignedOut />;

  const percent = w.recommended.length === 0 ? 0 : w.plan.plant_ids.length / w.recommended.length;

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="px-5 pt-safe-offset-2 pb-safe-offset-22 gap-5">
      <AppHeader />
      <PageHeading eyebrow="Planting workspace" title={w.meta.title} subtitle={`${w.site.name} · São Paulo`} />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5" contentContainerClassName="px-5 gap-2">
        {sites.map((s) => (
          <FilterChip
            key={s.site_id}
            label={getSiteMeta(s.site_id).title.replace(' Site', '')}
            selected={w.plan.site_id === s.site_id}
            onPress={() => w.chooseSite(s.site_id)}
          />
        ))}
      </ScrollView>

      {w.syncError ? (
        <View className="flex-row items-center gap-2 rounded-xl bg-ochre-soft px-3 py-2">
          <Icon name="cloud-offline-outline" size={14} colorClassName="accent-ochre-ink" />
          <Text className="flex-1 text-2xs text-ochre-ink">{w.syncError}</Text>
        </View>
      ) : null}

      <View className="flex-row gap-3">
        <Image source={w.meta.image} className="w-2/5 rounded-2xl" contentFit="cover" />
        <View className="flex-1 gap-2 rounded-2xl bg-mint p-3">
          <View className="flex-row gap-1.5">
            <Icon name="location-outline" size={13} colorClassName="accent-forest" />
            <View className="flex-1 gap-0.5">
              <Text className="text-caption text-forest">{w.meta.address}</Text>
              <Text className="text-3xs text-muted">Last visited {w.meta.lastVisited}</Text>
            </View>
          </View>
          <View className="flex-row flex-wrap gap-1">
            {siteChips(w.site).map((c) => (
              <InfoChip key={c.label} label={c.label} tone={c.tone} icon={chipIcons[c.icon]} />
            ))}
          </View>
          <View className="h-px bg-border" />
          <View className="flex-row items-center gap-1">
            <Icon name="leaf" size={11} colorClassName="accent-leaf" />
            <Text className="text-2xs text-forest">
              {w.plan.plant_ids.length} native species planted
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <View className="flex-1">
              <ProgressBar value={percent} />
            </View>
            <Text className="text-3xs font-semibold text-forest">{Math.round(percent * 100)}%</Text>
          </View>
          <Pressable onPress={w.togglePicker} accessibilityRole="button">
            <View className="flex-row items-center gap-2 rounded-full bg-forest px-3 py-2.5">
              <Icon name="leaf-outline" size={13} colorClassName="accent-white" />
              <Text className="flex-1 text-2xs font-semibold text-white">
                {w.pickerOpen ? 'Close plant list' : 'Select plants for this site'}
              </Text>
              <Icon name={w.pickerOpen ? 'chevron-up' : 'arrow-forward'} size={12} colorClassName="accent-white" />
            </View>
          </Pressable>
        </View>
      </View>

      {w.pickerOpen ? (
        <PlantPicker plants={w.recommended} isChosen={w.isChosen} onToggle={w.togglePlant} onDone={w.togglePicker} />
      ) : null}

      <View className="gap-2">
        <View className="flex-row items-center justify-between">
          <Text className="font-title-bold text-lg text-forest">Recommended for this site</Text>
          <Pressable onPress={() => router.navigate('/catalogue')} accessibilityRole="link">
            <View className="flex-row items-center gap-0.5">
              <Text className="text-caption text-leaf">View catalogue</Text>
              <Icon name="arrow-forward" size={11} colorClassName="accent-leaf" />
            </View>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5" contentContainerClassName="px-5 gap-2">
          {w.recommended.map((p) => (
            <RecommendedCard
              key={p.species_id}
              plant={p}
              chosen={w.isChosen(p.species_id)}
              onToggle={() => w.togglePlant(p.species_id)}
            />
          ))}
        </ScrollView>
      </View>

      <View className="flex-row gap-2">
        <View className="flex-1">
          <CareCalendar month={w.month} tasks={w.schedule} selected={w.selected} onSelect={w.selectDay} onShift={w.shiftMonth} />
        </View>
        <View className="w-28">
          <TaskLegend />
        </View>
      </View>

      <View className="gap-2">
        <Text className="text-caption font-semibold uppercase tracking-widest text-leaf">
          {formatDue(w.selected)}
        </Text>
        {w.chosen.length === 0 ? (
          <Text className="text-caption text-ink-soft">
            Add plants above and their watering, mulching, compost and pruning days appear on the calendar.
          </Text>
        ) : w.dayTasks.length === 0 ? (
          <Text className="text-caption text-ink-soft">Nothing due this day. Tap a dotted day to see its tasks.</Text>
        ) : (
          <View className="rounded-2xl border border-border bg-white px-3">
            {w.dayTasks.map((t) => (
              <TaskRow key={t.id} task={t} done={w.isDone(t.id)} onToggle={() => w.toggleTask(t.id)} />
            ))}
          </View>
        )}
      </View>

      <View className="overflow-hidden rounded-2xl border border-border bg-white">
        <View className="flex-row items-center justify-between bg-mint px-4 py-3">
          <Text className="font-title-bold text-lg text-forest">This week&apos;s care tasks</Text>
          <Text className="text-caption text-muted">
            {w.weekDone} of {w.weekTasks.length} complete
          </Text>
        </View>
        <View className="px-4">
          {w.weekTasks.length === 0 ? (
            <View className="gap-2 py-4">
              <Text className="text-caption text-ink-soft">
                {w.chosen.length === 0 ? 'No plants in your plan yet.' : 'No care due this week.'}
              </Text>
              {w.schedule.length > 0 ? (
                <Pressable onPress={w.jumpToFirstTask} accessibilityRole="button">
                  <Text className="text-caption font-semibold text-leaf">Show the next task on the calendar</Text>
                </Pressable>
              ) : null}
            </View>
          ) : (
            w.weekTasks.map((t) => (
              <TaskRow key={t.id} task={t} done={w.isDone(t.id)} onToggle={() => w.toggleTask(t.id)} />
            ))
          )}
        </View>
      </View>

      {w.allWeekDone ? <WeekCelebration /> : null}

      <Pressable onPress={w.signOut} accessibilityRole="button">
        <View className="flex-row items-center justify-center gap-2 py-3">
          <Icon name="log-out-outline" size={14} colorClassName="accent-muted" />
          <Text className="text-caption text-muted">Sign out ({w.user.email})</Text>
        </View>
      </Pressable>
    </ScrollView>
  );
}
