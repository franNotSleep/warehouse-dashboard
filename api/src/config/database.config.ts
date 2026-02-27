import 'dotenv/config';

import { registerAs } from '@nestjs/config';
import { getOrThrow } from './common.js';

export interface DatabaseConfiguration {
  type: 'postgres';
  host: string;
  port: number;
  password: string;
  user: string;
  database: string;
}

const config: DatabaseConfiguration = {
  type: 'postgres',
  host: getOrThrow('DATABASE_HOST'),
  port: parseInt(getOrThrow('DATABASE_PORT')),
  user: getOrThrow('DATABASE_USERNAME'),
  password: getOrThrow('DATABASE_PASSWORD'),
  database: getOrThrow('DATABASE_NAME'),
};

export default registerAs('database', () => config);
