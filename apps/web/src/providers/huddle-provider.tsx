'use client';

import { type PropsWithChildren } from 'react';

import {
  HuddleClient,
  HuddleProvider as HuddleProviderCore,
} from '@huddle01/react';

const env = import.meta.env;

const huddleClient = new HuddleClient({
  projectId: env.VITE_HUDDLE_ID,
});

export const HuddleProvider = ({ children }: PropsWithChildren) => {
  return (
    <HuddleProviderCore client={huddleClient}>{children}</HuddleProviderCore>
  );
};
