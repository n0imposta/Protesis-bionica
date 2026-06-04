import { create } from "zustand";

type WorkspaceState = {
  activeProjectId: string | null;
  setActiveProject: (projectId: string) => void;
};

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  activeProjectId: null,
  setActiveProject: (projectId) => set({ activeProjectId: projectId }),
}));
