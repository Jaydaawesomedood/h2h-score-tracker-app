import { Player } from "@/models/v2/data/Player";
import { Model } from "@nozbe/watermelondb";
import { Associations } from "@nozbe/watermelondb/Model";
import { field, writer } from "@nozbe/watermelondb/decorators";

export default class PlayerModel extends Model {
  static table = 'players';
  static associations: Associations = {
    match_players: { type: 'has_many', foreignKey: 'player_id' },
  };

  @field('first_name') firstName!: string
  @field('last_name') lastName!: string
  @field('color') color!: string
  @field('is_me') isMe!: boolean
}