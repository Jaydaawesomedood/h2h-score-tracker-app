import { DbQueries } from "@/constants/messages/DbQueries";
import { Match, MatchLite } from "@/models/Match";
import { Player, Team } from "@/models/Player";
import { SQLiteBindParams, SQLiteDatabase } from "expo-sqlite";
import moment from "moment";

export async function InsertPlayer(db: SQLiteDatabase, params: SQLiteBindParams) {
  const id = await GenerateId(db, "players");

  if (id !== "") {
    await db.runAsync(
      `INSERT INTO players (id, firstName, lastName, lastNameFirst, gender) VALUES ('${id}', ?, ?, ?, ?)`,
      params
    )
    .catch((error: any) => {
      console.log(error);
    });
  }
};

export async function GetAllPlayers(db: SQLiteDatabase) {
  const players = await db.getAllAsync<Player>('SELECT * FROM players').catch((error: any) => {
    console.log(error);
  });

  return players ?? [];
};

export async function GetPlayer(db: SQLiteDatabase, id: string) {
  const player = await db.getFirstAsync<Player>(`SELECT * FROM players WHERE id = ?`, id).catch((error: any) => {
    console.log(error);
  });

  return player ?? undefined;
};

export async function UpdatePlayer(db: SQLiteDatabase, params: SQLiteBindParams) {
  await db.runAsync(
    `UPDATE players SET firstName = ?, lastName = ?, lastNameFirst = ?, gender = ? WHERE id = ?`,
    params
  )
  .catch((error: any) => {
    console.log(error);
  });
};

export async function DeletePlayer(db: SQLiteDatabase, id: string) {
  // Get all teams player to be deleted is in
  const allTeams = await GetAllTeamsByPlayer(db, id);
  const allTeamsId: string[] = allTeams.map((t: Team) => `\'${t.id}\'`);

  // Get all singles matches where player to be deleted is in
  const allMatches = await GetAllMatchesByPlayer(db, id);
  const allSinglesMatches: Match[] = allMatches.slice().filter((m: Match) => m.id.toLowerCase().startsWith("sm"));
  const allSinglesMatchesId: string[] = allSinglesMatches.map((m: Match) => `\'${m.id}\'`);

  // Get all doubles matches for all teams player to be deleted is in
  const allDoublesMatches: Match[] = allMatches.slice().filter((m: Match) => m.id.toLowerCase().startsWith("dm"));
  const allDoublesMatchesId: string[] = allDoublesMatches.map((m: Match) => `\'${m.id}\'`);

  // Delete matches
  await DeleteMatchesInBulk(db, allSinglesMatchesId.join(", "), "singles");
  await DeleteMatchesInBulk(db, allDoublesMatchesId.join(", "), "doubles");

  // Delete teams
  await DeleteTeamsInBulk(db, allTeamsId.join(", "));

  // Delete player
  await db.runAsync(`DELETE FROM players WHERE id = ?`, id).catch((error: any) => {
    console.log(error);
  });
};

export async function InsertTeam(db: SQLiteDatabase, params: SQLiteBindParams) {
  const id = await GenerateId(db, "teams");

  if (id !== "") {
    await db.runAsync(
      `INSERT INTO teams (id, name, category, player1ID, player2ID) VALUES ('${id}', ?, ?, ?, ?);`,
      params
    )
    .catch((error: any) => {
      console.log(error);
    });
  }
};

export async function UpdateTeam(db: SQLiteDatabase, params: SQLiteBindParams, id: string) {
  await db.runAsync(
    `UPDATE teams SET name = ? WHERE id = '${id}'`,
    params
  )
  .catch((error: any) => {
    console.log(error);
  });
};

export async function DeleteTeam(db: SQLiteDatabase, id: string) {
  // Get all matches with team to be deleted
  const allMatches: Match[] = await GetAllMatchesByTeam(db, id);
  const allDoublesMatches: Match[] = allMatches.slice().filter((m: Match) => m.id.toLowerCase().startsWith("dm"));
  const allDoublesMatchesId: string[] = allDoublesMatches.map((m: Match) => `\'${m.id}\'`);

  // Delete all matches involving team to be deleted
  await DeleteMatchesInBulk(db, allDoublesMatchesId.join(", "), "doubles");

  // Delete team from teams table
  await db.runAsync(`DELETE FROM teams WHERE id = ?`, id).catch((error: any) => {
    console.log(error);
  });
};

async function DeleteTeamsInBulk(db: SQLiteDatabase, teamsId: string) {
  await db.runAsync(`DELETE FROM teams WHERE id IN (${teamsId})`).catch((error: any) => {
    console.log(error);
  });
};

