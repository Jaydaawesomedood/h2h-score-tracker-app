import { Match, MatchLite } from "@/models/Match";
import { Player, Team } from "@/models/Player";
import { GetWinRate } from "./common/common.util";
import { H2HStats, StatsByPartner } from "@/models/Stats";
import moment from "moment";

export function getHigherScore(scores: Number[]) {
  if (scores[1] > scores[0]) return 1;
  else return 0;
};

export function calculateWinner(match: Match) {
  let setsWon = [0, 0];
  
  match.score.forEach((setScores: Number[]) => {
    if (setScores[0] > setScores[1]) setsWon[0] += 1;
    else if (setScores[1] > setScores[0]) setsWon[1] += 1;
  });

  if (setsWon[1] > setsWon[0]) return match.teams[1].id;
  else return match.teams[0].id;
};

function calculateWinnerLite(match: MatchLite) {
  let setsWon = [0, 0];
  
  match.score.forEach((setScores: Number[]) => {
    if (setScores[0] > setScores[1]) setsWon[0] += 1;
    else if (setScores[1] > setScores[0]) setsWon[1] += 1;
  });

  if (setsWon[1] > setsWon[0]) return match.participant2ID;
  else return match.participant1ID;
};

export function getTotalScoreByMatch(scores: Number[][]) {
  let totalScores = [0, 0];

  scores.forEach((setScores: Number[]) => {
    totalScores[0] += setScores[0] as number;
    totalScores[1] += setScores[1] as number;
  });

  return totalScores;
};

export function getTotalSetsByMatch(scores: Number[][]) {
  let totalSets = [0, 0];

  scores.forEach((setScores: Number[]) => {
    if (setScores[0] > setScores[1]) totalSets[0] += 1;
    else if (setScores[1] > setScores[0]) totalSets[1] += 1;
  });

  return totalSets;
}

function getH2H(matches: Match[], participantsID: string[]) {
  // Expected that all array elements have the same participant1ID & participant2ID values
  let h2h: any = {};
  h2h[participantsID[0]] = 0;
  h2h[participantsID[1]] = 0;
  
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const winner = calculateWinner(match);

    h2h[winner] += 1;
  };
  
  return [h2h[participantsID[0]], h2h[participantsID[1]]];
};

export function getH2HLite(matches: MatchLite[], participantsID: string[]) {
  // Expected that all array elements have the same participant1ID & participant2ID values
  let h2h: any = {};
  h2h[participantsID[0]] = 0;
  h2h[participantsID[1]] = 0;

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const winner = calculateWinnerLite(match);
    h2h[winner] += 1;
  };

  return [h2h[participantsID[0]], h2h[participantsID[1]]];
};

function getTotalSetsByH2H(matches: Match[], participantsID: string[]) {
  // Expected that all array elements have the same participant1ID & participant2ID values
  let h2h: any = {};
  h2h[participantsID[0]] = 0;
  h2h[participantsID[1]] = 0;

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const setObtainedInMatch = getTotalSetsByMatch(match.score);

    // swap positions for matches that have different team order
    if (match.teams[0].id === participantsID[1] &&match.teams[1].id === participantsID[0]) {
      h2h[participantsID[0]] += setObtainedInMatch[1];
      h2h[participantsID[1]] += setObtainedInMatch[0];
    }
    else {
      h2h[participantsID[0]] += setObtainedInMatch[0];
      h2h[participantsID[1]] += setObtainedInMatch[1];
    }
  };

  return [h2h[participantsID[0]], h2h[participantsID[1]]];
};

export function getTotalSetsByH2HLite(matches: MatchLite[], participantsID: string[]) {
  // Expected that all array elements have the same participant1ID & participant2ID values
  let h2h: any = {};
  h2h[participantsID[0]] = 0;
  h2h[participantsID[1]] = 0;

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const setObtainedInMatch = getTotalSetsByMatch(match.score);

    // swap positions for matches that have different team order
    if (match.participant1ID === participantsID[1] && match.participant2ID === participantsID[0]) {
      h2h[participantsID[0]] += setObtainedInMatch[1];
      h2h[participantsID[1]] += setObtainedInMatch[0];
    }
    else {
      h2h[participantsID[0]] += setObtainedInMatch[0];
      h2h[participantsID[1]] += setObtainedInMatch[1];
    }
  };

  return [h2h[participantsID[0]], h2h[participantsID[1]]];
};

