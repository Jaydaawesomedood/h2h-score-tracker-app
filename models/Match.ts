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

// (id, team1ID, team2ID, category, score (sets are delimited with , while opponents are delimited with -), datetime)