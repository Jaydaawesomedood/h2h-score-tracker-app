import { Match } from "@/models/v2/data/Match";
import { PartnerStat } from "@/models/v2/views/PlayerProfileTab";

export class PlayerStatsHelper {
  public static getMatchesSummary(matches: Match[], playerId: string) {
    const matchesWon = this.getMatchesWon(matches, playerId);
    const matchesLost = matches.length - matchesWon;
    const wlPercentage = `${this.getWinRate(matchesWon, matches.length)}%`;

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

  public static getPartnersStats(matches: Match[], playerId: string) {
    const partners: { [key: string]: any } = {};
    const stats: PartnerStat[] = [];

    matches.forEach(match => {
      const side = match.sideA.find(p => p.id === playerId) ? 'A' : 'B';
      const partner = match[`side${side}`]?.find(player => player.id !== playerId);

      if (!partner) return;

      // If partner is not in the object - add new stats
      if (!partners[partner.id]) {
        partners[partner.id] = {
          ...partner,
          matches: 0,
          won: 0,
          lost: 0,
          winRate: '',
        };
      }

      // Count wins & losses for partner
      Object.assign(partners[partner.id], {
        matches: partners[partner.id]?.matches + 1,
        won: partners[partner.id]?.won + (match.winner === side ? 1 : 0),
        lost: partners[partner.id]?.lost + (match.winner !== side ? 1 : 0),
      });
    });

    // Update win rate
    Object.entries(partners).forEach(([key, value]) => {
      partners[key] = {
        ...value,
        winRate: this.getWinRate(value.won, value.matches),
      };

      stats.push(partners[key]);
    });

    // Sort descendingly based on win rate
    return Array.from(stats).sort((a, b) => b.winRate - a.winRate);
  }

  private static getMatchesWon(matches: Match[], playerId: string): number {
    return matches.reduce((acc, match) => {
      const side = match.sideA.find((p) => p.id === playerId) ? 'A' : 'B';
      return side === match.winner ? acc + 1 : acc;
    }, 0);
  }

  private static getWinRate(won: number, total: number): number {
    return Number((total > 0 ? (won / total) * 100 : 0).toFixed(0))
  }
}