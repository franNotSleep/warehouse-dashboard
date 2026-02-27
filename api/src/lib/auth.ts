import 'dotenv/config';

import { betterAuth } from 'better-auth';
import { Pool } from 'pg';
import { getOrThrow } from '../config/common.js';
import { admin } from 'better-auth/plugins';

const pool = new Pool({
  host: getOrThrow('DATABASE_HOST'),
  port: parseInt(getOrThrow('DATABASE_PORT')),
  user: getOrThrow('DATABASE_USERNAME'),
  password: getOrThrow('DATABASE_PASSWORD'),
  database: getOrThrow('DATABASE_NAME'),
});

export const auth = betterAuth({
  basePath: 'api/auth',
  database: pool,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: getOrThrow('TRUSTED_ORIGINS').split(','),
  plugins: [admin()],
  emailAndPassword: {
    enabled: true,
  },
});

// Source - https://stackoverflow.com/a/51540480
// Posted by ninhjs.dev, modified by community. See post 'Timeline' for change history
// Retrieved 2026-02-22, License - CC BY-SA 4.0

const generatePassword = () => {
  const length = 8;
  const characters =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$';
  return Array.from(crypto.getRandomValues(new Uint32Array(length)))
    .map((x) => characters[x % characters.length])
    .join('');
};

export async function initSuperAdmin() {
  const superAdminEmail = getOrThrow('SUPER_ADMIN_EMAIL');
  const result = await pool.query(`SELECT 1 FROM "user" WHERE email = $1`, [
    superAdminEmail,
  ]);

  if (result.rows.length) {
    return;
  }

  const password = generatePassword();

  await auth.api.createUser({
    body: {
      email: superAdminEmail,
      password: password,
      name: 'Super Admin',
      role: 'admin',
    },
  });

  console.log('ADMIN EMAIL: ', superAdminEmail);
  console.log('PASSWORD: ', password);
}
