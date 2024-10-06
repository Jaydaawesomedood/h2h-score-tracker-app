export const DbQueries = {
  GetTeams: `SELECT
      t.id,
      t.name,
      t.category, 
      p1.id AS player1ID,
      p1.firstName AS player1FirstName,
      p1.lastName AS player1LastName,
      p1.lastNameFirst AS player1LastNameFirst,
      p1.gender AS player1Gender,
      p2.id AS player2ID,
      p2.firstName AS player2FirstName,
      p2.lastName AS player2LastName,
      p2.lastNameFirst AS player2LastNameFirst,
      p2.gender AS player2Gender
    FROM teams AS t
    LEFT JOIN players AS p1
    ON p1.id = t.player1ID
    LEFT JOIN players AS p2
    ON p2.id = t.player2ID
  `,
  GetDoublesMatches: `
    SELECT
      dm.id, dm.category, dm.score, dm.datetime, dm.tournamentID, dm.mode,
      t1.id AS team1ID, t1.name AS team1Name, t1.player1ID AS team1Player1ID, t1.player2ID AS team1Player2ID,
      t2.id AS team2ID, t2.name AS team2Name, t2.player1ID AS team2Player1ID, t2.player2ID AS team2Player2ID,
      t1p1.firstName AS team1Player1FirstName, t1p1.lastName AS team1Player1LastName, t1p1.lastNameFirst AS team1Player1LastNameFirst, t1p1.gender AS team1Player1Gender,
      t1p2.firstName AS team1Player2FirstName, t1p2.lastName AS team1Player2LastName, t1p2.lastNameFirst AS team1Player2LastNameFirst, t1p2.gender AS team1Player2Gender,
      t2p1.firstName AS team2Player1FirstName, t2p1.lastName AS team2Player1LastName, t2p1.lastNameFirst AS team2Player1LastNameFirst, t2p1.gender AS team2Player1Gender,
      t2p2.firstName AS team2Player2FirstName, t2p2.lastName AS team2Player2LastName, t2p2.lastNameFirst AS team2Player2LastNameFirst, t2p2.gender AS team2Player2Gender
    FROM matches AS m
    INNER JOIN doublesMatches AS dm
    ON dm.id = m.matchId
    LEFT JOIN teams AS t1
    ON t1.id = dm.participant1ID
    LEFT JOIN teams AS t2
    ON t2.id = dm.participant2ID
    LEFT JOIN players AS t1p1
    ON t1p1.id = t1.player1ID
    LEFT JOIN players AS t1p2
    ON t1p2.id = t1.player2ID
    LEFT JOIN players AS t2p1
    ON t2p1.id = t2.player1ID
    LEFT JOIN players AS t2p2
    ON t2p2.id = t2.player2ID
  `,
  GetSinglesMatches: `
    SELECT
      sm.id, sm.category, sm.score, sm.datetime, sm.tournamentID, sm.mode,
      p1.id AS player1ID, p1.firstName AS player1FirstName, p1.lastName AS player1LastName, p1.lastNameFirst AS player1LastNameFirst, p1.gender AS player1Gender,
      p2.id AS player2ID, p2.firstName AS player2FirstName, p2.lastName AS player2LastName, p2.lastNameFirst AS player2LastNameFirst, p2.gender AS player2Gender
    FROM matches AS m
    INNER JOIN singlesMatches AS sm
    ON sm.id = m.matchId
    LEFT JOIN players AS p1
    ON p1.id = sm.participant1ID
    LEFT JOIN players AS p2
    ON p2.id = sm.participant2ID
  `
};