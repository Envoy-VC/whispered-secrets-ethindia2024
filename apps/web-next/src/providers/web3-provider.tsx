'use client';

import type { PropsWithChildren } from 'react';

import { config } from '~/lib/wagmi';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider } from 'connectkit';
import { WagmiProvider } from 'wagmi';

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: PropsWithChildren) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider theme='retro'>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
