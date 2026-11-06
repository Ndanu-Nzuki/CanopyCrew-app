import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Icon } from '@/components/icon';
import { Pressable } from '@/components/pressable';

export function BackButton() {
  const router = useRouter();
  return (
    <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Back">
      <View className="size-9 items-center justify-center rounded-full bg-paper">
        <Icon name="chevron-back" size={18} colorClassName="accent-forest" />
      </View>
    </Pressable>
  );
}
