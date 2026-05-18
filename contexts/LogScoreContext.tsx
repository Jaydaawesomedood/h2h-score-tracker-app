import { Player } from "@/models/v2/data/Player";
import React, { createContext } from "react";

type LogScore = {
  type: 'singles' | 'doubles' | undefined,
  date: string,
  sets: number[][],
  sideA: Player[],
  sideB: Player[],
  setType: React.Dispatch<React.SetStateAction<'singles' | 'doubles' | undefined>>,
  setDate: React.Dispatch<React.SetStateAction<string>>,
  setSets: React.Dispatch<React.SetStateAction<number[][]>>,
  setSideA: React.Dispatch<React.SetStateAction<Player[]>>,
  setSideB: React.Dispatch<React.SetStateAction<Player[]>>,
};

export const LogScoreContext = createContext<LogScore>({
  type: undefined,
  date: '',
  sets: [],
  sideA: [],
  sideB: [],
  setType: () => {},
  setDate: () => {},
  setSets: () => {},
  setSideA: () => {},
  setSideB: () => {},
});