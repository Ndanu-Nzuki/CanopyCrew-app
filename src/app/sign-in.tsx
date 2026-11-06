import { ScrollView, Text, TextInput, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Image } from '@/components/image';
import { Pressable } from '@/components/pressable';
import { Eyebrow } from '@/features/canopy/components/eyebrow';
import { useSignInScreen } from '@/features/canopy/hooks/use-sign-in-screen';

export default function SignInScreen() {
  const s = useSignInScreen();
  const signup = s.mode === 'signup';

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="px-5 pt-6 pb-safe-offset-4 gap-5"
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Image source={require('@/assets/images/canopy/logo-mark.png')} className="size-7" contentFit="contain" />
          <Text className="font-title-bold text-xl text-forest">Canopy Crew</Text>
        </View>
        <Pressable onPress={s.close} accessibilityRole="button" accessibilityLabel="Close">
          <View className="size-8 items-center justify-center rounded-full bg-mint">
            <Icon name="close" size={16} colorClassName="accent-forest" />
          </View>
        </Pressable>
      </View>
      <View className="flex-row items-center gap-3">
        <View className="flex-1 gap-2">
          <Eyebrow label="My workspace" />
          <Text className="font-title-bold text-title leading-tight text-forest">
            {signup ? 'Join the crew' : 'Welcome back'}
          </Text>
          <Text className="text-caption text-ink-soft">
            {signup
              ? 'Create an account to plan a site and keep your care calendar on every phone.'
              : 'Sign in to open your planting plan and care calendar.'}
          </Text>
        </View>
        <Image source={require('@/assets/images/canopy/leaf-buddy.png')} className="size-24" contentFit="contain" />
      </View>

      <View className="gap-2">
        {signup ? (
          <View className="flex-row items-center gap-2 rounded-xl border border-border bg-white px-3 py-3">
            <Icon name="person-outline" size={14} colorClassName="accent-muted" />
            <TextInput value={s.name} onChangeText={s.setName} placeholder="Your name" placeholderTextColorClassName="accent-muted" className="flex-1 text-row leading-none text-forest" />
          </View>
        ) : null}
        <View className="flex-row items-center gap-2 rounded-xl border border-border bg-white px-3 py-3">
          <Icon name="mail-outline" size={14} colorClassName="accent-muted" />
          <TextInput value={s.email} onChangeText={s.setEmail} placeholder="Email" placeholderTextColorClassName="accent-muted" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" className="flex-1 text-row leading-none text-forest" />
        </View>
        <View className="flex-row items-center gap-2 rounded-xl border border-border bg-white px-3 py-3">
          <Icon name="lock-closed-outline" size={14} colorClassName="accent-muted" />
          <TextInput value={s.password} onChangeText={s.setPassword} placeholder="Password" placeholderTextColorClassName="accent-muted" secureTextEntry autoCapitalize="none" className="flex-1 text-row leading-none text-forest" onSubmitEditing={s.submit} />
        </View>
        {s.error ? <Text className="text-2xs text-ochre-ink">{s.error}</Text> : null}
        <Pressable onPress={s.submit} isDisabled={s.busy} accessibilityRole="button">
          <View className="items-center rounded-full bg-forest py-3.5">
            <Text className="text-row font-semibold text-white">
              {s.busy ? 'One moment…' : signup ? 'Create account' : 'Sign in'}
            </Text>
          </View>
        </Pressable>
        <Pressable onPress={s.toggleMode} accessibilityRole="button">
          <View className="items-center py-2">
            <Text className="text-caption text-leaf">
              {signup ? 'Already have an account? Sign in' : 'New here? Create an account'}
            </Text>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
}
