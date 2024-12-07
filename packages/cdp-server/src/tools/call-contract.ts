import { z } from "zod";
import { Wallet } from "@coinbase/coinbase-sdk";

import { ExtractAbiFunctionNames } from "abitype";
import { erc20Abi } from "abitype/abis";

type Result = ExtractAbiFunctionNames<
  typeof erc20Abi,
  "payable" | "nonpayable"
>;

const CallContractInputs = z
  .object({
    contractAddress: z
      .string()
      .describe("The address of the contract to call. e.g. `0x1234...`"),
    method: z
      .string()
      .describe(
        "The method to call on the contract. e.g. `transfer(address to, uint256 amount)`",
      ),
    args: z
      .object({
        gameId: z.string(),
        userId: z.string(),
      })
      .describe("the gameId and userId to pass to the contract function"),
  })
  .strip()
  .describe("Instructions for signing a blockchain message");

export async function callContract(
  wallet: Wallet,
  args: z.infer<typeof CallContractInputs>,
): Promise<string> {
  console.log("args", args);
  const res = await wallet.invokeContract({
    contractAddress: args.contractAddress,
    abi: [
      { type: "constructor", inputs: [], stateMutability: "nonpayable" },
      {
        type: "function",
        name: "vote",
        inputs: [
          { name: "gameId", type: "string", internalType: "string" },
          { name: "userId", type: "string", internalType: "string" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "votes",
        inputs: [
          { name: "", type: "string", internalType: "string" },
          { name: "", type: "uint256", internalType: "uint256" },
        ],
        outputs: [{ name: "", type: "string", internalType: "string" }],
        stateMutability: "view",
      },
      {
        type: "event",
        name: "VoteForKiller",
        inputs: [
          {
            name: "gameId",
            type: "string",
            indexed: false,
            internalType: "string",
          },
          {
            name: "userId",
            type: "string",
            indexed: false,
            internalType: "string",
          },
        ],
        anonymous: false,
      },
    ],
    method: args.method,
    args: args.args,
  });
  const tx = await res.broadcast();

  const hash = tx.getTransactionHash();
  if (!hash) {
    throw new Error("Failed to broadcast transaction");
  }
  return hash;
}

export const callContractConfig = {
  name: "call_contract",
  description: "Call a contract",
  argsSchema: CallContractInputs,
  func: callContract,
};
