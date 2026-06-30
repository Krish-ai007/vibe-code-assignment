import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Platform, UserProfileSummary } from "@/types";

export interface ListedProfile extends UserProfileSummary {
  platform: Platform;
  addedAt: number;
}

interface ListState {
  profiles: ListedProfile[];
  addProfile: (profile: UserProfileSummary, platform: Platform) => void;
  removeProfile: (userId: string) => void;
  toggleProfile: (profile: UserProfileSummary, platform: Platform) => void;
  isInList: (userId: string) => boolean;
  clearList: () => void;
}

export const useListStore = create<ListState>()(
  persist(
    (set, get) => ({
      profiles: [],

      addProfile: (profile, platform) => {
        if (get().isInList(profile.user_id)) return;
        set((state) => ({
          profiles: [
            ...state.profiles,
            { ...profile, platform, addedAt: Date.now() },
          ],
        }));
      },

      removeProfile: (userId) => {
        set((state) => ({
          profiles: state.profiles.filter((p) => p.user_id !== userId),
        }));
      },

      toggleProfile: (profile, platform) => {
        const { isInList, addProfile, removeProfile } = get();
        if (isInList(profile.user_id)) {
          removeProfile(profile.user_id);
        } else {
          addProfile(profile, platform);
        }
      },

      isInList: (userId) => get().profiles.some((p) => p.user_id === userId),

      clearList: () => set({ profiles: [] }),
    }),
    {
      name: "wobb-influencer-list", // localStorage key -> persists across refreshes
    }
  )
);