export function getTotalPointsByH2H(matches: MatchLite[], participantsID: string[]) {
  // Expected that all array elements have the same participant1ID & participant2ID values
  let h2h: any = {};
  h2h[participantsID[0]] = 0;
  h2h[participantsID[1]] = 0;

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const pointsObtainedInMatch = getTotalScoreByMatch(match.score);

    // swap positions for matches that have different team order
    if (match.participant1ID === participantsID[1] && match.participant2ID === participantsID[0]) {
      h2h[participantsID[0]] += pointsObtainedInMatch[1];
      h2h[participantsID[1]] += pointsObtainedInMatch[0];
    }
    else{
      h2h[participantsID[0]] += pointsObtainedInMatch[0];
      h2h[participantsID[1]] += pointsObtainedInMatch[1];      
    }
  };

  return [h2h[participantsID[0]], h2h[participantsID[1]]];
};


// Player stats
function GetPlayerStatsByCategory(category: string, matches: Match[], id: string, isThisYear: boolean = false) {
  let totalGames = 0;
  let gamesWon = 0;

  if (isThisYear) {
    matches = matches.filter(match => moment(match.datetime, "DD MMM YYYY").year() === moment().year());
  }

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    if (match.category.toLowerCase() === category.toLowerCase()) {
      totalGames += 1;
      const winnerId = calculateWinner(match);

      // For singles, just directly compare player ID
      // For doubles, need to check team ID the player is in, and compare the team ID
      if (["ms", "ws"].includes(category) && winnerId.toLowerCase() === id.toLowerCase()) {
        gamesWon += 1;
      }
      else if (["md", "wd", "xd"].includes(category)) {
        const teamId = (match.teams as Team[]).find(team => {
          const player = team.players.find(player => player.id.toLowerCase() === id.toLowerCase())
          if (player && team.players.includes(player)) return true;
          return false;
        })?.id;
        
        if (winnerId.toLowerCase() === teamId?.toLowerCase()) {
          gamesWon += 1;
        }
      }
    }
  }

  return {
    total: totalGames,
    won: gamesWon,
    winRate: GetWinRate(totalGames, gamesWon)
  };
};

// TODO - Rename method, we are not getting overall stats only
// TODO - relook into this method to always provide total games and games won
function GetPlayerOverallStats(matches: Match[], playerId: string, category?: string, duration?: string) {
  let totalGames = 0;
  let gamesWon = 0;
  let totalSets = 0;
  let tournamentsPlayed = 0;
  let casualGamesPlayed = 0;

  // If the category dropdown have a value, we filter the matches based on the category
  if (category && category !== "overall") {
    matches = matches.filter(match => match.category.toLowerCase() === category.toLowerCase());
  }

  if (duration && duration === "this year") {
    matches = matches.filter(match => moment(match.datetime, "DD MMM YYYY").year() === moment().year());
  
    if (category && category !== "overall") {
      const playerStatByCategoryThisYear = GetPlayerStatsByCategory(category, matches, playerId, true);
      totalGames = playerStatByCategoryThisYear.total;
      gamesWon = playerStatByCategoryThisYear.won;
    }
  }

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];

    // For singles, just directly get the index of the player in the teams array
    // For doubles, need to check team ID the player is in, and grab the index of the team
    if (["ms", "ws"].includes(match.category)) {
      const playerIndex = (match.teams as Player[]).findIndex((p: Player) => p.id === playerId);
      totalSets += getTotalSetsByMatch(match.score)[playerIndex];
    }
    else if (["md", "wd", "xd"].includes(match.category)) {
      const playerIndex = (match.teams as Team[]).findIndex((t: Team) => {
        const player = t.players.find(p => p.id === playerId);
        if (player && t.players.includes(player)) return true;
        return false;
      });

      totalSets += getTotalSetsByMatch(match.score)[playerIndex];
    }

    if (match.mode === "tournament") tournamentsPlayed += 1;
    else if (match.mode === "casual") casualGamesPlayed += 1;
  }

  return { totalSets, tournamentsPlayed, casualGamesPlayed, totalGames, gamesWon };
};

