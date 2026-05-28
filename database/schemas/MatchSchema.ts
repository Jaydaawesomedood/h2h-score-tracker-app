import { tableSchema } from "@nozbe/watermelondb";

export const MatchSchema = tableSchema({
  name: 'matches',
  columns: [
    { name: 'type', type: 'string' },
    { name: 'date', type: 'string' },
    { name: 'sets', type: 'string' }, // In JSON format
    { name: 'winner', type: 'string' },
    { name: 'created_at', type: 'number' },
  ]
});