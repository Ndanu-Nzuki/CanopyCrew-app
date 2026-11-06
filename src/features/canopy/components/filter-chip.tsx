import { Text, View } from 'react-native';

import { Pressable } from '@/components/pressable';
import { cn } from '@/lib/cn';

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function FilterChip({ label, selected, onPress }: FilterChipProps) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected }}>
      <View
        className={cn(
          'rounded-full border px-3 py-1.5',
          selected ? 'border-leaf bg-leaf' : 'border-border bg-paper',
        )}
      >
        <Text className={cn('text-caption font-semibold', selected ? 'text-white' : 'text-forest')}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