function GetPlayerStatsByPartner(matches: Match[], playerId: string, category?: string, duration?: string) {
  let teams: any = {};
  let doublesMatches = matches.filter(match => ["md", "wd", "xd"].includes(match.category));

  if (category && category !== "overall") {
    doublesMatches = doublesMatches.filter((match: Match) => match.category.toLowerCase() === category.toLowerCase());
  }

  if (duration && duration === "this year") {
    doublesMatches = doublesMatches.filter(match => moment(match.datetime, "DD MMM YYYY").year() === moment().year());
  }

  for (let i = 0; i < doublesMatches.length; i++) {
    const match = doublesMatches[i];

    // First, we find which team the player is in
    const team = (match.teams as Team[]).find(t => {
      const player = t.players.find(player => player.id === playerId);
      if (player && t.players.includes(player)) return true;
      return false;
    });
    
    if (team) {
      if (!teams.hasOwnProperty(team.id)) {
        // We then store the partner's information & initialize the data
        // since doubles only consist of 2 players we can just find the partner by comparing if the player's id does NOT equal to the playerId
        teams[team.id] = {
          partner: team.players.find(player => player.id !== playerId) as Player,
          category: team.category,
          totalGames: 0,
          gamesWon: 0,
          winRate: "",
        };
      }

      teams[team.id].totalGames += 1;
      if (team.id === calculateWinner(match)) teams[team.id].gamesWon += 1;
    }
  };

  // After looping through all the matches, we get the win rate
  for (const teamId in teams) {
    teams[teamId].winRate = GetWinRate(teams[teamId].totalGames, teams[teamId].gamesWon);
  };

  /**
   * Sort partners based on adjusted win rate
   * AWR = ((w * ravg) + (n * r)) / (w + n)
   * Where
   * r = win rate of player,
   * n = total games played by player,
   * w = weight (avg number of games needed to overcome the baseline),
   * ravg = average win rate, either across all players or a neutral baseline (0.5)
   */
  let partnersStats = [];

  for (const teamId in teams) {
    partnersStats.push({
      id: teamId,
      category: teams[teamId].category,
      partner: teams[teamId].partner,
      totalGames: teams[teamId].totalGames,
      gamesWon: teams[teamId].gamesWon,
      winRate: teams[teamId].winRate,
    } as StatsByPartner);
  };

  // We find the average games played to populate weight value
  const averageGamesPlayed = partnersStats.reduce((acc, curr) => acc + curr.totalGames, 0) / partnersStats.length;

  // We find the average win rate to populate ravg value
  const averageWinRate = partnersStats.reduce((acc, curr) => acc + parseFloat(curr.winRate), 0) / partnersStats.length;

  partnersStats.sort((a, b) => {
    const awr = parseFloat(a.winRate);
    const an = a.totalGames;
    const bwr = parseFloat(b.winRate);
    const bn = b.totalGames;

    const w = averageGamesPlayed; // weight
    const wravg = averageWinRate / 100; // average win rate (in decimals)

    const awrAdjusted = ((w * wravg) + (an * awr)) / (w + an);
    const bwrAdjusted = ((w * wravg) + (bn * bwr)) / (w + bn);

    return bwrAdjusted - awrAdjusted;
  });

  return partnersStats;
}

function GetH2HStatsById(matches: Match[], id: string, isThisYear: boolean = false) {
  let opponents: Player[] | Team[] = [];
  let h2h: any = {};

  // Find all unique opponents and store their id in array
  for (let i = 0; i < matches.length; i++) {
    let match = matches[i];
    const participantIds = match.teams.map(t => t.id);

    if (participantIds.includes(id)) {
      if (["ms", "ws"].includes(match.category.toLowerCase())) {
        opponents = [...opponents] as Player[];
        // Get opponent's id
        const opponent = (match.teams as Player[]).find(player => player.id !== id);
        if (opponent && !opponents.includes(opponent)) opponents.push(opponent);
      }
      else if (["md", "wd", "xd"].includes(match.category.toLowerCase())) {
        opponents = [...opponents] as Team[];
        // Get opponent's id
        const opponent = (match.teams as Team[]).find(team => team.id !== id);
        if (opponent && !opponents.includes(opponent)) opponents.push(opponent);
      }
    }
  };

  for (let i = 0; i < opponents.length; i++) {
    const opponentId = opponents[i].id;
    let filteredMatchesByOpponentsThisYear: Match[] = [];

    const filteredMatchesByOpponents = matches.filter(match => {
      const participantsId = match.teams.map(t => t.id);
      return participantsId.includes(id) && participantsId.includes(opponentId);
    });

    if (isThisYear) {
      filteredMatchesByOpponentsThisYear = filteredMatchesByOpponents.filter(match => moment(match.datetime, "DD MMM YYYY").year() === moment().year());
    }

    h2h[opponentId] = {
      opponent: opponents[i],
      h2h: getH2H(isThisYear ? filteredMatchesByOpponentsThisYear : filteredMatchesByOpponents, [id, opponentId]),
      sets: getTotalSetsByH2H(isThisYear ? filteredMatchesByOpponentsThisYear : filteredMatchesByOpponents, [id, opponentId]),
      // points: getTotalPointsByH2H(matches, [id, opponentId]),
      recentMatch: (isThisYear && filteredMatchesByOpponentsThisYear.length > 0 ? filteredMatchesByOpponentsThisYear : filteredMatchesByOpponents)[0],
    } as H2HStats;
  };
  
  return h2h; // { [key: string]: H2HStats }
}