export async function GetAllTeams(db: SQLiteDatabase) {
  const teams = await db.getAllAsync<any>(DbQueries.GetTeams).catch((error: any) => {
    console.log(error);
  });

  return (teams as any[]).map(team => (
    <Team>{
      id: team.id,
      name: team.name,
      category: team.category,
      players: [
        {
          id: team.player1ID,
          firstName: team.player1FirstName,
          lastName: team.player1LastName,
          lastNameFirst: team.player1LastNameFirst,
          gender: team.player1Gender
        },
        {
          id: team.player2ID,
          firstName: team.player2FirstName,
          lastName: team.player2LastName,
          lastNameFirst: team.player2LastNameFirst,
          gender: team.player2Gender
        }
      ]
    })
  ) ?? [];
};

async function GetAllTeamsByPlayer(db: SQLiteDatabase, id: string) {
  const teams = await db.getAllAsync<any>(`${DbQueries.GetTeams} WHERE player1ID = '${id}' OR player2ID = '${id}'`).catch((error: any) => {
    console.log(error);
  });

  return (teams as any[]).map(team => (
    <Team>{
      id: team.id,
      name: team.name,
      category: team.category,
      players: [
        {
          id: team.player1ID,
          firstName: team.player1FirstName,
          lastName: team.player1LastName,
          lastNameFirst: team.player1LastNameFirst,
          gender: team.player1Gender
        },
        {
          id: team.player2ID,
          firstName: team.player2FirstName,
          lastName: team.player2LastName,
          lastNameFirst: team.player2LastNameFirst,
          gender: team.player2Gender
        }
      ]
    })
  ) ?? [];
};

export async function GetTeam(db: SQLiteDatabase, id: string) {
  const team = await db.getFirstAsync<any>(
    `${DbQueries.GetTeams} WHERE t.id = ?`, [id]
  ).catch((error: any) => {
    console.log(error);
  });

  return {
    id: team.id,
    name: team.name,
    category: team.category,
    players: [
      {
        id: team.player1ID,
        firstName: team.player1FirstName,
        lastName: team.player1LastName,
        lastNameFirst: team.player1LastNameFirst,
        gender: team.player1Gender
      },
      {
        id: team.player2ID,
        firstName: team.player2FirstName,
        lastName: team.player2LastName,
        lastNameFirst: team.player2LastNameFirst,
        gender: team.player2Gender
      }
    ]
  };
};

export async function IsTeamExists(db: SQLiteDatabase, params: SQLiteBindParams) {
  const team = await db.getFirstAsync<Team>(
    `SELECT * FROM teams WHERE player1ID = ? AND player2ID = ?`,
    params
  ).catch((error: any) => {
    console.log(error);
  });

  return { response: team ? true : false, id: team ? team.id : "" };
};

export async function GetAllSinglesMatches(db: SQLiteDatabase) {
  let matches: any = [];

  await db.getAllAsync(`
    ${DbQueries.GetSinglesMatches} LIMIT 20;
  `)
  .then((response: any[]) => {
    matches = response.map((match) => (
      <Match>{
        id: match.id,
        category: match.category,
        score: match.score.split(",").map((teamScore: string) => teamScore.split("-").map((value: string) => parseInt(value))),
        datetime: moment(match.datetime, "DD-MM-YYYY").format("DD MMM YYYY"),
        mode: match.mode,
        tournament: match.tournamentID,
        teams: [
          {
            id: match.player1ID,
            firstName: match.player1FirstName,
            lastName: match.player1LastName,
            lastNameFirst: match.player1LastNameFirst,
            gender: match.player1Gender
          },
          {
            id: match.player2ID,
            firstName: match.player2FirstName,
            lastName: match.player2LastName,
            lastNameFirst: match.player2LastNameFirst,
            gender: match.player2Gender
          }
        ]
      }
    ));
  })
  .catch((error: any) => {
    console.log(error);
  });

  return matches;
};

export async function GetSinglesMatch(db: SQLiteDatabase, id: string) {
  const match = await db.getFirstAsync<any>(
    `${DbQueries.GetSinglesMatches} WHERE sm.id = '${id}'`
  )
  .catch((error: any) => {
    console.log(error);
  });

  return <Match>{
    id: match.id,
    category: match.category,
    score: match.score.split(",").map((teamScore: string) => teamScore.split("-").map((value: string) => parseInt(value))),
    datetime: moment(match.datetime, "DD-MM-YYYY").format("DD MMM YYYY"),
    mode: match.mode,
    tournament: match.tournamentID,
    teams: [
      {
        id: match.player1ID,
        firstName: match.player1FirstName,
        lastName: match.player1LastName,
        lastNameFirst: match.player1LastNameFirst,
        gender: match.player1Gender
      },
      {
        id: match.player2ID,
        firstName: match.player2FirstName,
        lastName: match.player2LastName,
        lastNameFirst: match.player2LastNameFirst,
        gender: match.player2Gender
      }
    ]
  };
}

