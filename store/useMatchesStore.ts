import { Match } from "@/models/v2/data/Match";
import { create } from "zustand";
import { Subscription } from "rxjs";
import { MatchesService } from "@/api/MatchesService/MatchesService";

interface MatchesStore {
  matches: Match[],
  _dbSubscription: Subscription | null,
  initMatchListener: () => void,
  terminateMatchListener: () => void,
  addMatch: (match: Match) => void,
  removeMatch: (id: string) => void,
  updateMatch: (id: string, match: Match) => void,
}

export const useMatchesStore = create<MatchesStore>((set, get) => ({
  // matches: [
  //   {
  //     id: '61bddc5b-4ae5-4467-860a-4eaa2beb03e3',
  //     type: 'doubles',
  //     date: '24/05/2026',
  //     sideA: [
  //       { id: 'aa8b2db2-343e-49d5-b136-c4ef42f6dee3', firstName: 'Jason', lastName: 'Choo', color: '#b54aa5' },
  //       { id: 'c7c60dbf-40b7-499a-8280-4f29a65b4724', firstName: 'Haney', lastName: 'Iskandar', color: '#a375f3' }
  //     ],
  //     sideB: [
  //       { id: '12df067a-da03-4dfd-a017-b116deaf6a16', firstName: 'Bryan', lastName: 'Kee', color: '#c89b3a' },
  //       { id: '1ac66ac2-4859-4cf9-983d-2f2b92e4e180', firstName: 'Nurul', lastName: 'Syfiqah Ishak', color: '#97633c' },
  //     ],
  //     sets: [[23, 21], [19, 21], [17, 21]],
  //     winner: 'B',
  //     createdAt: '2026-05-22T10:00:00.000Z',
  //   },
  //   {
  //     id: '3c318a90-4bdb-4f97-ad87-e03d4e709e6c',
  //     type: 'doubles',
  //     date: '15/05/2026',
  //     sideA: [
  //       { id: 'aa8b2db2-343e-49d5-b136-c4ef42f6dee3', firstName: 'Jason', lastName: 'Choo', color: '#b54aa5' },
  //       { id: '12df067a-da03-4dfd-a017-b116deaf6a16', firstName: 'Bryan', lastName: 'Kee', color: '#c89b3a' },
  //     ],
  //     sideB: [
  //       { id: '3c36126a-c6a7-41ba-9b42-a28d61988a3b', firstName: 'Dicky', lastName: 'Chang', color: '#79a7f7' },
  //       { id: 'c7c60dbf-40b7-499a-8280-4f29a65b4724', firstName: 'Haney', lastName: 'Iskandar', color: '#a375f3' }
  //     ],
  //     sets: [[21, 15], [21, 13]],
  //     winner: 'A',
  //     createdAt: '2026-05-20T10:00:00.000Z',
  //   },
  //   {
  //     id: 'e169392a-6b8d-4779-a4fc-bbdc5cda036f',
  //     type: 'singles',
  //     date: '22/05/2026',
  //     sideA: [
  //       { id: 'aa8b2db2-343e-49d5-b136-c4ef42f6dee3', firstName: 'Jason', lastName: 'Choo', color: '#b54aa5' },
  //     ],
  //     sideB: [
  //       { id: '12df067a-da03-4dfd-a017-b116deaf6a16', firstName: 'Bryan', lastName: 'Kee', color: '#c89b3a' },
  //     ],
  //     sets: [[18, 21]],
  //     winner: 'B',
  //     createdAt: '2026-05-22T10:00:00.000Z',
  //   },
  //   {
  //     id: '5be0f33c-71a6-4855-b599-9dfe06f09bba',
  //     type: 'doubles',
  //     date: '25/05/2026',
  //     sideA: [
  //       { id: 'aa8b2db2-343e-49d5-b136-c4ef42f6dee3', firstName: 'Jason', lastName: 'Choo', color: '#b54aa5' },
  //       { id: '12df067a-da03-4dfd-a017-b116deaf6a16', firstName: 'Bryan', lastName: 'Kee', color: '#c89b3a' },
  //     ],
  //     sideB: [
  //       { id: '3c36126a-c6a7-41ba-9b42-a28d61988a3b', firstName: 'Dicky', lastName: 'Chang', color: '#79a7f7' },
  //       { id: '1127d5a1-4a23-474c-bd35-f4cbb60aab30', firstName: 'Ngoi', lastName: 'Kar Kian', color: '#a375f3' },
  //     ],
  //     sets: [[17, 21], [21, 12], [16, 21]],
  //     winner: 'B',
  //     createdAt: '2026-05-25T10:00:00.000Z',
  //   },
  //   {
  //     id: 'b519d4f5-0528-4862-93c3-d641876de4f6',
  //     type: 'doubles',
  //     date: '25/05/2026',
  //     sideA: [
  //       { id: 'c7c60dbf-40b7-499a-8280-4f29a65b4724', firstName: 'Haney', lastName: 'Iskandar', color: '#a375f3' },
  //       { id: '1ac66ac2-4859-4cf9-983d-2f2b92e4e180', firstName: 'Nurul', lastName: 'Syfiqah Ishak', color: '#97633c' },
  //     ],
  //     sideB: [
  //       { id: '54899b82-cdf2-482a-ac53-545dcb39752f', firstName: 'Humaira', lastName: 'Shuheimi', color: '#219677' },
  //       { id: '27175d54-8677-415a-9a81-f57304730f20', firstName: 'Jeevitha', lastName: 'Patmanathan', color: '#c89b3a' },
  //     ],
  //     sets: [[21, 9]],
  //     winner: 'A',
  //     createdAt: '2026-05-25T10:00:00.000Z',
  //   },
  //   {
  //     id: 'b519d4f5-0528-4862-93c3-d641876de4f6',
  //     type: 'doubles',
  //     date: '25/05/2026',
  //     sideA: [
  //       { id: 'aa8b2db2-343e-49d5-b136-c4ef42f6dee3', firstName: 'Jason', lastName: 'Choo', color: '#b54aa5' },
  //       { id: '3c36126a-c6a7-41ba-9b42-a28d61988a3b', firstName: 'Dicky', lastName: 'Chang', color: '#79a7f7' },
  //     ],
  //     sideB: [
  //       { id: '99cf2d5f-e235-43ad-8b1a-93336f9ccf6a', firstName: 'Aaron', lastName: 'Wee', color: '#219677' },
  //       { id: '12df067a-da03-4dfd-a017-b116deaf6a16', firstName: 'Bryan', lastName: 'Kee', color: '#c89b3a' },
  //     ],
  //     sets: [[21, 16], [21, 11]],
  //     winner: 'A',
  //     createdAt: '2026-05-25T10:00:00.000Z',
  //   },
  //   {
  //     id: 'b519d4f5-0528-4862-93c3-d641876de4f6',
  //     type: 'doubles',
  //     date: '25/05/2026',
  //     sideA: [
  //       { id: '99cf2d5f-e235-43ad-8b1a-93336f9ccf6a', firstName: 'Aaron', lastName: 'Wee', color: '#219677' },
  //       { id: '933a9e9b-2a10-44ce-9080-d9c51598834e', firstName: 'Tee', lastName: 'Shei Weon', color: '#219677' },
  //     ],
  //     sideB: [
  //       { id: 'aa8b2db2-343e-49d5-b136-c4ef42f6dee3', firstName: 'Jason', lastName: 'Choo', color: '#b54aa5' },
  //       { id: '27175d54-8677-415a-9a81-f57304730f20', firstName: 'Jeevitha', lastName: 'Patmanathan', color: '#c89b3a' },
  //     ],
  //     sets: [[17, 21]],
  //     winner: 'B',
  //     createdAt: '2026-05-25T10:00:00.000Z',
  //   },
  // ],
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

  addMatch: async (match: Match) => {
    try {
      await MatchesService.AddMatch({ ...match });
    }
    catch (err: any) {
      console.error('Something went wrong.', err);
    }
  },
  
  removeMatch: (id: string) => set((state) => ({
    matches: [...state.matches.filter(m => m.id !== id)]
  })),
  updateMatch: (id: string, match: Match) => set((state) => ({
    matches: [...state.matches.map(m => m.id === id ? { ...match } : { ...m })]
  })),
}));