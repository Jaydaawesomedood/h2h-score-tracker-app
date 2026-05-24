import { Match } from "@/models/v2/data/Match";
import { create } from "zustand";

interface MatchesStore {
  matches: Match[],
  addMatch: (match: Match) => void,
  removeMatch: (id: string) => void,
  updateMatch: (id: string, match: Match) => void,
}

export const useMatchesStore = create<MatchesStore>((set) => ({
  matches: [
    {
      id: '61bddc5b-4ae5-4467-860a-4eaa2beb03e3',
      type: 'doubles',
      date: '24/05/2026',
      sideA: [
        { id: 'aa8b2db2-343e-49d5-b136-c4ef42f6dee3', firstName: 'Jason', lastName: 'Choo', color: '#b54aa5' },
        { id: 'c7c60dbf-40b7-499a-8280-4f29a65b4724', firstName: 'Haney', lastName: 'Iskandar', color: '#a375f3' }
      ],
      sideB: [
        { id: '12df067a-da03-4dfd-a017-b116deaf6a16', firstName: 'Bryan', lastName: 'Kee', color: '#c89b3a' },
        { id: '1ac66ac2-4859-4cf9-983d-2f2b92e4e180', firstName: 'Nurul', lastName: 'Syfiqah Ishak', color: '#97633c' },
      ],
      sets: [[23, 21], [19, 21], [17, 21]],
      winner: 'B',
      createdAt: '2026-05-22T10:00:00.000Z',
    },
    {
      id: '3c318a90-4bdb-4f97-ad87-e03d4e709e6c',
      type: 'doubles',
      date: '15/05/2026',
      sideA: [
        { id: 'aa8b2db2-343e-49d5-b136-c4ef42f6dee3', firstName: 'Jason', lastName: 'Choo', color: '#b54aa5' },
        { id: '12df067a-da03-4dfd-a017-b116deaf6a16', firstName: 'Bryan', lastName: 'Kee', color: '#c89b3a' },
      ],
      sideB: [
        { id: '3c36126a-c6a7-41ba-9b42-a28d61988a3b', firstName: 'Dicky', lastName: 'Chang', color: '#79a7f7' },
        { id: 'c7c60dbf-40b7-499a-8280-4f29a65b4724', firstName: 'Haney', lastName: 'Iskandar', color: '#a375f3' }
      ],
      sets: [[21, 15], [21, 13]],
      winner: 'A',
      createdAt: '2026-05-20T10:00:00.000Z',
    },
    {
      id: 'e169392a-6b8d-4779-a4fc-bbdc5cda036f',
      type: 'singles',
      date: '22/05/2026',
      sideA: [
        { id: 'aa8b2db2-343e-49d5-b136-c4ef42f6dee3', firstName: 'Jason', lastName: 'Choo', color: '#b54aa5' },
      ],
      sideB: [
        { id: '12df067a-da03-4dfd-a017-b116deaf6a16', firstName: 'Bryan', lastName: 'Kee', color: '#c89b3a' },
      ],
      sets: [[18, 21]],
      winner: 'B',
      createdAt: '2026-05-22T10:00:00.000Z',
    },
  ],
  addMatch: (match: Match) => set((state) => ({ matches: [...state.matches, match] })),
  removeMatch: (id: string) => set((state) => ({
    matches: [...state.matches.filter(m => m.id !== id)]
  })),
  updateMatch: (id: string, match: Match) => set((state) => ({
    matches: [...state.matches.map(m => m.id === id ? { ...match } : { ...m })]
  })),
}));