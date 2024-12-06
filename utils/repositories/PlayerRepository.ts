import { Player, Team } from "@/models/Player";
import { SQLiteDatabase } from "expo-sqlite";
import * as DbClient from "../database/database";
import { Dispatch, SetStateAction } from "react";

const GetAllPlayers = async (
  db: SQLiteDatabase,
  setPlayers: Dispatch<SetStateAction<Player[]>>,
  error: () => void
) => {
  await DbClient.GetAllPlayers(db)
  .then((allPlayers: Player[]) => {
    if (allPlayers && allPlayers.length > 0) {
      setPlayers([...allPlayers]);
    }
    else {
      setPlayers([]);
    }
  })
  .catch((err: any) => {
    error();
  });
};

const GetAllTeams = async (
  db: SQLiteDatabase,
  setTeams: Dispatch<SetStateAction<Team[]>>,
  error: () => void
) => {
  await DbClient.GetAllTeams(db)
  .then((allTeams: Team[]) => {
    if (allTeams && allTeams.length > 0) {
      setTeams([...allTeams]);
    }
    else {
      setTeams([]);
    }
  })
  .catch((err: any) => {
    error();
  })
};

const GetAllPlayersAndTeams = async (
  db: SQLiteDatabase,
  setPlayers: Dispatch<SetStateAction<Player[]>>,
  setTeams: Dispatch<SetStateAction<Team[]>>,
  error: () => void
) => {
  await DbClient.GetAllPlayers(db)
  .then((allPlayers: Player[]) => {
    if (allPlayers && allPlayers.length > 0) {
      setPlayers([...allPlayers]);
    }
    else {
      setPlayers([]);
    }
  })
  .catch((err: any) => {
    error();
  });

  await DbClient.GetAllTeams(db)
  .then((allTeams: Team[]) => {
    if (allTeams && allTeams.length > 0) {
      setTeams([...allTeams]);
    }
    else {
      setTeams([]);
    }
  })
  .catch((err: any) => {
    error();
  })
};

export { GetAllPlayers, GetAllTeams, GetAllPlayersAndTeams };