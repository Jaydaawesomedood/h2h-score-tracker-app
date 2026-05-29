import { database } from "@/database";
import MatchModel from "@/database/models/MatchModel";
import MatchPlayerModel from "@/database/models/MatchPlayerModel";
import { Match } from "@/models/v2/data/Match";
import { Player } from "@/models/v2/data/Player";
import { Q } from "@nozbe/watermelondb";
import { map, Observable, startWith, switchMap } from "@nozbe/watermelondb/utils/rx";
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

        console.log('PREPARED SIDES',  [...preparedSideA, ...preparedSideB])
  
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
        createdAt: createdMatch._createdAt?.toString() || new Date().toISOString()
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
      .query(Q.experimentalJoinTables(['match_players']))
      .observe();

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

  static async test(id: string) {
    const a = database.collections.get<MatchPlayerModel>('match_players').query();
    // const b = database.collections.get<MatchModel>('matches').find(id);

    const b = await database.collections.get<MatchModel>('matches').query().fetch();
    const c = await a.fetch();

    console.log(b);
    console.log(c);

    // await database.write(async() => {
    //   (await b).destroyPermanently();
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
      createdAt: match._createdAt.toString() ?? new Date().toISOString(),
      sets: match.sets as number[][],
      sideA,
      sideB,
    } as Match;
  }
}