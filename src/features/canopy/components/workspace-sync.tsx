import { useEffect } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { useWorkspaceStore } from '@/features/canopy/store/workspace-store';

export function WorkspaceSync() {
  const { user, loading } = useAuth();
  const load = useWorkspaceStore((s) => s.load);
  const reset = useWorkspaceStore((s) => s.reset);

  useEffect(() => {
    if (loading) return;
    if (user) {
      void load(user.id);
      return;
    }
    reset();
  }, [user, loading, load, reset]);

  return null;
}
