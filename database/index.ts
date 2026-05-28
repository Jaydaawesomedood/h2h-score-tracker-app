import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import schema from './schemas/AppSchema';
import migrations from './migrations/Migrations';
import { Platform } from 'react-native';
import { Database } from '@nozbe/watermelondb';
import PlayerModel from './models/PlayerModel';
import MatchModel from './models/MatchModel';
import MatchPlayerModel from './models/MatchPlayerModel';

const adapter = new SQLiteAdapter({
  schema,
  migrations,
  jsi: Platform.OS === 'ios',
  onSetUpError: error => {
    console.error('Database failed to init.', error);
  }
})

export const database = new Database({
  adapter,
  modelClasses: [
    PlayerModel,
    MatchModel,
    MatchPlayerModel
  ]
});