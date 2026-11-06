import { Ionicons } from '@expo/vector-icons';
import { withUniwind } from 'uniwind';

export const Icon = withUniwind(Ionicons, {
  color: { fromClassName: 'colorClassName', styleProperty: 'accentColor' },
});
