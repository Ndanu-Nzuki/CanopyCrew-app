import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { WorkspacePlan } from '@/features/canopy/types/canopy';
import { todayKey } from '@/features/canopy/utils/schedule';
import { zustandStorage } from '@/lib/storage';
import { apiGet, apiPut } from '@/utils/api';

const emptyPlan: WorkspacePlan = {
  site_id: null,
  plant_ids: [],
  completed_task_ids: [],
  plan_started_at: null,
};

interface WorkspaceState {
  userID: string | null;
  plan: WorkspacePlan;
  syncing: boolean;
  syncError: string | null;
  load: (userID: string) => Promise<void>;
  reset: () => void;
  chooseSite: (siteID: string) => void;
  togglePlant: (plantID: string) => void;
  setPlants: (plantIDs: string[]) => void;
  toggleTask: (taskID: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => {
      const save = async (plan: WorkspacePlan) => {
        set({ plan, syncError: null });
        try {
          await apiPut('/workspace', plan);
        } catch {
          set({ syncError: "Couldn't save to your account. Check your connection." });
        }
      };

      return {
        userID: null,
        plan: emptyPlan,
        syncing: false,
        syncError: null,
        load: async (userID) => {
          if (get().userID !== userID) set({ userID, plan: emptyPlan });
          set({ syncing: true });
          try {
            const remote = await apiGet<WorkspacePlan>('/workspace');
            set({ plan: { ...emptyPlan, ...remote }, syncing: false, syncError: null });
          } catch {
            set({ syncing: false, syncError: "Couldn't load your workspace. Showing the last saved copy." });
          }
        },
        reset: () => set({ userID: null, plan: emptyPlan, syncError: null }),
        chooseSite: (siteID) => {
          const { plan } = get();
          if (plan.site_id === siteID) return;
          void save({ site_id: siteID, plant_ids: [], completed_task_ids: [], plan_started_at: null });
        },
        togglePlant: (plantID) => {
          const { plan } = get();
          const has = plan.plant_ids.includes(plantID);
          const plant_ids = has ? plan.plant_ids.filter((p) => p !== plantID) : [...plan.plant_ids, plantID];
          void save({
            ...plan,
            plant_ids,
            plan_started_at: plant_ids.length === 0 ? null : (plan.plan_started_at ?? todayKey()),
          });
        },
        setPlants: (plant_ids) => {
          const { plan } = get();
          void save({
            ...plan,
            plant_ids,
            plan_started_at: plant_ids.length === 0 ? null : (plan.plan_started_at ?? todayKey()),
          });
        },
        toggleTask: (taskID) => {
          const { plan } = get();
          const done = plan.completed_task_ids.includes(taskID);
          void save({
            ...plan,
            completed_task_ids: done
              ? plan.completed_task_ids.filter((t) => t !== taskID)
              : [...plan.completed_task_ids, taskID],
          });
        },
      };
    },
    {
      name: 'canopy-workspace',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (s) => ({ userID: s.userID, plan: s.plan }),
    },
  ),
);
