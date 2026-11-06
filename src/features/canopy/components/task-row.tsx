import { useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import { Presets } from 'react-native-pulsar';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Icon } from '@/components/icon';
import { Pressable } from '@/components/pressable';
import { taskStyle } from '@/features/canopy/components/task-style';
import type { ScheduledTask } from '@/features/canopy/types/canopy';
import { formatDue } from '@/features/canopy/utils/schedule';
import { cn } from '@/lib/cn';
import { timing } from '@/lib/motion';

interface TaskRowProps {
  task: ScheduledTask;
  done: boolean;
  onToggle: () => void;
}

export function TaskRow({ task, done, onToggle }: TaskRowProps) {
  const fill = useSharedValue(done ? 1 : 0);
  const sprout = useSharedValue(0);
  const settle = useSharedValue(done ? 1 : 0);
  const mounted = useRef(false);

  useEffect(() => {
    fill.set(withTiming(done ? 1 : 0, done ? timing.enter : timing.exit));
    settle.set(withTiming(done ? 1 : 0, timing.move));
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (done) sprout.set(withSequence(withTiming(0, { duration: 0 }), withTiming(1, timing.draw)));
  }, [done, fill, settle, sprout]);

  const boxFill = useAnimatedStyle(() => ({
    opacity: fill.get(),
    transform: [{ scale: 0.6 + fill.get() * 0.4 }],
  }));
  const leaf = useAnimatedStyle(() => ({
    opacity: sprout.get() === 0 ? 0 : 1 - sprout.get(),
    transform: [{ translateY: -18 * sprout.get() }, { rotate: `${-20 * sprout.get()}deg` }],
  }));
  const body = useAnimatedStyle(() => ({ opacity: 1 - settle.get() * 0.35 }));

  const style = taskStyle[task.type];

  const toggle = () => {
    if (!done) Presets.System.notificationSuccess();
    onToggle();
  };

  return (
    <Pressable
      onPress={toggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: done }}
      accessibilityLabel={task.title}
    >
      <View className="flex-row items-center gap-3 py-3">
        <View className="size-6 items-center justify-center">
          <View className="absolute size-5 rounded-md border-2 border-forest" />
          <Animated.View
            className="absolute size-5 items-center justify-center rounded-md bg-forest"
            style={boxFill}
          >
            <Icon name="checkmark" size={14} colorClassName="accent-white" />
          </Animated.View>
          <Animated.View className="absolute" style={leaf} pointerEvents="none">
            <Icon name="leaf" size={14} colorClassName="accent-leaf" />
          </Animated.View>
        </View>
        <Animated.View className="flex-1 gap-0.5" style={body}>
          <Text
            className={cn('text-row font-semibold text-forest', done ? 'line-through' : null)}
            numberOfLines={1}
          >
            {task.title}
          </Text>
          <Text className="text-2xs text-muted" numberOfLines={1}>
            Due {formatDue(task.date)}
            {task.plantName.includes(',') ? ` · ${task.plantName}` : ''}
          </Text>
        </Animated.View>
        <Icon name={style.icon} size={16} colorClassName={style.color} />
      </View>
    </Pressable>
  );
}
