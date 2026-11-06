import { useState } from 'react';

import { useCatalogueStore } from '@/features/canopy/store/catalogue-store';
import type { SortKey } from '@/features/canopy/types/canopy';
import { filterSpecies } from '@/features/canopy/utils/catalogue';

export const sortLabels: Record<SortKey, string> = {
  relevant: 'Most relevant',
  height: 'Height',
  name: 'Name',
  growth: 'Growth rate',
};

export function useCatalogueScreen() {
  const [search, setSearch] = useState('');
  const [sortOpen, setSortOpen] = useState(false);
  const store = useCatalogueStore();
  const results = filterSpecies({
    search,
    sun: store.sun,
    heights: store.heights,
    wireSafe: store.wireSafe,
    sort: store.sort,
  });
  const rows: (typeof results)[] = [];
  for (let i = 0; i < results.length; i += 2) rows.push(results.slice(i, i + 2));

  return {
    search,
    setSearch,
    sortOpen,
    toggleSort: () => setSortOpen((o) => !o),
    chooseSort: (key: SortKey) => {
      store.setSort(key);
      setSortOpen(false);
    },
    store,
    results,
    rows,
    clearAll: () => {
      setSearch('');
      store.clearFilters();
    },
  };
}
