import { Match } from "./Match";
import { Player } from "./Player";

export interface Profile {
  id: string;
  matches: Match[];
};

export interface PlayerProfile extends Profile {
  player?: Player;
};