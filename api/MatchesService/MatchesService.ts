import { database } from "@/database";
import MatchModel from "@/database/models/MatchModel";
import MatchPlayerModel from "@/database/models/MatchPlayerModel";
import PlayerModel from "@/database/models/PlayerModel";
import { Match } from "@/models/v2/data/Match";
import { Q } from "@nozbe/watermelondb";
import { Observable, startWith, switchMap } from "@nozbe/watermelondb/utils/rx";
import { combineLatest } from "rxjs";

export class MatchesService {
  static async AddMatch(match: Match) {
    try {
      const createdMatch = await database.write(async () => {
        const newMatch = await database.collections.get<MatchModel>('matches').create(m => {
          m.type = match.type,
          m.date = match.date,
          m.winner = match.winner,
          m._sets = JSON.stringify(match.sets)
        });
  
        const matchPlayersCollection = await database.collections.get<MatchPlayerModel>('match_players');
  
        const preparedSideA = match.sideA.map(player => ({
          matchId: newMatch.id,
          playerId: player.id,
          side: 'A'
        }));
  
        const preparedSideB = match.sideB.map(player => ({
          matchId: newMatch.id,
          playerId: player.id,
          side: 'B'
        }));
  
        const preparedMatchPlayersData = [...preparedSideA, ...preparedSideB].map(data => {
          return matchPlayersCollection.prepareCreate(mp => {
            mp.matchId = data.matchId,
            mp.playerId = data.playerId,
            mp.side = data.side
          });
        })
  
        await database.batch(...preparedMatchPlayersData);
  
        return newMatch;
      });
      
      return {
        ...match,
        id: createdMatch.id,
        createdAt: createdMatch.createdAt || new Date()
      };
    }
    catch (err: any) {
      console.error('Something went wrong.', err);
    }
  }

  static ObserveAllMatches(): Observable<Match[]> {
    // TODO - grab n number of matches first (lazy loading)
    const matches$ = database.collections
      .get<MatchModel>('matches')
      .query(
        Q.experimentalJoinTables(['match_players']),
        Q.sortBy('created_at', Q.desc)
      )
      .observeWithColumns(['date', 'sets', 'winner']);

    const players$ = database.withChangesForTables(['players']).pipe(startWith(null));

    return combineLatest([matches$, players$]).pipe(
        switchMap(async ([matches]) => {
          try {
            const promises = matches.map((m) => this.toMatch(m));
            return Promise.all(promises);
          }
          catch (error: any) {
            console.error("Error mapping matches inside stream:", error);
            return []; 
          }
        })
      )
  }

  static async UpdateMatch(match: Match) {
    try {
      const updatedMatch = await database.collections.get<MatchModel>('matches').find(match.id);
      await updatedMatch.updateDetails(match);
    }
    catch(err: any) {
      console.error(err);
    }
  }

  static async DeleteMatch(id: string) {
    try {
      const match = await database.collections.get<MatchModel>('matches').find(id);

      // TODO - can move this into common code
      const matchPlayerEntries = database.collections
        .get<MatchPlayerModel>('match_players')
        .query(Q.where('match_id', id));

      await database.write(async () => {
        await matchPlayerEntries.destroyAllPermanently();
      })

      await match.delete();
      return true;
    }
    catch(err: any) {
      console.error('Something went wrong.', err);
      return false;
    }
  }

  static async DeleteMatchesByPlayer(playerId: string) {
    const player = await database.collections.get<PlayerModel>('players').find(playerId);
    const matchesId = (await player.matches).map(m => m.id);

    // TODO - it would be better to move this into PlayerModel
    const matchPlayerEntries = database.collections
      .get<MatchPlayerModel>('match_players')
      .query(Q.where('match_id', Q.oneOf(matchesId)));

    await database.write(async () => {
      await player.matches.destroyAllPermanently();
      await matchPlayerEntries.destroyAllPermanently();
    })
  }

  static async nuke(id: string) {
    const a = database.collections.get<MatchPlayerModel>('match_players').query();
    const b = database.collections.get<MatchModel>('matches').query();
    // const b = database.collections.get<MatchModel>('matches').find(id);

    const matchplayers = await a.fetch();
    const matches = await b.fetch();

    console.log(matches);
    console.log(matchplayers);

    // await database.write(async() => {
    //   await b.destroyAllPermanently();
    //   await a.destroyAllPermanently();
    // })
  }

  private static async toMatch(match: MatchModel) {
    const sideA = await match.fetchSideA();
    const sideB = await match.fetchSideB();

    return {
      id: match.id,
      type: match.type,
      date: match.date,
      winner: match.winner,
      createdAt: match.createdAt ?? new Date(),
      sets: match.sets as number[][],
      sideA,
      sideB,
    } as Match;
  }
}