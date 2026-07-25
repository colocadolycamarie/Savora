import path from 'node:path';
import { config } from 'dotenv';

config({ path: path.resolve(import.meta.dirname, '../../../.env') });

if (!process.env.TEST_DATABASE_URL) {
  throw new Error(
    'TEST_DATABASE_URL must be set to run the API test suite (see .env.example). ' +
      'Run `npm run push:test -w @workspace/db` first to prepare the schema.',
  );
}

process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
