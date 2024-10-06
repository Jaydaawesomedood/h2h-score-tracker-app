import { Categories } from "./Categories.enum";
import { Genders } from "./Genders.enum";

export interface Participant {
  id: string;
}

export interface Player extends Participant {
  firstName: string;
  lastName: string;
  lastNameFirst: boolean | number;
  gender: Genders;
};

export interface Team extends Participant {
  name: string;
  category: Categories;
  players: Player[];
};