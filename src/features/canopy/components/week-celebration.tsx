import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { Presets } from 'react-native-pulsar';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Image } from '@/components/image';
import { timing } from '@/lib/motion';

export function WeekCelebration() {
  const shown = useSharedValue(0);

  useEffect(() => {
    Presets.System.notificationSuccess();
    shown.set(withTiming(1, timing.draw));
  }, [shown]);

  const style = useAnimatedStyle(() => ({
    opacity: shown.get(),
    transform: [{ translateY: 12 * (1 - shown.get()) }, { scale: 0.96 + 0.04 * shown.get() }],
  }));

  return (
    <Animated.View style={style}>
      <View className="flex-row items-center gap-3 rounded-2xl bg-forest p-4">
        <Image source={require('@/assets/images/canopy/leaf-buddy.png')} className="size-14" contentFit="contain" />
        <View className="flex-1 gap-1">
          <Text className="font-title text-lg text-white">Week complete!</Text>
          <Text className="text-caption text-mint">
            Every care task is done. Your new plantings are off to a strong start.
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}
