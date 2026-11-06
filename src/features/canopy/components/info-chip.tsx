import type { ComponentProps } from 'react';
import { Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { cn } from '@/lib/cn';

interface InfoChipProps {
  label: string;
  icon?: ComponentProps<typeof Icon>['name'];
  tone?: 'leaf' | 'ochre' | 'plain';
}

export function InfoChip({ label, icon, tone = 'leaf' }: InfoChipProps) {
  const ochre = tone === 'ochre';
  return (
    <View
      className={cn(
        'flex-row items-center gap-1 rounded-full px-2 py-1',
        ochre ? 'bg-ochre-soft' : 'bg-paper',
        tone === 'plain' ? 'border border-border' : null,
      )}
    >
      {icon ? (
        <Icon name={icon} size={10} colorClassName={ochre ? 'accent-ochre-ink' : 'accent-leaf'} />
      ) : null}
      <Text className={cn('text-3xs font-semibold', ochre ? 'text-ochre-ink' : 'text-ink-soft')}>
        {label}
      </Text>
    </View>
  );
}
