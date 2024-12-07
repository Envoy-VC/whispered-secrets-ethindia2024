import { z } from "zod";
import { Wallet, hashMessage } from "@coinbase/coinbase-sdk";

export const SignMessageInput = z
  .object({
    message: z.string().describe("The message to sign. e.g. `hello world`"),
  })
  .strip()
  .describe("Instructions for signing a blockchain message");

export async function signMessage(
  wallet: Wallet,
  args: z.infer<typeof SignMessageInput>,
): Promise<string> {
  const payloadSignature = await wallet.createPayloadSignature(
    hashMessage(args.message),
  );
  return `The payload signature ${payloadSignature}`;
}

export const signMessageConfig = {
  name: "sign_message",
  description: "Sign a message",
  argsSchema: SignMessageInput,
  func: signMessage,
};
