import { Q, Query } from "@nozbe/watermelondb";
import { children, field, lazy } from "@nozbe/watermelondb/decorators";
import Model, { Associations } from "@nozbe/watermelondb/Model";
import MatchPlayerModel from "./MatchPlayerModel";

export default class MatchModel extends Model {
  static table = 'matches';
  static associations: Associations = {
    match_players: { type: 'has_many', foreignKey: 'match_id' }
  };

  @field('type') type!: string
  @field('date') date!: string
  @field('sets') _sets!: string
  @field('winner') winner!: string
  @field('created_at') _createdAt!: number

  @children('match_players') matchPlayers!: Query<MatchPlayerModel>

  get sets() {
    return JSON.parse(this._sets ?? '[]')
  }

  @lazy get sideA() {
    return this.matchPlayers.extend(
      Q.where('side', 'A')
    )
  }

  @lazy get sideB() {
    return this.matchPlayers.extend(
      Q.where('side', 'B')
    )
  }
}