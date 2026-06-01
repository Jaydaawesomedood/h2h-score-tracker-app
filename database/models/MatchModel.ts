import { Q, Query } from "@nozbe/watermelondb";
import { children, date, field, lazy, readonly, writer } from "@nozbe/watermelondb/decorators";
import Model, { Associations } from "@nozbe/watermelondb/Model";
import MatchPlayerModel from "./MatchPlayerModel";
import PlayerModel from "./PlayerModel";
import { Player } from "@/models/v2/data/Player";
import { Match } from "@/models/v2/data/Match";

export default class MatchModel extends Model {
  static table = 'matches';
  static associations: Associations = {
    match_players: { type: 'has_many', foreignKey: 'match_id' }
  };

  @field('type') type!: string
  @field('date') date!: string
  @field('sets') _sets!: string
  @field('winner') winner!: string
  @readonly @date('created_at') createdAt!: number

  @children('match_players') matchPlayers!: Query<MatchPlayerModel>

  get sets() {
    return JSON.parse(this._sets ?? '[]')
  }

  @lazy sideA = this.collections
    .get<PlayerModel>('players')
    .query(
      Q.on('match_players', 'match_id', this.id),
      Q.on('match_players', 'side', 'A')
    );

  @lazy sideB = this.collections
    .get<PlayerModel>('players')
    .query(
      Q.on('match_players', 'match_id', this.id),
      Q.on('match_players', 'side', 'B')
    );

  async fetchSideA(): Promise<Player[]> {
    return (await this.sideA.fetch()).map(p => this.toPlayer(p));
  }

  async fetchSideB(): Promise<Player[]> {
    return (await this.sideB.fetch()).map(p => this.toPlayer(p));
  }

  @writer async updateDetails(updatedMatch: Match) {
    await this.update(m => {
      m.date = updatedMatch.date,
      m._sets = JSON.stringify(updatedMatch.sets),
      m.winner = updatedMatch.winner
    });
  }

  @writer async delete() {
    await this.destroyPermanently();
  }

  private toPlayer(player: PlayerModel) {
    return {
      id: player.id,
      firstName: player.firstName,
      lastName: player.lastName,
      color: player.color,
      isMe: player.isMe,
    } as Player;
  }
}