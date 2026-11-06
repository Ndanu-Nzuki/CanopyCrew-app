import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { HeightFilter, SortKey, SunFilter } from '@/features/canopy/types/canopy';
import { zustandStorage } from '@/lib/storage';

interface CatalogueState {
  favourites: string[];
  sun: SunFilter[];
  heights: HeightFilter[];
  wireSafe: boolean;
  sort: SortKey;
  toggleFavourite: (id: string) => void;
  toggleSun: (f: SunFilter) => void;
  toggleHeight: (f: HeightFilter) => void;
  toggleWireSafe: () => void;
  setSort: (s: SortKey) => void;
  clearFilters: () => void;
}

const toggle = <T,>(list: T[], value: T) =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

export const useCatalogueStore = create<CatalogueState>()(
  persist(
    (set) => ({
      favourites: [],
      sun: ['full_sun'],
      heights: [],
      wireSafe: false,
      sort: 'relevant',
      toggleFavourite: (id) => set((s) => ({ favourites: toggle(s.favourites, id) })),
      toggleSun: (f) => set((s) => ({ sun: toggle(s.sun, f) })),
      toggleHeight: (f) => set((s) => ({ heights: toggle(s.heights, f) })),
      toggleWireSafe: () => set((s) => ({ wireSafe: !s.wireSafe })),
      setSort: (sort) => set({ sort }),
      clearFilters: () => set({ sun: [], heights: [], wireSafe: false }),
    }),
    { name: 'canopy-catalogue', storage: createJSONStorage(() => zustandStorage) },
  ),
);
