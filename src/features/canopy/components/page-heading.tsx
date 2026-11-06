import { Text, View } from 'react-native';

import { Image } from '@/components/image';
import { Eyebrow } from '@/features/canopy/components/eyebrow';

interface PageHeadingProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
}

export function PageHeading({ eyebrow, title, subtitle }: PageHeadingProps) {
  return (
    <View className="flex-row items-end gap-2">
      <View className="flex-1 gap-2 py-2">
        <Eyebrow label={eyebrow} />
        <Text className="font-title text-title text-forest">{title}</Text>
        {subtitle ? <Text className="text-row text-ink-soft">{subtitle}</Text> : null}
      </View>
      <Image
        source={require('@/assets/images/canopy/sprig.png')}
        className="h-24 w-14"
        contentFit="contain"
      />
    </View>
  );
}
