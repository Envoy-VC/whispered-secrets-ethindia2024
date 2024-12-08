import { whisperedConfig } from './wagmi';

export const invokeContract = async (gameId: string, userId: string) => {
  const args = {
    gameId,
    userId,
  };
  const message = `Invoke the function called "vote" on contract with contract address: ${whisperedConfig.address} on base sepolia. It has the following arguments ${JSON.stringify(args)} . these both are string arguments with no spaces and special characters. This should be a regular transaction and there are no eth value transfers. Don't ask for confirmation, just send the transaction.`;

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

const splitContractAddress = '0x2ed6c4B5dA6378c7897AC67Ba9e43102Feb694EE';

interface SplitFundProps {
  // user -> vote
  votes: [string, string][];
  gameId: string;
  killerId: string;
}

export const splitFunds = async ({ votes }: SplitFundProps) => {
  const totalVotes = votes.length;
  const percentages = votes.map(([_, vote]) => {
    const voteCount = votes.filter(([, v]) => v === vote).length;
    return voteCount / totalVotes;
  });

  const formattedPercentages = percentages.map((p) =>
    parseInt(String(p * 100))
  );

  const prompt = `Split the funds using the contract with address ${splitContractAddress} based on the votes. The percentages are ${formattedPercentages.join(', ')} . The funds should be split in a single transaction. The contract has a function called "split" that takes in an array of addresses and an array of percentages. The percentages should be in the range of 0-100. The sum of the percentages should be 100. The function should be called with the addresses of the voters and the percentages of the votes they received. The value supplied to the function should be equal to 0.001 ether, and the gas limit should be 1000000. Don't ask for confirmation, just send the transaction.`;

  const res = await fetch('http://localhost:8787/invoke-agent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: prompt }),
  });

  const data = (await res.json()) as {
    status: 'success' | 'error';
    message: string;
  };
  console.log(data);
  return data;
};
