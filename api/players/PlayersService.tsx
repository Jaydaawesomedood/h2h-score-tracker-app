import { Player } from "@/models/v2/data/Player";
import { database } from "../../database";
import PlayerModel from "@/database/models/PlayerModel";

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

  static async GetAllPlayers(): Promise<Player[]> {
    // TODO - grab n number of players first (lazy loading)
    // TODO - move this to model instead
    const allPlayers = await database.collections.get<PlayerModel>('players').query().fetch();
    return allPlayers.map(pl => (this.toPlayer(pl)));
  }

  private static toPlayer(player: PlayerModel) {
    return {
      id: player.id,
      firstName: player.firstName,
      lastName: player.lastName,
      color: player.color,
      isMe: player.isMe,
    } as Player;
  }
}