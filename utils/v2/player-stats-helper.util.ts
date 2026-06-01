import { Match } from "@/models/v2/data/Match";
import { Player } from "@/models/v2/data/Player";
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
    const setsPlayed = this.getSetsPlayed(matches);

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
    // TODO - Sort win rate based on adjusted win rate
    /**
     * adjustedWinRate = ((w * ravg) + (n * r)) / (w + n)
     * Where
     * r = win rate of player,
     * n = total games played by player,
     * w = weight (avg number of games needed to overcome the baseline),
     * ravg = average win rate, either across all players or a neutral baseline (0.5)
     */
    return Array.from(stats).sort((a, b) => b.winRate - a.winRate);
  }

  public static getAllPartners(matches: Match[], playerId: string) {
    const partners: { [key: string]: any } = {};

    matches.forEach(match => {
      const side = match.sideA.find(p => p.id === playerId) ? 'A' : 'B';
      const partner = match[`side${side}`]?.find(player => player.id !== playerId);

      if (!partner) return;

      // If partner is not in the object - add new stats
      if (!partners[partner.id]) {
        partners[partner.id] = { ...partner };
      }
    });

    return partners;
  }

  public static getAllOpponents(matches: Match[], playerId: string, partnerId?: string) {
    const opponentSet = new Set<string>();
    const opponents: Player[][] = [];
    
    // If no partner ID, get all singles opponents
    if (!partnerId || partnerId.trim() === '') {
      matches.forEach(match => {
        const opponentSide = match.sideA.find(p => p.id === playerId) ? 'B' : 'A';
        const key = match[`side${opponentSide}`].map(player => player.id).join('|');

        if (opponentSet.has(key)) return;
        opponents.push([...match[`side${opponentSide}`]]);
        opponentSet.add(key);
      });
      return opponents;
    }

    matches
    .filter(match => (
      match.sideA.every(p => p.id === playerId || p.id === partnerId)
      || match.sideB.every(p => p.id === playerId || p.id === partnerId)
    ))
    .forEach(match => {
      const opponentSide = match.sideA.every(p => p.id === playerId || p.id === partnerId) ? 'B' : 'A';
      const key = match[`side${opponentSide}`].map(player => player.id).join('|');
      const keyReversed = key.split('|').reverse().join('|');

      if (opponentSet.has(key) || opponentSet.has(keyReversed)) return;
      opponents.push([...match[`side${opponentSide}`]]);
      opponentSet.add(key);
    });

    return opponents;
  }

  public static getToughestOpponents(matches: Match[], playerId: string, partnerId?: string) {
    const playerSide = (partnerId && partnerId.trim() !== '') ? [playerId, partnerId] : [playerId];
    let filteredMatches = this.getAllMatchesByPlayerIds(matches, playerSide);

    const opponents = this.getAllOpponents(filteredMatches, playerId, partnerId);
    const opponentsH2HMap = new Map<string, { opponent: Player[], h2h: number[] }>();

    opponents.forEach(opponent => {
      const key = opponent.map(player => player.id).join('|');
      const keyReversed = key.split('|').reverse().join('|');

      const h2h = this.getH2H(
        this.getAllMatchesByPlayerIds(filteredMatches, playerSide, opponent.map(o => o.id)),
        opponent
      );
      if (!opponentsH2HMap.has(key) && !opponentsH2HMap.has(keyReversed)) opponentsH2HMap.set(key, { opponent, h2h });
    });

    // return player/team, wins, losses
    return Array.from(opponentsH2HMap.values())
      .filter((({ h2h }) => h2h?.[1] >= h2h?.[0]))
      .sort((a, b) => (b.h2h?.[1] ?? 0) - (a.h2h?.[1] ?? 0))
      .slice(0, 5);
  }

  public static getH2H(matches: Match[], opponents: Player[], players?: Player[]): number[] {
    let h2h: number[] = [0, 0];
    const opponentPlayerIds = opponents.map(o => o.id);

    let filteredMatches = matches;

    if (players) {
      filteredMatches = this.getAllMatchesByPlayerIds(
        filteredMatches,
        players.map(p => p.id),
        opponentPlayerIds
      );
    }

    filteredMatches.forEach(match => {
      const opponentSide = match.sideA.every(p => opponentPlayerIds.includes(p.id)) ? 'A' : 'B';
      h2h[match.winner === opponentSide ? 1 : 0] += 1;
    });

    return h2h;
  }

  public static getH2HDetails(matches: Match[], h2h: number[], opponents: Player[], players: Player[]) {
    const totalMatches = h2h.reduce((arr, curr) => arr + curr, 0);
    const winRate = [this.getWinRate(h2h[0], totalMatches), this.getWinRate(h2h[1], totalMatches)];

    const filteredMatches = this.getAllMatchesByPlayerIds(
      matches,
      players.map(p => p.id),
      opponents.map(o => o.id)
    );

    let setsWon = [0, 0];

    // Get # of sets won
    filteredMatches.forEach(match => {
      const playerSide = match.sideA.every(p => players.map(player => player.id).includes(p.id)) ? 'A' : 'B';
      match.sets.forEach(set => {
        const setWinner = Boolean(set.indexOf(Math.max(...set))) ? 'B' : 'A' // 0 or 1 to A or B
        setsWon[setWinner === playerSide ? 0 : 1] += 1;
      });
    })

    return {
      winRate,
      setsWon,
    };
  }

  public static getAllMatchesByPlayerIds(matches: Match[], playerSideIds: string[], opponentSideIds?: string[]): Match[] {
    let filtered = matches.filter(match => (
      match.sideA.every(p => playerSideIds.includes(p.id))
      || match.sideB.every(p => playerSideIds.includes(p.id))
    ));

    if (opponentSideIds) {
      filtered = filtered.filter(match => (
        match.sideA.every(p => opponentSideIds.includes(p.id))
      || match.sideB.every(p => opponentSideIds.includes(p.id))
      ));
    }

    return filtered;
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

  private static getSetsPlayed(matches: Match[]) {
    return matches.reduce((arr, match) => arr + match.sets.length, 0);
  }
}