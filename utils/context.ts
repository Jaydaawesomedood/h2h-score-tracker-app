import { Player, Team } from "@/models/Player";
import { createContext, Dispatch, SetStateAction } from "react";
import * as SQLite from 'expo-sqlite';
import { Categories } from "@/models/Categories.enum";
import { create } from "zustand";

type AddTeamContext = {
  players: Player[],
  setPlayers: Dispatch<SetStateAction<Player[]>>,
  setCategory: Dispatch<SetStateAction<string>>
};

// TODO - refactor context to one match property
type AddMatchContext = {
  setting: string;
  date: string;
  category: "singles" | "doubles";
  subCategory: string;
  teams: Player[] | Team[];
  score: Number[][];
  setSetting: Dispatch<SetStateAction<string>>;
  setDate: Dispatch<SetStateAction<string>>;
  setCategory: Dispatch<SetStateAction<"singles" | "doubles">>;
  setSubCategory: Dispatch<SetStateAction<string>>;
  setTeams: Dispatch<SetStateAction<Player[] | Team[]>>;
  setScore: Dispatch<SetStateAction<Number[][]>>;
  playersList: Player[];
  teamsList: Team[];
};

type EditMatchContext = {
  setting: string;
  date: string;
  score: Number[][];
  category: "singles" | "doubles";
  teams: Player[] | Team[];
  setSetting: Dispatch<SetStateAction<string>>;
  setDate: Dispatch<SetStateAction<string>>;
  setScore: Dispatch<SetStateAction<Number[][]>>;
};

export const TeamPlayersContext = createContext<AddTeamContext>({ players: [], setPlayers: () => {}, setCategory: () => {} });

// TODO - refactor context to one match property
export const AddMatchContext = createContext<AddMatchContext>({
  setting: "",
  date: "",
  category: "singles",
  subCategory: Categories.Unspecified,
  teams: [],
  score: [],
  setSetting: () => {},
  setDate: () => {},
  setCategory: () => {},
  setSubCategory: () => {},
  setTeams: () => {},
  setScore: () => {},
  playersList: [],
  teamsList: [],
});

export const EditMatchContext = createContext<EditMatchContext>({
  setting: "",
  date: "",
  category: "singles",
  teams: [],
  score: [],
  setSetting: () => {},
  setDate: () => {},
  setScore: () => {},
});

// Creating the database context
export const DbContext = createContext<SQLite.SQLiteDatabase | undefined>(undefined);


type StepperContext = {
  currentStep: number;
  setIsNextBtnDisabled: Dispatch<SetStateAction<boolean>>;
};

export const StepperContext = createContext<StepperContext>({ currentStep: 0, setIsNextBtnDisabled: () => {} });


interface ProfileStore {
  profile: any,
  setProfile: (profile: any) => void,
  clearProfile: () => void,
};

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: {},
  setProfile: (profile: any) => set({ profile: profile }),
  clearProfile: () => set({ profile: {} }),
}));