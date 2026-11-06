import { Text, View } from 'react-native';

export function Eyebrow({ label }: { label: string }) {
  return (
    <View className="flex-row items-center gap-3">
      <Text className="text-2xs font-semibold uppercase tracking-widest text-leaf">{label}</Text>
      <View className="h-px w-10 bg-sage" />
    </View>
  );
}
