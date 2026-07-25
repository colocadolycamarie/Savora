import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { config } from 'dotenv';

const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dir, '../../..');

config({ path: path.resolve(root, '.env') });

if (!process.env.TEST_DATABASE_URL) {
  console.error('TEST_DATABASE_URL must be set (see .env.example) to push the test schema.');
  process.exit(1);
}

const result = spawnSync(
  'npx',
  ['drizzle-kit', 'push', '--config', './drizzle.config.ts', '--force'],
  {
    cwd: path.resolve(dir, '..'),
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: process.env.TEST_DATABASE_URL },
  },
);

process.exit(result.status ?? 1);