function GetToughestOpponentsByH2H(h2h: { [key: string]: H2HStats }) {
  /**
   * Sort h2h based on adjusted win rate
   * AWR = ((w * ravg) + (n * r)) / (w + n)
   * Where
   * r = win rate of player,
   * n = total games played by player,
   * w = weight (avg number of games needed to overcome the baseline),
   * ravg = average win rate, either across all players or a neutral baseline (0.5)
   */
  let h2hStats = [];

  for (const value of Object.values(h2h)) {
    h2hStats.push({
      id: value.opponent.id,
      opponent: value.opponent,
      h2h: value.h2h,
    });
  };

  // We find the average games played to populate weight value
  const averageGamesPlayed = h2hStats.reduce((acc, curr) => acc + curr.h2h.reduce((acc, curr) => acc + curr, 0), 0) / h2hStats.length;

  // We find the average loss rate to populate ravg value
  const averageLossRate = h2hStats.reduce((acc, curr) => acc + (curr.h2h[1] - curr.h2h[0] > 0 ? curr.h2h[1] - curr.h2h[0] : 0), 0) / h2hStats.length;

  h2hStats.sort((a, b) => {
    const awr = a.h2h[1] - a.h2h[0] > 0 ? a.h2h[1] - a.h2h[0] : 0;
    const an = a.h2h.reduce((acc, curr) => acc + curr, 0);
    const bwr = b.h2h[1] - b.h2h[0] > 0 ? b.h2h[1] - b.h2h[0] : 0;
    const bn = b.h2h.reduce((acc, curr) => acc + curr, 0);

    const w = averageGamesPlayed; // weight
    const wravg = averageLossRate / 100; // average win rate (in decimals)

    const awrAdjusted = ((w * wravg) + (an * awr)) / (w + an);
    const bwrAdjusted = ((w * wravg) + (bn * bwr)) / (w + bn);

    return bwrAdjusted - awrAdjusted;
  });

  // Filtering the opponents where player wins < opponent wins
  return h2hStats.filter(stat => stat.h2h[1] >= stat.h2h[0]);
};


// Team stats
function GetTeamStats(matches: Match[], teamId: string, duration?: string) {
  let totalGames = 0;
  let gamesWon = 0;
  let totalSets = 0;
  let tournamentsPlayed = 0;
  let casualGamesPlayed = 0;

  if (duration && duration === "this year") {
    matches = matches.filter(match => moment(match.datetime, "DD MMM YYYY").year() === moment().year());
  }

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];

    // For doubles, check team ID and grab the index of the team
    if (["md", "wd", "xd"].includes(match.category)) {
      totalGames += 1;
      const winnerId = calculateWinner(match);

      const teamIndex = (match.teams as Team[]).findIndex((t: Team) => t.id.toLowerCase() === teamId.toLowerCase());
      totalSets += getTotalSetsByMatch(match.score)[teamIndex];

      if (winnerId.toLowerCase() === teamId.toLowerCase()) {
        gamesWon += 1;
      }
    }

    if (match.mode === "tournament") tournamentsPlayed += 1;
    else if (match.mode === "casual") casualGamesPlayed += 1;
  }

  return { totalSets, tournamentsPlayed, casualGamesPlayed, totalGames, gamesWon };
};

export {
  GetPlayerStatsByCategory,
  GetPlayerOverallStats,
  GetPlayerStatsByPartner,
  GetH2HStatsById,
  GetToughestOpponentsByH2H,
  GetTeamStats,
};