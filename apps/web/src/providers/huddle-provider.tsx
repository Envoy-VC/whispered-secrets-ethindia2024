'use client';

import { type PropsWithChildren } from 'react';

import {
  HuddleClient,
  HuddleProvider as HuddleProviderCore,
} from '@huddle01/react';
import { env } from '~/env';

const huddleClient = new HuddleClient({
  projectId: env.NEXT_PUBLIC_HUDDLE_ID,
});

export const HuddleProvider = ({ children }: PropsWithChildren) => {
  return (
    <HuddleProviderCore client={huddleClient}>{children}</HuddleProviderCore>
  );
};
