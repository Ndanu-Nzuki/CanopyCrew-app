import { Text, View } from 'react-native';

export function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View className="w-1/2 gap-0.5 py-2 pr-2">
      <Text className="text-3xs uppercase tracking-widest text-muted">{label}</Text>
      <Text className="text-row text-forest">{value}</Text>
    </View>
  );
}
