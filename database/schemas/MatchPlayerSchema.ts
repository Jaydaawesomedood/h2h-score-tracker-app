import { tableSchema } from "@nozbe/watermelondb";

export const MatchPlayerSchema = tableSchema({
  name: 'match_players',
  columns: [
    { name: 'match_id', type: 'string', isIndexed: true },
    { name: 'player_id', type: 'string', isIndexed: true },
    { name: 'side', type: 'string' }
  ]
});