export async function GetAllDoublesMatches(db: SQLiteDatabase) {
  let matches: any = [];
  
  await db.getAllAsync(`${DbQueries.GetDoublesMatches} LIMIT 20;`)
  .then((response: any[]) => {
    matches = response.map((match) => (
      <Match>{
        id: match.id,
        category: match.category,
        score: match.score.split(",").map((teamScore: string) => teamScore.split("-").map((value: string) => parseInt(value))),
        datetime: moment(match.datetime, "DD-MM-YYYY").format("DD MMM YYYY"),
        mode: match.mode,
        tournament: match.tournamentID,
        teams: [
          {
            id: match.team1ID,
            name: match.team1Name,
            category: match.category,
            players: [
              {
                id: match.team1Player1ID,
                firstName: match.team1Player1FirstName,
                lastName: match.team1Player1LastName,
                lastNameFirst: match.team1Player1LastNameFirst,
                gender: match.team1Player1Gender
              },
              {
                id: match.team1Player2ID,
                firstName: match.team1Player2FirstName,
                lastName: match.team1Player2LastName,
                lastNameFirst: match.team1Player2LastNameFirst,
                gender: match.team1Player2Gender
              }
            ]
          },
          {
            id: match.team2ID,
            name: match.team2Name,
            category: match.category,
            players: [
              {
                id: match.team2Player1ID,
                firstName: match.team2Player1FirstName,
                lastName: match.team2Player1LastName,
                lastNameFirst: match.team2Player1LastNameFirst,
                gender: match.team2Player1Gender
              },
              {
                id: match.team2Player2ID,
                firstName: match.team2Player2FirstName,
                lastName: match.team2Player2LastName,
                lastNameFirst: match.team2Player2LastNameFirst,
                gender: match.team2Player2Gender
              }
            ]
          }
        ]
      }
    ));
  })
  .catch((error: any) => {
    console.log(error);
  });

  return matches;
};

export async function GetDoublesMatch(db: SQLiteDatabase, id: string) {
  const match = await db.getFirstAsync<any>(`
    ${DbQueries.GetDoublesMatches} WHERE dm.id = '${id}'
    `).catch((error: any) => {
      console.log(error);
    });

  return <Match>{
    id: match.id,
    category: match.category,
    score: match.score.split(",").map((teamScore: string) => teamScore.split("-").map((value: string) => parseInt(value))),
    datetime: moment(match.datetime, "DD-MM-YYYY").format("DD MMM YYYY"),
    mode: match.mode,
    tournament: match.tournamentID,
    teams: [
      {
        id: match.team1ID,
        name: match.team1Name,
        category: match.category,
        players: [
          {
            id: match.team1Player1ID,
            firstName: match.team1Player1FirstName,
            lastName: match.team1Player1LastName,
            lastNameFirst: match.team1Player1LastNameFirst,
            gender: match.team1Player1Gender
          },
          {
            id: match.team1Player2ID,
            firstName: match.team1Player2FirstName,
            lastName: match.team1Player2LastName,
            lastNameFirst: match.team1Player2LastNameFirst,
            gender: match.team1Player2Gender
          }
        ]
      },
      {
        id: match.team2ID,
        name: match.team2Name,
        category: match.category,
        players: [
          {
            id: match.team2Player1ID,
            firstName: match.team2Player1FirstName,
            lastName: match.team2Player1LastName,
            lastNameFirst: match.team2Player1LastNameFirst,
            gender: match.team2Player1Gender
          },
          {
            id: match.team2Player2ID,
            firstName: match.team2Player2FirstName,
            lastName: match.team2Player2LastName,
            lastNameFirst: match.team2Player2LastNameFirst,
            gender: match.team2Player2Gender
          }
        ]
      }
    ]
  }
};

export async function InsertMatch(db: SQLiteDatabase, params: SQLiteBindParams, category: "singles" | "doubles") {
  const id = await GenerateId(db, 'matches');
  const matchId = await GenerateId(db, `${category}Matches`);

  if (id !== "") {
    await db.runAsync(
      `INSERT INTO matches (id, matchId) VALUES ('${id}', '${matchId}');`
    )
    .catch((error: any) => {
      console.log(error);
    });

    await db.runAsync(
      `
        INSERT INTO ${category}Matches (id, category, participant1ID, participant2ID, score, datetime, mode, tournamentID)
        VALUES ('${matchId}', ?, ?, ?, ?, ?, ?, NULL);
      `,
      params
    )
    .catch((error: any) => {
      console.log(error);
    });
  }
};

