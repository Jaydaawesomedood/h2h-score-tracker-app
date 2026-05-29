import { PlayersService } from "@/api/players/PlayersService";
import { Player } from "@/models/v2/data/Player";
import { create } from "zustand";
import { Subscription } from "rxjs"; 

interface PlayersStore {
  players: Player[],
  _dbSubscription: Subscription | null,
  initPlayerListener: () => void,
  terminatePlayerListener: () => void,
  addPlayer: (player: Player) => Promise<void>,
  removePlayer: (id: string) => Promise<boolean>,
  updatePlayer: (player: Player) => Promise<void>,
}

export const usePlayersStore = create<PlayersStore>((set, get) => ({
  // players: [
  //   { id: 'aa8b2db2-343e-49d5-b136-c4ef42f6dee3', firstName: 'Jason', lastName: 'Choo', color: '#b54aa5' },
  //   { id: '12df067a-da03-4dfd-a017-b116deaf6a16', firstName: 'Bryan', lastName: 'Kee', color: '#c89b3a' },
  //   { id: 'c7c60dbf-40b7-499a-8280-4f29a65b4724', firstName: 'Haney', lastName: 'Iskandar', color: '#a375f3' },
  //   { id: '3c36126a-c6a7-41ba-9b42-a28d61988a3b', firstName: 'Dicky', lastName: 'Chang', color: '#79a7f7' },
  //   { id: '933a9e9b-2a10-44ce-9080-d9c51598834e', firstName: 'Tee', lastName: 'Shei Weon', color: '#219677' },
  //   { id: '1ac66ac2-4859-4cf9-983d-2f2b92e4e180', firstName: 'Nurul', lastName: 'Syfiqah Ishak', color: '#97633c' },
  //   { id: '27175d54-8677-415a-9a81-f57304730f20', firstName: 'Jeevitha', lastName: 'Patmanathan', color: '#c89b3a' },
  //   { id: '1127d5a1-4a23-474c-bd35-f4cbb60aab30', firstName: 'Ngoi', lastName: 'Kar Kian', color: '#a375f3' },
  //   { id: '99cf2d5f-e235-43ad-8b1a-93336f9ccf6a', firstName: 'Aaron', lastName: 'Wee', color: '#219677' },
  //   { id: '54899b82-cdf2-482a-ac53-545dcb39752f', firstName: 'Humaira', lastName: 'Shuheimi', color: '#219677' },
  // ],
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
      await PlayersService.AddPlayer({ ...player, isMe: get().players.length === 0 });
    }
    catch (err: any) {
      console.error('Something went wrong.', err);
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
  // updatePlayer: (id: string, player: Player) => set((state) => ({
  //   players: [...state.players.map(pl => pl.id === id ? { ...player } : { ...pl })]
  // })),
}));