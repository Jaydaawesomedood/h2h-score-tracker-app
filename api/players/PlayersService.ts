import { Player } from "@/models/v2/data/Player";
import { database } from "../../database";
import PlayerModel from "@/database/models/PlayerModel";
import { Observable, startWith, switchMap } from "@nozbe/watermelondb/utils/rx";
import { Q } from "@nozbe/watermelondb";
import { MatchesService } from "../MatchesService/MatchesService";
import { combineLatest } from "rxjs";

export class PlayersService {
  static async AddPlayer(player: Player) {
    const createdPlayer = await database.write(async () => {
      const newPlayer = await database.collections.get<PlayerModel>('players').create(p => {
        p.firstName = player.firstName,
        p.lastName = player.lastName,
        p.color = player.color,
        p.isMe = player.isMe ? true : false
      });

      return this.toPlayer(newPlayer);
    });

    return createdPlayer;
  }

  static ObserveAllPlayers(): Observable<Player[]> {
    // TODO - grab n number of players first (lazy loading)
    // TODO - move this to model instead
    const players$ = database.collections
      .get<PlayerModel>('players')
      .query(
        Q.experimentalJoinTables(['match_players']),
        Q.sortBy('created_at', Q.asc)
      )
      .observeWithColumns(['first_name', 'last_name', 'color'])

    const matches$ = database.withChangesForTables(['matches', 'match_players']).pipe(startWith(null));

    return combineLatest([players$, matches$])
      .pipe(
        switchMap(async ([players]) => {
          try {
            const promises = players.map((p) => this.toPlayer(p));
            return Promise.all(promises);
          }
          catch (error: any) {
            console.error("Error mapping matches inside stream:", error);
            return []; 
          }
        })
      )
  }

  static async UpdatePlayer(updatedPlayer: Player) {
    try {
      const player = await database.collections.get<PlayerModel>('players').find(updatedPlayer.id);
      await player.updateProfile(updatedPlayer);
    }
    catch(err: any) {
      console.error(err);
    }
  }

  static async DeletePlayer(id: string) {
    try {
      await MatchesService.DeleteMatchesByPlayer(id);
      const player = await database.collections.get<PlayerModel>('players').find(id);
      await player.delete();
      return true;
    }
    catch(err: any) {
      console.error('Something went wrong.', err);
      return false;
    }
  }

  static async Nuke() {
    try {
      const allPlayers = database.collections.get<PlayerModel>('players').query(Q.where('is_me', false));
  
      await database.write(async() => {
        await allPlayers.destroyAllPermanently();
      });
    }
    catch (err: any) {
      console.error('Something went wrong.', err);
    }
  }

  private static async toPlayer(player: PlayerModel) {
    const matches = await player.fetchMatchCount();

    return {
      id: player.id,
      firstName: player.firstName,
      lastName: player.lastName,
      color: player.color,
      isMe: player.isMe,
      createdAt: player.createdAt,
      matchCount: matches ?? 0,
    } as Player;
  }
}