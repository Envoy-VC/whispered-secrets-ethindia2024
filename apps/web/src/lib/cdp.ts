import { whisperedConfig } from './wagmi';

export const invokeContract = async (gameId: string, userId: string) => {
  const args = {
    gameId,
    userId,
  };
  const message = `Invoke the function called "vote" on contract with contract address: ${whisperedConfig.address} on base sepolia. It has the following arguments ${JSON.stringify(args)} . these both are string arguments with no spaces and special characters. The contract is on Base Sepolia. This should be a regular transaction and there are no eth value transfers.`;

  const res = await fetch('http://localhost:8787/invoke-agent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });

  const data = (await res.json()) as {
    status: 'success' | 'error';
    message: string;
  };

  return data;
};
