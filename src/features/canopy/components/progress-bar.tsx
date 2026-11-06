import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { timing } from '@/lib/motion';

export function ProgressBar({ value }: { value: number }) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.set(withTiming(Math.max(0, Math.min(1, value)), timing.draw));
  }, [value, progress]);
  const fill = useAnimatedStyle(() => ({ width: `${progress.get() * 100}%` }));
  return (
    <View className="h-1.5 flex-1 overflow-hidden rounded-full bg-mint-deep">
      <Animated.View className="h-full rounded-full bg-leaf" style={fill} />
    </View>
  );
}
