import type { ImageSourcePropType } from 'react-native';

import data from '@/features/canopy/data/canopy-data.json';
import type {
  HeightFilter,
  Site,
  SiteMeta,
  SortKey,
  Species,
  SunFilter,
  SunLevel,
} from '@/features/canopy/types/canopy';

export const sites = data.sites as Site[];
export const species = data.species as Species[];

const siteMeta: Record<string, SiteMeta> = {
  'site-a-sidewalk-strip': {
    title: 'Rua da Consolação Site',
    address: 'Rua da Consolação, 1873',
    lastVisited: 'Apr 12, 2025',
    image: require('@/assets/images/canopy/site-a.jpg'),
  },
  'site-b-sunny-lot': {
    title: 'Vila Madalena Site',
    address: 'Vila Madalena, São Paulo',
    lastVisited: 'Apr 8, 2025',
    image: require('@/assets/images/canopy/site-b.jpg'),
  },
  'site-c-shaded-courtyard': {
    title: 'Rua Itacolomi Site',
    address: 'Rua Itacolomi, 432',
    lastVisited: 'Apr 5, 2025',
    image: require('@/assets/images/canopy/site-c.jpg'),
  },
};

const speciesImages: Record<string, ImageSourcePropType> = {
  'eugenia-uniflora': require('@/assets/images/canopy/eugenia-uniflora.jpg'),
  'schinus-terebinthifolia': require('@/assets/images/canopy/schinus-terebinthifolia.jpg'),
  'pleroma-mutabile': require('@/assets/images/canopy/pleroma-mutabile.jpg'),
  'cecropia-pachystachya': require('@/assets/images/canopy/cecropia-pachystachya.jpg'),
  'calliandra-tweediei': require('@/assets/images/canopy/calliandra-tweediei.jpg'),
  'campomanesia-phaea': require('@/assets/images/canopy/campomanesia-phaea.jpg'),
  'psidium-cattleianum': require('@/assets/images/canopy/psidium-cattleianum.jpg'),
  'myrcia-glabra': require('@/assets/images/canopy/myrcia-glabra.jpg'),
  'bromelia-antiacantha': require('@/assets/images/canopy/bromelia-antiacantha.jpg'),
  'salvia-splendens': require('@/assets/images/canopy/salvia-splendens.jpg'),
};

export const getSite = (id: string | null | undefined) => sites.find((s) => s.site_id === id);
export const getSpecies = (id: string | null | undefined) =>
  species.find((s) => s.species_id === id);
export const getSiteMeta = (id: string) => siteMeta[id];
export const speciesImage = (id: string) => speciesImages[id];

export const speciesForSite = (siteID: string) =>
  species.filter((s) => s.site_tolerances.suitable_site_ids.includes(siteID));

export const commonName = (s: Species) => s.botanical.common_name_pt.split(' / ')[0];

const sunLabels: Record<SunLevel, string> = {
  full_sun: 'Full sun',
  partial_shade: 'Partial shade',
  partial_to_full_shade: 'Partial to full shade',
  full_shade: 'Shade',
};

export const sunLabel = (level: SunLevel) => sunLabels[level];

export const sunSummary = (s: Species) => {
  const levels = s.site_tolerances.sunlight;
  const sunny = levels.includes('full_sun');
  const shady = levels.some((l) => l === 'full_shade' || l === 'partial_to_full_shade');
  if (sunny && shady) return 'Sun to shade';
  if (sunny && levels.includes('partial_shade')) return 'Sun / part shade';
  if (sunny) return 'Full sun';
  return 'Shade';
};

export const formatMeters = (m: number) => `${Number.isInteger(m) ? m : m.toFixed(1)} m`;

export const heightRange = (s: Species) => {
  const h = s.physical_profile.mature_height_meters;
  if (h < 2) return '< 2 m';
  if (h <= 5) return '2 – 5 m';
  return '> 5 m';
};

export const humanize = (value: string) => {
  const text = value.replaceAll('_', ' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const matchesSun = (s: Species, filter: SunFilter) => {
  const levels = s.site_tolerances.sunlight;
  if (filter === 'full_sun') return levels.includes('full_sun');
  if (filter === 'partial_shade') return levels.includes('partial_shade');
  return levels.some((l) => l === 'full_shade' || l === 'partial_to_full_shade');
};

const matchesHeight = (s: Species, filter: HeightFilter) => {
  const h = s.physical_profile.mature_height_meters;
  if (filter === 'small') return h < 2;
  if (filter === 'medium') return h >= 2 && h <= 5;
  return h > 5;
};

interface CatalogueQuery {
  search: string;
  sun: SunFilter[];
  heights: HeightFilter[];
  wireSafe: boolean;
  sort: SortKey;
}

export const filterSpecies = ({ search, sun, heights, wireSafe, sort }: CatalogueQuery) => {
  const q = search.trim().toLowerCase();
  const list = species.filter((s) => {
    const haystack = [
      s.botanical.common_name_pt,
      s.botanical.common_name_en,
      s.botanical.scientific_name,
      s.botanical.family,
    ]
      .join(' ')
      .toLowerCase();
    if (q.length > 0 && !haystack.includes(q)) return false;
    if (sun.length > 0 && !sun.some((f) => matchesSun(s, f))) return false;
    if (heights.length > 0 && !heights.some((f) => matchesHeight(s, f))) return false;
    if (wireSafe && !s.physical_profile.sidewalk_wire_safe) return false;
    return true;
  });
  if (sort === 'height') {
    return list.toSorted(
      (a, b) => a.physical_profile.mature_height_meters - b.physical_profile.mature_height_meters,
    );
  }
  if (sort === 'name') return list.toSorted((a, b) => commonName(a).localeCompare(commonName(b)));
  if (sort === 'growth') {
    return list.toSorted(
      (a, b) => b.estimates.growth_rate_cm_per_year - a.estimates.growth_rate_cm_per_year,
    );
  }
  return list;
};

export const siteChips = (site: Site) => {
  const chips: { label: string; tone: 'leaf' | 'ochre'; icon: 'sun' | 'height' | 'area' | 'wire' }[] = [
    { label: sunLabel(site.sunlight_exposure), tone: 'leaf', icon: 'sun' },
  ];
  if (site.constraints.overhead_power_lines) {
    chips.push({ label: `Max ${formatMeters(site.constraints.max_mature_height_meters)}`, tone: 'leaf', icon: 'height' });
    chips.push({ label: 'Power lines', tone: 'ochre', icon: 'wire' });
    return chips;
  }
  chips.push({ label: `Up to ${formatMeters(site.constraints.max_mature_height_meters)}`, tone: 'leaf', icon: 'height' });
  chips.push({
    label: `${site.constraints.min_area_m2}–${site.constraints.max_area_m2} m²`,
    tone: 'leaf',
    icon: 'area',
  });
  return chips;
};
