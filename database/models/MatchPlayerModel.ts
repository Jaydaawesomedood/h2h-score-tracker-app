import { Model } from "@nozbe/watermelondb";
import { field, immutableRelation, relation } from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";
import MatchModel from "./MatchModel";
import PlayerModel from "./PlayerModel";

export default class MatchPlayerModel extends Model {
  static table = 'match_players';
  static associations: Associations = {
    'matches': { type: 'belongs_to', key: 'match_id' },
    'players': { type: 'belongs_to', key: 'player_id' },
  };

  @field('match_id') matchId!: string
  @field('player_id') playerId!: string
  @field('side') side!: string

  @immutableRelation('matches', 'match_id') match!: MatchModel
  @relation('players', 'player_id') player!: PlayerModel
}