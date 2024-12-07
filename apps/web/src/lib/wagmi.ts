import { getDefaultConfig } from 'connectkit';
import { defineChain } from 'viem';
import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';

const env = import.meta.env;

export const supraTestnet = defineChain({
  id: 231,
  name: 'Stagingnet Testnet',
  nativeCurrency: { name: 'Stagingnet', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc-evmstaging.supra.com/rpc/v1/eth'],
    },
  },
  testnet: true,
});

export const config = createConfig(
  getDefaultConfig({
    chains: [baseSepolia, supraTestnet],
    transports: {
      [baseSepolia.id]: http(),
      [supraTestnet.id]: http(),
    },
    connectors: [
      coinbaseWallet({
        appName: 'Create Wagmi',
        preference: 'smartWalletOnly',
      }),
    ],

    walletConnectProjectId: env.VITE_WALLETCONNECT_PROJECT_ID,
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

const abi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    name: 'getVotes',
    inputs: [{ name: 'gameId', type: 'string', internalType: 'string' }],
    outputs: [{ name: '', type: 'string[]', internalType: 'string[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'vote',
    inputs: [
      { name: 'gameId', type: 'string', internalType: 'string' },
      { name: 'userId', type: 'string', internalType: 'string' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'votes',
    inputs: [
      { name: '', type: 'string', internalType: 'string' },
      { name: '', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: '', type: 'string', internalType: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'VoteForKiller',
    inputs: [
      {
        name: 'gameId',
        type: 'string',
        indexed: false,
        internalType: 'string',
      },
      {
        name: 'userId',
        type: 'string',
        indexed: false,
        internalType: 'string',
      },
    ],
    anonymous: false,
  },
] as const;

export const whisperedConfig = {
  address: '0x9482e4c7927ba4e1AcB319321FC6b23E18FDf49C' as `0x${string}`,
  abi,
};

const getConfig = (chainId: number) => {
  if (chainId === 231) {
    return {
      address: '0x9482e4c7927ba4e1AcB319321FC6b23E18FDf49C' as `0x${string}`,
      abi,
    };
  }
  return {
    address: '0x9482e4c7927ba4e1AcB319321FC6b23E18FDf49C' as `0x${string}`,
    abi,
  };
};
