import { PlayersService } from "@/api/players/PlayersService";
import { Player } from "@/models/v2/data/Player";
import { create } from "zustand";
import { Subscription } from "rxjs"; 

interface PlayersStore {
  players: Player[],
  _dbSubscription: Subscription | null,
  initPlayerListener: () => void,
  terminatePlayerListener: () => void,
  addPlayer: (player: Player) => Promise<string | undefined>,
  removePlayer: (id: string) => Promise<boolean>,
  updatePlayer: (player: Player) => Promise<void>,
}

export const usePlayersStore = create<PlayersStore>((set, get) => ({
  players: [],
  _dbSubscription: null,

  // TODO - fetch by limit/offset to improve performance
  initPlayerListener: () => {
    if (get()._dbSubscription) return;

    const subscription = PlayersService.ObserveAllPlayers().subscribe({
      next: (players) => {
        set(() => ({ players: [...players] }));
      },
      error: (err) => {
        console.error('Something went wrong.', err);
      }
    });

    set({ _dbSubscription: subscription });
  },

  terminatePlayerListener: () => {
    const { _dbSubscription } = get();
    if (_dbSubscription) {
      _dbSubscription.unsubscribe();
      set({ _dbSubscription: null, players: [] });
    }
  },

  addPlayer: async (player: Player) => {
    try {
      const newPlayer = await PlayersService.AddPlayer({ ...player, isMe: get().players.length === 0 });
      return newPlayer.id;
    }
    catch (err: any) {
      console.error('Something went wrong.', err);
      return undefined;
    }
  },

  removePlayer: async (id: string) => {
    try {
      const success = await PlayersService.DeletePlayer(id);
      return success;
    }
    catch (err: any) {
      console.error('Something went wrong.', err);
      return false;
    }
  },

  updatePlayer: async (player: Player) => {
    try {
      await PlayersService.UpdatePlayer(player);
    }
    catch (err: any) {
      console.error('Something went wrong.', err)
    }
  }
}));