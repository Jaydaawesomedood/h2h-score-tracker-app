import { Match } from "@/models/v2/data/Match";
import { create } from "zustand";
import { Subscription } from "rxjs";
import { MatchesService } from "@/api/MatchesService/MatchesService";

interface MatchesStore {
  matches: Match[],
  _dbSubscription: Subscription | null,
  initMatchListener: () => void,
  terminateMatchListener: () => void,
  addMatch: (match: Match & Omit<Match, 'id' | 'createdAt'>) => void,
  removeMatch: (id: string) => Promise<boolean>,
  updateMatch: (match: Match) => Promise<void>,
}

export const useMatchesStore = create<MatchesStore>((set, get) => ({
  matches: [],
  _dbSubscription: null,

  // TODO - fetch by limit/offset to improve performance
  initMatchListener: () => {
    if (get()._dbSubscription) return;

    const subscription = MatchesService.ObserveAllMatches().subscribe({
      next: (matches) => {
        set(() => ({ matches: [...matches] }));
      },
      error: (err) => {
        console.error('Something went wrong.', err);
      }
    });

    set({ _dbSubscription: subscription });
  },

  terminateMatchListener: () => {
    const { _dbSubscription } = get();
    if (_dbSubscription) {
      _dbSubscription.unsubscribe();
      set({ _dbSubscription: null, matches: [] });
    }
  },

  addMatch: async (match: Match & Omit<Match, 'id' | 'createdAt'>) => {
    try {
      await MatchesService.AddMatch({ ...match });
    }
    catch (err: any) {
      console.error('Something went wrong.', err);
    }
  },
  
  removeMatch: async (id: string) => {
    try {
      const success = await MatchesService.DeleteMatch(id);
      return success;
    }
    catch (err: any) {
      console.error('Something went wrong.', err);
      return false;
    }
  },

  updateMatch: async (match: Match) => {
    try {
      await MatchesService.UpdateMatch(match);
    }
    catch (err: any) {
      console.error('Something went wrong.', err)
    }
  },
}));