import { Player } from "@/models/v2/data/Player";
import { Model, Q } from "@nozbe/watermelondb";
import { Associations } from "@nozbe/watermelondb/Model";
import { date, field, lazy, readonly, writer } from "@nozbe/watermelondb/decorators";
import MatchModel from "./MatchModel";
import { Match } from "@/models/v2/data/Match";

export default class PlayerModel extends Model {
  static table = 'players';
  static associations: Associations = {
    match_players: { type: 'has_many', foreignKey: 'player_id' },
  };

  @field('first_name') firstName!: string
  @field('last_name') lastName!: string
  @field('color') color!: string
  @field('is_me') isMe!: boolean
  @readonly @date('created_at') createdAt!: number

  @writer async updateProfile(updatedPlayer: Player) {
    await this.update(p => {
      p.firstName = updatedPlayer.firstName;
      p.lastName = updatedPlayer.lastName;
      p.color = updatedPlayer.color;
    });
  }

  @writer async delete() {
    await this.destroyPermanently();
  }

  @lazy matches = this.collections
    .get<MatchModel>('matches')
    .query(
      Q.on('match_players', 'player_id', this.id)
    );

  async fetchMatches() {
    return (await this.matches.fetch()).map(m => this.toMatch(m));
  }

  private async toMatch(match: MatchModel) {
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