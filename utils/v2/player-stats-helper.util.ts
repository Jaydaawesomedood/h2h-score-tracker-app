import { Match } from "@/models/v2/data/Match";

export class PlayerStatsHelper {
  public static getMatchesSummary(matches: Match[], playerId: string) {
    const matchesWon = this.getMatchesWon(matches, playerId);
    const matchesLost = matches.length - matchesWon;
    const wlPercentage = `${(matches.length > 0 ? (matchesWon / matches.length) * 100 : 0).toFixed(0)}%`;

    return {
      matchesWon,
      matchesLost,
      wlPercentage,
    }
  }

  public static getMatchesStats(matches: Match[], playerId: string) {
    const matchesWon = this.getMatchesWon(matches, playerId);

    const setsPlayed = matches.reduce((arr, match) => arr + match.sets.length, 0);

    const setsWon = matches
                    .map(match => {
                      const side = match.sideA.find((p) => p.id === playerId) ? 0 : 1;
                      const setWinners = match.sets.map(set => (set.indexOf(Math.max(...set)))); // Array of 0s and 1s
                      return setWinners.filter(winner => winner === side).length;
                    })
                    .reduce((arr, setsWon) => arr + setsWon, 0);

    return {
      matchesPlayed: matches.length,
      matchesWon,
      setsPlayed,
      setsWon,
    }
  }

  private static getMatchesWon(matches: Match[], playerId: string) {
    return matches.reduce((acc, match) => {
      const side = match.sideA.find((p) => p.id === playerId) ? 'A' : 'B';
      return side === match.winner ? acc + 1 : acc;
    }, 0);
  }
}