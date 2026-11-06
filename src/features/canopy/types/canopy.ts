import type { ImageSourcePropType } from 'react-native';

export type SunLevel = 'full_sun' | 'partial_shade' | 'partial_to_full_shade' | 'full_shade';

export interface CareTask {
  task: string;
  frequency: string;
  notes: string;
}

export interface Site {
  site_id: string;
  name: string;
  archetype_label: string;
  description: string;
  typical_dimensions: string;
  sunlight_exposure: SunLevel;
  constraints: {
    max_width_meters: number | null;
    min_area_m2: number;
    max_area_m2: number;
    overhead_power_lines: boolean;
    max_mature_height_meters: number;
    impervious_surroundings: boolean;
    soil_compaction_level: string;
  };
  requirements: {
    sidewalk_wire_safe: boolean;
    non_invasive_roots: boolean;
    low_lux_tolerance: boolean;
    pioneer_priority: boolean;
    avifauna_support_priority: boolean;
    municipal_reference: string;
  };
  ecological_goals: string[];
}

export interface Species {
  species_id: string;
  botanical: {
    scientific_name: string;
    common_name_pt: string;
    common_name_en: string;
    family: string;
    biome_origin: string;
    municipal_compliance: string[];
    successional_group: string;
  };
  physical_profile: {
    growth_habit: string;
    mature_height_meters: number;
    canopy_spread_meters: number;
    root_system: string;
    sidewalk_wire_safe: boolean;
  };
  site_tolerances: {
    sunlight: SunLevel[];
    low_lux_tolerant: boolean;
    drought_tolerant: boolean;
    compacted_soil_tolerant: boolean;
    suitable_site_ids: string[];
  };
  ecological_interactions: {
    pollinators: string[];
    seed_dispersers_avifauna: string[];
    ecological_role: string;
  };
  estimates: {
    growth_rate_cm_per_year: number;
    canopy_coverage_m2_at_year_3: number;
    unit_cost_usd: number;
  };
  volunteer_care_schedule: {
    initial_month: CareTask[];
    maintenance_quarterly: CareTask[];
    annual: CareTask[];
  };
}

export interface SiteMeta {
  title: string;
  address: string;
  lastVisited: string;
  image: ImageSourcePropType;
}

export type TaskType = 'watering' | 'mulching' | 'compost' | 'pruning';

export interface ScheduledTask {
  id: string;
  type: TaskType;
  title: string;
  notes: string;
  plantID: string;
  plantName: string;
  date: string;
}

export type SunFilter = 'full_sun' | 'partial_shade' | 'shade';
export type HeightFilter = 'small' | 'medium' | 'tall';
export type SortKey = 'relevant' | 'height' | 'name' | 'growth';

export interface WorkspacePlan {
  site_id: string | null;
  plant_ids: string[];
  completed_task_ids: string[];
  plan_started_at: string | null;
}
