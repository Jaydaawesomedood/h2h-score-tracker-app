import { LayoutChangeEvent } from "react-native";
import { Match } from "../data/Match";

export type PlayerProfileTab = {
  matches: Match[],
  playerId: string,
  onLayout: (event: LayoutChangeEvent) => void,
}

export type PlayerOverview = {
  overall: OverviewCategory,
  singles: OverviewCategory,
  doubles: OverviewCategory,
}

export type OverviewCategory = {
  wins: OverviewData,
  losses: OverviewData,
  winRate: OverviewData,
}

type OverviewData = {
  value: any,
  label: string,
  color?: string,
}

export type PlayerStats = {
  stats: {
    matchesPlayed: number,
    matchesWon: number,
    matchesLost: number,
    setsPlayed: number,
    setsWon: number,
    winRate: string,
  }
}