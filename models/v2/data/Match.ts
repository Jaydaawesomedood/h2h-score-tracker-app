import { Player } from "./Player";

export type Match = {
  id: string,
  type: 'singles' | 'doubles',
  date: string,
  sets: number[][],
  sideA: Player[],
  sideB: Player[],
  winner: 'A' | 'B',
  createdAt: string,
};