export async function UpdateMatch(db: SQLiteDatabase, params: SQLiteBindParams, id: string, category: "singles" | "doubles") {
  await db.runAsync(
    `UPDATE ${category}Matches SET mode = ?, datetime = ?, score = ? WHERE id = '${id}'`,
    params
  )
  .catch((error: any) => {
    console.log(error);
  });
};

export async function DeleteMatch(db: SQLiteDatabase, id: string, category: "singles" | "doubles") {
  await db.runAsync(`DELETE FROM matches WHERE matchId = ?`, id).catch((error: any) => {
    console.log(error);
  });

  await db.runAsync(`DELETE FROM ${category}Matches WHERE id = ?`, id).catch((error: any) => {
    console.log(error);
  });
};

async function DeleteMatchesInBulk(db: SQLiteDatabase, matchesId: string, category: "singles" | "doubles") {
  await db.runAsync(`DELETE FROM matches WHERE matchId IN (${matchesId})`).catch((error: any) => {
    console.log(error);
  });

  await db.runAsync(`DELETE FROM ${category}Matches WHERE id IN (${matchesId})`).catch((error: any) => {
    console.log(error);
  });
};

export async function GetAllMatchesOfSamePairs(db: SQLiteDatabase, teamIds: string[], category: "singles" | "doubles") {
  const alias = category === "doubles" ? "dm" : "sm";
  let matches: MatchLite[] = [];

  await db.getAllAsync(`
    SELECT *
    FROM matches AS m
    INNER JOIN ${category}Matches AS ${alias}
    ON ${alias}.id = m.matchId
    WHERE (${alias}.participant1ID = '${teamIds[0]}' AND ${alias}.participant2ID = '${teamIds[1]}') OR (${alias}.participant2ID = '${teamIds[0]}' AND ${alias}.participant1ID = '${teamIds[1]}');
  `)
  .then((response: any[]) => {
    matches = response.map(match => (
      <MatchLite>{
        id: match.id,
        mode: match.mode,
        category: match.category,
        participant1ID: match.participant1ID,
        participant2ID: match.participant2ID,
        datetime: moment(match.datetime, "DD-MM-YYYY").format("DD MMM YYYY"),
        score: match.score.split(",").map((teamScore: string) => teamScore.split("-").map((value: string) => parseInt(value)))
      }
    ));
  })
  .catch((error: any) => {
    console.log(error);
  });

  return matches;
};

export async function GetAllMatchesByPlayer(db: SQLiteDatabase, playerId: string) {
  let matches: Match[] = [];

  await db.getAllAsync(`${DbQueries.GetSinglesMatches} WHERE p1.id = '${playerId}' OR p2.id = '${playerId}'`)
  .then((response: any[]) => {
    for (let i = 0; i < response.length; i++) {
      const match = response[i];

      // TODO - mapping needs to be segregated somewhere
      matches.push({
        id: match.id,
        category: match.category,
        score: match.score.split(",").map((teamScore: string) => teamScore.split("-").map((value: string) => parseInt(value))),
        datetime: moment(match.datetime, "DD-MM-YYYY").format("DD MMM YYYY"),
        mode: match.mode,
        tournament: match.tournamentID,
        teams: [
          {
            id: match.player1ID,
            firstName: match.player1FirstName,
            lastName: match.player1LastName,
            lastNameFirst: match.player1LastNameFirst,
            gender: match.player1Gender
          },
          {
            id: match.player2ID,
            firstName: match.player2FirstName,
            lastName: match.player2LastName,
            lastNameFirst: match.player2LastNameFirst,
            gender: match.player2Gender
          }
        ]
      });
    }
  })
  .catch((error: any) => console.log(error));

  await db.getAllAsync(`${DbQueries.GetDoublesMatches} WHERE (t1p1.id = '${playerId}' OR t1p2.id = '${playerId}' OR t2p1.id = '${playerId}' OR t2p2.id = '${playerId}')`)
  .then((response: any[]) => {
    for (let i = 0; i < response.length; i++) {
      const match = response[i];

      matches.push({
        id: match.id,
        category: match.category,
        score: match.score.split(",").map((teamScore: string) => teamScore.split("-").map((value: string) => parseInt(value))),
        datetime: moment(match.datetime, "DD-MM-YYYY").format("DD MMM YYYY"),
        mode: match.mode,
        tournament: match.tournamentID,
        teams: [
          {
            id: match.team1ID,
            name: match.team1Name,
            category: match.category,
            players: [
              {
                id: match.team1Player1ID,
                firstName: match.team1Player1FirstName,
                lastName: match.team1Player1LastName,
                lastNameFirst: match.team1Player1LastNameFirst,
                gender: match.team1Player1Gender
              },
              {
                id: match.team1Player2ID,
                firstName: match.team1Player2FirstName,
                lastName: match.team1Player2LastName,
                lastNameFirst: match.team1Player2LastNameFirst,
                gender: match.team1Player2Gender
              }
            ]
          },
          {
            id: match.team2ID,
            name: match.team2Name,
            category: match.category,
            players: [
              {
                id: match.team2Player1ID,
                firstName: match.team2Player1FirstName,
                lastName: match.team2Player1LastName,
                lastNameFirst: match.team2Player1LastNameFirst,
                gender: match.team2Player1Gender
              },
              {
                id: match.team2Player2ID,
                firstName: match.team2Player2FirstName,
                lastName: match.team2Player2LastName,
                lastNameFirst: match.team2Player2LastNameFirst,
                gender: match.team2Player2Gender
              }
            ]
          }
        ]
      });
    }
  })
  .catch((error: any) => console.log(error));
  return matches;
};

