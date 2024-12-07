'use client';

import { type ReactNode } from 'react';

import { ConvexProvider, ConvexReactClient } from 'convex/react';

const env = import.meta.env;

const convex = new ConvexReactClient(env.VITE_CONVEX_URL);

export const ConvexClientProvider = ({ children }: { children: ReactNode }) => {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
};
