import { getDefaultConfig } from 'connectkit';
import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';
import { env } from '~/env';

export const config = createConfig(
  getDefaultConfig({
    chains: [baseSepolia],
    transports: {
      [baseSepolia.id]: http(),
    },
    connectors: [
      coinbaseWallet({
        appName: 'Create Wagmi',
        preference: 'smartWalletOnly',
      }),
    ],

    walletConnectProjectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    appName: 'Your App Name',
    multiInjectedProviderDiscovery: false,
    appDescription: 'Your App Description',
    appUrl: 'https://family.co',
    appIcon: 'https://family.co/logo.png',
    coinbaseWalletPreference: 'smartWalletOnly',
  })
);

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