export async function GetAllMatchesByTeam(db: SQLiteDatabase, teamId: string) {
  let matches: Match[] = [];

  await db.getAllAsync(`${DbQueries.GetDoublesMatches} WHERE (team1ID = '${teamId}' OR team2ID = '${teamId}')`)
  .then((response: any[]) => {
    for (let i = 0; i < response.length; i++) {
      const match = response[i];

      // TODO - Put mapping code into separate function
      matches.push({
        id: match.id,
        category: match.category,
        score: match.score.split(",").map((teamScore: string) => teamScore.split("-").map((value: string) => parseInt(value))),
        datetime: moment(match.datetime, "DD-MM-YYYY").format("DD MMM YYYY"),
        mode: match.mode,
        tournament: match.tournamentID,
        teams: [
          {
            id: match.team1ID,
            name: match.team1Name,
            category: match.category,
            players: [
              {
                id: match.team1Player1ID,
                firstName: match.team1Player1FirstName,
                lastName: match.team1Player1LastName,
                lastNameFirst: match.team1Player1LastNameFirst,
                gender: match.team1Player1Gender
              },
              {
                id: match.team1Player2ID,
                firstName: match.team1Player2FirstName,
                lastName: match.team1Player2LastName,
                lastNameFirst: match.team1Player2LastNameFirst,
                gender: match.team1Player2Gender
              }
            ]
          },
          {
            id: match.team2ID,
            name: match.team2Name,
            category: match.category,
            players: [
              {
                id: match.team2Player1ID,
                firstName: match.team2Player1FirstName,
                lastName: match.team2Player1LastName,
                lastNameFirst: match.team2Player1LastNameFirst,
                gender: match.team2Player1Gender
              },
              {
                id: match.team2Player2ID,
                firstName: match.team2Player2FirstName,
                lastName: match.team2Player2LastName,
                lastNameFirst: match.team2Player2LastNameFirst,
                gender: match.team2Player2Gender
              }
            ]
          }
        ]
      });
    }
  })
  .catch((error: any) => console.log(error));
  return matches;
};

export async function DeleteAllData(db: SQLiteDatabase) {
  await db.execAsync(`
    DELETE FROM doublesMatches;
    DELETE FROM singlesMatches;
    DELETE FROM matches;
    DELETE FROM tournaments;
    DELETE FROM teams;
    DELETE FROM players WHERE id != 'p1';
  `)
  .catch((err: any) => console.log(err));
};

async function GenerateId(db: SQLiteDatabase, table: string) {
  const lastResult = await db.getFirstAsync<Player>(
    `SELECT * FROM ${table} LIMIT 1 OFFSET CAST((SELECT COUNT(*) FROM ${table}) AS INT) - 1;`
  )
  .catch((error: any) => {
    console.log(error);
  });

  let id: number;
  let char;

  if(lastResult) {
    id = parseInt(lastResult.id.substring(table === "singlesMatches" || table === "doublesMatches" ? 2 : 1)) + 1;
  }
  else {
    id = 1;
  }

  switch (table) {
    case "teams":
      char = "t";
      break;
    case "players":
      char = "p";
      break;
    case "matches":
      char = "m";
      break;
    case "singlesMatches":
      char = "sm";
      break;
    case "doublesMatches":
      char = "dm";
      break;
    case "tournaments":
      char = "c";
      break;
  }
  
  return `${char}${id.toString()}`;
}