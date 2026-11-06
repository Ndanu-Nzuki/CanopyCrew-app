import { useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { useWorkspaceStore } from '@/features/canopy/store/workspace-store';
import {
  getSite,
  getSiteMeta,
  getSpecies,
  sites,
  speciesForSite,
} from '@/features/canopy/utils/catalogue';
import type { Species } from '@/features/canopy/types/canopy';
import { buildSchedule, fromKey, todayKey, weekRange } from '@/features/canopy/utils/schedule';
import { confirmDelete } from '@/lib/confirm';

export function useWorkspaceScreen() {
  const { user, signOut } = useAuth();
  const store = useWorkspaceStore();
  const { plan } = store;
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selected, setSelected] = useState(todayKey());
  const [pickerOpen, setPickerOpen] = useState(false);

  const site = getSite(plan.site_id) ?? sites[0];
  const meta = getSiteMeta(site.site_id);
  const recommended = speciesForSite(site.site_id);
  const chosen = plan.plant_ids.map((id) => getSpecies(id)).filter((s): s is Species => s !== undefined);
  const schedule = buildSchedule(chosen, plan.plan_started_at);
  const week = weekRange(new Date());
  const weekTasks = schedule.filter((t) => t.date >= week.start && t.date <= week.end);
  const weekDone = weekTasks.filter((t) => plan.completed_task_ids.includes(t.id)).length;
  const dayTasks = schedule.filter((t) => t.date === selected);

  const ensureSite = () => {
    if (plan.site_id === null) store.chooseSite(site.site_id);
  };

  return {
    user,
    plan,
    syncError: store.syncError,
    site,
    meta,
    recommended,
    chosen,
    schedule,
    weekTasks,
    weekDone,
    allWeekDone: weekTasks.length > 0 && weekDone === weekTasks.length,
    dayTasks,
    month,
    selected,
    pickerOpen,
    togglePicker: () => {
      ensureSite();
      setPickerOpen((o) => !o);
    },
    selectDay: (key: string) => setSelected(key),
    shiftMonth: (delta: number) => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1)),
    jumpToFirstTask: () => {
      const first = schedule[0];
      if (!first) return;
      const d = fromKey(first.date);
      setMonth(new Date(d.getFullYear(), d.getMonth(), 1));
      setSelected(first.date);
    },
    chooseSite: (id: string) => {
      if (id === plan.site_id) return;
      if (plan.plant_ids.length === 0) {
        store.chooseSite(id);
        return;
      }
      confirmDelete({
        title: 'Switch site?',
        message: 'Your chosen plants and ticked tasks for this site will be cleared.',
        confirmLabel: 'Switch',
        onConfirm: () => store.chooseSite(id),
      });
    },
    isChosen: (id: string) => plan.plant_ids.includes(id),
    togglePlant: (id: string) => {
      ensureSite();
      useWorkspaceStore.getState().togglePlant(id);
    },
    isDone: (id: string) => plan.completed_task_ids.includes(id),
    toggleTask: store.toggleTask,
    signOut: () => {
      confirmDelete({
        title: 'Sign out?',
        message: 'Your workspace stays saved to your account.',
        confirmLabel: 'Sign out',
        onConfirm: () => void signOut(),
      });
    },
  };
}
