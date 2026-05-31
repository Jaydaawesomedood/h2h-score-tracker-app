import { Player } from "@/models/v2/data/Player";
import { database } from "../../database";
import PlayerModel from "@/database/models/PlayerModel";
import { map, Observable } from "@nozbe/watermelondb/utils/rx";
import { Q } from "@nozbe/watermelondb";
import { MatchesService } from "../MatchesService/MatchesService";

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
    return database.collections
      .get<PlayerModel>('players')
      .query(
        Q.experimentalJoinTables(['match_players']),
        Q.sortBy('created_at', Q.asc)
      )
      .observeWithColumns(['first_name', 'last_name', 'color'])
      .pipe(
        map(players => players.map(p => this.toPlayer(p)))
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

  private static toPlayer(player: PlayerModel) {
    return {
      id: player.id,
      firstName: player.firstName,
      lastName: player.lastName,
      color: player.color,
      isMe: player.isMe,
      createdAt: player.createdAt,
    } as Player;
  }
}