import { ScrollView, Text, TextInput, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Image } from '@/components/image';
import { Pressable } from '@/components/pressable';
import { AppHeader } from '@/features/canopy/components/app-header';
import { Eyebrow } from '@/features/canopy/components/eyebrow';
import { useAboutScreen } from '@/features/canopy/hooks/use-about-screen';

function LinkPill({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="link">
      <View className="flex-row items-center gap-2 self-start rounded-full bg-mint-deep px-3 py-2">
        <Icon name="open-outline" size={12} colorClassName="accent-forest" />
        <Text className="text-2xs text-forest">{label}</Text>
        <Icon name="arrow-forward" size={11} colorClassName="accent-forest" />
      </View>
    </Pressable>
  );
}

export default function AboutScreen() {
  const a = useAboutScreen();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="px-5 pt-safe-offset-2 pb-safe-offset-22 gap-5"
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
    >
      <AppHeader />
      <View className="gap-2">
        <Eyebrow label="About" />
        <View className="flex-row items-center gap-2">
          <View className="flex-1 gap-2">
            <Text className="font-title-bold text-3xl leading-tight text-forest">Greener cities brighter futures</Text>
            <Text className="text-caption text-ink-soft">
              Canopy Crew helps people map and care for urban trees, building healthier, cooler and more livable
              cities — together.
            </Text>
          </View>
          <Image source={require('@/assets/images/canopy/mascot.png')} className="h-36 w-32" contentFit="contain" />
        </View>
      </View>

      <View className="flex-row overflow-hidden rounded-2xl bg-mint">
        <Image source={require('@/assets/images/canopy/city.jpg')} className="w-2/5" contentFit="cover" />
        <View className="flex-1 gap-2 p-3">
          <Text className="font-title-bold text-lg leading-tight text-forest">Aligned with São Paulo’s tree plan</Text>
          <Text className="text-2xs text-ink-soft">
            Our work supports São Paulo’s Municipal Urban Tree Plan (Planurb) to expand, protect and diversify the
            city’s tree canopy.
          </Text>
          <LinkPill label="Learn about Planurb" onPress={() => a.open('https://www.prefeitura.sp.gov.br/cidade/secretarias/meio_ambiente/')} />
        </View>
      </View>

      <View className="flex-row items-center gap-3 rounded-2xl bg-mint p-3">
        <Image source={require('@/assets/images/canopy/sdg11.png')} className="size-24 rounded-lg" contentFit="cover" />
        <View className="flex-1 gap-2">
          <Text className="font-title-bold text-lg leading-tight text-forest">Supporting UN SDG 11.7</Text>
          <Text className="text-2xs text-ink-soft">
            Goal 11.7 calls for safe, inclusive, green and accessible public spaces for all.
          </Text>
          <LinkPill label="Learn about SDG 11.7" onPress={() => a.open('https://sdgs.un.org/goals/goal11')} />
        </View>
      </View>

      <View className="gap-3">
        <Eyebrow label="Our impact together" />
        <View className="flex-row gap-2">
          {a.impact.map((t) => (
            <View key={t.label} className="flex-1 items-center gap-1 rounded-xl bg-mint px-1 py-3">
              <Icon name={t.icon} size={18} colorClassName="accent-forest" />
              <Text className="text-lg font-semibold text-forest">{t.value}</Text>
              <Text className="text-center text-3xs text-ink-soft">{t.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="gap-3">
        <Eyebrow label="Get in touch" />
        <Text className="font-title-bold text-2xl leading-tight text-forest">Let’s grow greener cities together</Text>
        <Text className="text-caption text-ink-soft">
          Have a question, suggestion or want to collaborate? We’d love to hear from you.
        </Text>
        <Pressable onPress={() => a.open('mailto:hello@canopycrew.org')} accessibilityRole="link">
          <View className="flex-row items-center gap-2 self-start rounded-full bg-mint px-4 py-2">
            <Icon name="mail-outline" size={14} colorClassName="accent-forest" />
            <Text className="text-caption text-forest">hello@canopycrew.org</Text>
          </View>
        </Pressable>

        {a.sent ? (
          <View className="items-center gap-2 rounded-2xl bg-mint px-5 py-6">
            <Icon name="checkmark-circle" size={28} colorClassName="accent-leaf" />
            <Text className="font-title text-lg text-forest">Message sent</Text>
            <Text className="text-center text-caption text-ink-soft">Thanks! We’ll get back to you by email.</Text>
            <Pressable onPress={a.writeAnother} accessibilityRole="button">
              <Text className="text-caption font-semibold text-leaf">Write another message</Text>
            </Pressable>
          </View>
        ) : (
          <View className="gap-2">
            <View className="flex-row items-center gap-2 rounded-xl border border-border bg-white px-3 py-3">
              <Icon name="person-outline" size={14} colorClassName="accent-muted" />
              <TextInput value={a.name} onChangeText={a.setName} placeholder="Your name" placeholderTextColorClassName="accent-muted" className="flex-1 text-row leading-none text-forest" />
            </View>
            <View className="flex-row items-center gap-2 rounded-xl border border-border bg-white px-3 py-3">
              <Icon name="mail-outline" size={14} colorClassName="accent-muted" />
              <TextInput value={a.email} onChangeText={a.setEmail} placeholder="Your email" placeholderTextColorClassName="accent-muted" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} className="flex-1 text-row leading-none text-forest" />
            </View>
            <View className="flex-row gap-2 rounded-xl border border-border bg-white px-3 py-3">
              <Icon name="chatbox-ellipses-outline" size={14} colorClassName="accent-muted" />
              <TextInput value={a.message} onChangeText={a.setMessage} placeholder="Your message" placeholderTextColorClassName="accent-muted" multiline textAlignVertical="top" className="h-20 flex-1 text-row text-forest" />
            </View>
            {a.error ? <Text className="text-2xs text-ochre-ink">{a.error}</Text> : null}
            <Pressable onPress={a.send} isDisabled={a.sending} accessibilityRole="button">
              <View className="flex-row items-center justify-center gap-2 rounded-full bg-forest py-3">
                <Icon name="paper-plane-outline" size={14} colorClassName="accent-white" />
                <Text className="text-row font-semibold text-white">{a.sending ? 'Sending…' : 'Send message'}</Text>
              </View>
            </Pressable>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
