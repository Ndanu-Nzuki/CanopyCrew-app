import { useAuth } from '@/contexts/AuthContext';
import { useWorkspaceStore } from '@/features/canopy/store/workspace-store';
import { getSiteMeta, species, speciesForSite } from '@/features/canopy/utils/catalogue';

export function usePlantingProgress() {
  const { user } = useAuth();
  const plan = useWorkspaceStore((s) => s.plan);

  if (!user) {
    return {
      planted: 0,
      goal: species.length,
      caption: 'Native species planted',
      hint: 'Open My Workspace to plan a site and track what you plant.',
    };
  }
  if (!plan.site_id) {
    return {
      planted: 0,
      goal: species.length,
      caption: 'Native species planted',
      hint: 'Pick a site in your workspace to start planting.',
    };
  }
  return {
    planted: plan.plant_ids.length,
    goal: speciesForSite(plan.site_id).length,
    caption: `Native species planted · ${getSiteMeta(plan.site_id).title}`,
    hint: null,
  };
}
