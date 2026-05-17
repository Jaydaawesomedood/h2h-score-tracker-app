import { Player } from "@/models/v2/data/Player";
import { create } from "zustand";

interface PlayersStore {
  players: Player[],
  addPlayer: (player: Player) => void,
  removePlayer: (id: string) => void,
  updatePlayer: (player: Player) => void,
}

export const usePlayersStore = create<PlayersStore>((set) => ({
  players: [
    { id: 'aa8b2db2-343e-49d5-b136-c4ef42f6dee3', firstName: 'Jason', lastName: 'Choo', color: '#b54aa5' },
    { id: '12df067a-da03-4dfd-a017-b116deaf6a16', firstName: 'Bryan', lastName: 'Kee', color: '#c89b3a' },
    { id: 'c7c60dbf-40b7-499a-8280-4f29a65b4724', firstName: 'Haney', lastName: 'Iskandar', color: '#a375f3' },
    { id: '3c36126a-c6a7-41ba-9b42-a28d61988a3b', firstName: 'Dicky', lastName: 'Chang', color: '#79a7f7' },
    { id: '933a9e9b-2a10-44ce-9080-d9c51598834e', firstName: 'Tee', lastName: 'Shei Weon', color: '#219677' },
    { id: '1ac66ac2-4859-4cf9-983d-2f2b92e4e180', firstName: 'Nurul', lastName: 'Syfiqah Ishak', color: '#97633c' },
    { id: '27175d54-8677-415a-9a81-f57304730f20', firstName: 'Jeevitha', lastName: 'Patmanathan', color: '#c89b3a' },
  ],
  addPlayer: (player: Player) => set((state) => ({ players: [...state.players, player] })),
  removePlayer: (id: string) => set((state) => ({
    players: [...state.players.slice().splice(state.players.findIndex(pl => pl.id === id), 1)]
  })),
  updatePlayer: (player: Player) => set((state) => ({
    players: [...state.players.map(pl => pl.id === player.id ? { ...player } : { ...pl })]
  })),
}));