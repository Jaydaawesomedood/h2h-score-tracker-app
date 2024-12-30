import { Match } from "./Match";
import { Player, Team } from "./Player";

export interface Stats {
  total: number;
  won: number;
  winRate: string;
};

export interface StatsByCategory {
  category: string;
  stats: Stats;
};

export interface StatsByPartner {
  id: string,
  category: string,
  partner: Player,
  totalGames: number,
  gamesWon: number,
  winRate: string,
};


export interface PlayerMatchSummary {
  overall: Stats;
  categories: StatsByCategory[];
};

export interface H2HStats {
  opponent: Player | Team;
  h2h: number[];
  sets: number[];
  points?: number[];
  recentMatch: Match;
};