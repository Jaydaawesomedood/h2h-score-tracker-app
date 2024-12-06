import { Match, MatchLite } from "@/models/Match";

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

export function getH2H(matches: MatchLite[], participantsID: string[]) {
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

export function getTotalSetsByH2H(matches: MatchLite[], participantsID: string[]) {
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