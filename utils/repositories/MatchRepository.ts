import { SQLiteDatabase } from "expo-sqlite";
import * as DbClient from "../database/database";
import { Dispatch, SetStateAction } from "react";
import { Match } from "@/models/Match";

const GetAllMatches = async (
  db: SQLiteDatabase,
  setSinglesMatches: (matches: Match[]) => void,
  setDoublesMatches: (matches: Match[]) => void,
  error: () => void
) => {
  await DbClient.GetAllSinglesMatches(db)
  .then((allSinglesMatches: Match[]) => {
    if (allSinglesMatches && allSinglesMatches.length > 0) {
      setSinglesMatches([...allSinglesMatches]);
    }
    else {
      setSinglesMatches([]);
    }
  })
  .catch((err: any) => {
    error();
  });

  await DbClient.GetAllDoublesMatches(db)
  .then((allDoublesMatches: Match[]) => {
    if (allDoublesMatches && allDoublesMatches.length > 0) {
      setDoublesMatches([...allDoublesMatches]);
    }
    else {
      setDoublesMatches([]);
    }
  })
  .catch((err: any) => {
    error();
  });
};

async function GetAllMatchesV2(
  db: SQLiteDatabase,
  setSinglesMatches: (matches: Match[]) => void,
  setDoublesMatches: (matches: Match[]) => void,
  error: () => void,
) {
  try {
    const allSinglesMatches = await DbClient.GetAllSinglesMatches(db);
    const allDoublesMatches = await DbClient.GetAllDoublesMatches(db);

    setSinglesMatches(allSinglesMatches.length > 0 ? [...allSinglesMatches] : []);
    setDoublesMatches(allDoublesMatches.length > 0 ? [...allDoublesMatches] : []);
  }
  catch (err: any) {
    error();
  }
}

const GetMatch = async (
  db: SQLiteDatabase,
  category: "singles" | "doubles",
  id: string,
  setMatch: Dispatch<SetStateAction<Match | undefined>>,
  error: () => void
) => {
  try {
    let match;

    if (category === "doubles") {
      match = await DbClient.GetDoublesMatch(db, id);
    }
    else {
      match = await DbClient.GetSinglesMatch(db, id);
    }

    setMatch(match);
  }
  catch (err: any) {
    error();
  }
};

export { GetAllMatches, GetMatch, GetAllMatchesV2 };