import { z } from "zod";
import { Wallet } from "@coinbase/coinbase-sdk";

import { ExtractAbiFunctionNames } from "abitype";
import { erc20Abi } from "abitype/abis";

import { Abi } from "abitype/zod";

type Result = ExtractAbiFunctionNames<
  typeof erc20Abi,
  "payable" | "nonpayable"
>;

const CallContractInputs = z
  .object({
    contractAddress: z
      .string()
      .describe("The address of the contract to call. e.g. `0x1234...`"),
    abi: Abi,
    method: z
      .string()
      .describe(
        "The method to call on the contract. e.g. `transfer(address to, uint256 amount)`",
      ),
    amount: z
      .bigint()
      .optional()
      .describe(
        "The amount to send in wei with the transaction. e.g. `1000000000000000000`",
      ),
    args: z.object({}).describe("The arguments to pass to the method"),
  })
  .strip()
  .describe("Instructions for signing a blockchain message");

export async function callContract(
  wallet: Wallet,
  args: z.infer<typeof CallContractInputs>,
): Promise<string> {
  const payloadSignature = await wallet.invokeContract({
    contractAddress: args.contractAddress,
    abi: args.abi,
    method: args.method,
    amount: args.amount,
    args: args.args,
  });
  return `The payload signature ${payloadSignature}`;
}

export const callContractConfig = {
  name: "call_contract",
  description: "Call a contract",
  argsSchema: CallContractInputs,
  func: callContract,
};
