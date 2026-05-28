import { tableSchema } from '@nozbe/watermelondb';

export const PlayerSchema = tableSchema({
  name: 'players',
  columns: [
    { name: 'first_name', type: 'string' },
    { name: 'last_name', type: 'string' },
    { name: 'color', type: 'string' },
    { name: 'is_me', type: 'boolean' },
  ],
});