import { Categories } from "./Categories.enum";
import { Player, Team } from "./Player";

export interface Match {
  id: string;
  teams: Player[] | Team[];
  category: Categories;
  mode: string;
  tournament?: string;
  score: Number[][];
  datetime: string;
};

export interface MatchLite {
  id: string;
  mode: string;
  category: string;
  participant1ID: string;
  participant2ID: string;
  score: Number[][];
  tournamentID: string;
  datetime: string;
};