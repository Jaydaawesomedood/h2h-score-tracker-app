export function getHigherScore(scores: Number[]) {
  if (scores[1] > scores[0]) return 1;
  else return 0;
};