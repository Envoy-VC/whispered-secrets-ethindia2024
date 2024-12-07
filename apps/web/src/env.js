/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair -- safe  */

/* eslint-disable no-undef -- safe */
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
    HUDDLE_API_KEY: z.string(),
    CDP_API_KEY_NAME: z.string(),
    CDP_API_KEY_PRIVATE_KEY: z.string(),
  },
  client: {
    NEXT_PUBLIC_CONVEX_URL: z.string(),
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string(),
    NEXT_PUBLIC_HUDDLE_ID: z.string(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    NEXT_PUBLIC_HUDDLE_ID: process.env.NEXT_PUBLIC_HUDDLE_ID,
  },
  skipValidation: Boolean(process.env.SKIP_ENV_VALIDATION),
  emptyStringAsUndefined: true,
});
