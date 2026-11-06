import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Image } from '@/components/image';
import { Pressable } from '@/components/pressable';
import { useAuth } from '@/contexts/AuthContext';

export function AppHeader() {
  const router = useRouter();
  const { user } = useAuth();

  const openWorkspace = () => {
    if (user) {
      router.navigate('/workspace');
      return;
    }
    router.push('/sign-in');
  };

  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center gap-2">
        <Image
          source={require('@/assets/images/canopy/logo-mark.png')}
          className="size-7"
          contentFit="contain"
        />
        <Text className="font-title text-xl text-forest">Canopy Crew</Text>
      </View>
      <Pressable onPress={openWorkspace} accessibilityRole="button" accessibilityLabel="My Workspace">
        <View className="flex-row items-center gap-1.5 rounded-full border border-sage bg-mint px-3 py-2">
          <Icon name="briefcase-outline" size={14} colorClassName="accent-leaf" />
          <Text className="text-caption font-semibold text-forest">My Workspace</Text>
          {user ? <View className="size-1.5 rounded-full bg-ochre" /> : null}
        </View>
      </Pressable>
    </View>
  );
}
