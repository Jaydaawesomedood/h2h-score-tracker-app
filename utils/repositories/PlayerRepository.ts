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

// TODO - no references, might deprecate this
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

// TODO - deprecate this
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

async function GetAllPlayersV2(
  db: SQLiteDatabase,
  setPlayers: (players: Player[]) => void,
  error: () => void,
) {
  try {
    const allPlayers = await DbClient.GetAllPlayers(db);
    setPlayers(allPlayers && allPlayers.length > 0 ? [...allPlayers] : []);
  }
  catch (err: any) {
    error();
  }
}

async function GetAllTeamsV2(
  db: SQLiteDatabase,
  setTeams: (teams: Team[]) => void,
  error: () => void,
) {
  try {
    const allTeams = await DbClient.GetAllTeams(db);
    setTeams(allTeams && allTeams.length > 0 ? [...allTeams] : []);
  }
  catch (err: any) {
    error();
  }
}

async function GetAllParticipants(
  db: SQLiteDatabase,
  setPlayers: (players: Player[]) => void,
  setTeams: (teams: Team[]) => void,
  error: () => void
) {
  try {
    await GetAllPlayersV2(db, setPlayers, error);
    await GetAllTeamsV2(db, setTeams, error);
  }
  catch (err: any) {
    error();
  }
};

export { GetAllPlayers, GetAllTeams, GetAllPlayersAndTeams, GetAllPlayersV2, GetAllTeamsV2, GetAllParticipants };